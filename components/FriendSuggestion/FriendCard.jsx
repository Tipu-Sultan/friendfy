'use client'
import React from 'react';
import { Users } from 'lucide-react';

export default function FriendCard({ name, profilePic, followers }){
  return (
    <div className="min-w-[200px] rounded-xl shadow-md p-4 mx-2 transition-transform hover:scale-105">
      <div className="flex flex-col items-center">
        <img
          src={profilePic}
          alt={`${name}'s profile`}
          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
        />
        <h3 className="mt-3 font-semibold ">{name}</h3>
        <div className="flex items-center mt-2  text-sm">
          <Users size={14} className="mr-1" />
          <span>{followers.toLocaleString()} followers</span>
        </div>
        <button className="mt-3 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-lg transition-colors">
          Follow
        </button>
      </div>
    </div>
  );
}