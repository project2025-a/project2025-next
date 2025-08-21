import { PaginationParams } from '@/types/api/common';
import { logBookmarkListParams, LogsParams } from '@/types/api/log';
import { SearchParams } from '@/types/api/search';
import { followKeys, logKeys, placeKeys, searchKeys, userKeys } from './keys';

/* 해당 태그 관련 전체 무효화용 */
export const globalTags = {
  /* 유저 관련 */
  userAll: 'user:all',

  /* 팔로우 관련 */
  followAll: 'follow:all',

  /* 로그 관련 */
  logAll: 'log:all',

  /* 장소 관련 */
  placeAll: 'place:all',

  /* 검색 관련 */
  searchAll: 'search:list:all',
};

export const cacheTags = {
  // 캐시키 배열을 문자열로 변환
  fromKey: (key: readonly (string | number)[]) => key.join(':'),

  /* 유저 */
  me: () => cacheTags.fromKey(userKeys.me()),
  publicUser: (userId: string) => cacheTags.fromKey(userKeys.publicUser(userId)),

  /* 팔로우 */
  follower: (userId: string) => cacheTags.fromKey([...followKeys.follower(userId), 'single']),
  followerList: (userId: string) => cacheTags.fromKey([...followKeys.follower(userId), 'list']),
  following: (userId: string) => cacheTags.fromKey([...followKeys.following(userId), 'single']),
  followingList: (userId: string) => cacheTags.fromKey([...followKeys.following(userId), 'list']),

  /* 로그 */
  logDetail: (logId: string, locale: string = 'ko') =>
    cacheTags.fromKey([...logKeys.detail(logId, locale), 'single']),
  logList: (params: LogsParams) => cacheTags.fromKey(logKeys.list(params)),
  logListByUser: (params: LogsParams) => cacheTags.fromKey(logKeys.listByUser(params)),
  logBookmarkList: (params: logBookmarkListParams) =>
    cacheTags.fromKey(logKeys.bookmarkList(params)),
  logMyList: (userId: string) => cacheTags.fromKey([...logKeys.all, 'myList', userId, 'list']),

  /* 장소 */
  placeDetail: (placeId: string, locale: string = 'ko') =>
    cacheTags.fromKey([...placeKeys.detail(placeId, locale), 'single']),
  placeList: (params: PaginationParams) => cacheTags.fromKey(placeKeys.list(params)),
  placeBookmarkList: (params: logBookmarkListParams) =>
    cacheTags.fromKey(placeKeys.bookmarkList(params)),

  /* 북마크 */
  placeBookmark: (placeId: string) =>
    cacheTags.fromKey([...placeKeys.detail(placeId), 'place_bookmark']),
  logBookmark: (logId: string) => cacheTags.fromKey([...logKeys.detail(logId), 'log_bookmark']),

  /* 검색 */
  searchList: (params: SearchParams) => cacheTags.fromKey(searchKeys.list(params)),
} as const;
