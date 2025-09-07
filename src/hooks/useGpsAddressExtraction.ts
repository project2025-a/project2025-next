'use client';

import { getAddressFromCoords } from '@/utils/getAddressFromCoords';
import exifr from 'exifr';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface UseGpsAddressExtractionProps {
  onAddressSet: (address: string) => void | Promise<void>;
  currentAddress?: string;
}

export const useGpsAddressExtraction = ({
  onAddressSet,
  currentAddress,
}: UseGpsAddressExtractionProps) => {
  const locale = useLocale();
  const tToast = useTranslations('Toast.logCreate');

  const extractGpsAndSetAddress = async (files: File[]) => {
    // 이미 주소가 있으면 GPS 추출 건너뛰기
    if (currentAddress) {
      toast.info(tToast('autoAddressSkipped'));
      return;
    }

    for (const file of files.slice(0, 3)) {
      try {
        const gps = await exifr.gps(file);

        if (gps !== undefined && gps.latitude && gps.longitude) {
          const address = await getAddressFromCoords({
            lat: gps.latitude,
            lng: gps.longitude,
            locale,
          });

          if (address.success) {
            await onAddressSet(address.data.address);
            toast.success(tToast('autoAddressSuccess'), {
              id: 'gps-address-extraction',
            });
            return; // 첫 번째 성공한 GPS 정보로 주소 설정 후 종료
          }
        }
      } catch (err) {
        console.error('GPS 추출 중 오류:', err);
      }
    }

    // 모든 파일을 확인했는데도 실패한 경우에만 표시
    toast.info(tToast('autoAddressFailed'), { id: 'gps-address-extraction' });
  };

  return { extractGpsAndSetAddress };
};
