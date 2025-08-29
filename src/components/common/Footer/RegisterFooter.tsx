'use client';
import { Button } from '@/components/ui/button';
import { REGISTER_PATHS } from '@/constants/pathname';
import { Link, useRouter } from '@/i18n/navigation';
import { TagKeys, useLogTagStore } from '@/stores/logTagStore';
import { RegisterPath } from '@/types/path';
import { useTranslations } from 'next-intl';
interface RegisterFooterProps {
  tagTargets?: TagKeys[];
  nextPath: RegisterPath;
  delayBtn?: boolean;
}

// 태그 선택 여부 판단
const checkAllSelected = (state: Record<string, any>, tagTargets?: TagKeys[]) => {
  if (!tagTargets || tagTargets.length === 0) return false;

  const isMoodPage = tagTargets.includes('mood') && tagTargets.includes('activity');
  if (isMoodPage) {
    // mood, activity
    return tagTargets.some((key) => !!state[key] && state[key].length > 0);
  } else {
    // location
    return tagTargets.every((key) => !!state[key] && state[key].length > 0);
  }
};

const RegisterFooter = ({ tagTargets, nextPath, delayBtn }: RegisterFooterProps) => {
  const router = useRouter();
  const t = useTranslations('Register.Footer');
  const handleClick = () => router.push(nextPath);

  const allSelected = useLogTagStore((state) => checkAllSelected(state, tagTargets));
  const isDisabled = !allSelected;

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
      {delayBtn && (
        <Link href={REGISTER_PATHS.LOCATION} className="text-center text-text-xs text-light-300">
          {t('skip')}
        </Link>
      )}
    </div>
  );
};

export default RegisterFooter;
