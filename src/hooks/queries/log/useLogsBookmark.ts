import { logKeys } from '@/app/actions/keys';
import { toQueryString } from '@/lib/utils';
import { useProfileTabStore } from '@/stores/profileStore';
import { BookmarkParams } from '@/types/api/common';
import { LogsResponse } from '@/types/api/log';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

async function fetchUseLogsBookmark(params: BookmarkParams): Promise<LogsResponse> {
  const query = toQueryString(params);
  const res = await fetch(`/api/logs/bookmark?${query}`);
  const data = await res.json();
  return data;
}

export default function useLogsBookmark({
  userId,
  currentPage = 1,
  pageSize = 12,
}: BookmarkParams) {
  const locale = useLocale();

  const params = {
    userId,
    currentPage,
    pageSize,
  };
  const localeParams = { ...params, locale };
  const tab = useProfileTabStore((state) => state.tab);
  return useQuery({
    queryKey: logKeys.bookmarkList(localeParams),
    queryFn: () => fetchUseLogsBookmark(localeParams),
    enabled: !!userId && tab === 'savedLog',
    placeholderData: keepPreviousData,
  });
}
