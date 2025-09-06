'use client';
import { LogFormProvider } from '@/contexts/LogRegisterContext';
import { useLogFormStore } from '@/stores/logFormStore';
import { useLogTagStore } from '@/stores/logTagStore';
import { PropsWithChildren, useEffect } from 'react';

const LogWriteLayout = ({ children }: PropsWithChildren) => {
  const clearFormValues = useLogFormStore((state) => state.clearFormValues);
  const clearTag = useLogTagStore((state) => state.clearTag);
  useEffect(() => {
    return () => {
      clearTag();
      clearFormValues();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LogFormProvider>
      <div className="h-full">{children}</div>
    </LogFormProvider>
  );
};

export default LogWriteLayout;
