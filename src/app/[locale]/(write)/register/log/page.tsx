'use client';

import AddPlaceButton from '@/components/common/Button/AddPlaceButton';
import { LogRegisterHeader } from '@/components/common/Header';
import PlaceForm from '@/components/features/log/common/PlaceForm';
import ConfirmRegistrationDialog from '@/components/features/log/register/ConfirmRegistrationDialog';
import TitledInput from '@/components/features/log/register/TitledInput';
import { Form } from '@/components/ui/form';
import { INITIAL_PLACE } from '@/constants/logConstants';
import useLogCreateMutation from '@/hooks/mutations/log/useLogCreateMutation';
import { usePlacesFieldArray } from '@/hooks/usePlacesFieldArray';
import { trackLogCreateEvent } from '@/lib/analytics';
import { LogFormSchema } from '@/lib/zod/logSchema';
import { SerializableLogFormValues, useLogFormStore } from '@/stores/logFormStore';
import { useLogTagStore } from '@/stores/logTagStore';
import { LogFormValues } from '@/types/log';
import { scrollToPlaceAfterReorder } from '@/utils/scrollToElement';
import { zodResolver } from '@hookform/resolvers/zod';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const LogPage = () => {
  const translations = {
    logPage: useTranslations('Register.LogPage'),
    toastLogCreate: useTranslations('Toast.logCreate'),
    toastPlaceDrawer: useTranslations('Toast.PlaceDrawer'),
  };
  const { mutate, isPending } = useLogCreateMutation();
  const country = useLogTagStore((state) => state.country);
  const city = useLogTagStore((state) => state.city);
  const sigungu = useLogTagStore((state) => state.sigungu);
  const mood = useLogTagStore((state) => state.mood);
  const activity = useLogTagStore((state) => state.activity);

  const formValues = useLogFormStore((state) => state.formValues);
  const setFormValues = useLogFormStore((state) => state.setFormValues);

  const form = useForm<LogFormValues>({
    resolver: zodResolver(LogFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: formValues ?? {
      logTitle: '',
      places: [INITIAL_PLACE],
      tags: {
        mood,
        activity,
      },
      address: {
        country,
        city,
        sigungu,
      },
    },
  });

  const serialize = useCallback(
    (data: LogFormValues) => {
      if (!data) return;
      console.log('디바운스 호출');
      const serializable: SerializableLogFormValues = {
        ...data,
        places:
          data.places?.map((place) => {
            // 임시 방편
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { placeImages, ...rest } = place;
            return rest;
          }) || [],
      };
      setFormValues(serializable);
    },
    [setFormValues]
  );
  const debounced = useMemo(() => debounce(serialize, 500), [serialize]);

  // 주소 누락 시, 주소 등록 페이지로 이동 (주소 페이지 뒤로 옮길거라서 임시 주석 처리)
  // useEffect(() => {
  //   const isAddressMissing = !country || !city || !sigungu;

  //   if (hydrated && isAddressMissing && !submitted) {
  //     toast.error(translations.toastLogCreate('locationMissing'));
  //     router.replace(REGISTER_PATHS.LOCATION);
  //   }
  // }, [hydrated, country, city, sigungu, submitted, router]);

  // 상태를 watch 해서 store에 저장
  useEffect(() => {
    const sub = form.watch(debounced as any);
    return () => {
      sub.unsubscribe();
      debounced.cancel();
    };
  }, [form, debounced]);

  // 장소 필드
  const placesField = useFieldArray<LogFormValues>({
    control: form.control,
    name: 'places',
  });
  const { fields } = placesField;

  // 장소 관련 핸들러
  const { addPlace, deletePlace, movePlaceUp, movePlaceDown } = usePlacesFieldArray<
    LogFormValues,
    'places'
  >(placesField, INITIAL_PLACE, {
    onAddError: () =>
      toast.info(translations.toastPlaceDrawer('maxPlaceError'), { id: 'maxPlaceError' }),
    onDeleteError: () =>
      toast.error(translations.toastPlaceDrawer('minPlaceError'), { id: 'minPlaceError' }),
    onReorder: (from, to) => scrollToPlaceAfterReorder(from, to > from ? 'down' : 'up'),
  });

  const onSubmit = async (values: LogFormValues) => {
    trackLogCreateEvent('start');
    mutate(values);
  };

  return (
    <div className="flex flex-col h-full">
      <LogRegisterHeader onAddNewPlace={addPlace} />
      <Form {...form}>
        <main className="grow bg-white pt-[66px]">
          <TitledInput />
          <div className="flex flex-col">
            {fields.map((field, idx) => (
              <PlaceForm
                key={field.id}
                idx={idx}
                onDeletePlace={deletePlace}
                onMoveUpPlace={movePlaceUp}
                onMoveDownPlace={movePlaceDown}
              />
            ))}
          </div>
          <div className="flex justify-center mt-4 mb-4">
            <AddPlaceButton handleAddNewPlace={addPlace} />
          </div>
        </main>
      </Form>

      {/* footer */}
      <div className="text-[13px] w-full h-9 rounded-md flex items-center justify-center bg-error-50 text-red-500 my-2.5">
        {translations.logPage('deleteWarning')}
      </div>

      <ConfirmRegistrationDialog
        logTitle={form.getValues('logTitle')}
        disabled={!form.formState.isValid || form.formState.isSubmitting || isPending}
        loading={isPending}
        onSubmitLogForm={form.handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default LogPage;
