import { Tables } from '../supabase';
import { ApiResponse, LogWithUserAndAddress, PaginationParams } from './common';

/* 로그 */
type PlaceWithImages = Tables<'place'> & {
  place_images: Tables<'place_images'>[];
  _count?: {
    place_bookmark: number;
  };
};

export type DetailLog = Tables<'log'> & {
  place: PlaceWithImages[];
} & {
  log_tag: Array<Pick<Tables<'log_tag'>, 'category' | 'tag'>>;
  address: Array<Pick<Tables<'address'>, 'country' | 'city' | 'sigungu'>>;
  users: Pick<Tables<'users'>, 'image_url' | 'nickname'>;
  _count?: { log_bookmark: number };
};

/* 로그리스트 */
export type LogsResponse = ApiResponse<LogWithUserAndAddress[]>;
export interface LogsParams extends PaginationParams {
  userId?: string;
}
export interface logBookmarkListParams extends PaginationParams {
  userId: string;
}

export interface LogBookmarkCheckParams {
  logId: string;
  isBookmark: boolean;
  locale?: string;
}

export interface LogBookmarkParams {
  userId: string;
  currentPage: number;
  pageSize: number;
}
