'use client';

import { ArrowUpRightIcon } from '@/components/common/Icons';
import { Button } from '@/components/ui/button';
import { REGISTER_PATHS } from '@/constants/pathname';
import { Link } from '@/i18n/navigation';

interface RegisterLinkButtonsProps {
  label: string;
}

export default function RegisterLinkButtons({ label }: RegisterLinkButtonsProps) {
  return (
    <Link href={REGISTER_PATHS.LOCATION} className="group inline-flex items-center">
      {/* 텍스트 버튼 */}
      <div>
        <Button
          className="pointer-events-none rounded-full w-56 h-15 !text-text-lg web:!text-text-md font-medium bg-black text-white group-hover:bg-light-900 group-hover:text-white transition-colors duration-200"
          size="lg"
        >
          {label}
        </Button>
      </div>

      {/* 아이콘 버튼 */}
      <div>
        <Button
          className="pointer-events-none rounded-full w-15 h-15 bg-black group-hover:bg-light-900 transition-colors duration-200"
          size="icon"
        >
          <ArrowUpRightIcon className="w-9 h-9" />
        </Button>
      </div>
    </Link>
  );
}
