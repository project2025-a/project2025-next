'use client';

import { PlusIcon } from '@/components/common/Icons';
import { REGISTER_PATHS } from '@/constants/pathname';
import useUser from '@/hooks/queries/user/useUser';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function ProfileMyLogFallback() {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const t = useTranslations('ProfilePage');

  const onRegisterClick = () => {
    if (isLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    router.push(REGISTER_PATHS.MOOD);
  };
  return (
    <section className="flex w-full">
      <button
        onClick={onRegisterClick}
        className="w-full web:w-[324px] aspect-[343/218] web:aspect-[324/218] rounded-xl flex flex-col justify-center items-center gap-2.5 border border-dashed border-primary-200"
      >
        <PlusIcon className="w-6 h-6 stroke-[1.2] stroke-primary-200" />
        <p className="font-bold text-center text-text-sm text-primary-200">
          {t('fallback.myLog')
            .split('\n')
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
        </p>
      </button>
    </section>
  );
}
