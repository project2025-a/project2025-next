import { logKeys } from '@/app/actions/keys';
import { BookmarkResponse } from '@/types/api/common';
import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

interface UseLogBookmarkCheckProps {
  logId: string;
  userId: string | null;
}

async function fetchLogBookmarkCheck(logId: string, locale: string): Promise<BookmarkResponse> {
  const res = await fetch(`/api/log/bookmark/check?logId=${logId}&locale=${locale}`);
  return res.json();
}

export default function useLogBookmarkCheck({ logId, userId }: UseLogBookmarkCheckProps) {
  const locale = useLocale();
  return useQuery<BookmarkResponse>({
    queryKey: logKeys.bookmarkStatus(logId, String(userId), locale),
    queryFn: () => fetchLogBookmarkCheck(logId, locale),
    enabled: !!userId,
  });
}
