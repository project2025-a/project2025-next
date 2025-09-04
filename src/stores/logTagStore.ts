import { TAG_SETS } from '@/constants/tagData';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

/* 태그 */
export type TagKeys = keyof typeof TAG_SETS;
export type MultiKeys = Extract<TagKeys, 'mood' | 'activity'>; // 다중 선택
export type SingleKeys = Exclude<TagKeys, MultiKeys>; // 단일 선택

type TagStates = {
  mood: string[];
  activity: string[];
  country: string;
  city: string;
  sigungu: string;
  hydrated: boolean;
};
type TagActions = {
  toggleMultiTag: (key: MultiKeys, tag: string) => void;
  setSingleTag: (key: SingleKeys, tag: string) => void;
  clearTag: () => void;
  initializeTags: (payload: Pick<TagStates, 'mood' | 'activity'>) => void;
};

type LogTagStoreType = TagStates & TagActions;

const initialState: TagStates = {
  mood: [] as string[],
  activity: [] as string[],
  country: '',
  city: '',
  sigungu: '',
  hydrated: false,
};

// 각 태그별 최대 개수
const MAX_MULTI_TAGS: Record<MultiKeys, number> = {
  mood: 6,
  activity: 10,
};

export const useLogTagStore = create<LogTagStoreType>()(
  persist(
    devtools(
      immer((set, get) => ({
        ...initialState,
        toggleMultiTag: (key, tag) => {
          const state = get();
          const tags = state[key];
          const isSelected = tags.includes(tag);

          // 각 태그별 최대 개수 제한
          if (!isSelected && tags.length >= MAX_MULTI_TAGS[key]) return;

          set((state) => {
            state[key] = isSelected ? tags.filter((t) => t != tag) : [...tags, tag];
          });
        },
        setSingleTag: (key, tag) =>
          set((state) => {
            state[key] = tag;
          }),
        clearTag: () =>
          set((state) => {
            state.mood = [];
            state.activity = [];
            state.country = '';
            state.city = '';
            state.sigungu = '';
          }),
        initializeTags: (payload) =>
          set((state) => {
            state.mood = payload.mood;
            state.activity = payload.activity;
          }),
      })),
      { name: 'logTagStore' }
    ),
    {
      name: 'logTagStore',
      partialize: (state) => ({
        mood: state.mood,
        activity: state.activity,
        country: state.country,
        city: state.city,
        sigungu: state.sigungu,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) state.hydrated = true;
      },
    }
  )
);
