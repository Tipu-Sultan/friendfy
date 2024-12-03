import React from 'react';

export default function CarouselButton({ direction, onClick, children }){
  const positionClasses = direction === 'left' 
    ? 'left-0 -translate-x-4' 
    : 'right-0 translate-x-4';

  return (
    <button
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${positionClasses} rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10`}
    >
      {children}
    </button>
  );
}