'use client';

import { useLogCreationStore } from '@/stores/logCreationStore';
import { useTranslations } from 'next-intl';
import AddPlaceButton from '../Button/AddPlaceButton';
import BackButton from '../Button/BackButton';

interface LogRegisterHeaderProps {
  onAddNewPlace: () => void;
}

const LogRegisterHeader = ({ onAddNewPlace }: LogRegisterHeaderProps) => {
  const city = useLogCreationStore((state) => state.city);
  const sigungu = useLogCreationStore((state) => state.sigungu);

  const translations = {
    region: useTranslations('Region'),
    logPage: useTranslations('Register.LogPage'),
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[66px] bg-white">
      <div className="py-[15px] flex items-center justify-between w-full min-w-[343px] max-w-[724px] mx-auto px-4">
        <div className="flex items-center gap-2.5">
          <BackButton plain />
          {city && sigungu ? (
            <p className="text-text-2xl font-bold">
              {translations.region(city)} · {translations.region(sigungu)}
            </p>
          ) : (
            <p className="text-text-2xl font-bold">{translations.logPage('loading')}</p>
          )}
        </div>
        <AddPlaceButton handleAddNewPlace={onAddNewPlace} className="px-3 py-1.5" />
      </div>
    </header>
  );
};

export default LogRegisterHeader;
