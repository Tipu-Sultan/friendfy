import { useCallback } from 'react';

function useCarouselScroll(scrollRef) {
  return useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = 220; // Card width + margin
      const newScrollPosition =
        scrollRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  }, [scrollRef]);
}

export default useCarouselScroll;
