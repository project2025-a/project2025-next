'use client';
import { LogEditHeader } from '@/components/common/Header';
import PlaceForm from '@/components/features/log/common/PlaceForm';
import ConfirmRegistrationDialog from '@/components/features/log/register/ConfirmRegistrationDialog';
import MultiTagGroup from '@/components/features/log/register/tags/MultiTagGroup';
import TitledInput from '@/components/features/log/register/TitledInput';
import { Form } from '@/components/ui/form';
import { INITIAL_PLACE } from '@/constants/logConstants';
import useAddPlaceMutation from '@/hooks/mutations/log/useAddPlaceMutation';
import useLogEditMutation from '@/hooks/mutations/log/useLogEditMutation';
import { usePlacesFieldArray } from '@/hooks/usePlacesFieldArray';
import { trackLogEditEvent } from '@/lib/analytics';
import { LogEditFormSchema } from '@/lib/zod/logSchema';
import { useLogTagStore } from '@/stores/logTagStore';
import { DetailLog } from '@/types/api/log';
import { LogEditFormValues } from '@/types/log';
import { createFormData } from '@/utils/formatLog';
import { scrollToPlaceAfterReorder } from '@/utils/scrollToElement';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { extractDirtyValues, isImageOrderChanged, isOrderChanged, pickDirtyFields } from './utils';

const LogEditPage = ({ logData }: { logData: DetailLog }) => {
  const translations = {
    logEditPage: useTranslations('LogEditPage'),
    toastPlaceDrawer: useTranslations('Toast.PlaceDrawer'),
    toastLogEdit: useTranslations('Toast.logEdit'),
  };
  const router = useRouter();
  const { mutateAsync: editMutate, isPending: editIsPending } = useLogEditMutation();
  const { mutateAsync: addPlaceMutate, isPending: addPlaceIsPending } = useAddPlaceMutation();

  const { title, place: places, log_tag, address, log_id } = logData;
  const initializeTags = useLogTagStore((state) => state.initializeTags);
  const initialMoodTags = log_tag.filter((t) => t.category === 'mood').map((t) => t.tag);
  const initialActivityTags = log_tag.filter((t) => t.category === 'activity').map((t) => t.tag);

  const form = useForm({
    resolver: zodResolver(LogEditFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      logTitle: title,
      places: places.map((place) => ({
        id: place.place_id,
        placeName: place.name,
        category: place.category,
        location: place.address,
        description: place?.description ?? '',
        placeImages: place.place_images,
        order: place.order, // 이미지 순서
      })),
      tags: {
        mood: initialMoodTags,
        activity: initialActivityTags,
      },
      addedPlace: [],
      deletedPlace: [],
      deletedPlaceImages: [],
    },
  });

  useEffect(() => {
    initializeTags({ mood: initialMoodTags, activity: initialActivityTags });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //---------- 기존 장소 ----------
  const existingPlacesArray = useFieldArray<LogEditFormValues>({
    control: form.control,
    name: 'places',
  });

  // 기존 장소 drawer용 (추가 없음)
  const {
    deletePlace: deleteExistingPlace,
    movePlaceUp: moveExistingPlaceUp,
    movePlaceDown: moveExistingPlaceDown,
  } = usePlacesFieldArray(existingPlacesArray, null, {
    onDeleteError: () =>
      toast.error(translations.toastPlaceDrawer('minPlaceError'), { id: 'minPlaceError' }),
    onReorder: (from, to) => scrollToPlaceAfterReorder(from, to > from ? 'down' : 'up'),
  });

  // 기존 장소 수정 처리 함수
  const handleEditExistingPlaces = async (dirtyValues: Partial<LogEditFormValues>) => {
    const currentPlaces = form.getValues('places'); // 현재 장소 데이터
    const prevPlaces = places; // 초기값 저장

    const patchedDirtyValues = {
      ...dirtyValues,
      places: currentPlaces.map((place, idx) => {
        const dirtyPlace = dirtyValues.places?.[idx];
        const prevPlace = prevPlaces[idx];
        const imageOrderChanged = isImageOrderChanged(prevPlace?.place_images, place.placeImages);

        return {
          id: place.id,
          order: idx + 1,
          ...pickDirtyFields<LogEditFormValues['places'][number]>(dirtyPlace, [
            'placeName',
            'category',
            'location',
            'description',
          ]),
          ...(imageOrderChanged && { placeImages: place.placeImages }),
        };
      }),
    };

    // console.log(patchedDirtyValues);
    const formData = createFormData(patchedDirtyValues);
    await editMutate({ formData, logId: logData.log_id });
  };

  //---------- 새 장소 ------------
  const newPlacesArray = useFieldArray<LogEditFormValues>({
    control: form.control,
    name: 'addedPlace',
  });

  // 새 장소 drawer용
  const {
    addPlace: addNewPlace,
    deletePlace: deleteNewPlace,
    movePlaceUp: moveNewPlaceUp,
    movePlaceDown: moveNewPlaceDown,
  } = usePlacesFieldArray(newPlacesArray, INITIAL_PLACE, {
    onAddError: () => {
      toast.error(translations.toastPlaceDrawer('maxPlaceCountError'), {
        description: translations.toastPlaceDrawer('maxPlaceCountErrorDesc'),
      });
    },
    onReorder: (from, to) => scrollToPlaceAfterReorder(from, to > from ? 'down' : 'up'),
  });

  // 기존 장소와 새 장소를 합쳐서 렌더링
  const allPlaces = useMemo(
    () => [
      ...existingPlacesArray.fields.map((field, idx) => ({
        ...field,
        type: 'existing',
        originalIdx: idx,
      })),
      ...newPlacesArray.fields.map((field, idx) => ({
        ...field,
        type: 'added',
        originalIdx: idx,
      })),
    ],
    [existingPlacesArray.fields, newPlacesArray.fields]
  );

  // console.log('>>>>allPlaces', allPlaces);

  // 새 장소 추가
  const handleAddNewPlaces = async (newPlaces: LogEditFormValues['addedPlace']) => {
    const existingPlacesCount = form.getValues('places').length;
    const deletedPlacesCount = form.getValues('deletedPlace')?.length || 0;
    const currentExistingPlacesCount = existingPlacesCount - deletedPlacesCount;

    await addPlaceMutate({
      values: newPlaces,
      logId: logData.log_id,
      existingOrderCount: currentExistingPlacesCount,
    });
  };

  // 기존 장소 vs 신규 장소 구분해서 순서 이동
  const movePlaceGlobal = (globalIdx: number, direction: 'up' | 'down') => {
    const lastIdx = allPlaces.length - 1;

    // 에라 발생 범위
    if (direction === 'up' && globalIdx <= 0) return;
    if (direction === 'down' && globalIdx >= lastIdx) return;

    const currentPlace = allPlaces[globalIdx];
    const adjacentPlace = direction === 'up' ? allPlaces[globalIdx - 1] : allPlaces[globalIdx + 1];

    // 타입이 다르면 이동 불가
    if (currentPlace.type !== adjacentPlace.type) {
      toast.error(translations.toastPlaceDrawer('orderTypeError'), {
        description: translations.toastPlaceDrawer('orderTypeErrorDesc'),
      });
      return;
    }

    // 이동 함수 선택 (기존 장소 vs 신규 장소)
    const moveFn =
      currentPlace.type === 'existing'
        ? direction === 'up'
          ? moveExistingPlaceUp
          : moveExistingPlaceDown
        : direction === 'up'
        ? moveNewPlaceUp
        : moveNewPlaceDown;

    moveFn(currentPlace.originalIdx);
  };

  /* 변경 상태 확인 */
  const getChangeStatus = () => {
    const values = form.getValues();
    const dirtyValues = extractDirtyValues(form.formState.dirtyFields, values);

    return {
      hasAddedPlace: values.addedPlace.length > 0, // 새로운 장소 추가
      hasFieldChanges: Object.keys(dirtyValues).some((key) => key !== 'addedPlace'),
      hasOrderChanged: isOrderChanged(places, form.getValues('places')),
      isImageOrderChanged: isImageOrderChanged(
        places.map((p) => p.place_images).flat(),
        form
          .getValues('places')
          .map((p) => p.placeImages)
          .flat()
      ),
      dirtyValues,
    };
  };

  const onSubmit = async (values: LogEditFormValues) => {
    trackLogEditEvent('start');

    // 변경 상태 확인
    const { hasAddedPlace, hasFieldChanges, hasOrderChanged, isImageOrderChanged, dirtyValues } =
      getChangeStatus();

    // 새로운 장소가 있으면 먼저 추가
    if (hasAddedPlace) {
      await handleAddNewPlaces(values.addedPlace);
    }
    // 나머지 수정사항 처리
    else if (hasFieldChanges || hasOrderChanged || isImageOrderChanged) {
      await handleEditExistingPlaces(dirtyValues);
    } else {
      toast.info(translations.toastLogEdit('noChanges'), {
        description: translations.toastLogEdit('noChangesDesc'),
      });
      router.back();
    }
  };

  return (
    <div className="flex flex-col h-full">
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
                type={field.type as 'existing' | 'added'}
                isEditPage
                globalIdx={globalIdx} // 전체 장소 배열에서의 인덱스
                onDeletePlace={field.type === 'existing' ? deleteExistingPlace : deleteNewPlace}
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
      <div className="text-text-sm w-full h-9 rounded-md flex items-center justify-center bg-error-50 text-red-500 my-2.5 py-2">
        {translations.logEditPage('warning.imagePolicy')}
      </div>

      <ConfirmRegistrationDialog
        edit
        disabled={
          !form.formState.isValid ||
          form.formState.isSubmitting ||
          editIsPending ||
          addPlaceIsPending
        }
        loading={editIsPending || addPlaceIsPending}
        onSubmitLogForm={form.handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default LogEditPage;
