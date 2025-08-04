'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';
interface ErrorTemplateProps {
  title?: string;
  message?: string;
  invalidateKeys?: string[];
  onMountEffect?: () => void;
}

export default function ErrorTemplate({
  title = '찾으시는 페이지를 찾을 수 없습니다.',
  message = 'URL 주소를 확인해주세요.',
  invalidateKeys,
  onMountEffect,
}: ErrorTemplateProps) {
  const router = useRouter();
  const t = useTranslations('NotFoundPage');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (invalidateKeys && queryClient) {
      invalidateKeys.forEach((key) => {
        queryClient.removeQueries({ queryKey: [key] });
      });
    }

    if (onMountEffect) {
      onMountEffect();
    }
  }, [invalidateKeys, queryClient, onMountEffect]);

  const handleClick = () => router.replace('/');
  return (
    <main className="flex flex-col items-center justify-center h-dvh grow">
      <Image src="/images/404.png" alt="404" width={300} height={200} />
      <div className="flex flex-col items-center mt-[50px] mb-5">
        <h4 className="text-text-xl font-bold">{title ?? t('title')}</h4>
        <h5 className="text-center">{message ?? t('defaultMessage')}</h5>
      </div>
      <Button className="rounded-full mt-5" size={'lg'} onClick={handleClick}>
        홈으로 이동
      </Button>
    </main>
  );
}
