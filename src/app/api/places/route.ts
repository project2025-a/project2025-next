import { fetchPlaces } from '@/app/actions/place';
import { globalTags } from '@/app/actions/tags';
import { ERROR_CODES } from '@/constants/errorCode';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentPage = parseInt(searchParams.get('currentPage') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');
  const locale = searchParams.get('locale') || 'ko';

  try {
    const result = await fetchPlaces({ currentPage, pageSize, locale });

    revalidateTag(globalTags.placeAll);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 404,
      });
    }

    return NextResponse.json(result, {
      status: result.meta?.httpStatus ?? 200,
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
