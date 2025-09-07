import { compressImageToWebp } from '@/utils/compressImageToWebp';
import { useState } from 'react';

export function useImageCompression() {
  const [isCompressing, setIsCompressing] = useState(false);

  const compressFiles = async (files: File[]) => {
    setIsCompressing(true);
    try {
      const compressedFiles = await Promise.all(files.map((file) => compressImageToWebp(file)));
      return compressedFiles.filter((f) => f !== undefined);
    } finally {
      setIsCompressing(false);
    }
  };

  return { compressFiles, isCompressing };
}
