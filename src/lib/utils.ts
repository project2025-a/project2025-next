import { ILocale } from '@/app/actions/log-register';
import { StorageBucket } from '@/types/api/storage';
import { QueryClient } from '@tanstack/react-query';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from './supabase/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* 쿼리키에서 배열 요소를 전부 string으로 안전하게 변환 */
export function stringifyQueryKey(key: readonly (string | number | undefined)[]) {
  return key.map((k) =>
    typeof k === 'string' ? `s:${k}` : typeof k === 'number' ? `n:${k}` : 'u:'
  );
}

export function setLocaleTable(base: string, locale: ILocale) {
  return locale === 'en' ? `${base}_en` : base;
}

export function getSchema(locale: ILocale) {
  return locale === 'en' ? 'en' : 'public';
}

/* URLSearchParams로 변환해 API 요청용 쿼리스트링(query string) 으로 만들어주는 유틸 함수 */
export function toQueryString(params: Record<string, any>): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

export function getQueryClient() {
  return new QueryClient();
}

// ===================================================================
// storage 관련
// ===================================================================

/* 기존 이미지 삭제 */
export async function removeImageIfNeeded(url: string, bucket: StorageBucket) {
  const publicPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;

  let relativePath: string;

  if (url.startsWith(publicPrefix)) {
    // 절대 URL인 경우 prefix 제거
    relativePath = url.replace(publicPrefix, '');
    if (relativePath.startsWith(`${bucket}/`)) {
      relativePath = relativePath.replace(`${bucket}/`, '');
    }
  } else {
    // 상대 경로일 경우 그대로 사용
    relativePath = url;
  }
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([relativePath]);

  if (error) {
    console.warn('기존 이미지 삭제 실패:', error.message);
  } else {
    console.log('기존 이미지 삭제 성공:', relativePath);
  }
}

/* getSignedUploadUrl한테 받은 서명 URL로 fetch 업로드 */
export async function uploadToSignedUrl(
  signedUrl: string,
  contentType: string,
  file: Blob
): Promise<boolean> {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });

  return res.ok;
}

/* 숫자를 K(천), M(백만) 단위로 축약하여 표시하는 함수 */
export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
}

/* 쿼리키에서 undefined나 null 제거하는 함수 */
export function safeKey(...args: (string | number | undefined | null)[]) {
  return args
    .filter((v): v is string | number => v !== undefined && v !== null)
    .map((v) => String(v));
}
