import { LogFormValues } from '@/types/log';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 이미지 (blob) 제외한 로그 폼 값
export type PlaceWithoutImages = Omit<LogFormValues['places'][number], 'placeImages'>;

export type SerializableLogFormValues = {
  logTitle: string;
  places: PlaceWithoutImages[];
  tags: LogFormValues['tags'];
  address: LogFormValues['address'];
};

interface LogFormState {
  formValues: SerializableLogFormValues | null;
}

interface LogFormActions {
  setFormValues: (values: SerializableLogFormValues) => void;
  clearFormValues: () => void;
}

type LogFormStoreType = LogFormState & LogFormActions;

export const useLogFormStore = create<LogFormStoreType>()(
  persist(
    (set) => ({
      formValues: null,
      setFormValues: (values) => set({ formValues: values }),
      clearFormValues: () => set({ formValues: null }),
    }),
    { name: 'logFormStore', partialize: (state) => ({ formValues: state.formValues }) }
  )
);
