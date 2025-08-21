'use client';

import MotionCard from '@/components/common/Card/MotionCard';
import { PostCard, PostCardWrapper } from '@/components/common/Card/PostCard';
import CustomPagination from '@/components/common/CustomPagination';
import FallbackMessage from '@/components/common/FallbackMessage';
import { TitledSection } from '@/components/common/SectionBlock';
import { ERROR_MESSAGES, ERROR_MESSAGES_EN } from '@/constants/errorMessages';
import useLogs from '@/hooks/queries/log/useLogs';
import useQueryPagination from '@/hooks/useQueryPagination';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { useRef } from 'react';

interface LatestLogContentProps {
  currentPage: number;
}

export default function LatestLogContent({ currentPage }: LatestLogContentProps) {
  const locale = useLocale();
  const M = locale === 'en' ? ERROR_MESSAGES_EN : ERROR_MESSAGES;

  const contentRef = useRef<HTMLElement | null>(null);
  const { handlePageChange } = useQueryPagination('logPage', currentPage, contentRef);
  const { data } = useLogs({ currentPage, pageSize: 13, sort: 'latest' });

  if ((data && !data?.success) || data?.data.length === 0) {
    return (
      <FallbackMessage
        message={!data.success ? M.COMMON.INTERNAL_SERVER_ERROR : M.LOG.LIST_EMPTY}
        className="items-center"
      />
    );
  }
  return (
    <section ref={contentRef}>
      <TitledSection title="Latest" subTitle="Log">
        <PostCardWrapper className="mb-[50px]">
          {data?.data.map((log, idx) => (
            <MotionCard
              key={log?.log_id}
              className={cn(idx === 2 && 'web:row-span-2 web:col-span-2')}
            >
              <PostCard log={log} />
            </MotionCard>
          ))}
        </PostCardWrapper>
        {data?.success && data.meta?.pagination && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={Number(data.meta.pagination.totalPages)}
            onChangePage={handlePageChange}
          />
        )}
      </TitledSection>
    </section>
  );
}
