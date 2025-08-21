'use client';

import { logKeys, searchKeys, userKeys } from '@/app/actions/keys';
import { patchUser } from '@/app/actions/user';
import AccountDeleteSection from '@/components/features/profile-editor/AccountDeleteSection/AccountDeleteSection';
import AvatarEditSection from '@/components/features/profile-editor/AvatarEditSection';
import ProfileFormFields from '@/components/features/profile-editor/ProfileFormFields';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import useUser from '@/hooks/queries/user/useUser';
import { useRouter } from '@/i18n/navigation';
import { removeImageIfNeeded } from '@/lib/utils';
import { profileEditorSchema } from '@/lib/zod/profileSchema';
import { compressImageToWebp } from '@/utils/compressImageToWebp';
import { getStoragePublicImage } from '@/utils/getStorageImage';
import { uploadSingleImage } from '@/utils/imageUpload';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const Loading = dynamic(() => import('@/components/common/Loading/Loading'), {
  ssr: false,
});

export default function ProfileEditorClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: me } = useUser();

  const queryClient = useQueryClient();

  const [imageFile, setImageFile] = useState<File | null>(null);

  const t = useTranslations('ProfileEditor');

  const form = useForm({
    resolver: zodResolver(profileEditorSchema),
    defaultValues: {
      nickname: '',
      image_url: '',
      description: '',
      insta_id: '',
    },
  });

  useEffect(() => {
    if (me) {
      form.reset({
        nickname: me.nickname ?? '',
        image_url: me.image_url ?? '',
        description: me.description ?? '',
        insta_id: me.insta_id ?? '',
      });
    }
  }, [me, form]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const onSubmit = async (data: z.infer<typeof profileEditorSchema>) => {
    setIsSubmitting(true);

    try {
      if (!me) {
        console.error('사용자 정보가 없습니다.');
        return;
      }

      const nickname = data.nickname.trim();
      const description = data.description;

      const rawInstaId = data.insta_id.trim();
      const insta_id =
        rawInstaId === '' ? null : rawInstaId.startsWith('@') ? rawInstaId : `@${rawInstaId}`;

      let image_url: string | undefined = undefined;

      if (imageFile) {
        /** 1.기존 이미지 삭제 (image_url이 있고, 기본 이미지가 아닐 경우) */
        if (
          me.image_url &&
          (me.image_url.includes('/storage/v1/object/public/profiles/') || // 절대 경로
            me.image_url.startsWith('profiles/')) && // 상대 경로
          !me.image_url.includes('user-default-avatar') // 기본 이미지가 아님
        ) {
          try {
            await removeImageIfNeeded(me.image_url, 'profiles');
          } catch (error) {
            console.warn('기존 이미지 삭제 실패:', error);
            return;
          }
        }

        /** 2.새 이미지 압축 */
        const resizingFile = await compressImageToWebp(imageFile, { maxWidthOrHeight: 300 });
        if (!resizingFile) {
          console.error('이미지 압축 실패: resizingFile이 undefined');
          return;
        }

        /** 3.서버에서 PreSigned URL 발급 + fetch 업로드 */
        const result = await uploadSingleImage('profiles', resizingFile, {
          fileName: `profile${Date.now()}.webp`,
        });

        if (!result.success) {
          console.error('업로드 실패');
          return;
        }

        /** 4.public URL 생성 후 patch */
        image_url = getStoragePublicImage(result.data);
      }

      // 변경 감지 로직(프리즈마는 값이 undefined인 필드는 db에 업로드 안 함)
      const updateData = {
        userId: me.user_id,
        nickname: nickname !== me?.nickname ? nickname : undefined,
        image_url: image_url ?? undefined, // 업로드된 경우만
        insta_id: insta_id !== me?.insta_id ? insta_id : undefined,
        description: description !== me?.description ? description : undefined,
      };

      //캐시 무효화 추가
      const res = await patchUser(updateData);
      console.log(res);

      queryClient.removeQueries({ queryKey: userKeys.me(), exact: true });
      queryClient.removeQueries({ queryKey: userKeys.publicUser(String(me.user_id)), exact: true });
      queryClient.removeQueries({ queryKey: logKeys.all, exact: true });
      queryClient.removeQueries({ queryKey: searchKeys.all, exact: true });

      router.push(`/profile/${me.user_id}`);
      toast.success(t('toast.success'));
    } catch {
      toast.error(t('toast.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col pt-7.5 web:pt-15 mx-4 web:mx-12.5 mb-35 web:mb-25">
      <div className="w-full web:w-[661px] flex flex-col px-4 web:px-0 web:mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full">
            {/* 아바타 섹션 */}
            <AvatarEditSection imageUrl={me?.image_url ?? ''} onFileChange={handleImageChange} />

            {/* 프로필 편집 섹션 */}
            <ProfileFormFields />

            {/* 계정삭제 섹션 */}
            <AccountDeleteSection />

            <section className="flex justify-between mt-12.5">
              <Button
                onClick={() => router.back()}
                type="button"
                variant="outline"
                className="rounded-[6px] w-30 h-10.5"
              >
                {t('cancel')}
              </Button>
              <Button type="submit" className="rounded-[6px] w-30 h-10.5">
                {isSubmitting ? <Loading /> : t('save')}
              </Button>
            </section>
          </form>
        </Form>
      </div>
    </main>
  );
}
