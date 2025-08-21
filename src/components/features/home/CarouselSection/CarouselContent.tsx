'use client';

import FallbackMessage from '@/components/common/FallbackMessage';
import { ERROR_MESSAGES, ERROR_MESSAGES_EN } from '@/constants/errorMessages';
import useLogs from '@/hooks/queries/log/useLogs';
import { useLocale } from 'next-intl';
import Carousel from './Carousel';
import CarouselSkeleton from './CarouselSkeleton';

interface CarouselContentProps {
  currentPage: number;
}

export default function CarouselContent({ currentPage }: CarouselContentProps) {
  const locale = useLocale();
  const M = locale === 'en' ? ERROR_MESSAGES_EN : ERROR_MESSAGES;

  const { data, isPending } = useLogs({ currentPage, pageSize: 12, sort: 'popular' });
  if (isPending) return <CarouselSkeleton />;

  if ((data && !data?.success) || data?.data.length === 0) {
    return (
      <FallbackMessage
        message={!data.success ? M.COMMON.INTERNAL_SERVER_ERROR : M.LOG.LIST_EMPTY}
        className="items-center"
      />
    );
  }

  return <Carousel logs={data?.data ?? []} />;
}
