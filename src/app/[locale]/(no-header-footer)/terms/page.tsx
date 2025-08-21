import NoticeHeader from '@/components/features/notice/NoticeHeader';
import TermsArticleSection from '@/components/features/terms/TermsArticleSection';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'terms',
};

export default async function TermsPage() {
  const t = await getTranslations('TermsPage');
  return (
    <main className="flex justify-center w-full">
      <div className="max-w-[724px] w-full">
        <NoticeHeader title={t('title')} />
        <section className="px-4 py-10 text-text-sm text-light-600 space-y-6">
          <h2 className="text-lg font-semibold">{t('subtitle')}</h2>

          {/* 제1조 */}
          <TermsArticleSection
            title={t('articles.1.title')}
            description={t('articles.1.description')}
          />

          {/* 제2조 */}
          <TermsArticleSection
            title={t('articles.2.title')}
            description={t('articles.2.description')}
            items={Array.from({ length: 5 }, (_, i) => t(`articles.2.items.${i}`))}
          />

          {/* 제3조 */}
          <TermsArticleSection
            title={t('articles.3.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.3.items.${i}`))}
          />

          {/* 제4조 */}
          <TermsArticleSection
            title={t('articles.4.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.4.items.${i}`))}
          />

          {/* 제5조 */}
          <TermsArticleSection title={t('articles.5.title')} items={t.raw('articles.5.items')} />

          {/* 제6조 */}
          <TermsArticleSection
            title={t('articles.6.title')}
            items={Array.from({ length: 5 }, (_, i) => t(`articles.6.items.${i}`))}
          />

          {/* 제7조 */}
          <TermsArticleSection title={t('articles.7.title')} items={t.raw('articles.7.items')} />

          {/* 제8조 */}
          <TermsArticleSection
            title={t('articles.8.title')}
            items={Array.from({ length: 4 }, (_, i) => t(`articles.8.items.${i}`))}
          />

          {/* 제9조 */}
          <TermsArticleSection title={t('articles.9.title')} items={t.raw('articles.9.items')} />

          {/* 제10조 */}
          <TermsArticleSection title={t('articles.10.title')} items={t.raw('articles.10.items')} />

          {/* 제11조 */}
          <TermsArticleSection
            title={t('articles.11.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.11.items.${i}`))}
          />

          {/* 제12조 */}
          <TermsArticleSection
            title={t('articles.12.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.12.items.${i}`))}
          />

          {/* 제13조 */}
          <TermsArticleSection
            title={t('articles.13.title')}
            items={Array.from({ length: 4 }, (_, i) => t(`articles.13.items.${i}`))}
          />

          {/* 제14조 */}
          <TermsArticleSection
            title={t('articles.14.title')}
            items={Array.from({ length: 2 }, (_, i) => t(`articles.14.items.${i}`))}
          />

          {/* 제15조 */}
          <TermsArticleSection
            title={t('articles.15.title')}
            items={Array.from({ length: 4 }, (_, i) => t(`articles.15.items.${i}`))}
          />

          {/* 제16조 */}
          <TermsArticleSection
            title={t('articles.16.title')}
            items={Array.from({ length: 2 }, (_, i) => t(`articles.16.items.${i}`))}
          />

          {/* 제17조 */}
          <TermsArticleSection
            title={t('articles.17.title')}
            items={Array.from({ length: 2 }, (_, i) => t(`articles.17.items.${i}`))}
          />

          {/* 제18조 */}
          <TermsArticleSection
            title={t('articles.18.title')}
            description={t('articles.18.description')}
          />

          {/* 부칙 */}
          <TermsArticleSection
            title={t('articles.appendix.title')}
            description={t('articles.appendix.description')}
          />
        </section>
      </div>
    </main>
  );
}
