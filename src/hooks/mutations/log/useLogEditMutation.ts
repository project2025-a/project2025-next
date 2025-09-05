import { logKeys, placeKeys, searchKeys } from '@/app/actions/keys';
import { updateLog } from '@/app/actions/log-update';
import { trackLogEditEvent } from '@/lib/analytics';
import { useLogTagStore } from '@/stores/logTagStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface LogEditMutationProps {
  formData: FormData;
  logId: string;
}

const useLogEditMutation = () => {
  const translations = {
    toastLogEdit: useTranslations('Toast.logEdit'),
    toastLogCreate: useTranslations('Toast.logCreate'),
  };

  const queryClient = useQueryClient();
  const clearTag = useLogTagStore((state) => state.clearTag);

  return useMutation({
    mutationFn: ({ formData, logId }: LogEditMutationProps) => updateLog(formData, logId),
    onSuccess: ({ success }) => {
      if (success) {
        trackLogEditEvent('complete');

        clearTag();

        //캐시 무효화
        const keysToInvalidate = [logKeys.all, placeKeys.all, searchKeys.all];

        keysToInvalidate.forEach((key) => {
          queryClient.removeQueries({ queryKey: key, exact: false });
        });

        toast.success(translations.toastLogEdit('success'), {
          description: translations.toastLogCreate('redirect'),
        });
      }
    },
    onError: () => {
      trackLogEditEvent('cancel');
      toast.error(translations.toastLogEdit('error'));
    },
  });
};

export default useLogEditMutation;
