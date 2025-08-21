'use server';

import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CACHE_REVALIDATE_TIME, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/fetchConfig';
import { createClient } from '@/lib/supabase/server';
import { setLocaleTable } from '@/lib/utils';
import { ApiResponse, LogWithUserAndAddress } from '@/types/api/common';
import { DetailLog, logBookmarkListParams, LogsParams, LogsResponse } from '@/types/api/log';
import { SearchParams, SearchResponse } from '@/types/api/search';
import { getLocale } from 'next-intl/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import prisma from 'prisma/prisma';
import { logKeys, searchKeys } from './keys';
import { ILocale } from './log-register';
import { deleteNestedFolderFiles } from './storage';
import { cacheTags, globalTags } from './tags';
import { getUser } from './user';
import {
  getBookmarkedLogsFindArgsEn,
  getBookmarkedLogsFindArgsKo,
  getLogFindArgsEn,
  getLogFindArgsKo,
  getLogsFindArgsEn,
  getLogsFindArgsKo,
  getSearchLogsFindArgsEn,
  getSearchLogsFindArgsKo,
  getWhereConditionEn,
  getWhereConditionKo,
} from './utils/logService';

export async function revalidateLogs() {
  revalidateTag(globalTags.logAll);
}

// ===================================================================
// 단일 로그
// ===================================================================

export async function fetchLog(logId: string, locale: string): Promise<ApiResponse<DetailLog>> {
  try {
    let log: DetailLog;

    //영문, 국문 분기
    if (locale === 'en') {
      const logFindArgs = getLogFindArgsEn();
      const dbLog = await prisma.log_en.findUnique({
        where: { log_id: logId },
        include: logFindArgs,
      });
      log = {
        address: (dbLog?.address_en ?? []).map((address) => address),
        created_at: dbLog?.created_at.toString() ?? '',
        log_id: dbLog?.log_id ?? '',
        log_tag: (dbLog?.log_tag_en ?? []).map((tag) => tag),
        place: (dbLog?.place_en ?? []).map((place) => ({
          place_id: place.place_id,
          address: place.address,
          category: place.category,
          name: place.name,
          order: place.order,
          created_at: String(place.created_at),
          updated_at: String(place.updated_at),
          description: place.description,
          log_id: place.log_id,
          place_images: (place.place_images_en ?? []).map((img) => ({
            place_id: img.place_id,
            place_image_id: img.place_image_id,
            order: img.order,
            image_path: img.image_path,
          })),
          _count: {
            place_bookmark: place._count.place_bookmark_en,
          },
        })),
        title: dbLog?.title ?? '',
        user_id: dbLog?.user_id ?? '',
        users: {
          image_url: dbLog?.users.image_url ?? '',
          nickname: dbLog?.users.nickname ?? '',
        },
        _count: {
          log_bookmark: dbLog?._count.log_bookmark_en ?? 0,
        },
      };
    } else {
      const logFindArgs = getLogFindArgsKo();
      const dbLog = await prisma.log.findUnique({
        where: { log_id: logId },
        include: logFindArgs,
      });
      log = {
        address: (dbLog?.address ?? []).map((address) => address),
        created_at: dbLog?.created_at.toString() ?? '',
        log_id: dbLog?.log_id ?? '',
        log_tag: (dbLog?.log_tag ?? []).map((tag) => tag),
        place: (dbLog?.place ?? []).map((place) => ({
          place_id: place.place_id,
          address: place.address,
          category: place.category,
          name: place.name,
          order: place.order,
          created_at: String(place.created_at),
          updated_at: String(place.updated_at),
          description: place.description,
          log_id: place.log_id,
          place_images: (place.place_images ?? []).map((img) => ({
            place_id: img.place_id,
            place_image_id: img.place_image_id,
            order: img.order,
            image_path: img.image_path,
          })),
          _count: {
            place_bookmark: place._count.place_bookmark,
          },
        })),
        title: dbLog?.title ?? '',
        user_id: dbLog?.user_id ?? '',
        users: {
          image_url: dbLog?.users.image_url ?? '',
          nickname: dbLog?.users.nickname ?? '',
        },
        _count: {
          log_bookmark: dbLog?._count.log_bookmark ?? 0,
        },
      };
    }

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
  const locale = await getLocale();
  return unstable_cache(() => fetchLog(logId, locale), [...cacheTags.logDetail(logId, locale)], {
    tags: [cacheTags.logDetail(logId, locale), globalTags.logAll], // 상위 그룹 태그 추가
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

export async function deleteLog(logId: string, locale: ILocale): Promise<ApiResponse<null>> {
  const me = await getUser();
  const table = setLocaleTable('log', locale);
  const isEn = locale === 'en';
  const schema = isEn ? 'en' : 'public';

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
    const { error: logDeleteError } = await supabase
      .schema(schema)
      .from(table)
      .delete()
      .eq('log_id', logId);
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
  locale,
}: LogsParams): Promise<LogsResponse> {
  try {
    const isEn = locale === 'en';

    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize; // 몇 개 건너뛸지 계산

    /* userId가 있을 경우 마이로그에서 쓸 로그리스트 반환 */
    const where = userId ? { user_id: userId } : undefined;

    let logs: LogWithUserAndAddress[] = [];
    let totalCount: number = 0;

    //영문, 국문 분기
    if (isEn) {
      const logFindArgs = getLogsFindArgsEn({ skip, safeSize, sort, where });
      const [dbLogs, dbTalCount] = await Promise.all([
        prisma.log_en.findMany(logFindArgs),
        // 전체 로그 수 카운트 (페이지 수 계산에 사용)
        prisma.log_en.count({ where }),
      ]);

      logs = dbLogs.map((log) => ({
        log_id: log.log_id,
        title: log.title,
        users: log.users,
        address: log.address_en,
        place: log.place_en.map((p) => ({
          place_images: p.place_images_en,
        })),
      }));
      totalCount = dbTalCount;
    } else {
      const logFindArgs = getLogsFindArgsKo({ skip, safeSize, sort, where });

      const [dbLogs, dbTotalCount] = await Promise.all([
        prisma.log.findMany(logFindArgs),
        prisma.log.count({ where }),
      ]);

      logs = dbLogs;
      totalCount = dbTotalCount;
    }

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
  const locale = await getLocale();
  const localeParams = { ...params, locale };

  const queryKey = localeParams.userId
    ? logKeys.listByUser(localeParams)
    : logKeys.list(localeParams);

  const tagKey = localeParams.userId
    ? cacheTags.logListByUser(localeParams)
    : cacheTags.logList(localeParams);

  return unstable_cache(() => fetchLogs(localeParams), [...queryKey].filter(Boolean), {
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
  locale,
}: logBookmarkListParams): Promise<LogsResponse> {
  try {
    const isEn = locale === 'en';

    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize;

    let bookmarkedLogs: LogWithUserAndAddress[] = [];
    let totalCount: number = 0;

    //영문, 국문 분기
    if (isEn) {
      const bookmarkedLogsFindArgs = getBookmarkedLogsFindArgsEn({
        userId,
        skip,
        pageSize,
      });

      const [dbBookmarkedLogs, dbTotalCount] = await Promise.all([
        prisma.log_bookmark_en.findMany(bookmarkedLogsFindArgs),
        prisma.log_bookmark_en.count({
          where: { user_id: userId },
        }),
      ]);

      bookmarkedLogs = dbBookmarkedLogs
        .map((log) => {
          const logEn = log.log_en;
          if (!logEn) return null;

          return {
            log_id: logEn.log_id,
            title: logEn.title,
            users: logEn.users,
            place: logEn.place_en.map((place) => ({
              place_images: place.place_images_en,
            })),
            address: logEn.address_en,
          };
        })
        .filter(Boolean);
      totalCount = dbTotalCount;
    } else {
      const bookmarkedLogsFindArgs = getBookmarkedLogsFindArgsKo({
        userId,
        skip,
        pageSize,
      });
      const [dbBookmarkedLogs, dbTotalCount] = await Promise.all([
        prisma.log_bookmark.findMany(bookmarkedLogsFindArgs),
        prisma.log_bookmark.count({
          where: { user_id: userId },
        }),
      ]);

      bookmarkedLogs = dbBookmarkedLogs
        .map((item) => {
          const log = item.log;
          if (!log) return null;

          return {
            log_id: log.log_id,
            title: log.title,
            users: log.users,
            place: log.place.map((p) => ({
              place_images: p.place_images,
            })),
            address: log.address,
          };
        })
        .filter(Boolean);
      totalCount = dbTotalCount;
    }

    return {
      success: true,
      data: bookmarkedLogs,
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
  const locale = await getLocale();
  const localeParams = { ...params, locale };
  return unstable_cache(
    () => fetchBookmarkedLogs(localeParams),
    [...logKeys.bookmarkList(localeParams)].filter(Boolean),
    {
      tags: [
        cacheTags.logBookmarkList(localeParams), // 특정 페이지 북마크 리스트
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
  locale,
}: SearchParams): Promise<SearchResponse> {
  try {
    const isEn = locale === 'en';

    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize; // 몇 개 건너뛸지 계산

    let searchData: LogWithUserAndAddress[] = [];
    let totalCount: number = 0;

    if (isEn) {
      const whereCondition = getWhereConditionEn({ keyword, city, sigungu });
      const searchLogsFindArgs = getSearchLogsFindArgsEn({ skip, safeSize, sort, whereCondition });
      const [dbSearchData, dbTotalCount] = await Promise.all([
        prisma.log_en.findMany(searchLogsFindArgs),
        prisma.log_en.count({
          where: whereCondition,
        }),
      ]);

      searchData = dbSearchData.map((log) => ({
        log_id: log.log_id,
        title: log.title,
        users: log.users,
        place: log.place_en.map((p) => ({
          place_images: p.place_images_en,
        })),
        address: log.address_en,
      }));
      totalCount = dbTotalCount;
    } else {
      const whereCondition = getWhereConditionKo({ keyword, city, sigungu });
      const searchLogsFindArgs = getSearchLogsFindArgsKo({ skip, safeSize, sort, whereCondition });
      const [dbSearchData, dbTotalCount] = await Promise.all([
        prisma.log.findMany(searchLogsFindArgs),
        prisma.log.count({
          where: whereCondition,
        }),
      ]);

      searchData = dbSearchData;
      totalCount = dbTotalCount;
    }

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
  const locale = await getLocale();
  const localeParams = { ...params, locale };
  return unstable_cache(
    () => fetchSearchLogs(localeParams),
    [...searchKeys.list(localeParams)].filter(Boolean),
    {
      tags: [
        cacheTags.searchList(localeParams), // 조건별로 구분되는 태그
        globalTags.searchAll, // 전체 무효화용 상위 태그
      ],
      revalidate: CACHE_REVALIDATE_TIME,
    }
  )();
}
