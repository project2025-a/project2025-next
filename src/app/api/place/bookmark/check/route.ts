import { revalidateLog } from '@/app/actions/log';
import { getUser } from '@/app/actions/user';
import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma from 'prisma/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get('placeId');
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

  if (!placeId) {
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
    let placeBookmark: boolean;

    if (isEn) {
      const dbPlaceBookmark = await prisma.place_bookmark_en.findFirst({
        where: {
          user_id: me?.user_id,
          place_id: String(placeId),
        },
      });
      placeBookmark = !!dbPlaceBookmark;
    } else {
      const dbPlaceBookmark = await prisma.place_bookmark.findFirst({
        where: {
          user_id: me?.user_id,
          place_id: String(placeId),
        },
      });
      placeBookmark = !!dbPlaceBookmark;
    }

    return NextResponse.json(
      {
        success: true,
        isBookmark: placeBookmark,
      },
      { status: 200 }
    );
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
  const placeId = searchParams.get('placeId');
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

  if (!placeId) {
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
    let existing: boolean;

    if (isEn) {
      const dbExisting = await prisma.place_bookmark_en.findFirst({
        where: {
          user_id: me.user_id,
          place_id: String(placeId),
        },
      });
      existing = !!dbExisting;
    } else {
      const dbExisting = await prisma.place_bookmark.findFirst({
        where: {
          user_id: me.user_id,
          place_id: String(placeId),
        },
      });
      existing = !!dbExisting;
    }

    if (existing) {
      return NextResponse.json({ success: true, isBookmark: true }, { status: 200 });
    }

    if (isEn) {
      await prisma.place_bookmark_en.create({
        data: {
          user_id: me.user_id,
          place_id: String(placeId),
        },
      });
    } else {
      await prisma.place_bookmark.create({
        data: {
          user_id: me.user_id,
          place_id: String(placeId),
        },
      });
    }

    // 북마크 후 관련 로그 서버 캐시 무효화(카운트 낙관적 업데이트 후 북마크 카운트 관련 버그 수정: ssr, csr 캐시 불일치)
    let relatedPlace: any = {};
    if (isEn) {
      const dbRelatedPlace = await prisma.place_en.findUnique({
        where: { place_id: String(placeId) },
        select: { log_id: true },
      });
      relatedPlace = dbRelatedPlace;
    } else {
      const dbRelatedPlace = await prisma.place.findUnique({
        where: { place_id: String(placeId) },
        select: { log_id: true },
      });
      relatedPlace = dbRelatedPlace;
    }

    if (relatedPlace?.log_id) {
      await revalidateLog(relatedPlace.log_id);
    }

    return NextResponse.json({ success: true, isBookmark: true }, { status: 200 });
  } catch (_error) {
    console.error(_error);
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.PLACE.CREATE_FAILED,
        errorCode: ERROR_CODES.PLACE.CREATE_FAILED,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get('placeId');
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

  if (!placeId) {
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
      const dbDeleted = await prisma.place_bookmark_en.deleteMany({
        where: {
          user_id: me.user_id,
          place_id: String(placeId),
        },
      });
      deleted = dbDeleted;
    } else {
      const dbDeleted = await prisma.place_bookmark.deleteMany({
        where: {
          user_id: me.user_id,
          place_id: String(placeId),
        },
      });
      deleted = dbDeleted;
    }

    // 북마크 후 관련 로그 서버 캐시 무효화(카운트 낙관적 업데이트 후 북마크 카운트 관련 버그 수정: ssr, csr 캐시 불일치)
    let relatedPlace: any = {};
    if (isEn) {
      const dbRelatedPlace = await prisma.place_en.findUnique({
        where: { place_id: String(placeId) },
        select: { log_id: true },
      });
      relatedPlace = dbRelatedPlace;
    } else {
      const dbRelatedPlace = await prisma.place.findUnique({
        where: { place_id: String(placeId) },
        select: { log_id: true },
      });
      relatedPlace = dbRelatedPlace;
    }

    if (relatedPlace?.log_id) {
      await revalidateLog(relatedPlace.log_id);
    }

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
        msg: ERROR_MESSAGES.PLACE.DELETE_FAILED,
        errorCode: ERROR_CODES.PLACE.DELETE_FAILED,
      },
      { status: 500 }
    );
  }
}
