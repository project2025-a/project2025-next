import { placeKeys } from '@/app/actions/keys';
import { BookmarkResponse } from '@/types/api/common';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

interface UseIsPlaceBookmarkProps {
  placeId: string;
  userId: string | null;
}

async function fetchPlaceBookmarkCheck(placeId: string, locale: string): Promise<BookmarkResponse> {
  const res = await fetch(`/api/place/bookmark/check?placeId=${placeId}&locale=${locale}`);
  return res.json();
}

export default function usePlaceBookmarkCheck({ placeId, userId }: UseIsPlaceBookmarkProps) {
  const locale = useLocale();
  return useQuery<BookmarkResponse>({
    queryKey: placeKeys.bookmarkStatus(placeId, String(userId), locale),
    queryFn: () => fetchPlaceBookmarkCheck(placeId, locale),
    enabled: !!userId,
  });
}
