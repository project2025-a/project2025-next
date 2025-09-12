'use client';

import PlaceBookMarkButton from '@/components/common/Button/Bookmark/PlaceBookMarkButton';
import { formatCount } from '@/lib/utils';
import { usePlaceBookmarkStore } from '@/stores/placeBookmarkStore';

interface PlaceBookmarkWithCountProps {
  placeId: string;
  placeBookmarkCount: number;
}

export default function PlaceBookmarkWithCount({
  placeId,
  placeBookmarkCount = 0,
}: PlaceBookmarkWithCountProps) {
  const count = usePlaceBookmarkStore((state) => state.counts[placeId] ?? placeBookmarkCount);

  return (
    <section className="absolute top-0 right-0 flex flex-col items-center">
      <PlaceBookMarkButton placeId={placeId} className="!top-0 !right-0 !relative w-9 h-9" />
      <span className="font-medium text-text-sm text-light-300">{formatCount(count)}</span>
    </section>
  );
}
