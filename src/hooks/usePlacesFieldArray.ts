import { useCallback } from 'react';
import { ArrayPath, FieldValues, UseFieldArrayReturn } from 'react-hook-form';

const MAX_PLACE_COUNT = 10;

export function usePlacesFieldArray<
  TFieldValues extends FieldValues,
  TName extends ArrayPath<TFieldValues>
>(
  fieldArray: UseFieldArrayReturn<TFieldValues, TName>,
  initialField: TFieldValues[TName][number] | null,
  options: {
    onAddError?: () => void;
    onDeleteError?: () => void;
    onReorder?: (from: number, to: number) => void;
  }
) {
  const { fields, append, remove, swap } = fieldArray;

  /** 새 장소 추가 */
  const addPlace = useCallback(() => {
    if (fields.length >= MAX_PLACE_COUNT) {
      options?.onAddError?.();
      return;
    }
    if (initialField) {
      append(initialField);
    }
  }, [fields.length, append, options, initialField]);

  /** 장소 삭제 */
  const deletePlace = useCallback(
    (idx: number) => {
      if (fields.length <= 1) {
        options?.onDeleteError?.();
        return;
      }
      remove(idx);
    },
    [fields.length, remove, options]
  );

  /** 장소 위로 이동 */
  const movePlaceUp = useCallback(
    (idx: number) => {
      if (idx <= 0) return;
      swap(idx, idx - 1);
      options?.onReorder?.(idx, idx - 1);
    },
    [swap, options]
  );

  /** 장소 아래로 이동 */
  const movePlaceDown = useCallback(
    (idx: number) => {
      if (idx >= fields.length - 1) return;
      swap(idx, idx + 1);
      options?.onReorder?.(idx, idx + 1);
    },
    [fields.length, swap, options]
  );

  return {
    addPlace,
    deletePlace,
    movePlaceUp,
    movePlaceDown,
  };
}
