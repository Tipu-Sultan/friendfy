'use client'
import React from 'react';

export default function CarouselContainer({ children, scrollRef }){
  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto scrollbar-hide scroll-smooth gap-2 pb-4"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {children}
    </div>
  );
}