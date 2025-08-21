import { Tables } from '../supabase';
import { ApiResponse, PaginationParams } from './common';

type IBookmarkPlace = Pick<
  Tables<'place'>,
  'place_id' | 'log_id' | 'name' | 'description' | 'address' | 'category'
>;
type PlaceImage = Tables<'place_images'>;
type User = Pick<Tables<'users'>, 'nickname' | 'user_id'>;

interface BookmarkPlace extends IBookmarkPlace {
  user: User;
  image: PlaceImage;
}

export type Place = {
  place_id: string;
  log_id: string;
  name: string;
  place_images: string;
  user: {
    user_id: string;
    nickname: string;
  };
  address: {
    country: string;
    city: string;
    sigungu: string;
  };
};

export type PlacesReseponse = ApiResponse<Place[]>;

export type PlacesBookmarkReseponse = ApiResponse<BookmarkPlace[]>;

/* 장소 리스트 */
type PlacesParams = PaginationParams;

/* 장소북마크 리스트 */
export interface PlaceBookmarkListParmas extends PaginationParams {
  userId: string;
}

export interface PlaceBookmarkParams {
  placeId: string;
  isBookmark: boolean;
  locale?: string;
}

//사진 메타에이터 장소 타입
export type PhotoMetadataReseponse = ApiResponse<{ address: string }>;
