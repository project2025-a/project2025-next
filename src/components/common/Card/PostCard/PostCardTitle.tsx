import { cn } from '@/lib/utils';

interface PostCardTitleProps {
  className?: string;
  title: string | null;
  modal?: boolean;
}

function PostCardTitle({ className, title, modal }: PostCardTitleProps) {
  return (
    <h3
      className={cn(
        'font-bold text-black text-[17px] truncate',
        modal && '!text-text-xs',
        className
      )}
    >
      {title ?? ''}
    </h3>
  );
}

export default PostCardTitle;
