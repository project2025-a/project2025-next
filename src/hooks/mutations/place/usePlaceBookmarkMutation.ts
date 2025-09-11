import { placeKeys } from '@/app/actions/keys';
import useUser from '@/hooks/queries/user/useUser';
import { usePlaceBookmarkStore } from '@/stores/placeBookmarkStore';
import { BookmarkResponse } from '@/types/api/common';
import { PlaceBookmarkParams } from '@/types/api/place';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';

async function fetchPlaceBookmark({
  placeId,
  isBookmark,
  locale,
}: PlaceBookmarkParams): Promise<BookmarkResponse> {
  const res = await fetch(`/api/place/bookmark/check?placeId=${placeId}&locale=${locale}`, {
    method: isBookmark ? 'DELETE' : 'POST',
  });
  const data = await res.json();
  return data;
}

export default function usePlaceBookmarkMutation(onToggle?: (newStatus: boolean) => void) {
  const locale = useLocale();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const onBookmark = usePlaceBookmarkStore((state) => state.onBookmark);

  return useMutation({
    mutationFn: (params: PlaceBookmarkParams) => fetchPlaceBookmark({ ...params, locale }),
    onMutate: async ({ placeId, isBookmark }: PlaceBookmarkParams) => {
      await queryClient.cancelQueries({
        queryKey: placeKeys.bookmarkStatus(placeId, String(user?.user_id), locale),
      });

      const previousData = queryClient.getQueryData(
        placeKeys.bookmarkStatus(placeId, String(user?.user_id), locale)
      );

      queryClient.setQueryData(
        placeKeys.bookmarkStatus(placeId, String(user?.user_id), locale),
        (old: BookmarkResponse) => ({
          ...old,
          isBookmark: !isBookmark,
        })
      );

      // 상세페이지 카운트 반영
      onToggle?.(!isBookmark);

      // 전역 상태 낙관적 업데이트
      onBookmark(placeId, isBookmark);

      return { previousData };
    },
    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          placeKeys.bookmarkStatus(variables.placeId, String(user?.user_id), locale),
          context.previousData
        );
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: placeKeys.bookmarkStatus(variables.placeId, String(user?.user_id), locale),
      });
    },
  });
}
