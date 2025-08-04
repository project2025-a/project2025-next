import { userKeys } from '@/app/actions/keys';
import { revalidateUsers } from '@/app/actions/user';
import ErrorTemplate from '@/components/common/ErrorTemplate';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFoundPage');
  return (
    <ErrorTemplate
      message={t('userMessage')}
      invalidateKeys={[userKeys.all[0]]}
      onMountEffect={revalidateUsers}
    />
  );
}
