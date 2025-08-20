import { searchKeys } from '@/app/actions/keys';
import { getSearchLogs } from '@/app/actions/log';
import { SectionTitle } from '@/components/common/SectionBlock';
import SearchContent from '@/components/features/search/SearchContent';
import { SITE_URL } from '@/constants/pathname';
import { getQueryClient } from '@/lib/utils';
import { getStoragePublicImage } from '@/utils/getStorageImage';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata, ResolvingMetadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

interface SearchPageProps {
  searchParams: Promise<{ keyword: string; page: string }>;
}

export async function generateMetadata(
  { searchParams }: SearchPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { keyword, page } = await searchParams;

  const parsedPage = Number(page);
  const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const t = await getTranslations('NotFoundPage');
  const locale = await getLocale();
  const ogLocale = locale === 'ko' ? 'ko_KR' : 'en_US';

  // 게시물 데이터 가져오기
  const result = await getSearchLogs({
    keyword,
    currentPage,
    pageSize: 16,
  });

  if (!result.success) {
    return {
      title: t('title'),
      description: t('logMessage'),
    };
  }

  const log = result.data;
  const title = keyword || '';
  const rawPath = log[0]?.place[0].place_images[0].image_path;

  // 썸네일이 없으면 undefined로 두어 부모 OG를 상속
  const thumbnail = rawPath ? getStoragePublicImage(rawPath) : undefined;

  return {
    title,
    openGraph: {
      title,
      url: `${SITE_URL}/search?keyword=${keyword}`,
      siteName: 'Placesurf',
      images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630, alt: title }] : undefined, // ← 없으면 생략하여 부모 OG 상속
      type: 'article',
      locale: ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: thumbnail ? [thumbnail] : undefined,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { keyword, page } = await searchParams;
  const parsedPage = Number(page);
  const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: searchKeys.list({ keyword, currentPage, pageSize: 16 }),
    queryFn: () => getSearchLogs({ keyword, currentPage, pageSize: 16 }),
  });

  return (
    <div className="w-full pt-10 web:pt-15 pb-20 web:pb-35 px-4 web:px-12.5">
      <section className="pb-10 web:pb-15 border-b-[1px] border-b-light-100">
        <SectionTitle title="Searching for" subTitle={keyword} />
      </section>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchContent keyword={keyword} currentPage={currentPage} />
      </HydrationBoundary>
    </div>
  );
}
