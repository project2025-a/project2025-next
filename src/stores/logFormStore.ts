import { LogFormValues } from '@/types/log';
import { debounce, DebouncedFunc } from 'lodash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 이미지 (blob) 제외한 로그 폼 값
export type PlaceWithoutImages = Omit<LogFormValues['places'][number], 'placeImages'>;

// 로그 작성 페이지 데이터만 저장
export type SerializableLogFormValues = {
  logTitle: string;
  places: PlaceWithoutImages[];
};

interface LogFormState {
  formValues: SerializableLogFormValues | null;
  hydrated: boolean;
}

interface LogFormActions {
  setFormValues: DebouncedFunc<(values: SerializableLogFormValues) => void>;
  clearFormValues: () => void;
}

type LogFormStoreType = LogFormState & LogFormActions;

export const useLogFormStore = create<LogFormStoreType>()(
  persist(
    (set) => ({
      formValues: null,
      hydrated: false,
      setFormValues: debounce((values) => set({ formValues: values }), 500),
      clearFormValues: () => set({ formValues: null }),
    }),
    {
      name: 'logFormStore',
      partialize: (state) => ({ formValues: state.formValues }),
      onRehydrateStorage: () => (state, error) => {
        if (!error && state) {
          state.hydrated = true;
        }
      },
    }
  )
);
