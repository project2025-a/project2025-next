'use client';

import { Button } from '@/components/ui/button';
import Script from 'next/script';
import { useCallback } from 'react';

// 반환값 중 필수 값만
interface DaumPostcodeData {
  address: string;
}

interface DaumPostcodeProps {
  onComplete: (address: string) => void;
}

const DaumPostcode = ({ onComplete }: DaumPostcodeProps) => {
  const handleClick = useCallback(() => {
    if (typeof window === 'undefined' || !window.daum) return;

    new window.daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        // console.log(data);
        onComplete(data.address);
      },
    }).open();
  }, [onComplete]);

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />
      <Button type="button" onClick={handleClick} variant="outline" className="rounded-full">
        주소 검색
      </Button>
    </>
  );
};

export default DaumPostcode;
