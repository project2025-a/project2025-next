/* 이미지 압축 + webp 변환*/
import imageCompression, { Options } from 'browser-image-compression';
import heic2any from 'heic2any';

// heic → jpeg 변환
export async function convertHeicToJPEG(file: File): Promise<File> {
  const convertedBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.8,
  });

  return new File([convertedBlob as Blob], file.name.replace(/\.heic$/i, '.jpeg'), {
    type: 'image/jpeg',
  });
}

export async function compressImageToWebp(
  file: File,
  options?: Partial<Options>
): Promise<File | undefined> {
  const defaultOptions: Partial<Options> = {
    maxSizeMB: 3,
    useWebWorker: true,
    fileType: 'image/webp',
    maxWidthOrHeight: 1600,
    ...options,
  };

  try {
    // 변환 + 압축
    if (file.type === 'image/heic' || file.name.endsWith('.heic')) {
      // console.log('원본', returnFileSize(file.size), file.type);

      // 1. HEIC → JPEG 변환
      const jpegFile = await convertHeicToJPEG(file);
      // console.log('변환된 JPEG', returnFileSize(jpegFile.size), jpegFile.type);

      // 2. 변환된 JPEG 파일 압축
      return await imageCompression(jpegFile, defaultOptions);
    }
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
  }
}
