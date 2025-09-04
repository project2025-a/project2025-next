'use client';

import AddPlaceButton from '@/components/common/Button/AddPlaceButton';
import RegisterFooter from '@/components/common/Footer/RegisterFooter';
import { LogRegisterHeader } from '@/components/common/Header';
import PlaceForm from '@/components/features/log/common/PlaceForm';
import TitledInput from '@/components/features/log/register/TitledInput';
import { Form } from '@/components/ui/form';
import { INITIAL_PLACE } from '@/constants/logConstants';
import { REGISTER_PATHS } from '@/constants/pathname';
import { useLogForm } from '@/contexts/LogRegisterContext';
import { usePlacesFieldArray } from '@/hooks/usePlacesFieldArray';
import { useRouter } from '@/i18n/navigation';
import { useLogTagStore } from '@/stores/logTagStore';
import { LogFormValues } from '@/types/log';
import { scrollToPlaceAfterReorder } from '@/utils/scrollToElement';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';
import { toast } from 'sonner';

const LogPage = () => {
  const country = useLogTagStore((state) => state.country);
  const city = useLogTagStore((state) => state.city);
  const sigungu = useLogTagStore((state) => state.sigungu);

  const translations = {
    logPage: useTranslations('Register.LogPage'),
    toastLogCreate: useTranslations('Toast.logCreate'),
    toastPlaceDrawer: useTranslations('Toast.PlaceDrawer'),
  };

  const router = useRouter();
  const { form } = useLogForm();

  // 주소 누락 시, 주소 등록 페이지로 이동 (주소 페이지 뒤로 옮길거라서 임시 주석 처리)
  useEffect(() => {
    const isAddressMissing = !country || !city || !sigungu;

    if (isAddressMissing) {
      toast.error(translations.toastLogCreate('locationMissing'));
      router.replace(REGISTER_PATHS.LOCATION);
    }
  }, [form, router]);

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

      <RegisterFooter disabled={!form.formState.isValid} nextPath={REGISTER_PATHS.MOOD} />
    </div>
  );
};

export default LogPage;
