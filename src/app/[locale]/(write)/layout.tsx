import { PropsWithChildren } from 'react';

const WriteLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col max-w-[724px] mx-auto h-dvh font-pretendard">
      <div className="grow px-4 bg-white overflow-y-auto scrollbar-hide">{children}</div>
    </div>
  );
};

export default WriteLayout;
