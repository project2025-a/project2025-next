import ImageWithLoader from '@/components/features/detail-log/ImageWithLoader';
import { cn } from '@/lib/utils';
import { getStoragePublicImage } from '@/utils/getStorageImage';
interface PostCardImageProps {
  imageUrl?: string | null;
  author?: string | null;
  className?: string;
  vertical?: boolean;
}

function PostCardImage({ imageUrl, author, className, vertical }: PostCardImageProps) {
  return (
    <div
      className={cn(
        'relative flex-1 w-full',
        'aspect-[324/218] overflow-hidden mb-1.5 web:mb-2.5',
        vertical && 'aspect-[324/425]',
        className
      )}
    >
      {imageUrl && (
        <>
          <ImageWithLoader
            src={getStoragePublicImage(imageUrl)}
            alt="Post Thumbnail"
            fill
            sizes="(max-width: 768px) 100vw, 324px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 card-id-gradient" />
          <div className="absolute inset-0 transition-colors group-hover:bg-black/25" />
        </>
      )}
      {author && (
        <div className="flex items-center gap-[3px] absolute bottom-0 p-2.5 text-white">
          <span className="text-[11px] font-semibold leading-[130%] tracking-[-0.22px]">
            {author}
          </span>
        </div>
      )}
    </div>
  );
}

export default PostCardImage;
