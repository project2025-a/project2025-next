'use client';
import { LogEditHeader } from '@/components/common/Header';
import PlaceForm from '@/components/features/log/common/PlaceForm';
import useExistingPlaces from '@/components/features/log/edit/hooks/useExistingPlaces';
import useLogEditForm from '@/components/features/log/edit/hooks/useLogEditForm';
import { useNewPlaces } from '@/components/features/log/edit/hooks/useNewPlaces';
import { getChangeStatus } from '@/components/features/log/edit/utils/utils';
import ConfirmRegistrationDialog from '@/components/features/log/register/ConfirmRegistrationDialog';
import MultiTagGroup from '@/components/features/log/register/tags/MultiTagGroup';
import TitledInput from '@/components/features/log/register/TitledInput';
import { Form } from '@/components/ui/form';
import { HOME } from '@/constants/pathname';
import { useRouter } from '@/i18n/navigation';
import { trackLogEditEvent } from '@/lib/analytics';
import { DetailLog } from '@/types/api/log';
import { LogEditFormValues } from '@/types/log';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { toast } from 'sonner';

const LogEditPage = ({ logData }: { logData: DetailLog }) => {
  const translations = {
    logEditPage: useTranslations('LogEditPage'),
    toastPlaceDrawer: useTranslations('Toast.PlaceDrawer'),
    toastLogEdit: useTranslations('Toast.logEdit'),
  };
  const router = useRouter();

  const { title, place: places, address, log_id } = logData;

  const { form, oldPlacesArray, newPlacesArray, allPlaces, movePlaceGlobal } = useLogEditForm({
    logData,
  });
  const { deleteExistingPlace, submitExistedPlaces } = useExistingPlaces({
    oldPlacesArray,
    logId: log_id,
    totalPlacesCount: allPlaces.length,
    form,
  });
  const { addNewPlace, handleAddNewPlaces, deleteNewPlace } = useNewPlaces({
    newPlacesArray,
    logId: log_id,
    totalPlacesCount: allPlaces.length,
  });

  const onSubmit = async (values: LogEditFormValues) => {
    trackLogEditEvent('start');

    // console.log('변경된 값', form.formState.dirtyFields); // 텍스트 변경은 파악함 (제목, 장소(이미지 제외), 태그), 장소 추가 >>  이미지 순서, 장소 순서, 삭제 장소, 파악안됨

    // 변경 상태 확인
    const {
      hasAddedPlace,
      hasDeletedPlace,
      extractedDirtyValues,
      hasPlaceOrderChanged,
      hasPlaceImageOrderChanged,
    } = getChangeStatus(form);
    const hasDirtyValues = Object.keys(extractedDirtyValues).length > 0;

    try {
      if (hasAddedPlace) {
        // 새로운 장소 추가
        await handleAddNewPlaces(values.addedPlace, places.length);
      }
      if (hasDeletedPlace || hasDirtyValues || hasPlaceOrderChanged || hasPlaceImageOrderChanged) {
        if (hasPlaceImageOrderChanged) {
          await submitExistedPlaces(extractedDirtyValues, values.places);
        } else {
          await submitExistedPlaces(extractedDirtyValues);
        }
      } else {
        toast.info(translations.toastLogEdit('noChanges'), {
          id: 'noChanges',
        });
        return;
      }
    } finally {
      router.push(HOME);
    }
  };

  return (
    <div className="flex flex-col">
      <LogEditHeader
        address={address[0]}
        logTitle={title}
        logId={log_id}
        onAddNewPlace={addNewPlace}
      />
      <Form {...form}>
        <main className="grow bg-white pt-[66px]">
          <TitledInput />
          <div className="flex flex-col gap-4">
            {allPlaces.map((field, globalIdx) => (
              <PlaceForm
                key={field.id}
                idx={field.originalIdx} // 각 필드별 인덱스
                type={field.type as 'old' | 'new'}
                isEditPage
                globalIdx={globalIdx} // 전체 장소 배열에서의 인덱스
                onDeletePlace={field.type === 'old' ? deleteExistingPlace : deleteNewPlace}
                onMoveUpPlace={() => movePlaceGlobal(globalIdx, 'up')}
                onMoveDownPlace={() => movePlaceGlobal(globalIdx, 'down')}
              />
            ))}
          </div>
        </main>
        <>
          <Controller
            control={form.control}
            name="tags.mood"
            render={({ field }) => (
              <MultiTagGroup
                title={translations.logEditPage('tag.mood')}
                type="mood"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            control={form.control}
            name="tags.activity"
            render={({ field }) => (
              <MultiTagGroup
                title={translations.logEditPage('tag.activity')}
                type="activity"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </>
      </Form>

      {/* footer */}
      <div className="text-text-sm w-full min-h-9 rounded-md flex items-center justify-center bg-error-50 text-red-500 my-2.5 py-2">
        {translations.logEditPage('warning.imagePolicy')}
      </div>

      <ConfirmRegistrationDialog
        edit
        disabled={!form.formState.isValid || form.formState.isSubmitting}
        onSubmitLogForm={form.handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default LogEditPage;
