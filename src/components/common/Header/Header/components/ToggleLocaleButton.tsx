'use client';

import { GlobeBlackIcon, GlobeIcon } from '@/components/common/Icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

export default function ToggleLocaleButton() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <GlobeIcon className="absolute group-hover:opacity-0" />
          <GlobeBlackIcon className="opacity-0 group-hover:opacity-100" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-25 p-1 font-untitled">
        <DropdownMenuItem className=" px-3 py-1.5" asChild>
          <Link href={{ pathname }} locale="en">
            <span
              className={cn('text-text-sm w-full', locale === 'en' ? 'font-bold' : 'font-normal')}
            >
              English
            </span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className=" px-3 py-1.5" asChild>
          <Link href={{ pathname }} locale="ko">
            <span
              className={cn('text-text-sm w-full', locale === 'ko' ? 'font-bold' : 'font-normal')}
            >
              Korean
            </span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
