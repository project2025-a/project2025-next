'use server';

import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CACHE_REVALIDATE_TIME, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/fetchConfig';
import {
  PlaceBookmarkListParmas,
  PlacesBookmarkReseponse,
  PlacesParams,
  PlacesReseponse,
} from '@/types/api/place';
import { revalidateTag, unstable_cache } from 'next/cache';
import prisma from 'prisma/prisma';
import { placeKeys } from './keys';
import { cacheTags, globalTags } from './tags';

export async function revalidatePlaces() {
  revalidateTag(globalTags.placeAll);
}

// ===================================================================
// 장소 리스트
// ===================================================================

export async function fetchPlaces({
  currentPage = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  sort = 'latest',
}: PlacesParams): Promise<PlacesReseponse> {
  try {
    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize; // 몇 개 건너뛸지 계산

    const [places, totalCount] = await Promise.all([
      prisma.place.findMany({
        skip, // 앞에서 몇 개 건너뛸지
        take: safeSize, // 가져올 데이터 수

        // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
        orderBy:
          sort === 'popular' ? { place_bookmark: { _count: 'desc' } } : { created_at: 'desc' },

        select: {
          place_id: true,
          name: true,
          log_id: true,

          place_images: {
            orderBy: { order: 'asc' },
            take: 1,
            select: {
              image_path: true,
            },
          },
          log: {
            select: {
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
      }),
      // 전체 장소 수 카운트 (페이지 수 계산에 사용)
      prisma.place.count(),
    ]);

    const filteredPlaces = places.map((place) => ({
      place_id: place.place_id?.toString() ?? '',
      log_id: place.log_id?.toString() ?? '',
      place_images: place.place_images[0].image_path?.toString() ?? '',
      name: place.name?.toString() ?? '',
      user: {
        user_id: place.log?.users.user_id?.toString() ?? '',
        nickname: place.log?.users.nickname?.toString() ?? '',
      },
      address: {
        country: place.log?.address[0].country?.toString() ?? '',
        city: place.log?.address[0].city?.toString() ?? '',
        sigungu: place.log?.address[0].sigungu?.toString() ?? '',
      },
    }));

    return {
      success: true,
      data: filteredPlaces,
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

export async function getPlaces(params: PlacesParams) {
  const queryKey = placeKeys.list(params);

  const tagKey = cacheTags.placeList(params);

  return unstable_cache(() => fetchPlaces(params), [...queryKey].filter(Boolean), {
    tags: [tagKey, globalTags.placeAll], // 상위 그룹 태그 추가
    revalidate: CACHE_REVALIDATE_TIME,
  })();
}

// ===================================================================
// 북마크 장소 리스트
// ===================================================================
export async function fetchBookmarkedPlaces({
  userId,
  currentPage = 1,
  pageSize = 12,
}: PlaceBookmarkListParmas): Promise<PlacesBookmarkReseponse> {
  try {
    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), 30);
    const skip = (safePage - 1) * safeSize;

    const bookmarkedPlaces = await prisma.place_bookmark.findMany({
      where: { user_id: userId },
      skip,
      take: pageSize,
      orderBy: {
        place: {
          created_at: 'desc',
        },
      },
      include: {
        place: {
          select: {
            place_id: true,
            name: true,
            description: true,
            address: true,
            category: true,
            place_images: {
              orderBy: { order: 'asc' },
              take: 1, // 대표 이미지 한 장만
              select: {
                image_path: true,
                order: true,
                place_id: true,
                place_image_id: true,
              },
            },
            log: {
              select: {
                log_id: true,
                users: {
                  select: {
                    user_id: true,
                    nickname: true, // 작성자 이름
                  },
                },
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

    const filteredPlaces = bookmarkedPlaces.map((boolmark) => {
      const place = boolmark.place;
      const image = place?.place_images?.[0];
      return {
        place_id: place?.place_id?.toString() ?? '',
        log_id: place?.log?.log_id?.toString() as string,
        user: {
          user_id: place?.log?.users?.user_id ?? '',
          nickname: place?.log?.users?.nickname ?? null,
        },
        name: place?.name ?? '',
        description: place?.description ?? '',
        address: place?.address ?? '',
        category: place?.category ?? '',
        image: {
          image_path: image?.image_path ?? null,
          order: image?.order ?? null,
          place_id: image?.place_id?.toString() ?? null,
          place_image_id: image?.place_image_id ? Number(image.place_image_id) : 0,
        },
      };
    });
    return {
      success: true,
      data: filteredPlaces,
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

export async function getBookmarkedPlaces(params: PlaceBookmarkListParmas) {
  return unstable_cache(() => fetchBookmarkedPlaces(params), [...placeKeys.bookmarkList(params)], {
    tags: [
      cacheTags.placeBookmarkList(params), // 개별 사용자별 태그
      globalTags.placeAll, // 전체 북마크 무효화용 태그
    ],
    revalidate: 300,
  })();
}

/* 북마크 시 서버캐시 무효화 */
export async function revalidateBookmarkPlaces() {
  revalidateTag(globalTags.placeAll);
}
