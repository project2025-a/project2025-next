'use client';

import { INITIAL_PLACE } from '@/constants/logConstants';
import useLogCreateMutation from '@/hooks/mutations/log/useLogCreateMutation';
import { trackLogCreateEvent } from '@/lib/analytics';
import { LogFormSchema } from '@/lib/zod/logSchema';
import { PlaceWithoutImages, useLogFormStore } from '@/stores/logFormStore';
import { useLogTagStore } from '@/stores/logTagStore';
import { LogCreateValues, LogFormValues } from '@/types/log';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { FieldErrors, UseFormReturn, useForm } from 'react-hook-form';

interface LogFormContextType {
  form: UseFormReturn<LogFormValues>;
  handleLogSubmit: () => void;
  isLogCreatePending: boolean;
}

const LogFormContext = createContext<LogFormContextType | null>(null);
const stripPlaceImages = (places: LogFormValues['places']): PlaceWithoutImages[] =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  places?.map(({ placeImages, ...rest }) => rest) ?? [];

export const useLogForm = () => {
  const context = useContext(LogFormContext);
  if (!context) {
    throw new Error('useLogFormContext 없음');
  }
  return context;
};

export const LogFormProvider = ({ children }: { children: ReactNode }) => {
  const tRegister = useTranslations('Register.CountryPage.options');
  const tRegion = useTranslations('Region');

  const country = useLogTagStore((state) => state.country);
  const city = useLogTagStore((state) => state.city);
  const sigungu = useLogTagStore((state) => state.sigungu);
  const mood = useLogTagStore((state) => state.mood);
  const activity = useLogTagStore((state) => state.activity);

  const savedValues = useLogFormStore((state) => state.formValues);
  const hydrated = useLogFormStore((state) => state.hydrated);
  const setFormValues = useLogFormStore((state) => state.setFormValues);

  const hasResetRef = useRef(false);

  const { mutate: logCreateMutation, isPending: isLogCreatePending } = useLogCreateMutation();

  const initialValues = useMemo(() => {
    return hydrated && savedValues ? savedValues : { logTitle: '', places: [INITIAL_PLACE] };
  }, [hydrated, savedValues]);

  const form = useForm<LogFormValues>({
    resolver: zodResolver(LogFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: initialValues,
  });

  // Zustand 상태와 form 값을 합쳐서 제출
  const onSuccessCb = useCallback(
    (values: LogCreateValues) => {
      const submissionData = {
        ...values,
        tags: {
          mood,
          activity,
        },
        address: {
          country: tRegister(country),
          city: tRegion(city),
          sigungu: tRegion(sigungu),
        },
      };

      trackLogCreateEvent('start');
      logCreateMutation(submissionData);
    },
    [logCreateMutation, mood, activity, country, city, sigungu]
  );

  const onErrorCb = useCallback((errors: FieldErrors<LogFormValues>) => {
    console.error('로그 등록 실패:', errors);
  }, []);

  const handleLogSubmit = form.handleSubmit(onSuccessCb, onErrorCb);

  // hydration 완료 후 저장된 값으로 form 업데이트
  useEffect(() => {
    if (hydrated && savedValues && !hasResetRef.current) {
      form.reset(savedValues);
      hasResetRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const subscription = form.watch((data) => {
      if (!data) return;
      setFormValues({
        logTitle: data.logTitle || '',
        places: stripPlaceImages(data.places as LogFormValues['places']),
      });
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, setFormValues]);

  return (
    <LogFormContext.Provider value={{ form, handleLogSubmit, isLogCreatePending }}>
      {children}
    </LogFormContext.Provider>
  );
};
