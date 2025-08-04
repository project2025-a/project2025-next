'use server';

import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CACHE_REVALIDATE_TIME, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/fetchConfig';
import { createClient } from '@/lib/supabase/server';
import { ApiResponse } from '@/types/api/common';
import { DetailLog, logBookmarkListParams, LogsParams, LogsResponse } from '@/types/api/log';
import { SearchParams, SearchResponse } from '@/types/api/search';
import { Prisma } from '@prisma/client';
import { revalidateTag, unstable_cache } from 'next/cache';
import prisma from 'prisma/prisma';
import { logKeys, searchKeys } from './keys';
import { deleteNestedFolderFiles } from './storage';
import { cacheTags, globalTags } from './tags';
import { getUser } from './user';

export async function revalidateLogs() {
  revalidateTag(globalTags.logAll);
}

// ===================================================================
// 단일 로그
// ===================================================================

export async function fetchLog(logId: string): Promise<ApiResponse<DetailLog>> {
  try {
    const log = await prisma.log.findUnique({
      where: { log_id: logId },
      include: {
        users: {
          select: {
            nickname: true,
            image_url: true,
          },
        },
        place: {
          include: {
            place_images: {
              orderBy: { order: 'asc' },
            },
            _count: { select: { place_bookmark: true } },
          },
          orderBy: {
            order: 'asc',
          },
        },
        log_tag: {
          select: {
            category: true,
            tag: true,
          },
        },
        address: {
          select: {
            country: true,
            city: true,
            sigungu: true,
          },
        },
        _count: { select: { log_bookmark: true } },
      },
    });

    if (!log) {
      return {
        success: false,
        msg: ERROR_MESSAGES.LOG.NOT_FOUND,
        errorCode: ERROR_CODES.LOG.NOT_FOUND,
      };
    }

    return {
      success: true,
      data: log as unknown as DetailLog,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      msg: ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.COMMON.INTERNAL_SERVER_ERROR,
    };
  }
}

/* 로그 상세 조회 */
export async function getLog(logId: string) {
  return unstable_cache(() => fetchLog(logId), [...cacheTags.logDetail(logId)], {
    tags: [cacheTags.logDetail(logId), globalTags.logAll], // 상위 그룹 태그 추가
    revalidate: CACHE_REVALIDATE_TIME,
  })();
}

/* 북마크 시 서버캐시 무효화 */
export async function revalidateLog(logId: string) {
  revalidateTag(cacheTags.logDetail(logId));
}

// ===================================================================
// 로그 삭제
// ===================================================================

export async function deleteLog(logId: string): Promise<ApiResponse<null>> {
  const me = await getUser();
  if (!me) {
    return {
      success: false,
      msg: ERROR_MESSAGES.COMMON.UNAUTHORIZED,
      errorCode: ERROR_CODES.COMMON.UNAUTHORIZED,
    };
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('유저 정보 없음');

    // 로그 삭제
    const { error: logDeleteError } = await supabase.from('log').delete().eq('log_id', logId);
    if (logDeleteError) {
      console.error('로그 삭제 실패', logDeleteError);
      throw new Error('로그 삭제 실패');
    }

    // 스토리지 삭제 (places, thumbnails)
    const folderPath = `${user.id}/${logId}`;
    await deleteNestedFolderFiles(`${user.id}/${logId}`, 'places');

    const { error: thumbnailDeleteError } = await supabase.storage
      .from('thumbnails')
      .remove([`${folderPath}/${logId}.webp`]);

    if (thumbnailDeleteError) {
      console.warn('썸네일 삭제 실패:', thumbnailDeleteError.message);
    }

    /* 캐시 무효화 */
    const logTagsToInvalidate = [globalTags.logAll, globalTags.placeAll, globalTags.searchAll];
    logTagsToInvalidate.forEach((tag) => revalidateTag(tag));

    return { success: true, data: null };
  } catch (e) {
    console.error('로그 삭제 전체 실패:', e);
    return {
      success: false,
      msg: ERROR_MESSAGES.LOG.DELETE_FAILED,
      errorCode: ERROR_CODES.LOG.DELETE_FAILED,
    };
  }
}

// ===================================================================
// 로그 리스트
// ===================================================================

export async function fetchLogs({
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = 'latest',
  userId,
}: LogsParams): Promise<LogsResponse> {
  try {
    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize; // 몇 개 건너뛸지 계산

    /* userId가 있을 경우 마이로그에서 쓸 로그리스트 반환 */
    const where = userId ? { user_id: userId } : undefined;

    const [logs, totalCount] = await Promise.all([
      prisma.log.findMany({
        skip, // 앞에서 몇 개 건너뛸지
        take: safeSize, // 가져올 데이터 수
        where,

        // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
        orderBy: sort === 'popular' ? { log_bookmark: { _count: 'desc' } } : { created_at: 'desc' },
        select: {
          log_id: true,
          title: true,
          place: {
            take: 1,
            orderBy: {
              order: 'asc',
            },
            select: {
              place_images: {
                take: 1,
                orderBy: {
                  order: 'asc',
                },
                select: {
                  image_path: true,
                },
              },
            },
          },
          users: {
            select: {
              user_id: true,
              nickname: true,
            },
          },
          address: {
            select: {
              country: true,
              city: true,
              sigungu: true,
            },
          },
        },
      }),
      // 전체 로그 수 카운트 (페이지 수 계산에 사용)
      prisma.log.count({ where }),
    ]);

    return {
      success: true,
      data: logs,
      meta: {
        pagination: {
          currentPage: safePage,
          pageSize: safeSize,
          totalPages: Math.ceil(totalCount / safeSize),
          totalItems: totalCount,
        },
        httpStatus: 200,
      },
    };
  } catch (_error) {
    console.error(_error);
    return {
      success: false,
      msg: ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
      errorCode: ERROR_CODES.COMMON.INTERNAL_SERVER_ERROR,
    };
  }
}

export async function getLogs(params: LogsParams) {
  const queryKey = params.userId ? logKeys.listByUser(params) : logKeys.list(params);

  const tagKey = params.userId ? cacheTags.logListByUser(params) : cacheTags.logList(params);

  return unstable_cache(() => fetchLogs(params), [...queryKey].filter(Boolean), {
    tags: [tagKey, globalTags.logAll], // 상위 그룹 태그 추가
    revalidate: CACHE_REVALIDATE_TIME,
  })();
}

// ===================================================================
// 북마크 로그 리스트
// ===================================================================
export async function fetchBookmarkedLogs({
  userId,
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
}: logBookmarkListParams): Promise<LogsResponse> {
  try {
    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize;

    const bookmarkedLogs = await prisma.log_bookmark.findMany({
      where: { user_id: userId },
      skip,
      take: pageSize,
      orderBy: {
        log: {
          created_at: 'desc',
        },
      },
      include: {
        log: {
          select: {
            log_id: true,
            title: true,
            place: {
              take: 1,
              select: {
                place_images: {
                  take: 1,
                  select: {
                    image_path: true,
                  },
                },
              },
            },
            users: {
              select: {
                user_id: true,
                nickname: true,
              },
            },
            address: {
              select: {
                country: true,
                city: true,
                sigungu: true,
              },
            },
          },
        },
      },
    });

    // 전체 로그북마크 수 카운트 (페이지 수 계산에 사용)
    const totalCount = await prisma.log_bookmark.count({
      where: { user_id: userId },
    });

    //실제로 존재하는 log만 필터링, 예: 로그가 삭제된 북마크가 있을 경우
    const filterBookmarkedLogs = bookmarkedLogs.map((b) => b.log).filter(Boolean);
    return {
      success: true,
      data: filterBookmarkedLogs,
      meta: {
        pagination: {
          currentPage: safePage,
          pageSize: safeSize,
          totalPages: Math.ceil(totalCount / safeSize),
          totalItems: totalCount,
        },
        httpStatus: 200,
      },
    };
  } catch (_error) {
    console.error(_error);
    return {
      success: false,
      msg: ERROR_MESSAGES.LOG.LIST_EMPTY,
      errorCode: ERROR_CODES.LOG.LIST_EMPTY,
    };
  }
}

export async function getBookmarkedLogs(params: logBookmarkListParams) {
  return unstable_cache(
    () => fetchBookmarkedLogs(params),
    [...logKeys.bookmarkList(params)].filter(Boolean),
    {
      tags: [
        cacheTags.logBookmarkList(params), // 특정 페이지 북마크 리스트
        globalTags.logAll, // 전체 북마크 리스트 무효화용 상위 태그
      ],
      revalidate: CACHE_REVALIDATE_TIME,
    }
  )();
}

/* 북마크 시 서버캐시 무효화 */
export async function revalidateBookmarkLogs() {
  revalidateTag(globalTags.logAll); // 특정 유저·페이지 무관하게 전체 무효화
}

// ===================================================================
// 검색 결과 로그 리스트
// ===================================================================

export async function fetchSearchLogs({
  keyword,
  city,
  sigungu,
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = 'latest',
}: SearchParams): Promise<SearchResponse> {
  try {
    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize; // 몇 개 건너뛸지 계산

    // 검색 조건 구성
    const searchConditions = [];

    if (keyword) {
      searchConditions.push({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { place: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
          {
            address: {
              some: {
                city: { contains: keyword, mode: 'insensitive' },
              },
            },
          },
          {
            address: {
              some: {
                sigungu: { contains: keyword, mode: 'insensitive' },
              },
            },
          },
        ],
      });
    }

    if (city) {
      searchConditions.push({
        address: {
          some: {
            city: { equals: city },
          },
        },
      });
    }

    if (sigungu) {
      searchConditions.push({
        address: {
          some: {
            sigungu: { contains: sigungu, mode: 'insensitive' },
          },
        },
      });
    }

    const whereCondition =
      searchConditions.length > 0 ? { AND: searchConditions as Prisma.logWhereInput[] } : {};

    const [searchData, totalCount] = await Promise.all([
      prisma.log.findMany({
        skip, // 앞에서 몇 개 건너뛸지
        take: safeSize, // 가져올 데이터 수
        where: whereCondition,

        // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
        orderBy: sort === 'popular' ? { log_bookmark: { _count: 'desc' } } : { created_at: 'desc' },
        select: {
          log_id: true,
          title: true,
          place: {
            take: 1,
            select: {
              place_images: {
                take: 1,
                select: {
                  image_path: true,
                },
              },
            },
          },
          users: {
            select: {
              user_id: true,
              nickname: true,
            },
          },
          address: {
            select: {
              country: true,
              city: true,
              sigungu: true,
            },
          },
        },
      }),
      prisma.log.count({
        where: whereCondition,
      }),
    ]);

    if (!searchData || searchData.length === 0) {
      return {
        success: false,
        msg: ERROR_MESSAGES.SEARCH.EMPTY,
        errorCode: ERROR_CODES.SEARCH.EMPTY,
      };
    }

    return {
      success: true,
      data: searchData,
      meta: {
        pagination: {
          currentPage: safePage,
          pageSize: safeSize,
          totalPages: Math.ceil(totalCount / safeSize),
          totalItems: totalCount,
        },
        httpStatus: 200,
      },
    };
  } catch (_error) {
    console.error(_error);
    return {
      success: false,
      msg: ERROR_MESSAGES.SEARCH.FAILED,
      errorCode: ERROR_CODES.SEARCH.FAILED,
    };
  }
}

export async function getSearchLogs(params: SearchParams) {
  return unstable_cache(
    () => fetchSearchLogs(params),
    [...searchKeys.list(params)].filter(Boolean),
    {
      tags: [
        cacheTags.searchList(params), // 조건별로 구분되는 태그
        globalTags.searchAll, // 전체 무효화용 상위 태그
      ],
      revalidate: CACHE_REVALIDATE_TIME,
    }
  )();
}
