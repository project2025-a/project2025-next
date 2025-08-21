import { safeKey } from '@/lib/utils';
import { PaginationParams } from '@/types/api/common';
import { FollowListParams } from '@/types/api/follow';
import { logBookmarkListParams, LogsParams } from '@/types/api/log';
import { SearchParams } from '@/types/api/search';

// ============================================================================
// 유저 관련 쿼리키
// ============================================================================
export const userKeys = {
  all: ['user'] as const,

  // 현재 로그인한 유저 정보
  me: () => safeKey(...userKeys.all, 'me'),

  // 특정 유저 공개 프로필 정보
  publicUser: (userId: string) => safeKey(...userKeys.all, 'public', userId),
};

// ============================================================================
// 팔로우 관련 쿼리키
// ============================================================================
export const followKeys = {
  all: ['follow'] as const,

  // 특정 유저 팔로우 관련 정보
  publicUser: (userId: string) => safeKey(...followKeys.all, 'user', userId),

  // 팔로우 상태 확인 (특정 유저를 팔로우하고 있는지)
  status: (userId: string) => safeKey(...followKeys.publicUser(userId), 'status'),

  // 팔로워 목록 (나를 팔로우하는 사람들)
  follower: (userId: string) => safeKey(...followKeys.publicUser(userId), 'followers'),
  followerList: (params: FollowListParams) =>
    safeKey(
      ...followKeys.follower(params.userId),
      `page-${params.currentPage}`,
      `size-${params.pageSize}`
    ),

  // 팔로잉 목록 (내가 팔로우하는 사람들)
  following: (userId: string) => safeKey(...followKeys.publicUser(userId), 'followings'),
  followingList: (params: FollowListParams) =>
    safeKey(
      ...followKeys.following(params.userId),
      `page-${params.currentPage}`,
      `size-${params.pageSize}`
    ),
};

// ============================================================================
// 로그 관련 쿼리키
// ============================================================================
export const logKeys = {
  all: ['log'] as const,

  // 특정 로그 상세 정보
  detail: (logId: string, locale: string = 'ko') =>
    safeKey(...logKeys.all, 'detail', `locale-${locale}`, logId),

  // 로그 목록 (전체)
  list: ({ currentPage = 1, pageSize = 10, sort = 'latest', locale = 'ko' }: LogsParams) =>
    safeKey(
      ...logKeys.all,
      'list',
      `locale-${locale}`,
      `page-${currentPage}`,
      `size-${pageSize}`,
      `sort-${sort}`
    ),

  // 특정 유저 로그 목록
  listByUser: ({ userId, currentPage = 1, pageSize = 10, locale = 'ko' }: LogsParams) =>
    safeKey(
      ...logKeys.all,
      'byUser',
      `locale-${locale}`,
      userId,
      `page-${currentPage}`,
      `size-${pageSize}`
    ),

  // 북마크된 로그 목록
  bookmarkList: ({ userId, currentPage, pageSize, locale = 'ko' }: logBookmarkListParams) =>
    safeKey(
      ...logKeys.all,
      'bookmarks',
      `locale-${locale}`,
      `user-${userId}`,
      `page-${currentPage}`,
      `size-${pageSize}`
    ),

  // 특정 로그 북마크 상태
  bookmarkStatus: (logId: string, userId: string, locale: string) =>
    safeKey(...logKeys.all, 'bookmark-status', `locale-${locale}`, logId, `user-${userId}`),
};

// ============================================================================
// 장소 관련 쿼리키
// ============================================================================
export const placeKeys = {
  all: ['place'] as const,

  // 특정 장소 상세 정보
  detail: (placeId: string, locale: string = 'ko') =>
    safeKey(...placeKeys.all, 'detail', `locale-${locale}`, placeId),

  // 장소 목록
  list: ({ currentPage = 1, pageSize = 10, locale = 'ko' }: PaginationParams) =>
    safeKey(
      ...placeKeys.all,
      'list',
      `locale-${locale}`,
      `page-${currentPage}`,
      `size-${pageSize}`
    ),

  // 북마크된 장소 목록
  bookmarkList: ({
    userId,
    currentPage = 1,
    pageSize = 12,
    locale = 'ko',
  }: logBookmarkListParams) =>
    safeKey(
      ...placeKeys.all,
      'bookmarks',
      `locale-${locale}`,
      `user-${userId}`,
      `page-${currentPage}`,
      `size-${pageSize}`
    ),

  // 특정 장소 북마크 상태
  bookmarkStatus: (placeId: string, userId: string, locale: string) =>
    safeKey(...placeKeys.all, 'bookmark-status', `locale-${locale}`, placeId, `user-${userId}`),
};

// ============================================================================
// 검색 관련 쿼리키
// ============================================================================
export const searchKeys = {
  all: ['search'] as const,

  // 검색 결과 목록
  list: (params: SearchParams) =>
    safeKey(
      ...searchKeys.all,
      'results',
      `locale-${params.locale ?? 'ko'}`,
      `page-${params.currentPage ?? 1}`,
      `size-${params.pageSize ?? 10}`,
      `sort-${params.sort ?? 'latest'}`,
      `keyword-${params.keyword ?? ''}`,
      `city-${params.city ?? ''}`,
      `sigungu-${params.sigungu ?? ''}`
    ),
};
