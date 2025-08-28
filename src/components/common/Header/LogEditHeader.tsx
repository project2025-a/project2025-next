'use client';

import ConfirmDeleteDialog from '@/components/features/log/edit/ConfirmDeleteDialog';
import { Tables } from '@/types/supabase';
import { useTranslations } from 'next-intl';
import AddPlaceButton from '../Button/AddPlaceButton';
import BackButton from '../Button/BackButton';

interface LogEditHeaderProps {
  address: Pick<Tables<'address'>, 'country' | 'city' | 'sigungu'>;
  logTitle: string;
  logId: string;
  onAddNewPlace: () => void;
}

const LogEditHeader = ({ address, logTitle, logId, onAddNewPlace }: LogEditHeaderProps) => {
  const t = useTranslations();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[66px] bg-white">
      <div className="py-[15px] flex items-center justify-between w-full min-w-[343px] max-w-[724px] mx-auto px-4">
        <div className="flex items-center gap-2.5">
          <BackButton plain />
          <p className="text-text-2xl font-bold">
            {t(`Region.${address.city}`)} · {t(`Region.${address.sigungu}`)}
          </p>
        </div>
        <div className="flex items-center space-x-[14px] gap-2">
          <AddPlaceButton handleAddNewPlace={onAddNewPlace} className="px-3 py-1.5" />
          <ConfirmDeleteDialog logTitle={logTitle} logId={logId} />
        </div>
      </div>
    </header>
  );
};

export default LogEditHeader;
