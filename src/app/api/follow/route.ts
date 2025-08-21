import { globalTags } from '@/app/actions/tags';
import { getUser } from '@/app/actions/user';
import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import prisma from 'prisma/prisma';

/*
  팔로우 관계 설명:

  - 내가 어떤 유저(B)를 팔로우하는 경우:
    follower_id: 나 (로그인한 유저)
    following_id: B (내가 팔로우하는 대상 유저)

  - 어떤 유저(B)가 나를 팔로우하는 경우:
    follower_id: B (팔로우하는 유저)
    following_id: 나 (로그인한 유저)
*/

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const me = await getUser();

  if (!me?.user_id || !userId) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.BAD_REQUEST,
        errorCode: ERROR_CODES.COMMON.BAD_REQUEST,
      },
      { status: 400 }
    );
  }

  try {
    const follow = await prisma.follow.findFirst({
      where: {
        follower_id: me.user_id,
        following_id: userId,
      },
    });

    return NextResponse.json({
      success: true,
      isFollowing: !!follow,
    });
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.INTERNAL_SERVER_ERROR,
        errorCode: ERROR_CODES.COMMON.INTERNAL_SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const me = await getUser();

  if (!me?.user_id || !userId) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.BAD_REQUEST,
        errorCode: ERROR_CODES.COMMON.BAD_REQUEST,
      },
      { status: 400 }
    );
  }

  if (me.user_id === userId) {
    return NextResponse.json(
      {
        success: false,
        msg: '자기 자신을 팔로우할 수 없습니다.',
        errorCode: ERROR_CODES.FOLLOW.CREATE_FAILED,
      },
      { status: 400 }
    );
  }

  try {
    /* 중복체크 */
    const alreadyFollowed = await prisma.follow.findFirst({
      where: {
        follower_id: me.user_id,
        following_id: userId,
      },
    });

    if (alreadyFollowed) {
      return NextResponse.json(
        {
          success: false,
          msg: '이미 팔로우한 유저입니다.',
          errorCode: ERROR_CODES.FOLLOW.CREATE_FAILED,
        },
        { status: 409 }
      );
    }

    /* 팔로우 등록 */
    await prisma.follow.create({
      data: {
        follower_id: me?.user_id,
        following_id: userId,
      },
    });

    revalidateTag(globalTags.userAll);

    return NextResponse.json({ success: true, isFollowing: true }, { status: 200 });
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.FOLLOW.CREATE_FAILED,
        errorCode: ERROR_CODES.FOLLOW.CREATE_FAILED,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get('userId');
  const me = await getUser();

  if (!me?.user_id || !targetUserId) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.BAD_REQUEST,
        errorCode: ERROR_CODES.COMMON.BAD_REQUEST,
      },
      { status: 400 }
    );
  }

  if (me.user_id === targetUserId) {
    return NextResponse.json(
      { success: false, msg: '자기 자신은 언팔로우할 수 없습니다.' },
      { status: 400 }
    );
  }

  try {
    const deleted = await prisma.follow.deleteMany({
      where: {
        follower_id: me.user_id,
        following_id: targetUserId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ success: false, msg: '팔로우 상태가 아닙니다.' }, { status: 404 });
    }

    revalidateTag(globalTags.userAll);

    return NextResponse.json({ success: true, isFollowing: false });
  } catch (error) {
    console.error('언팔로우 실패:', error);
    return NextResponse.json({ success: false, msg: '서버 오류로 언팔로우 실패' }, { status: 500 });
  }
}
