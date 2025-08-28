import { cityCategories, globalCategories } from './cityData';

export const TAG_SETS = {
  mood: ['혼자', '친구랑', '연인과', '가족과', '동료와', '반려동물과'] as const,
  activity: [
    'SNS 핫플레이스',
    '체험 · 액티비티',
    '자연과 함께',
    '유명 관광지',
    '여유롭게 힐링',
    '미술관 · 갤러리',
    '알차고 바쁘게!',
    '역사가 물든',
    '여행지',
    '쇼핑',
    '맛집투어',
    '음악',
    '페스티벌',
    '독서하며 잔잔하게',
    '모임 · 동호회',
    '가성비 굿',
  ] as const,
  country: ['한국', '국제'] as const,
  city: cityCategories || globalCategories,
  sigungu: [],
};
