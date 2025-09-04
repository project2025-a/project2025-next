import { Toaster } from '@/components/ui/sonner';
import { OR_IMAGE_PATHS } from '@/constants/pathname';
import { routing } from '@/i18n/routing';
import { pretendard, prompt, untitled } from '@/lib/fonts';
import Providers from '@/providers';
import '@/styles/globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  metadataBase: new URL('https://placesurf.xyz'),
  title: {
    default: 'Placesurf',
    template: '%s | Placesurf',
  },
  description:
    '좋아하는 카페, 자주 걷는 골목, 우연히 찾은 전시. 당신의 취향이 머무는 장소로 하루를 그려보세요. 누군가의 여행, 데이트, 소중한 기념일이 될 수 있어요.',
  alternates: {
    canonical: '/',
    languages: { ko: '/ko', en: '/en' }, // i18n hreflang
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    images: [OR_IMAGE_PATHS],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 유효하지 않은 locale이면 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // locale을 서버 컴포넌트 전체에 적용 (SSG 대응)
  setRequestLocale(locale);

  // locale에 맞는 messages 불러오기
  const messages = (await import(`messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicons/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-icon-180x180.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/favicons/android-chrome-192x192.png"
        />
        <meta name="msapplication-TileImage" content="/favicons/ms-icon-144x144.png" />
        {/* Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
      (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
    `,
          }}
        />
        {/* Hotjar */}
        {process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_HOTJAR_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${JSON.stringify(process.env.NEXT_PUBLIC_HOTJAR_ID)},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `,
            }}
          />
        )}
      </head>
      <body
        className={`${pretendard.variable} ${untitled.variable} ${prompt.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
          <Toaster position="top-right" richColors />
        </NextIntlClientProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      </body>
    </html>
  );
}
