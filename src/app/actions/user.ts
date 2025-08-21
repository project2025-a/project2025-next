'use server';

import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { createClient } from '@/lib/supabase/server';
import { PublicUser } from '@/types/api/user';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidateTag, unstable_cache } from 'next/cache';
import prisma from 'prisma/prisma';
import { userKeys } from './keys';
import { deleteAllFilesRecursively, deleteProfileStorageFolder } from './storage';
import { cacheTags, globalTags } from './tags';

interface PatchUserProps {
  userId: string;
  nickname?: string | null;
  image_url?: string | null;
  insta_id?: string | null;
  description?: string | null;
}

export async function revalidateUsers() {
  revalidateTag(globalTags.userAll);
}

// ===================================================================
// AUTH / 소셜로그인
// ===================================================================
/* 로그인 유저의 수파베이스 정보 가져오기 */
export async function fetchUserSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

async function fetchUserPrisma(userId: string) {
  try {
    const user = await prisma.public_users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        nickname: true,
        image_url: true,
        insta_id: true,
        description: true,
      },
    });

    if (!user) return null;

    const [followerCount, followingCount] = await Promise.all([
      prisma.follow.count({
        where: {
          following_id: userId,
        },
      }),
      prisma.follow.count({
        where: {
          follower_id: userId,
        },
      }),
    ]);

    return {
      ...user,
      followerCount,
      followingCount,
    };
  } catch (error) {
    console.error(`로그인 유저 조회 실패 (${userId})`, error);
    return null;
  }
}

const cacheUser = unstable_cache(
  async (userId: string) => {
    //console.log('캐시 제대로 되나', userId);
    return await fetchUserPrisma(userId);
  },
  [...userKeys.me()],
  {
    tags: [cacheTags.me(), globalTags.userAll],
    revalidate: 300,
  }
);

export async function getUser() {
  const userId = await fetchUserSupabase();
  if (!userId) return null;
  return cacheUser(userId); // 캐싱된 결과 반환
}

// ===================================================================
// 퍼블릭 유저 정보 가져오기
// ===================================================================
export async function fetchPublicUser(userId: string): Promise<PublicUser | null> {
  try {
    const user = await prisma.public_users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        nickname: true,
        image_url: true,
        insta_id: true,
        description: true,
      },
    });

    if (!user) return null;

    /* 팔로워 수: 나를 팔로우하는 사람 수 */
    const followerCount = await prisma.follow.count({
      where: {
        following_id: userId,
      },
    });

    /* 팔로잉 수: 내가 팔로우하는 사람 수 */
    const followingCount = await prisma.follow.count({
      where: {
        follower_id: userId,
      },
    });

    return {
      ...user,
      followerCount,
      followingCount,
    };
  } catch (error) {
    console.error(`퍼블릭 유저 조회 실패 (${userId})`, error);
    return null;
  }
}

export async function getPublicUser(userId: string) {
  return unstable_cache(() => fetchPublicUser(userId), [...userKeys.publicUser(userId)], {
    tags: [cacheTags.publicUser(userId), globalTags.userAll],
    revalidate: 300,
  })();
}

//----------------------------------------------------서버액션--------------------------------------

// ===================================================================
// 유저 정보 수정
// ===================================================================
export async function patchUser({
  userId,
  nickname,
  image_url,
  insta_id,
  description,
}: PatchUserProps) {
  try {
    // undefined로 전달된 필드는 무시되어, 해당 컬럼은 db로 전송되지 않아 수정되지 않음
    const updated = await prisma.public_users.update({
      where: { user_id: userId },
      data: {
        nickname,
        image_url,
        insta_id,
        description,
      },
    });

    /* 캐시 무효화 */
    const tagsToInvalidate = [
      globalTags.userAll,
      globalTags.logAll,
      globalTags.placeAll,
      globalTags.searchAll,
    ];
    tagsToInvalidate.forEach(revalidateTag);

    return updated;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      console.warn(`유저 수정 실패: 유저가 존재하지 않음 (${userId})`);
      return null;
    }
    throw error;
  }
}

// ===================================================================
// 유저 삭제
// ===================================================================
export async function deleteUser() {
  const me = await getUser();
  if (!me) {
    return { success: false, msg: ERROR_MESSAGES.COMMON.UNAUTHORIZED };
  }
  try {
    // 유저 삭제 전, 이미지 폴더 삭제
    await Promise.allSettled([
      deleteAllFilesRecursively(me.user_id, 'places'),
      deleteAllFilesRecursively(me.user_id, 'thumbnails'),
    ]);

    /* 프로필 이미지 삭제 */
    if (me.image_url && me.image_url.includes('profiles')) {
      await deleteProfileStorageFolder(me.image_url);
    }

    /* 유저 데이터 삭제 */
    await prisma.auth_users.delete({
      where: {
        id: me.user_id,
      },
    });
    /* 캐시 무효화 */
    Object.values(globalTags).forEach(revalidateTag);

    return { success: true, msg: ERROR_MESSAGES.USER.DELETE_SUCCESS };
  } catch (error) {
    console.error('유저 삭제 오류', error);
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      // 이미 삭제되었거나 존재하지 않는 유저는 조용히 처리
      return;
    }
    return {
      success: false,
      msg: ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
    };
  }
}

// ===================================================================
// 로그아웃
// ===================================================================
export async function logout() {
  const supabase = await createClient();

  try {
    await supabase.auth.signOut();
    // 서버 캐시 무효화
    revalidateTag(cacheTags.me());
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}
