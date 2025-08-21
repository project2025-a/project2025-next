import { logKeys } from '@/app/actions/keys';
import useUser from '@/hooks/queries/user/useUser';
import { BookmarkResponse } from '@/types/api/common';
import { LogBookmarkCheckParams } from '@/types/api/log';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

async function fetchLogBookmark({
  logId,
  isBookmark,
  locale,
}: LogBookmarkCheckParams): Promise<BookmarkResponse> {
  const res = await fetch(`/api/log/bookmark/check?logId=${logId}&locale=${locale}`, {
    method: isBookmark ? 'DELETE' : 'POST',
  });
  const data = await res.json();
  return data;
}

export default function useLogBookmarkMutation(onToggle?: (newStatus: boolean) => void) {
  const locale = useLocale();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: LogBookmarkCheckParams) => fetchLogBookmark({ ...params, locale }),
    onMutate: async ({ logId, isBookmark }: LogBookmarkCheckParams) => {
      await queryClient.cancelQueries({
        queryKey: logKeys.bookmarkStatus(logId, String(user?.user_id), locale),
      });

      const previousbookmarkStatus = queryClient.getQueryData(
        logKeys.bookmarkStatus(logId, String(user?.user_id), locale)
      );

      queryClient.setQueryData(
        logKeys.bookmarkStatus(logId, String(user?.user_id), locale),
        (old: BookmarkResponse) => ({
          ...old,
          isBookmark: !isBookmark,
        })
      );

      // 상세페이지 카운트 반영
      onToggle?.(!isBookmark);

      return { previousbookmarkStatus };
    },
    onError: (_error, variables, context) => {
      if (context?.previousbookmarkStatus) {
        queryClient.setQueryData(
          logKeys.bookmarkStatus(variables.logId, String(user?.user_id), locale),
          context.previousbookmarkStatus
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: logKeys.bookmarkStatus(variables.logId, String(user?.user_id), locale),
      });
    },
  });
}
