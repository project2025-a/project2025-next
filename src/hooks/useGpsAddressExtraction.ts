'use client';

import { getAddressFromCoords } from '@/utils/getAddressFromCoords';
import exifr from 'exifr';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface UseGpsAddressExtractionProps {
  onAddressSet: (address: string) => void;
  currentAddress?: string;
  onSkip?: () => void;
}

export const useGpsAddressExtraction = ({
  onAddressSet,
  currentAddress,
  onSkip,
}: UseGpsAddressExtractionProps) => {
  const locale = useLocale();
  const tToast = useTranslations('Toast.logCreate');

  const extractGpsAndSetAddress = async (files: File[]) => {
    // 이미 주소가 있으면 GPS 추출 건너뛰기
    if (currentAddress) {
      onSkip?.();
      return;
    }

    let hasGpsInfo = false;

    for (const file of files) {
      try {
        const gps = await exifr.gps(file);

        if (gps?.latitude && gps?.longitude) {
          hasGpsInfo = true;
          const address = await getAddressFromCoords({
            lat: gps.latitude,
            lng: gps.longitude,
            locale,
          });

          if (address.success) {
            onAddressSet(address.data.address);
            toast.success(tToast('autoAddressSuccess'), {
              id: 'gps-address-extraction',
            });
            break; // 첫 번째 성공한 GPS 정보로 주소 설정 후 종료
          } else {
            toast.warning(tToast('autoAddressFailed'), { id: 'gps-address-extraction' });
          }
        }
      } catch (err) {
        console.error('GPS 추출 중 오류:', err);
      }
    }

    // GPS 정보가 없는 경우 토스트 표시
    if (!hasGpsInfo) {
      toast.info(tToast('autoAddressFailed'), { id: 'gps-address-extraction' });
    }
  };

  return { extractGpsAndSetAddress };
};
