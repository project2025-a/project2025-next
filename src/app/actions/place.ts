'use server';

import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { CACHE_REVALIDATE_TIME, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/constants/fetchConfig';
import {
  BookmarkPlace,
  Place,
  PlaceBookmarkListParmas,
  PlacesBookmarkReseponse,
  PlacesParams,
  PlacesReseponse,
} from '@/types/api/place';
import { getLocale } from 'next-intl/server';
import { revalidateTag, unstable_cache } from 'next/cache';
import prisma from 'prisma/prisma';
import { placeKeys } from './keys';
import { cacheTags, globalTags } from './tags';
import {
  getBookmarkedPlacesFindArgsEn,
  getBookmarkedPlacesFindArgsKo,
  getPlacesFindArgsEn,
  getPlacesFindArgsKo,
  mapBookmarkPlaceEn,
  mapBookmarkPlaceKo,
} from './utils/placeService';

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
  locale,
}: PlacesParams): Promise<PlacesReseponse> {
  try {
    const isEn = locale === 'en';

    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), MAX_PAGE_SIZE);
    const skip = (safePage - 1) * safeSize; // 몇 개 건너뛸지 계산

    //매핑 전 타입찾기
    let places: any[] = [];
    let totalCount: number = 0;

    if (isEn) {
      const placesFindArgs = getPlacesFindArgsEn({ skip, safeSize, sort });
      const [dbPlaces, dbTotalCount] = await Promise.all([
        prisma.place_en.findMany(placesFindArgs),
        // 전체 장소 수 카운트 (페이지 수 계산에 사용)
        prisma.place_en.count(),
      ]);

      places = dbPlaces.map((place) => {
        const log = place.log_en;

        return {
          place_id: place.place_id,
          log_id: place.log_id,
          name: place.name,
          place_images: place.place_images_en,
          log: log
            ? {
                users: log.users,
                address: log.address_en,
              }
            : null,
        };
      });
      totalCount = dbTotalCount;
    } else {
      const placesFindArgs = getPlacesFindArgsKo({ skip, safeSize, sort });
      const [dbPlaces, dbTotalCount] = await Promise.all([
        prisma.place.findMany(placesFindArgs),
        // 전체 장소 수 카운트 (페이지 수 계산에 사용)
        prisma.place.count(),
      ]);

      places = dbPlaces;
      totalCount = dbTotalCount;
    }

    const filteredPlaces: Place[] = places.map((place) => ({
      place_id: place.place_id,
      log_id: place.log_id,
      place_images: place.place_images[0].image_path,
      name: place.name,
      user: {
        user_id: place.log?.users.user_id,
        nickname: place.log?.users.nickname,
      },
      address: {
        country: place.log?.address[0].country,
        city: place.log?.address[0].city,
        sigungu: place.log?.address[0].sigungu,
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
  const locale = await getLocale();
  const localeParams = { ...params, locale };

  const queryKey = placeKeys.list(localeParams);

  const tagKey = cacheTags.placeList(localeParams);

  return unstable_cache(() => fetchPlaces(localeParams), [...queryKey].filter(Boolean), {
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
  locale,
}: PlaceBookmarkListParmas): Promise<PlacesBookmarkReseponse> {
  try {
    const isEn = locale === 'en';

    const safePage = Math.max(1, currentPage);
    const safeSize = Math.min(Math.max(1, pageSize), 30);
    const skip = (safePage - 1) * safeSize;

    let bookmarkedPlaces: BookmarkPlace[] = [];
    let totalCount = 0;

    if (isEn) {
      const bookmarkedPlacesFindArgs = getBookmarkedPlacesFindArgsEn({ userId, skip, pageSize });
      const [dbBookmarkedPlaces, dbTotalCount] = await Promise.all([
        prisma.place_bookmark_en.findMany(bookmarkedPlacesFindArgs),
        prisma.log_bookmark_en.count({
          where: { user_id: userId },
        }),
      ]);
      bookmarkedPlaces = dbBookmarkedPlaces.map(mapBookmarkPlaceEn);
      totalCount = dbTotalCount;
    } else {
      const bookmarkedPlacesFindArgs = getBookmarkedPlacesFindArgsKo({ userId, skip, pageSize });
      const [dbBookmarkedPlaces, dbTotalCount] = await Promise.all([
        prisma.place_bookmark.findMany(bookmarkedPlacesFindArgs),
        prisma.log_bookmark.count({
          where: { user_id: userId },
        }),
      ]);

      bookmarkedPlaces = dbBookmarkedPlaces.map(mapBookmarkPlaceKo);
      totalCount = dbTotalCount;
    }

    return {
      success: true,
      data: bookmarkedPlaces,
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
  const locale = await getLocale();
  const localeParams = { ...params, locale };

  return unstable_cache(
    () => fetchBookmarkedPlaces(localeParams),
    [...placeKeys.bookmarkList(localeParams)],
    {
      tags: [
        cacheTags.placeBookmarkList(localeParams), // 개별 사용자별 태그
        globalTags.placeAll, // 전체 북마크 무효화용 태그
      ],
      revalidate: 300,
    }
  )();
}

/* 북마크 시 서버캐시 무효화 */
export async function revalidateBookmarkPlaces() {
  revalidateTag(globalTags.placeAll);
}
