/*data 속성으로 요소를 스크롤  */
export const scrollToElement = (
  selector: string,
  options: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'center',
  }
) => {
  if (typeof window === 'undefined') return; // 브라우저 환경이 아닌 경우 종료
  requestAnimationFrame(() => {
    // DOM 업데이트 후 스크롤처리
    const element = document.querySelector(selector);
    element?.scrollIntoView(options);
  });
};

/* 장소 순서 변경 후 해당 장소로 스크롤하는 유틸 함수 */
export const scrollToPlaceAfterReorder = (globalIdx: number, direction: 'up' | 'down') => {
  console.log('scrollToPlaceAfterReorder', globalIdx, direction);
  const targetIdx = direction === 'up' ? globalIdx - 1 : globalIdx + 1;
  scrollToElement(`[data-place-index="${targetIdx}"]`);
};
