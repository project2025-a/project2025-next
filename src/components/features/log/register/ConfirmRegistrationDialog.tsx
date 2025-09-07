'use client';
import Loading from '@/components/common/Loading/Loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
interface ConfirmRegistrationDialogProps {
  edit?: boolean;
  logTitle?: string;
  onSubmitLogForm: () => void;
  disabled?: boolean;
  loading?: boolean;
  submitText?: string;
}

const ConfirmRegistrationDialog = ({
  edit,
  logTitle,
  onSubmitLogForm,
  disabled,
  loading,
  submitText,
}: ConfirmRegistrationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const t = useTranslations('Register.LogPage');
  const confirmText = edit
    ? t('confirmEdit', { logTitle: logTitle ?? '' })
    : t('confirmCreate', { logTitle: logTitle ?? '' });

  const handleSubmit = async () => {
    try {
      await onSubmitLogForm();
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size={'xl'} className="font-bold w-full mt-2 mb-6 text-[13px]" disabled={disabled}>
          {loading ? <Loading className="max-h-fit size-24" /> : submitText ?? t('submit')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-text-2xl font-bold">
            {confirmText.split(logTitle ?? '').map((part, index, arr) => (
              <span key={index}>
                {part}
                {index < arr.length - 1 && <span className="text-info-500">{logTitle}</span>}
              </span>
            ))}
          </AlertDialogTitle>
          <AlertDialogDescription hidden>
            {logTitle} {confirmText}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-8 !text-[13px]">{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction className="px-8 text-[13px]" onClick={handleSubmit}>
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmRegistrationDialog;
