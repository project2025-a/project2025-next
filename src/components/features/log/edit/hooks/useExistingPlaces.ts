import useLogEditMutation from '@/hooks/mutations/log/useLogEditMutation';
import { LogEditFormValues } from '@/types/log';
import { createFormData } from '@/utils/formatLog';
import { useTranslations } from 'next-intl';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface UseExistingPlacesProps {
  oldPlacesArray: UseFieldArrayReturn<LogEditFormValues, 'places'>;
  totalPlacesCount: number;
  logId: string;
  form: UseFormReturn<LogEditFormValues>;
  // places: LogEditFormValues['places'];
}

// 기존 장소 수정
const useExistingPlaces = ({
  oldPlacesArray,
  totalPlacesCount,
  logId,
  form,
}: UseExistingPlacesProps) => {
  const t = useTranslations('Toast.PlaceDrawer');
  const { mutateAsync: editMutateAsync } = useLogEditMutation();

  const deleteExistingPlace = (idx: number) => {
    if (totalPlacesCount <= 1) {
      toast.error(t('minPlaceError'), { id: 'minPlaceError' });
      return;
    }

    const { placeId: deletedPlaceId } = oldPlacesArray.fields[idx]; // 삭제할 장소 id
    oldPlacesArray.remove(idx); // 필드에서 지우고
    form.setValue('deletedPlace', [...form.getValues('deletedPlace'), deletedPlaceId]); // 삭제된 장소 id 추가
    console.log('deletedPlace', form.getValues('deletedPlace'));
    // 삭제된 장소 id
  };
  const moveExistingPlaceUp = (idx: number) => {
    if (idx <= 0) {
      toast.error(t('minPlaceError'), { id: 'minPlaceError' });
      return;
    }
    oldPlacesArray.swap(idx, idx - 1);
  };
  const moveExistingPlaceDown = (idx: number) => {
    if (totalPlacesCount - 1 <= idx) {
      toast.error(t('minPlaceError'), { id: 'minPlaceError' });
      return;
    }
    oldPlacesArray.swap(idx, idx + 1);
  };

  //
  const submitExistedPlaces = async (extractedDirtyValues: Partial<LogEditFormValues>) => {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>> extractedDirtyValues', extractedDirtyValues);

    const patchedDirtyValues = {
      ...extractedDirtyValues,
      places: oldPlacesArray.fields.map((place, idx) => {
        const dirtyPlace = extractedDirtyValues.places?.[idx]; // 특정 인덱스 dirty 값
        return {
          id: place.placeId,
          order: idx + 1,
          ...(dirtyPlace?.placeName && { placeName: dirtyPlace.placeName }),
          ...(dirtyPlace?.category && { category: dirtyPlace.category }),
          ...(dirtyPlace?.location && { location: dirtyPlace.location }),
          ...(dirtyPlace?.description && { description: dirtyPlace.description }),
          ...(dirtyPlace?.placeImages && { placeImages: dirtyPlace.placeImages }),
        };
      }),
      deletedPlace: form.getValues('deletedPlace'),
    };

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>> patchedDirtyValues', patchedDirtyValues);
    const formData = createFormData(patchedDirtyValues);
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>> formData', formData);
    // for (const [key, value] of formData.entries()) {
    //   console.log('>>>>>>>>>', key, value);
    // }

    await editMutateAsync({ formData, logId });
  };

  return {
    submitExistedPlaces,
    deleteExistingPlace,
    moveExistingPlaceUp,
    moveExistingPlaceDown,
  };
};

export default useExistingPlaces;
