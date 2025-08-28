import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IconProps {
  className?: string;
}

/* Header */
export const SearchIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/search.svg"
      width={20}
      height={20}
      alt="검색 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const SearchBlackIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/search-black.svg"
      width={20}
      height={20}
      alt="검색 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const GlobeIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/globe.svg"
      width={20}
      height={20}
      alt="다국어 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const GlobeBlackIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/globe-black.svg"
      width={20}
      height={20}
      alt="다국어 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const AlertIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/alert.svg"
      width={20}
      height={20}
      alt="알림 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const UserIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/user.svg"
      width={20}
      height={20}
      alt="유저 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const UserBlackIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/user-black.svg"
      width={20}
      height={20}
      alt="유저 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

/* modal header */
export const XIcon = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative', className ? className : 'w-5 h-5')}>
      <Image
        src="/icons/x.svg"
        alt="엑스 아이콘"
        fill
        className="object-contain object-center stroke-2"
      />
    </div>
  );
};

/* profile */
export const HeadPhoneIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/head-phone.svg"
      width={14}
      height={15}
      alt="헤드폰 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

export const LogoutIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/log-out.svg"
      width={14}
      height={15}
      alt="헤드폰 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

export const AddImageIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/add-image.svg"
      width={16}
      height={16}
      alt="로그 작성 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

export const PlusIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/Plus.svg"
      width={14}
      height={15}
      alt="더하기 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

export const PlusSemiboldIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/PlusSemibold.svg"
      width={16}
      height={16}
      alt="더하기 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

/* register header */
export const HomeIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/home.svg"
      width={20}
      height={20}
      alt="홈 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

/* log */

export const AddCameraIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/add-camera.svg"
      width={20}
      height={20}
      alt="이미지 추가 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const MapIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/map.svg"
      width={20}
      height={20}
      alt="지도 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const LocationIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/location.svg"
      width={20}
      height={20}
      alt="장소 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const WhiteLocationIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/location-white.svg"
      width={20}
      height={20}
      alt="장소 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const CircleIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/circle.svg"
      width={20}
      height={20}
      alt="장소 타겟 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const CheckedCircleIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/circle-checked.svg"
      width={20}
      height={20}
      alt="선택된 장소 타켓 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const TrashIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/trash.svg"
      width={20}
      height={20}
      alt="휴지통 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const TableIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/table.svg"
      width={20}
      height={20}
      alt="테이블 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const BookMarkIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="18"
      height="22"
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-4.5 h-5.5', className)}
    >
      <path
        d="M16.1665 1.02344V20.25L9.58057 15.5586L9.00049 15.1455L8.42041 15.5586L1.8335 20.25V1.02344H16.1665Z"
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};
export const ShareIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/share.svg"
      width={24}
      height={24}
      alt="공유 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const PenIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/pen.svg"
      width={24}
      height={24}
      alt="로그 수정 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const PenBlackIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/pen-black.svg"
      width={24}
      height={24}
      alt="로그 수정 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

/* arrow */
export const ArrowLeftIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/arrow-left.svg"
      width={18}
      height={18}
      alt="왼쪽 화살표 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const ArrowUpIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/arrow-up.svg"
      width={20}
      height={20}
      alt="위쪽 화살표 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const ArrowDownIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/arrow-down.svg"
      width={20}
      height={20}
      alt="아래쪽 화살표 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const ArrowUpRightIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/arrow-up-right.svg"
      width={20}
      height={20}
      alt="오른쪽 위 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};

/* x */
export const XInputClearIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/x-clear-input.svg"
      width={20}
      height={20}
      alt="입력창 클리어 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const XRemovePlaceImageIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/x-remove-placeImage.svg"
      width={20}
      height={20}
      alt="장소 이미지 삭제 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
export const XRemoveThumbnailIcon = ({ className }: IconProps) => {
  return (
    <Image
      src="/icons/x-remove-thumbnail.svg"
      width={20}
      height={20}
      alt="썸네일 이미지 삭제 아이콘"
      className={cn('w-5 h-5', className)}
    />
  );
};
