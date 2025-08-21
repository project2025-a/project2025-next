import NoticeHeader from '@/components/features/notice/NoticeHeader';
import PrivacyArticleSection from '@/components/features/privacy/PrivacyArticleSection';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'privacy',
};

export default async function PrivacyPage() {
  const t = await getTranslations('PrivacyPolicyPage');
  return (
    <main className="flex justify-center w-full">
      <div className="max-w-[724px] w-full">
        <NoticeHeader title={t('title')} />
        <section className="px-4 py-10 text-text-sm text-light-600 space-y-6">
          <p>{t('intro')}</p>

          {/* 제1조 */}
          <PrivacyArticleSection
            title={t('articles.1.title')}
            description={t('articles.1.description')}
            items={Array.from({ length: 4 }, (_, idx) => t(`articles.1.items.${idx}`))}
          />

          {/* 제2조 */}
          <PrivacyArticleSection
            title={t('articles.2.title')}
            description={t('articles.2.description')}
            items={Array.from({ length: 4 }, (_, idx) => t(`articles.2.items.${idx}`))}
          />

          {/* 제3조 */}
          <PrivacyArticleSection
            title={t('articles.3.title')}
            description={t('articles.3.description')}
            items={Array.from({ length: 3 }, (_, idx) => t(`articles.3.items.${idx}`))}
          />

          {/* 제4조 */}
          <PrivacyArticleSection
            title={t('articles.4.title')}
            description={t('articles.4.description')}
            items={Array.from({ length: 3 }, (_, idx) => t(`articles.4.items.${idx}`))}
          />

          {/* 제5조 */}
          <PrivacyArticleSection
            title={t('articles.5.title')}
            description={t('articles.5.description')}
            items={Array.from({ length: 2 }, (_, i) => t(`articles.5.items.${i}`))}
          />
          <p>{t('articles.5.footer')}</p>

          {/* 제6조 */}
          <PrivacyArticleSection
            title={t('articles.6.title')}
            description={t('articles.6.description')}
          />

          {/* 제7조 */}
          <PrivacyArticleSection
            title={t('articles.7.title')}
            items={Array.from({ length: 4 }, (_, i) => t(`articles.7.items.${i}`))}
          />

          {/* 제8조 */}
          <PrivacyArticleSection
            title={t('articles.8.title')}
            description={t('articles.8.description')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.8.items.${i}`))}
          />

          {/* 제9조 */}
          <PrivacyArticleSection
            title={t('articles.9.title')}
            description={t('articles.9.description')}
            items={Array.from({ length: 5 }, (_, i) => t(`articles.9.items.${i}`))}
          />

          {/* 제10조 */}
          <PrivacyArticleSection
            title={t('articles.10.title')}
            items={Array.from({ length: 4 }, (_, i) => t(`articles.10.items.${i}`))}
          />
          {/* 제11조 */}
          <PrivacyArticleSection
            title={t('articles.11.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.11.items.${i}`))}
          />

          {/* 제12조 */}
          <PrivacyArticleSection
            title={t('articles.12.title')}
            description={t('articles.12.description')}
            items={Array.from({ length: 4 }, (_, i) => t(`articles.12.items.${i}`))}
          />

          {/* 제13조 */}
          <PrivacyArticleSection
            title={t('articles.13.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.13.items.${i}`))}
          />

          {/* 제14조 */}
          <PrivacyArticleSection
            title={t('articles.14.title')}
            items={Array.from({ length: 3 }, (_, i) => t(`articles.14.items.${i}`))}
          />
        </section>
      </div>
    </main>
  );
}
