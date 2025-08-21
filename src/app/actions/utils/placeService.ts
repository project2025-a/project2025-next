import { Sort } from '@/types/api/common';
import { BookmarkPlace } from '@/types/api/place';
import { Prisma } from '@prisma/client';

// ===================================================================
// 장소 리스트
// ===================================================================

interface getPlacesFindArgs {
  skip: number;
  safeSize: number;
  sort: Sort;
}
export function mapmarkPlacesEn(place: any) {
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
}

export function getPlacesFindArgsKo({ skip, safeSize, sort }: getPlacesFindArgs) {
  return {
    skip, // 앞에서 몇 개 건너뛸지
    take: safeSize, // 가져올 데이터 수

    // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
    orderBy:
      sort === 'popular'
        ? { place_bookmark: { _count: Prisma.SortOrder.desc } }
        : { created_at: Prisma.SortOrder.desc },

    select: {
      place_id: true,
      name: true,
      log_id: true,

      place_images: {
        orderBy: { order: Prisma.SortOrder.asc },
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
  };
}

export function getPlacesFindArgsEn({ skip, safeSize, sort }: getPlacesFindArgs) {
  return {
    skip, // 앞에서 몇 개 건너뛸지
    take: safeSize, // 가져올 데이터 수

    // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
    orderBy:
      sort === 'popular'
        ? { place_bookmark_en: { _count: Prisma.SortOrder.desc } }
        : { created_at: Prisma.SortOrder.desc },

    select: {
      place_id: true,
      name: true,
      log_id: true,

      place_images_en: {
        orderBy: { order: Prisma.SortOrder.asc },
        take: 1,
        select: {
          image_path: true,
        },
      },
      log_en: {
        select: {
          users: {
            select: {
              user_id: true,
              nickname: true,
            },
          },
          address_en: {
            select: {
              country: true,
              city: true,
              sigungu: true,
            },
          },
        },
      },
    },
  };
}

// ===================================================================
// 북마크 장소 리스트
// ===================================================================

interface GetBookmarkedPlacesFindArgsProps {
  userId: string;
  skip: number;
  pageSize: number;
}

export function mapBookmarkPlaceKo(bookmark: any): BookmarkPlace {
  const place = bookmark.place;
  const log = place.log;
  const image = place?.place_images[0];

  return {
    place_id: place.place_id,
    log_id: log?.log_id ?? null,
    user: {
      user_id: log?.users.user_id ?? '',
      nickname: log?.users.nickname ?? null,
    },
    name: place.name,
    address: place.address,
    description: place.description,
    category: place.category,
    image: {
      image_path: image?.image_path ?? null,
      order: image?.order ?? null,
      place_id: image?.place_id ?? null,
      place_image_id: image?.place_image_id ? Number(image.place_image_id) : 0,
    },
  };
}
export function mapBookmarkPlaceEn(bookmark: any): BookmarkPlace {
  const place = bookmark.place_en;
  const log = place.log_en;
  const image = place?.place_images_en[0];

  return {
    place_id: place.place_id,
    log_id: log?.log_id ?? null,
    user: {
      user_id: log?.users.user_id ?? '',
      nickname: log?.users.nickname ?? null,
    },
    name: place.name,
    address: place.address,
    description: place.description,
    category: place.category,
    image: {
      image_path: image?.image_path ?? null,
      order: image?.order ?? null,
      place_id: image?.place_id ?? null,
      place_image_id: image?.place_image_id ? Number(image.place_image_id) : 0,
    },
  };
}

export function getBookmarkedPlacesFindArgsKo({
  userId,
  skip,
  pageSize,
}: GetBookmarkedPlacesFindArgsProps) {
  return {
    where: { user_id: userId },
    skip,
    take: pageSize,
    orderBy: {
      place: {
        created_at: Prisma.SortOrder.desc,
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
            orderBy: { order: Prisma.SortOrder.asc },
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
  };
}

export function getBookmarkedPlacesFindArgsEn({
  userId,
  skip,
  pageSize,
}: GetBookmarkedPlacesFindArgsProps) {
  return {
    where: { user_id: userId },
    skip,
    take: pageSize,
    orderBy: {
      place_en: {
        created_at: Prisma.SortOrder.desc,
      },
    },
    include: {
      place_en: {
        select: {
          place_id: true,
          name: true,
          description: true,
          address: true,
          category: true,
          place_images_en: {
            orderBy: { order: Prisma.SortOrder.asc },
            take: 1, // 대표 이미지 한 장만
            select: {
              image_path: true,
              order: true,
              place_id: true,
              place_image_id: true,
            },
          },
          log_en: {
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
  };
}

export function normalizeBookmarkedPlaceEn(item: any) {
  const place = item.place_en;

  return {
    place_id: place.place_id,
    name: place.name,
    description: place.description,
    address: place.address,
    category: place.category,
    place_images: place.place_images_en,
    log: place.log_en
      ? {
          log_id: place.log_en.log_id,
          users: place.log_en.users,
        }
      : null,
  };
}
