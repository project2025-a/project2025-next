import { LogEditFormSchema } from '@/lib/zod/logSchema';
import { DetailLog } from '@/types/api/log';
import { LogEditFormValues } from '@/types/log';
import { scrollToPlaceAfterReorder } from '@/utils/scrollToElement';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import useExistingPlaces from './useExistingPlaces';
import { useNewPlaces } from './useNewPlaces';

// 폼 초기화
interface UseLogEditFormProps {
  logData: DetailLog;
}

const useLogEditForm = ({ logData }: UseLogEditFormProps) => {
  const { title, place: places, log_tag } = logData; // 원본 데이터
  const initialMoodTags = log_tag.filter((t) => t.category === 'mood').map((t) => t.tag);
  const initialActivityTags = log_tag.filter((t) => t.category === 'activity').map((t) => t.tag);
  const translations = {
    toastPlaceDrawer: useTranslations('Toast.PlaceDrawer'),
  };
  const form = useForm({
    resolver: zodResolver(LogEditFormSchema),
    defaultValues: {
      logTitle: title,
      places: places.map((place) => ({
        placeId: place.place_id, // 내부 id랑 구분하기 위해서 이름 변경
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
      addedPlace: [], // 추가할 장소
      deletedPlace: [], // 삭제할 장소
      deletedPlaceImages: [], // 삭제할 장소 이미지
    },
  });

  //---------- 기존 장소 ----------
  const oldPlacesArray = useFieldArray<LogEditFormValues>({
    control: form.control,
    name: 'places',
  });

  //---------- 새 장소 ------------
  const newPlacesArray = useFieldArray<LogEditFormValues>({
    control: form.control,
    name: 'addedPlace',
  });

  // 기존 장소와 새 장소를 합쳐서 렌더링
  const allPlaces = useMemo(
    () => [
      ...oldPlacesArray.fields.map((field, idx) => ({
        ...field,
        type: 'old',
        originalIdx: idx,
      })),
      ...newPlacesArray.fields.map((field, idx) => ({
        ...field,
        type: 'new',
        originalIdx: idx,
      })),
    ],
    [oldPlacesArray.fields, newPlacesArray.fields]
  );

  const { moveExistingPlaceUp, moveExistingPlaceDown } = useExistingPlaces({
    oldPlacesArray,
    logId: logData.log_id,
    totalPlacesCount: allPlaces.length,
    form,
  });
  const { moveNewPlaceUp, moveNewPlaceDown } = useNewPlaces({
    newPlacesArray,
    logId: logData.log_id,
    totalPlacesCount: allPlaces.length,
  });

  // 기존 장소 vs 신규 장소 구분해서 순서 이동
  const movePlaceGlobal = (globalIdx: number, direction: 'up' | 'down') => {
    const lastIdx = allPlaces.length - 1;

    // 에러 발생 범위
    if ((direction === 'up' && globalIdx <= 0) || (direction === 'down' && globalIdx >= lastIdx))
      return;

    const offset = direction === 'up' ? -1 : 1; // 이동할 범위
    const currentPlace = allPlaces[globalIdx];
    const adjacentPlace = allPlaces[globalIdx + offset];

    // 타입이 다르면 이동 불가
    if (currentPlace.type !== adjacentPlace.type) {
      toast.error(translations.toastPlaceDrawer('orderTypeError'), {
        description: translations.toastPlaceDrawer('orderTypeErrorDesc'),
        id: 'orderTypeError',
      });
      return;
    }

    // 이동 함수 선택 (기존 장소 vs 신규 장소)
    const moveFn =
      currentPlace.type === 'old'
        ? direction === 'up'
          ? moveExistingPlaceUp
          : moveExistingPlaceDown
        : direction === 'up'
        ? moveNewPlaceUp
        : moveNewPlaceDown;

    moveFn(currentPlace.originalIdx);

    scrollToPlaceAfterReorder(globalIdx, direction);
  };

  return { form, oldPlacesArray, newPlacesArray, allPlaces, movePlaceGlobal };
};

export default useLogEditForm;
