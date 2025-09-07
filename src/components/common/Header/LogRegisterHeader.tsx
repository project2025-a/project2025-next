'use client';

import AddPlaceButton from '../Button/AddPlaceButton';
import BackButton from '../Button/BackButton';

interface LogRegisterHeaderProps {
  onAddNewPlace: () => void;
}

const LogRegisterHeader = ({ onAddNewPlace }: LogRegisterHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[66px] bg-white">
      <div className="py-[15px] flex items-center justify-between w-full min-w-[343px] max-w-[724px] mx-auto px-4">
        <BackButton plain />
        <AddPlaceButton handleAddNewPlace={onAddNewPlace} className="px-3 py-1.5" />
      </div>
    </header>
  );
};

export default LogRegisterHeader;
