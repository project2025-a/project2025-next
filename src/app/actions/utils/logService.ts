import { Sort } from '@/types/api/common';
import { Prisma } from '@prisma/client';

// ===================================================================
// 단일 로그
// ===================================================================

export function getLogFindArgsKo() {
  return {
    users: {
      select: {
        nickname: true,
        image_url: true,
      },
    },
    place: {
      include: {
        place_images: {
          orderBy: { order: Prisma.SortOrder.asc },
        },
        _count: {
          select: {
            place_bookmark: true,
          },
        },
      },
      orderBy: {
        order: Prisma.SortOrder.asc,
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
    _count: {
      select: {
        log_bookmark: true,
      },
    },
  };
}

export function getLogFindArgsEn() {
  return {
    users: {
      select: {
        nickname: true,
        image_url: true,
      },
    },
    place_en: {
      include: {
        place_images_en: {
          orderBy: { order: Prisma.SortOrder.asc },
        },
        _count: {
          select: {
            place_bookmark_en: true,
          },
        },
      },
      orderBy: {
        order: Prisma.SortOrder.asc,
      },
    },
    log_tag_en: {
      select: {
        category: true,
        tag: true,
      },
    },
    address_en: {
      select: {
        country: true,
        city: true,
        sigungu: true,
      },
    },
    _count: {
      select: {
        log_bookmark_en: true,
      },
    },
  };
}

// ===================================================================
// 로그 리스트
// ===================================================================

interface GetLogsSelectProps {
  skip: number;
  safeSize: number;
  where:
    | {
        user_id: string;
      }
    | undefined;
  sort: Sort;
}

export function getLogsFindArgsKo({ skip, safeSize, where, sort }: GetLogsSelectProps) {
  return {
    skip,
    take: safeSize,
    where,
    orderBy:
      sort === 'popular'
        ? { log_bookmark: { _count: Prisma.SortOrder.desc } }
        : { created_at: Prisma.SortOrder.desc },
    select: {
      log_id: true,
      title: true,
      place: {
        take: 1,
        orderBy: { order: Prisma.SortOrder.asc },
        select: {
          place_images: {
            take: 1,
            orderBy: { order: Prisma.SortOrder.asc },
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
  };
}

export function getLogsFindArgsEn({ skip, safeSize, where, sort }: GetLogsSelectProps) {
  return {
    skip, // 앞에서 몇 개 건너뛸지
    take: safeSize, // 가져올 데이터 수
    where,
    // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
    orderBy:
      sort === 'popular'
        ? { log_bookmark_en: { _count: Prisma.SortOrder.desc } }
        : { created_at: Prisma.SortOrder.desc },
    select: {
      log_id: true,
      title: true,
      place_en: {
        take: 1,
        orderBy: { order: Prisma.SortOrder.asc },
        select: {
          place_images_en: {
            take: 1,
            orderBy: { order: Prisma.SortOrder.asc },
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
      address_en: {
        select: {
          country: true,
          city: true,
          sigungu: true,
        },
      },
    },
  };
}

// ===================================================================
// 북마크 로그 리스트
// ===================================================================

interface GetBookmarkedLogsFindArgsKoProps {
  userId: string;
  skip: number;
  pageSize: number;
}

export function getBookmarkedLogsFindArgsKo({
  userId,
  skip,
  pageSize,
}: GetBookmarkedLogsFindArgsKoProps) {
  return {
    where: { user_id: userId },
    skip,
    take: pageSize,
    orderBy: {
      log: {
        created_at: Prisma.SortOrder.desc,
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
  };
}

export function getBookmarkedLogsFindArgsEn({
  userId,
  skip,
  pageSize,
}: GetBookmarkedLogsFindArgsKoProps) {
  return {
    where: { user_id: userId },
    skip,
    take: pageSize,
    orderBy: {
      log_en: {
        created_at: Prisma.SortOrder.desc,
      },
    },
    include: {
      log_en: {
        select: {
          log_id: true,
          title: true,
          place_en: {
            take: 1,
            select: {
              place_images_en: {
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
// 검색 리스트
// ===================================================================

interface GetWhereConditionProps {
  keyword: string | undefined;
  city: string | undefined;
  sigungu: string | undefined;
}

// 검색 조건 구성
export function getWhereConditionKo({ keyword, city, sigungu }: GetWhereConditionProps) {
  // 검색 조건 구성
  const searchConditions = [];

  if (keyword) {
    searchConditions.push({
      OR: [
        { title: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { place: { some: { name: { contains: keyword, mode: Prisma.QueryMode.insensitive } } } },
        {
          address: {
            some: {
              city: { contains: keyword, mode: Prisma.QueryMode.insensitive },
            },
          },
        },
        {
          address: {
            some: {
              sigungu: { contains: keyword, mode: Prisma.QueryMode.insensitive },
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
          sigungu: { contains: sigungu, mode: Prisma.QueryMode.insensitive },
        },
      },
    });
  }

  const whereCondition =
    searchConditions.length > 0 ? { AND: searchConditions as Prisma.logWhereInput[] } : {};

  return whereCondition;
}

// 검색 조건 구성
export function getWhereConditionEn({ keyword, city, sigungu }: GetWhereConditionProps) {
  const searchConditions = [];

  if (keyword) {
    searchConditions.push({
      OR: [
        { title: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { place_en: { some: { name: { contains: keyword, mode: Prisma.QueryMode.insensitive } } } },
        {
          address_en: { some: { city: { contains: keyword, mode: Prisma.QueryMode.insensitive } } },
        },
        {
          address_en: {
            some: { sigungu: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
          },
        },
      ],
    });
  }

  if (city) {
    searchConditions.push({
      address_en: {
        some: {
          city: { equals: city },
        },
      },
    });
  }

  if (sigungu) {
    searchConditions.push({
      address_en: {
        some: {
          sigungu: { contains: sigungu, mode: Prisma.QueryMode.insensitive },
        },
      },
    });
  }

  const whereCondition = searchConditions.length ? { AND: searchConditions } : {};

  return whereCondition;
}

interface GetSearchLogsFindArgsKoProps {
  skip: number;
  safeSize: number;
  sort: Sort;
  whereCondition: Prisma.logWhereInput;
}
interface GetSearchLogsFindArgsEnProps {
  skip: number;
  safeSize: number;
  sort: Sort;
  whereCondition: Prisma.log_enWhereInput;
}

export function getSearchLogsFindArgsKo({
  skip,
  safeSize,
  sort,
  whereCondition,
}: GetSearchLogsFindArgsKoProps) {
  return {
    skip, // 앞에서 몇 개 건너뛸지
    take: safeSize, // 가져올 데이터 수
    where: whereCondition,

    // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
    orderBy:
      sort === 'popular'
        ? { log_bookmark: { _count: Prisma.SortOrder.desc } }
        : { created_at: Prisma.SortOrder.desc },
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
  };
}

export function getSearchLogsFindArgsEn({
  skip,
  safeSize,
  sort,
  whereCondition,
}: GetSearchLogsFindArgsEnProps) {
  return {
    skip, // 앞에서 몇 개 건너뛸지
    take: safeSize, // 가져올 데이터 수
    where: whereCondition,

    // 정렬 기준 설정: 인기순이면 북마크 개수 기준(연결된 테이블의 개수를 기준으로 정렬), 기본은 최신순
    orderBy:
      sort === 'popular'
        ? { log_bookmark_en: { _count: Prisma.SortOrder.desc } }
        : { created_at: Prisma.SortOrder.desc },
    select: {
      log_id: true,
      title: true,
      place_en: {
        take: 1,
        select: {
          place_images_en: {
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
      address_en: {
        select: {
          country: true,
          city: true,
          sigungu: true,
        },
      },
    },
  };
}
