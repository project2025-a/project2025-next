import { placeKeys } from '@/app/actions/keys';
import { toQueryString } from '@/lib/utils';
import { useProfileTabStore } from '@/stores/profileStore';
import { BookmarkParams } from '@/types/api/common';
import { PlacesBookmarkReseponse } from '@/types/api/place';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

async function fetchUsePlacesBookmark(params: BookmarkParams): Promise<PlacesBookmarkReseponse> {
  const query = toQueryString(params);
  const res = await fetch(`/api/places/bookmark?${query}`);
  const data = await res.json();
  return data;
}

export default function usePlacesBookmark({
  userId,
  currentPage = 1,
  pageSize = 12,
}: BookmarkParams) {
  const params = {
    userId,
    currentPage,
    pageSize,
  };
  const locale = useLocale();
  const localeParams = { ...params, locale };
  const tab = useProfileTabStore((state) => state.tab);
  return useQuery({
    queryKey: placeKeys.bookmarkList(localeParams),
    queryFn: () => fetchUsePlacesBookmark(localeParams),
    enabled: !!userId && tab === 'savedSpaces',
    placeholderData: keepPreviousData,
  });
}
