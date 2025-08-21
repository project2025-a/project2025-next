import { fetchBookmarkedPlaces } from '@/app/actions/place';
import { globalTags } from '@/app/actions/tags';
import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const userId = searchParams.get('userId');
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') ?? '12', 12);
  const locale = searchParams.get('locale') || 'ko';

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        msg: ERROR_MESSAGES.COMMON.UNAUTHORIZED,
        errorCode: ERROR_CODES.COMMON.UNAUTHORIZED,
      },
      { status: 400 }
    );
  }

  try {
    const result = await fetchBookmarkedPlaces({ userId, currentPage, pageSize, locale });

    revalidateTag(globalTags.placeAll);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 404,
      });
    }

    return NextResponse.json(result, { status: result.meta?.httpStatus ?? 200 });
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
