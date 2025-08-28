'use client';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { PlusSemiboldIcon } from '../Icons';

interface AddPlaceButtonProps {
  handleAddNewPlace: () => void;
  className?: string;
}

const AddPlaceButton = ({ handleAddNewPlace, className }: AddPlaceButtonProps) => {
  const translations = {
    logPage: useTranslations('Register.LogPage'),
  };
  return (
    <button
      className={cn(
        'flex items-center justify-center gap-1.5 font-semibold text-text-md bg-black text-white rounded-full px-4 py-2 hover:bg-light-900 hover:text-white',
        className
      )}
      onClick={handleAddNewPlace}
    >
      <PlusSemiboldIcon className="fill-light-500" />
      {translations.logPage('addPlace')}
    </button>
  );
};

export default AddPlaceButton;
