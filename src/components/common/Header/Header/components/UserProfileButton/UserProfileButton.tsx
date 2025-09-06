'use client';
import LogoutButton from '@/components/common/Button/LogoutButton';
import { AddImageIcon, HeadPhoneIcon, UserBlackIcon, UserIcon } from '@/components/common/Icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NOTICE_PATHS, PRIVACY_PATHS, REGISTER_PATHS, TERMS_PATHS } from '@/constants/pathname';
import { Link } from '@/i18n/navigation';
import { IUser } from '@/types/api/user';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import MyProfileButton from './components/MyProfileButton';

interface UserProfileButtonProps {
  user: IUser;
}

export default function UserProfileButton({ user }: UserProfileButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const t = useTranslations('UserDropdown');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <Button variant={'ghost'} size={'icon'} className="relative group">
          <UserIcon className="absolute group-hover:opacity-0" />
          <UserBlackIcon className="opacity-0 group-hover:opacity-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // autoFocus를 끄면 포커스를 잡지 않음(에러방지)
        autoFocus={false}
        forceMount
        className="w-[264px]"
      >
        <DropdownMenuItem className="font-bold text-text-lg flex justify-start gap-[5px] px-4 items-center">
          {/* 체크 아이콘 추가 시 span에 ref={textRef} 추가 */}
          {/* 닉네임 */}
          <span className="truncate">{user?.nickname}</span>
          {/* {!isTruncated && <VerifiedLabelIcon />} */}
        </DropdownMenuItem>

        {/* 프로필 보기 */}
        <DropdownMenuItem className="px-4 py-5 focus:bg-white">
          <MyProfileButton user={user} label={t('viewProfile')} onClick={() => setOpen(false)} />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 로그 작성 / 문의하기 */}
        <div className="m-1">
          <Link href={REGISTER_PATHS.LOCATION}>
            <DropdownMenuItem className="flex items-center justify-start gap-2 px-4 py-3 text-text-sm">
              <AddImageIcon />
              {t('writeLog')}
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            asChild
            className="flex items-center justify-start gap-2 px-4 py-3 text-text-sm"
          >
            <a href="https://tally.so/r/nrYJEo" target="_blank" rel="noopener noreferrer">
              <HeadPhoneIcon />
              {t('contact')}
            </a>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />

        {/* 로그아웃 */}
        <div className="m-1">
          <DropdownMenuItem asChild className="flex items-center justify-start text-text-sm">
            <LogoutButton label={t('logout')} />
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        {/* 하단 정책 링크 */}
        <div className="flex items-center justify-start px-4 py-[10px] gap-[15px] text-[#81858F]">
          <Link href={NOTICE_PATHS.NOTICE} className="flex">
            <DropdownMenuItem className="p-0">
              <button className="text-text-xs">{t('notice')}</button>
            </DropdownMenuItem>
          </Link>
          <Link href={TERMS_PATHS.TERMS} className="flex">
            <DropdownMenuItem className="p-0">
              <button className="text-text-xs">{t('terms')}</button>
            </DropdownMenuItem>
          </Link>
          <Link href={PRIVACY_PATHS.PRIVACY} className="flex">
            <DropdownMenuItem className="p-0">
              <button className="text-text-xs">{t('privacy')}</button>
            </DropdownMenuItem>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
