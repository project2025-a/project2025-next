import { placeKeys } from '@/app/actions/keys';
import { toQueryString } from '@/lib/utils';
import { PlacesParams, PlacesReseponse } from '@/types/api/place';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

async function fetchUsePlaces(params: PlacesParams): Promise<PlacesReseponse> {
  const query = toQueryString(params);
  const res = await fetch(`/api/places?${query}`);
  const data = await res.json();
  return data;
}

export default function usePlaces(
  { currentPage = 1, pageSize = 12, sort }: Partial<PlacesParams> = {},
  options?: Partial<UseQueryOptions<PlacesReseponse, Error>>
) {
  const locale = useLocale();

  const params = {
    currentPage,
    pageSize,
    sort,
  };
  const localeParams = { ...params, locale };
  return useQuery({
    queryKey: placeKeys.list(localeParams),
    queryFn: () => fetchUsePlaces(localeParams),
    //placeholderData: keepPreviousData,
    ...options,
  });
}
