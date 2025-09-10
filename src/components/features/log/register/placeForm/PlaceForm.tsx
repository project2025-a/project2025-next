'use client';
import { useState } from 'react';
import PlaceDrawer from '../PlaceDrawer';
import ImageSection from '../place-item/ImageSection';
import TextSection from '../place-item/TextSection';
import CategoryField from './CategoryField';
import LocationField from './LocationField';
import PlaceNameField from './PlaceNameSection';

interface PlaceFormProps {
  idx: number;
  type?: 'old' | 'new';
  globalIdx?: number;
  isEditPage?: boolean;
  onDeletePlace: (globalIdx: number) => void;
  onMoveUpPlace: (globalIdx: number) => void;
  onMoveDownPlace: (globalIdx: number) => void;
}

const getFieldName = (idx: number, type: 'old' | 'new', isEdit: boolean) => {
  if (!isEdit) return `places.${idx}`; // 등록 페이지
  return type === 'old' ? `places.${idx}` : `addedPlace.${idx}`; // 수정 페이지 (기존 : 신규)
};

const PlaceForm = ({
  idx,
  type = 'old',
  globalIdx,
  isEditPage = false,
  onDeletePlace,
  onMoveUpPlace,
  onMoveDownPlace,
}: PlaceFormProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const fieldName = getFieldName(idx, type, isEditPage);
  const currentIdx = globalIdx ?? idx;

  return (
    <div className="mt-6" data-place-index={currentIdx}>
      <div className="flex justify-between">
        <span className="text-[14px] font-semibold text-black">
          {String((globalIdx ?? idx) + 1).padStart(2, '0')}
        </span>
        <PlaceDrawer
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          onDeletePlace={() => onDeletePlace(currentIdx)}
          onMoveUpPlace={() => onMoveUpPlace(currentIdx)}
          onMoveDownPlace={() => onMoveDownPlace(currentIdx)}
        />
      </div>

      <ImageSection idx={idx} fieldName={fieldName} edit={isEditPage && type === 'old'} />

      <div className="flex flex-col gap-2.5">
        <PlaceNameField fieldName={fieldName} />
        <LocationField fieldName={fieldName} />
        <CategoryField fieldName={fieldName} />
      </div>

      <div className="mt-4">
        <TextSection idx={idx} fieldName={fieldName} />
      </div>
    </div>
  );
};

export default PlaceForm;
