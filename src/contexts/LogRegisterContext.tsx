'use client';

import { INITIAL_PLACE } from '@/constants/logConstants';
import useLogCreateMutation from '@/hooks/mutations/log/useLogCreateMutation';
import { trackLogCreateEvent } from '@/lib/analytics';
import { LogFormSchema } from '@/lib/zod/logSchema';
import { PlaceWithoutImages, useLogFormStore } from '@/stores/logFormStore';
import { useLogTagStore } from '@/stores/logTagStore';
import { LogCreateValues, LogFormValues } from '@/types/log';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import { FieldErrors, UseFormReturn, useForm } from 'react-hook-form';

interface LogFormContextType {
  form: UseFormReturn<LogFormValues>;
  handleLogSubmit: () => void;
  isLogCreatePending: boolean;
}

const LogFormContext = createContext<LogFormContextType | null>(null);

export const useLogForm = () => {
  const context = useContext(LogFormContext);
  if (!context) {
    throw new Error('useLogFormContext 없음');
  }
  return context;
};

export const LogFormProvider = ({ children }: { children: ReactNode }) => {
  const country = useLogTagStore((state) => state.country);
  const city = useLogTagStore((state) => state.city);
  const sigungu = useLogTagStore((state) => state.sigungu);
  const mood = useLogTagStore((state) => state.mood);
  const activity = useLogTagStore((state) => state.activity);

  const savedValues = useLogFormStore((state) => state.formValues);
  const setFormValues = useLogFormStore((state) => state.setFormValues);

  const { mutate: logCreateMutation, isPending: isLogCreatePending } = useLogCreateMutation();

  const form = useForm<LogFormValues>({
    resolver: zodResolver(LogFormSchema),
    reValidateMode: 'onChange',
    defaultValues: savedValues || {
      logTitle: '',
      places: [INITIAL_PLACE],
    },
  });

  // Zustand 상태와 form 값을 합쳐서 제출
  const onSuccessCb = (values: LogCreateValues) => {
    const submissionData = {
      ...values,
      tags: {
        mood,
        activity,
      },
      address: {
        country,
        city,
        sigungu,
      },
    };

    // console.log('submission data:', submissionData);
    trackLogCreateEvent('start');
    logCreateMutation(submissionData);
  };
  const onErrorCb = (errors: FieldErrors<LogFormValues>) => {
    console.error('로그 등록 실패:', errors);
  };

  const handleLogSubmit = form.handleSubmit(onSuccessCb, onErrorCb);

  useEffect(() => {
    const subscription = form.watch((data) => {
      if (!data) return;

      const serializable = {
        logTitle: data.logTitle || '',
        places:
          data.places?.map((place) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { placeImages, ...rest } = place || {};
            return rest as PlaceWithoutImages;
          }) || [],
      };
      setFormValues(serializable);
    });

    return () => subscription.unsubscribe();
  }, [form, setFormValues]);

  return (
    <LogFormContext.Provider value={{ form, handleLogSubmit, isLogCreatePending }}>
      {children}
    </LogFormContext.Provider>
  );
};
