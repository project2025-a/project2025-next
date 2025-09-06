'use client';

import ConfirmRegistrationDialog from '@/components/features/log/register/ConfirmRegistrationDialog';
import { useLogForm } from '@/contexts/LogRegisterContext';
import { useTranslations } from 'next-intl';

const ClientRegisterFooter = () => {
  const t = useTranslations('Register.Footer');
  const { form, handleLogSubmit, isLogCreatePending } = useLogForm();

  return (
    <>
      <p className="text-center text-text-xs text-light-300">{t('skip')}</p>
      <ConfirmRegistrationDialog
        logTitle={form.getValues('logTitle')}
        onSubmitLogForm={handleLogSubmit}
        disabled={isLogCreatePending}
        loading={isLogCreatePending}
        submitText={t('register')}
      />
    </>
  );
};
export default ClientRegisterFooter;
