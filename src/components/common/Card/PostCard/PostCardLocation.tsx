import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

type PostCardLocationProps = Partial<{
  city: string;
  country: string;
  sigungu?: string;
  category?: string;
}> & {
  modal?: boolean;
};

function PostCardLocation({ city, country = '', sigungu, category, modal }: PostCardLocationProps) {
  const t = useTranslations();
  return (
    <h4
      className={cn('flex items-center text-[16px] text-light-300 gap-2', modal && '!text-text-xs')}
    >
      {category ? (
        <span>{t(`Category.${category}`)}</span>
      ) : (
        <>
          {city && <span>{city}</span>}
          <div className="h-3 inline-block align-middle">
            <Separator orientation="vertical" className="h-3 bg-light-300" />
          </div>
          {country && <span>{country}</span>}
          {sigungu && <span>{sigungu}</span>}
        </>
      )}
    </h4>
  );
}

export default PostCardLocation;
