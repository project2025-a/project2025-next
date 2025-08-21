import { searchKeys } from '@/app/actions/keys';
import { toQueryString } from '@/lib/utils';
import { SearchParams, SearchResponse } from '@/types/api/search';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

async function fetchuseSearch(params: SearchParams): Promise<SearchResponse> {
  const query = toQueryString(params);
  const res = await fetch(`/api/logs/search?${query}`);
  const data = await res.json();
  return data;
}

export default function useSearchLogs(params: SearchParams) {
  const locale = useLocale();
  const localeParams = { ...params, locale };
  return useQuery({
    queryKey: searchKeys.list(localeParams),
    queryFn: () => fetchuseSearch(localeParams),
    placeholderData: keepPreviousData,
    enabled: (params.keyword ?? '').length > 0, // 검색어가 있을 때만
  });
}

//() => getSearch(params),
