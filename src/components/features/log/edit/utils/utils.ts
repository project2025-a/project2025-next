import { LogEditFormValues } from '@/types/log';
import { FieldValues, UseFormReturn } from 'react-hook-form';

/* 변경 상태 확인 */
export const getChangeStatus = (form: UseFormReturn<LogEditFormValues>) => {
  const values = form.getValues(); // 현재 form 값
  const places = form.getValues().places; // 장소 필드 값
  const defaultPlaces = form.formState.defaultValues?.places; // 장소 필드 값

  // 변경 필드값 추출
  const extractedDirtyValues = extractDirtyValues<LogEditFormValues>(
    form.formState.dirtyFields,
    values
  );

  const hasAddedPlace = values.addedPlace.length > 0; // 추가된 장소
  const hasDeletedPlace = values.deletedPlace.length > 0; // 삭제된 장소

  const hasPlaceOrderChanged = isOrderChanged(
    defaultPlaces ?? [],
    places,
    (item) => item?.placeId ?? ''
  ); // 장소 순서 변경

  const hasPlaceImageOrderChanged = isOrderChanged(
    defaultPlaces?.map((p) => p?.placeImages).flat() ?? [],
    places.map((p) => p.placeImages).flat(),
    (item) => item?.place_image_id ?? ''
  ); // 장소 이미지 순서 변경

  return {
    hasAddedPlace,
    hasDeletedPlace,
    hasPlaceOrderChanged,
    hasPlaceImageOrderChanged,
    extractedDirtyValues,
  };
};

/* 변경된 필드만 추출 
- dirtyFields와 전체 values 비교 후 변경된 값만 결과로 반환
- 재귀로 중첩 객체 처리 
*/
export function extractDirtyValues<T extends FieldValues>(
  dirtyFields: Record<string, any> | true,
  allValues: T
): Partial<T> {
  if (dirtyFields === true) return allValues; // 해당 필드가 변경되면 값 전체 포함
  if (typeof dirtyFields !== 'object') return {}; // 배열인 경우 빈 배열 반환, 객체인 경우 빈 객체 반환

  // 순회하면서 dirty 필드의 값만 추출
  return Object.keys(dirtyFields).reduce((acc, key) => {
    const field = dirtyFields[key]; // dirty 여부 정보
    const value = allValues[key]; // 실제 값

    if (!field) return acc;

    // value가 undefined인 경우 처리
    if (value === undefined) {
      acc[key as keyof T] = value;
      return acc;
    }

    acc[key as keyof T] =
      field === true
        ? value // 해당 필드 전체가 dirty → 값 그대로
        : extractDirtyValues(field, value); // 하위 필드 재귀 추출

    return acc;
  }, {} as Partial<T>);
}

/* 장소 순서 변경 확인용 
- useFieldArray는 값 변경만 확인되므로, 순서 변경은 직접 비교
*/
export function isOrderChanged<T>(
  initialArray: T[], // 변경 전
  currentArray: T[], // 변경 후
  keySelector: (item: T) => string | number
) {
  if (initialArray.length !== currentArray.length) return true;
  return currentArray.some((item, idx) => keySelector(item) !== keySelector(initialArray[idx]));
}
