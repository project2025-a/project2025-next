'use client';

import PlaceBookMarkButton from '@/components/common/Button/Bookmark/PlaceBookMarkButton';
import MotionCard from '@/components/common/Card/MotionCard';
import {
  PostCardImage,
  PostCardLocation,
  PostCardTitle,
  PostCardWrapper,
} from '@/components/common/Card/PostCard';
import CustomPagination from '@/components/common/CustomPagination';
import FallbackMessage from '@/components/common/FallbackMessage';
import { TitledSection } from '@/components/common/SectionBlock';
import { ERROR_MESSAGES, ERROR_MESSAGES_EN } from '@/constants/errorMessages';
import usePlaces from '@/hooks/queries/place/usePlaces';
import useQueryPagination from '@/hooks/useQueryPagination';
import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useRef } from 'react';

interface LatestPlaceContentProps {
  currentPage: number;
}

export default function LatestPlaceContent({ currentPage }: LatestPlaceContentProps) {
  const locale = useLocale();
  const M = locale === 'en' ? ERROR_MESSAGES_EN : ERROR_MESSAGES;

  const contentRef = useRef<HTMLElement | null>(null);
  const { handlePageChange } = useQueryPagination('placePage', currentPage, contentRef);
  const { data } = usePlaces({ currentPage, pageSize: 12, sort: 'latest' });
  if ((data && !data?.success) || data?.data.length === 0) {
    return (
      <FallbackMessage
        message={!data.success ? M.COMMON.INTERNAL_SERVER_ERROR : M.PLACE.LIST_EMPTY}
        className="items-center"
      />
    );
  }
  return (
    <section ref={contentRef}>
      <TitledSection title="Latest" subTitle="Places">
        <PostCardWrapper className="mb-[50px]">
          {data?.data.map((place) => (
            <MotionCard key={place.place_id} className="relative group">
              <Link href={`/log/${place?.log_id}`}>
                <PostCardImage
                  author={String(place?.user.nickname)}
                  imageUrl={String(place.place_images)}
                />
                <PostCardTitle title={String(place.name)} />
                <PostCardLocation
                  city={String(place.address.city)}
                  country={String(place.address.country)}
                  sigungu={String(place.address.sigungu)}
                />
              </Link>
              <PlaceBookMarkButton placeId={place.place_id} />
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
