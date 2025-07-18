'use client';

import { XIcon } from '@/components/common/Icons';
import { cityCategories, cityDistricts } from '@/constants/cityData';
import { useCitySearchStore } from '@/stores/searchStore';
import { useTranslations } from 'next-intl';
import CitySearchButton from './CitySearchButton';
import SigunguButtonList from './SigunguButtonList';

export default function CitySearchDropbox() {
  const {
    city,
    isCityDropBox,
    isSigunguDropBox,
    closeDropBox,
    setcity,
    setsigungu,
    toggleCityDropBox,
    toggleSigunguDropBox,
  } = useCitySearchStore();

  const t = useTranslations('HomePage.citySearchForm.dropbox');
  const r = useTranslations('Region');

  const oncityClick = (city: string) => {
    setcity(city);
    setsigungu(cityDistricts[city]?.[0]);
    toggleCityDropBox();
  };

  const onSigunguClick = (sigungu: string) => {
    setsigungu(sigungu);
    toggleSigunguDropBox();
  };
  return (
    <div className="will-change-transform">
      <header className="flex items-center justify-between py-3">
        <div className="flex justify-start gap-1 web:gap-2.5 flex-col font-pretendard web:flex-row web:justify-between web:items-center">
          <h3 className="font-bold text-sm">
            {isSigunguDropBox ? t('sigunguTitle') : t('cityTitle')}
          </h3>
          <h4 className="flex-1 text-text-xs text-primary-400">{t('subtitle')}</h4>
        </div>
        <div>
          <button
            className="w-8.5 h-8.5 flex justify-center items-center"
            type="button"
            onClick={closeDropBox}
          >
            <XIcon className="w-3 h-3" />
          </button>
        </div>
      </header>
      <div className="flex justify-center web:justify-start">
        <section className="grid grid-cols-2 web:flex web:justify-start web:items-center gap-[5px] flex-wrap w-[343px] web:w-auto">
          {isCityDropBox &&
            cityCategories.map((city) => (
              <CitySearchButton
                key={city}
                city={city}
                label={r(city)} // 번역된 이름 보여주기
                onClick={oncityClick}
              />
            ))}
          {isSigunguDropBox && (
            <SigunguButtonList city={city} onSigunguClick={onSigunguClick} tRegion={r} />
          )}
        </section>
        <div
          onClick={() => closeDropBox()}
          className="fixed top-0 left-0 w-screen h-screen -z-10"
        />
      </div>
    </div>
  );
}
