import { INITIAL_PLACE } from '@/constants/logConstants';
import useAddPlaceMutation from '@/hooks/mutations/log/useAddPlaceMutation';
import { LogEditFormValues } from '@/types/log';
import { useTranslations } from 'next-intl';
import { UseFieldArrayReturn } from 'react-hook-form';
import { toast } from 'sonner';

interface UseNewPlacesProps {
  newPlacesArray: UseFieldArrayReturn<LogEditFormValues, 'addedPlace'>;
  logId: string;
  totalPlacesCount: number;
  // places: LogEditFormValues['places'];
}

// 새로운 장소 추가
export function useNewPlaces({ newPlacesArray, logId, totalPlacesCount }: UseNewPlacesProps) {
  const t = useTranslations('Toast.PlaceDrawer');
  const { mutateAsync: addPlaceMutate } = useAddPlaceMutation();

  const addNewPlace = () => {
    // 전체 장소 개수가 10개 이상이면 추가 불가
    if (totalPlacesCount >= 10) {
      toast.error(t('maxPlaceError'), { id: 'maxPlaceError' });
      return;
    }
    newPlacesArray.append(INITIAL_PLACE);
  };
  const deleteNewPlace = (idx: number) => {
    // 전체 장소 개수가 1개 이하면 삭제 불가
    if (totalPlacesCount <= 1) {
      toast.error(t('minPlaceError'), { id: 'minPlaceError' });
      return;
    }
    newPlacesArray.remove(idx);
  };
  const moveNewPlaceUp = (idx: number) => {
    if (idx <= 0) return;
    newPlacesArray.swap(idx, idx - 1);
  };
  const moveNewPlaceDown = (idx: number) => {
    if (newPlacesArray.fields.length - 1 <= idx) return;
    newPlacesArray.swap(idx, idx + 1);
  };

  /*********
   * mutation
   *********/
  const handleAddNewPlaces = async (
    newPlaces: LogEditFormValues['addedPlace'],
    existingOldPlacesCount: number
  ) => {
    await addPlaceMutate({
      values: newPlaces,
      logId,
      existingOldPlacesCount,
    });
  };

  return { addNewPlace, handleAddNewPlaces, deleteNewPlace, moveNewPlaceUp, moveNewPlaceDown };
}
