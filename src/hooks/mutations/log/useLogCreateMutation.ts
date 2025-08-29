import { logKeys, placeKeys, searchKeys } from '@/app/actions/keys';
import { createLog, ILocale } from '@/app/actions/log-register';
import { HOME } from '@/constants/pathname';
import useUser from '@/hooks/queries/user/useUser';
import { useRouter } from '@/i18n/navigation';
import { trackLogCreateEvent } from '@/lib/analytics';
import { useLogTagStore } from '@/stores/logTagStore';
import { LogFormValues, NewPlace, NewPlaceImage } from '@/types/log';
import { uploadPlacesOptimized } from '@/utils/imageUpload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

// 로그 등록 위해 서버로 보낼 데이터 (db 갱신용)
export type LogCreatePayload = {
  logId: string;
  userId: string;
  logTitle: LogFormValues['logTitle'];
  tags: LogFormValues['tags'];
  address: LogFormValues['address'];
  placeDataList: NewPlace[];
  placeImageDataList: NewPlaceImage[];
  locale: ILocale;
};

const useLogCreateMutation = () => {
  const locale = useLocale();

  const router = useRouter();
  const queryClient = useQueryClient();
  const clearTag = useLogTagStore((state) => state.clearTag);
  const t = useTranslations('Toast.logCreate');
  const setSubmitted = useLogTagStore((state) => state.setSubmitted);
  //일단 유저 아이디 추가
  const me = useUser();

  return useMutation({
    mutationFn: async (values: LogFormValues) => {
      const logId = crypto.randomUUID(); // 로그 고유 id

      // 1. 장소 이미지 업로드
      const { placeDataList, placeImageDataList } = await uploadPlacesOptimized(
        values.places,
        logId
      );

      // 2. 이미지 업로드 후 페이로드 생성
      const logCreatePayload: LogCreatePayload = {
        logId,
        userId: String(me.data?.user_id),
        logTitle: values.logTitle,
        tags: values.tags,
        address: values.address,
        placeDataList,
        placeImageDataList,
        locale: locale === 'en' ? 'en' : 'ko',
      };

      // 3. 로그 등록
      return await createLog(logCreatePayload);
    },
    onMutate: () => {
      const firstTimeoutId = setTimeout(() => {
        toast.info(t('delayed'), {
          description: t('delayedDescription'),
          id: 'delayed-upload-toast',
          duration: 20_000,
        });
      }, 10_000); // 10초

      const secondTimeoutId = setTimeout(() => {
        toast.info(t('stillUploading'), {
          id: 'long-upload-toast',
          duration: 20_000,
        });
      }, 25_000); // 20초

      return { firstTimeoutId, secondTimeoutId };
    },
    onSuccess: ({ success }, _variables, context) => {
      if (context) {
        clearTimeout(context.firstTimeoutId);
        clearTimeout(context.secondTimeoutId);
      }

      if (success) {
        // GA 이벤트 추적 - 로그 등록 완료
        trackLogCreateEvent('complete');

        // 캐시 무효화
        const keysToInvalidate = [logKeys.all, placeKeys.all, searchKeys.all];

        keysToInvalidate.forEach((key) => {
          queryClient.removeQueries({ queryKey: key, exact: false });
        });

        // router.replace(`/log/${data}`);
        router.replace(HOME);
        setSubmitted(true);
        clearTag();
        toast.success(t('success'), {
          description: t('redirect'),
        });
      }
    },
    onError: (error, _variables, context) => {
      if (context) {
        clearTimeout(context.firstTimeoutId);
        clearTimeout(context.secondTimeoutId);
      }
      // GA 이벤트 추적 - 로그 등록 실패
      trackLogCreateEvent('cancel');

      toast.error(t('error'));
    },
  });
};

export default useLogCreateMutation;
