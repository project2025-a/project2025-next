import { Tables } from '../supabase';

type Sort = 'popular' | 'latest';

export type NullableFields<T> = {
  [K in keyof T]: T[K] | null;
};

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      meta?: {
        pagination?: {
          currentPage: number;
          pageSize: number;
          totalPages: number;
          totalItems: number;
          sort?: Sort;
        };
        httpStatus?: number;
      };
    }
  | {
      success: false;
      msg?: string;
      errorCode?: string;
    };

export interface PaginationParams {
  currentPage?: number;
  pageSize?: number;
  sort?: Sort;
  locale?: string;
}

export interface BookmarkResponse {
  success: boolean;
  isBookmark: boolean;
  msg?: string;
}

export interface BookmarkParams extends Pick<PaginationParams, 'currentPage' | 'pageSize'> {
  userId: string;
}

/* 검색, 로그 응답에 사용되는 공통 타입 */
export type User = Pick<Tables<'users'>, 'nickname' | 'user_id'> | null;
export type Address = Pick<Tables<'address'>, 'city' | 'country' | 'sigungu'>;
export type Log = Omit<Tables<'log'>, 'created_at' | 'user_id'>;
export type LogWithUserAndAddress =
  | (Log & {
      users: User;
      address: Address[];
      place: {
        place_images: {
          image_path: string;
        }[];
      }[];
    })
  | null;
