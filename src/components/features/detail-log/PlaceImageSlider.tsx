'use client';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/supabase';
import { getStoragePublicImage } from '@/utils/getStorageImage';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FreeMode, Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ImageWithLoader from './ImageWithLoader';

interface PlaceImageSliderProps {
  placeImages: Tables<'place_images'>[];
}

const downloadImage = async (imagePath: string) => {
  try {
    const supabase = createClient();
    const downloadPath = imagePath.replace('places/', ''); // 접두사 제거
    const { data, error } = await supabase.storage.from('places').download(downloadPath); // blob

    if (error || !data) {
      toast.error('이미지 다운로드 실패');
      return;
    }
    const extension = data.type.split('/')[1] || 'jpg';

    const blobURL = URL.createObjectURL(data); // url을 파일 위치처럼 인식
    const link = document.createElement('a'); // 가짜 태그
    link.href = blobURL;
    link.download = `image_${Date.now()}.${extension}`; // 다운로드 파일명

    link.click(); // 클릭

    URL.revokeObjectURL(blobURL); // 메모리 해제
  } catch (err) {
    console.error('이미지 다운로드 실패', err);
  }
};

const PlaceImageSlider = ({ placeImages }: PlaceImageSliderProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleImageClick = (imagePath: string, index: number) => {
    setSelectedImage(imagePath);
    setSelectedImageIndex(index);
  };

  return (
    <>
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        freeMode
        mousewheel={{ forceToAxis: true }}
        spaceBetween={15}
        className="w-full cursor-pointer"
      >
        {placeImages.map((img, index) => (
          <SwiperSlide
            key={img.place_image_id}
            className="w-[40vw] max-w-[300px] aspect-[3/4] relative"
            onClick={() => handleImageClick(img.image_path, index)}
          >
            <ImageWithLoader
              src={getStoragePublicImage(img.image_path as string)}
              alt="장소 이미지"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 600px"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent
          className="bg-transparent p-0 flex justify-center items-center border-0 min-w-[100vw] max-w-[90vw] h-full shadow-none"
          showCloseButton={false}
          overlayClassName="bg-black"
        >
          <DialogTitle className="hidden">이미지 상세보기</DialogTitle>
          <Swiper
            modules={[Navigation]}
            initialSlide={selectedImageIndex}
            className="w-full h-full"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {placeImages.map((img) => (
              <SwiperSlide key={img.place_image_id} className="flex items-center justify-center">
                <ImageWithLoader
                  src={getStoragePublicImage(img.image_path as string)}
                  alt="장소 이미지"
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="fixed left-[20px] top-1/2 -translate-y-1/2 z-[9999] text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={swiperRef.current?.isBeginning}
          >
            <ChevronLeft className="w-10 h-10 stroke-white" strokeWidth={1} />
          </button>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="fixed right-[20px] top-1/2 -translate-y-1/2 z-[9999] text-white hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={swiperRef.current?.isEnd}
          >
            <ChevronRight className="w-10 h-10 stroke-white" strokeWidth={1} />
          </button>
          <button
            onClick={() => downloadImage(placeImages[selectedImageIndex].image_path)}
            className="fixed top-[15px] right-[80px] z-[9999] text-white hover:scale-110 transition-transform"
            aria-label="이미지 다운로드"
          >
            <Download className="w-6 h-6" strokeWidth={1} />
          </button>
          <DialogClose asChild>
            <button
              className="fixed top-[15px] right-[25px] font-medium font-pretendard !text-text-sm text-light-300 z-100"
              aria-label="닫기"
            >
              닫기
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaceImageSlider;
