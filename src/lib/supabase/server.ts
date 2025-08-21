'use server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
/* 
  서버 컴포넌트/서버 액션/route handler 에서 사용
*/
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // global: {
      //   fetch: (url: any, options = {}) => {
      //     return fetch(url, { ...options, cache: 'no-store' });
      //   },
      // },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      db: { schema: 'public' }, // 기본 스키마. en은 쿼리에서 .schema('en')로 지정
    }
  );
}
