import { getLog } from '@/app/actions/log';
import { getUser } from '@/app/actions/user';
import LogAuthorIntro from '@/components/features/detail-log/LogAuthorIntro';
import LogContent from '@/components/features/detail-log/LogContent';
import LogDetailActions from '@/components/features/detail-log/LogDetailActions';
import LogThumbnail from '@/components/features/detail-log/LogThumbnail';
import { SITE_URL } from '@/constants/pathname';
import { getStoragePublicImage } from '@/utils/getStorageImage';
import { Metadata, ResolvingMetadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
export interface LogIdParams {
  logId: string;
}
interface LogDetailPageProps {
  params: Promise<LogIdParams>;
}

export async function generateMetadata(
  { params }: LogDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { logId } = await params;
  const t = await getTranslations('NotFoundPage');
  const locale = await getLocale();
  const ogLocale = locale === 'ko' ? 'ko_KR' : 'en_US';

  // 게시물 데이터 가져오기
  const result = await getLog(logId);
  if (!result.success || !result.data.place[0]) {
    return {
      title: t('title'),
      description: t('logMessage'),
    };
  }

  const log = result.data;
  const title = log.title || '';
  const description = log.place[0].description || '';
  const rawPath = log.place[0]?.place_images?.[0]?.image_path;

  // 썸네일이 없으면 undefined로 두어 부모 OG를 상속
  const thumbnail = rawPath ? getStoragePublicImage(rawPath) : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/log/${logId}`,
      siteName: 'Placesurf',
      images: thumbnail ? [{ url: thumbnail, width: 1200, height: 630, alt: title }] : undefined, // ← 없으면 생략하여 부모 OG 상속
      type: 'article',
      locale: ogLocale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: thumbnail ? [thumbnail] : undefined,
    },
  };
}

const LogDetailPage = async ({ params }: LogDetailPageProps) => {
  const { logId } = await params;
  const result = await getLog(logId);
  if (!result.success || !result.data.place[0]) {
    return notFound();
  }

  const { data: logData } = result;
  const user = await getUser();
  const isAuthor = user?.user_id === logData.user_id;

  return (
    <div>
      <LogThumbnail logData={logData} isAuthor={isAuthor} />
      <main className="flex flex-col px-4 web:px-[50px] pb-[200px]">
        <LogAuthorIntro
          userId={logData.user_id}
          userNickname={String(logData.users.nickname)}
          userImgUrl={String(logData.users.image_url)}
        />
        <>
          {logData.place.map((place, idx) => (
            <LogContent key={place.place_id} place={place} idx={idx + 1} />
          ))}
        </>
      </main>

      <LogDetailActions
        isAuthor={isAuthor}
        logId={logId}
        logBookmarkCount={Number(logData._count?.log_bookmark)}
      />
    </div>
  );
};

export default LogDetailPage;
