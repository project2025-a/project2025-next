'use client';

import { TagKeys, useLogCreationStore } from '@/stores/logCreationStore';
import { useTranslations } from 'next-intl';

type TagIntroKey = 'mood' | 'country' | 'city' | 'sigungu' | 'area';

interface PageIntro {
  type: Extract<TagKeys, 'mood' | 'country' | 'city' | 'sigungu'>;
}

const PageIntro = ({ type }: PageIntro) => {
  const t = useTranslations('Register.TagIntro');
  const country = useLogCreationStore((state) => state.country); // 한국 | 국제
  const isDomestic = country === '한국';

  let localeIntro: TagIntroKey = type;

  if (type === 'city') {
    localeIntro = isDomestic ? 'city' : 'area';
  } else if (type === 'sigungu') {
    localeIntro = isDomestic ? 'sigungu' : 'city';
  }
  return (
    <div className="flex flex-col items-center justify-center text-center w-full mb-0">
      <h3 className="!text-[18px] text-black font-bold">{t(`${localeIntro}.title`)}</h3>
      {/* <p className="text-text-sm font-medium text-light-300">{t(`${localeIntro}.description`)}</p> */}
    </div>
  );
};

export default PageIntro;
