'use client'
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FriendCard from './FriendCard';
import CarouselButton from './CarouselButton';
import CarouselContainer from './CarouselContainer';
import useCarouselScroll from './useCarouselScroll';
import { SUGGESTED_FRIENDS } from './data';

 function  FriendsCarousel(){
  const scrollContainerRef = useRef(null);
  const handleScroll = useCarouselScroll(scrollContainerRef);

  return (
    <div className="relative mx-auto px-4 py-6">      
      <div className="relative group">
        <CarouselButton direction="left" onClick={() => handleScroll('left')}>
          <ChevronLeft size={20} />
        </CarouselButton>

        <CarouselContainer scrollRef={scrollContainerRef}>
          {SUGGESTED_FRIENDS.map((friend) => (
            <FriendCard key={friend.id} {...friend} />
          ))}
        </CarouselContainer>

        <CarouselButton direction="right" onClick={() => handleScroll('right')}>
          <ChevronRight size={20} />
        </CarouselButton>
      </div>
    </div>
  );
}

export default FriendsCarousel