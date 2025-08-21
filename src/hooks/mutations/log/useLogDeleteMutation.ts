import { logKeys, placeKeys, searchKeys } from '@/app/actions/keys';
import { deleteLog } from '@/app/actions/log';
import { HOME } from '@/constants/pathname';
import { useRouter } from '@/i18n/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface LogDeleteMutationProps {
  logId: string;
}

const useLogDeleteMutation = () => {
  const locale = useLocale();

  const t = useTranslations('Toast.logDelete');
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ logId }: LogDeleteMutationProps) => deleteLog(logId, locale),
    onSuccess: ({ success }) => {
      if (success) {
        toast.success(t('success'));
        const keysToInvalidate = [logKeys.all, placeKeys.all, searchKeys.all];

        keysToInvalidate.forEach((key) => {
          queryClient.removeQueries({ queryKey: key, exact: false });
        });
        router.replace(HOME);
      }
    },
    onError: () => {
      toast.error(t('error'));
    },
  });
};

export default useLogDeleteMutation;
