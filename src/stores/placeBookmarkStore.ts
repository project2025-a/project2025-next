import { create } from 'zustand';

type Counts = Record<string, number>;

type State = {
  counts: Counts;
};
type Actions = {
  setCount: (placeId: string, count: number) => void;
  onBookmark: (placeId: string, isBookmarked: boolean) => void;
};

export const usePlaceBookmarkStore = create<State & Actions>((set) => ({
  counts: {},
  setCount: (placeId, count) =>
    set((state) => ({
      counts: { ...state.counts, [placeId]: Math.max(0, count) },
    })),

  onBookmark: (placeId, isBookmarked) =>
    set((state) => {
      const current = state.counts[placeId] ?? 0;
      const delta = isBookmarked ? -1 : 1; // 북마크 해제면 -1, 등록이면 +1
      return {
        counts: {
          ...state.counts,
          [placeId]: Math.max(0, current + delta),
        },
      };
    }),
}));
