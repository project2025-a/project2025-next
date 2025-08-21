import { revalidateLog } from '@/app/actions/log';
import { getUser } from '@/app/actions/user';
import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from 'prisma/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');
  const locale = searchParams.get('locale');
  const isEn = locale === 'en';
  const me = await getUser();

  if (!me) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.UNAUTHORIZED,
        errorCode: ERROR_CODES.COMMON.UNAUTHORIZED,
      },
      { status: 401 }
    );
  }

  if (!logId) {
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
    let logBookmark: any = {};

    if (isEn) {
      const dbLogBookmark = await prisma.log_bookmark_en.findFirst({
        where: {
          user_id: me?.user_id,
          log_id: String(logId),
        },
      });
      logBookmark = dbLogBookmark;
    } else {
      const dbLogBookmark = await prisma.log_bookmark.findFirst({
        where: {
          user_id: me?.user_id,
          log_id: String(logId),
        },
      });
      logBookmark = dbLogBookmark;
    }

    return NextResponse.json(
      {
        success: true,
        isBookmark: !!logBookmark,
      },
      { status: 200 }
    );
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.LOG.NOT_FOUND,
        errorCode: ERROR_CODES.LOG.NOT_FOUND,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');
  const locale = searchParams.get('locale');
  const isEn = locale === 'en';

  const me = await getUser();

  if (!me) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.UNAUTHORIZED,
        errorCode: ERROR_CODES.COMMON.UNAUTHORIZED,
      },
      { status: 401 }
    );
  }

  if (!logId) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.BAD_REQUEST,
        errorCode: ERROR_CODES.COMMON.BAD_REQUEST,
      },
      { status: 400 }
    );
  }

  let existing: boolean;

  if (isEn) {
    const dbExisting = await prisma.log_bookmark_en.findFirst({
      where: {
        user_id: me.user_id,
        log_id: String(logId),
      },
    });

    existing = !!dbExisting;
  } else {
    const dbExisting = await prisma.log_bookmark.findFirst({
      where: {
        user_id: me.user_id,
        log_id: String(logId),
      },
    });
    existing = !!dbExisting;
  }

  if (existing) {
    return NextResponse.json({ success: true, isBookmark: true }, { status: 200 });
  }

  try {
    if (isEn) {
      await prisma.log_bookmark_en.create({
        data: {
          user_id: me.user_id,
          log_id: String(logId),
        },
      });
    } else {
      await prisma.log_bookmark.create({
        data: {
          user_id: me.user_id,
          log_id: String(logId),
        },
      });
    }

    /* 북마크 시 로그 서버캐시 무효화(버그 수정) */
    await revalidateLog(logId);

    return NextResponse.json({ success: true, isBookmark: true }, { status: 200 });
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.LOG.NOT_FOUND,
        errorCode: ERROR_CODES.LOG.NOT_FOUND,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const logId = searchParams.get('logId');
  const locale = searchParams.get('locale');
  const isEn = locale === 'en';

  const me = await getUser();

  if (!me) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.UNAUTHORIZED,
        errorCode: ERROR_CODES.COMMON.UNAUTHORIZED,
      },
      { status: 401 }
    );
  }

  if (!logId) {
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
    let deleted: Prisma.BatchPayload;

    if (isEn) {
      const dbDeleted = await prisma.log_bookmark_en.deleteMany({
        where: {
          user_id: me.user_id,
          log_id: String(logId),
        },
      });
      deleted = dbDeleted;
    } else {
      const dbDeleted = await prisma.log_bookmark.deleteMany({
        where: {
          user_id: me.user_id,
          log_id: String(logId),
        },
      });
      deleted = dbDeleted;
    }

    if (deleted.count === 0) {
      return NextResponse.json(
        {
          success: false,
          msg: ERROR_MESSAGES.LOG.NOT_FOUND,
          errorCode: ERROR_CODES.LOG.NOT_FOUND,
        },
        { status: 404 }
      );
    }

    /* 북마크 시 로그 서버캐시 무효화(버그 수정) */
    await revalidateLog(logId);

    return NextResponse.json(
      {
        success: deleted.count > 0,
        isBookmark: false,
      },
      { status: 200 }
    );
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.LOG.CREATE_FAILED,
        errorCode: ERROR_CODES.LOG.CREATE_FAILED,
      },
      { status: 500 }
    );
  }
}
