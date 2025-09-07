'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { TagKeys, useLogTagStore } from '@/stores/logTagStore';
import { RegisterPath } from '@/types/path';
import { useTranslations } from 'next-intl';
interface RegisterFooterProps {
  tagTargets?: TagKeys[];
  nextPath?: RegisterPath;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const RegisterFooter = ({ tagTargets, nextPath, onClick, disabled }: RegisterFooterProps) => {
  const router = useRouter();
  const t = useTranslations('Register.Footer');

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (nextPath) {
      router.push(nextPath);
    }
  };

  const allSelected = useLogTagStore((state) =>
    tagTargets?.every((key) => !!state[key] && state[key].length > 0)
  );

  const isDisabled = disabled ?? !allSelected;

  return (
    <div className="flex flex-col pt-2 pb-6 gap-[15px]">
      <Button
        size={'xl'}
        className="font-bold text-[13px]"
        onClick={handleClick}
        disabled={isDisabled}
      >
        {t('next')}
      </Button>
    </div>
  );
};

export default RegisterFooter;
