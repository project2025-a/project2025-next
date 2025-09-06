'use client';

import {
  cityCategories,
  cityDistricts,
  globalCategories,
  globalRegions,
} from '@/constants/cityData';
import { TAG_SETS } from '@/constants/tagData';
import { TagKeys, useLogTagStore } from '@/stores/logTagStore';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo } from 'react';
import { PAGE_TAG_INTROS } from './constant';
import TagGroup from './TagGroup';

interface SingleTagGroupProps {
  title?: string;
  type: Extract<TagKeys, 'country' | 'city' | 'sigungu'>;
}

const SingleTagGroup = ({ title, type }: SingleTagGroupProps) => {
  const t = useTranslations();
  const selectedTag = useLogTagStore((state) => state[type]);
  const setSingleTag = useLogTagStore((state) => state.setSingleTag);
  const selectedCity = useLogTagStore((state) => state['city']);
  const selectedCountry = useLogTagStore((state) => state['country']);
  const isDomestic = selectedCountry === '한국';

  // 선택한 값에 따라 다음 태그가 결정
  const tags = useMemo(() => {
    switch (type) {
      case 'sigungu':
        if (!selectedCity) return [];
        return isDomestic ? cityDistricts[selectedCity] ?? [] : globalRegions[selectedCity] ?? [];
      case 'city':
        return isDomestic ? cityCategories : globalCategories;
      default:
        return TAG_SETS[type] ?? [];
    }
  }, [type, selectedCity, isDomestic]);

  // 상위 태그 변경 시 하위 태그 초기화
  const clearDependentTags = useCallback(
    (changedType: TagKeys) => {
      if (changedType === 'country') {
        setSingleTag('city', '');
        setSingleTag('sigungu', '');
      } else if (changedType === 'city') {
        setSingleTag('sigungu', '');
      }
    },
    [setSingleTag]
  );

  const handleTagClick = useCallback(
    (value: string) => {
      setSingleTag(type, value);
      clearDependentTags(type);
    },
    [setSingleTag, type, clearDependentTags]
  );

  // 번역
  const { localeTitle, namespace } = useMemo(() => {
    const tagGroupTitle =
      (type === 'city' || type === 'sigungu') &&
      PAGE_TAG_INTROS[type][isDomestic ? 'domestic' : 'aboard'].tagGroupTitle;

    let localeTitle = '';
    if (type === 'country') {
      localeTitle = 'Register.CountryPage.groupTitle';
    } else if (tagGroupTitle === '도시') {
      localeTitle = 'Register.CityPage.city';
    } else if (tagGroupTitle === '지역') {
      localeTitle = 'Register.CityPage.area';
    } else if (tagGroupTitle === '시/군/구') {
      localeTitle = 'Register.sigunguPage.sigungu';
    }

    const namespace = type === 'country' ? 'Register.CountryPage.options' : 'Region';

    return { localeTitle, namespace };
  }, [type, isDomestic]);

  // 단계별 스텝 표시 (1/3), (2/3), (3/3)
  const stepMap: Record<SingleTagGroupProps['type'], string> = {
    country: '(1/3)',
    city: '(2/3)',
    sigungu: '(3/3)',
  };

  return (
    <TagGroup
      title={title || (localeTitle ? String(t(localeTitle)) : '')}
      stepText={stepMap[type]} // ✅ 타이틀 옆에 단계 표시
      tags={tags}
      isSelected={(value) => selectedTag === value}
      onTagClick={handleTagClick}
      namespace={namespace}
    />
  );
};

export default SingleTagGroup;

// 'use client';
// import {
//   cityCategories,
//   cityDistricts,
//   globalCategories,
//   globalRegions,
// } from '@/constants/cityData';
// import { TAG_SETS } from '@/constants/tagData';
// import { TagKeys, useLogTagStore } from '@/stores/logCreationStore';
// import { useTranslations } from 'next-intl';
// import { useCallback, useMemo } from 'react';
// import { PAGE_TAG_INTROS } from './constant';
// import TagGroup from './TagGroup';

// interface SingleTagGroupProps {
//   title?: string;
//   type: Extract<TagKeys, 'country' | 'city' | 'sigungu'>;
// }

// const SingleTagGroup = ({ title, type }: SingleTagGroupProps) => {
//   const t = useTranslations();
//   const selectedTag = useLogTagStore((state) => state[type]);
//   const setSingleTag = useLogTagStore((state) => state.setSingleTag);
//   const selectedCity = useLogTagStore((state) => state['city']);
//   const selectedCountry = useLogTagStore((state) => state['country']);
//   const isDomestic = selectedCountry === '한국';

//   // 선택한 값에 따라 다음 태그가 결정
//   const tags = useMemo(() => {
//     switch (type) {
//       case 'sigungu':
//         if (!selectedCity) return [];
//         return isDomestic ? cityDistricts[selectedCity] ?? [] : globalRegions[selectedCity] ?? [];
//       case 'city':
//         return isDomestic ? cityCategories : globalCategories;
//       default:
//         return TAG_SETS[type] ?? [];
//     }
//   }, [type, selectedCity, isDomestic]);

//   // 상위 태그 변경 시 하위 태그 초기화
//   const clearDependentTags = useCallback(
//     (changedType: TagKeys) => {
//       if (changedType === 'country') {
//         setSingleTag('city', '');
//         setSingleTag('sigungu', '');
//       } else if (changedType === 'city') {
//         setSingleTag('sigungu', '');
//       }
//     },
//     [setSingleTag]
//   );

//   const handleTagClick = useCallback(
//     (value: string) => {
//       setSingleTag(type, value);
//       clearDependentTags(type);
//     },
//     [setSingleTag, type, clearDependentTags]
//   );

//   // 번역
//   const { localeTitle, namespace } = useMemo(() => {
//     const tagGroupTitle =
//       (type === 'city' || type === 'sigungu') &&
//       PAGE_TAG_INTROS[type][isDomestic ? 'domestic' : 'aboard'].tagGroupTitle;

//     let localeTitle = '';
//     if (type === 'country') {
//       localeTitle = 'Register.CountryPage.groupTitle'; // ✅ 국가도 타이틀 설정
//     } else if (tagGroupTitle === '도시') {
//       localeTitle = 'Register.CityPage.city';
//     } else if (tagGroupTitle === '지역') {
//       localeTitle = 'Register.CityPage.area';
//     } else if (tagGroupTitle === '시/군/구') {
//       localeTitle = 'Register.sigunguPage.sigungu';
//     }

//     const namespace = type === 'country' ? 'Register.CountryPage.options' : 'Region';

//     return { localeTitle, namespace };
//   }, [type, isDomestic]);

//   return (
//     <TagGroup
//       title={title || (localeTitle ? String(t(localeTitle)) : '')}
//       tags={tags}
//       isSelected={(value) => selectedTag === value}
//       onTagClick={handleTagClick}
//       namespace={namespace}
//     />
//   );
// };

// export default SingleTagGroup;
