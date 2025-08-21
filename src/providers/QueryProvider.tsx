'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // 항상 fresh
      gcTime: 5 * 60 * 1000, // 5분 보관
      refetchOnMount: 'always', // CSR 컴포넌트가 마운트될 때마다 무조건 refetch
      refetchOnWindowFocus: true, // 브라우저 탭으로 돌아올 때 데이터가 stale이면 refetch
      refetchOnReconnect: true, // 네트워크가 끊겼다가 다시 연결되면, 데이터가 stale이면 refetch
      retry: 2, // 요청 실패 시 최대 2번 재시도
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
