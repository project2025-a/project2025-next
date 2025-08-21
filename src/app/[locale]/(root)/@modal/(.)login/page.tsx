import XButton from '@/components/common/Button/XButton';
import { ModalContent, ModalHeader } from '@/components/common/Modal';
import LoginAgreementNotice from '@/components/features/login/LoginAgreementNotice';
import SocialLoginButtons from '@/components/features/login/SocialLoginButtons';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'login',
};

export default async function LoginModal() {
  const t = await getTranslations('LoginModal');
  const description = t('description').split('\n');
  return (
    <ModalContent>
      <ModalHeader>
        <XButton />
      </ModalHeader>
      <section className="flex flex-col text-center items-center self-stretch">
        <h1 className="font-prompt text-3xl font-bold mb-10">Placesurf</h1>
        <h2 className="font-bold text-lg web:text-xl mb-3">{t('login')}</h2>
        <p className="text-center text-text-sm text-light-700">
          {' '}
          {description.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </section>
      <SocialLoginButtons />
      <LoginAgreementNotice />
    </ModalContent>
  );
}
