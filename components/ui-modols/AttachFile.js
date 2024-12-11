import {FileAudio,FileVideo,Image,FileMinus } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';

const AttachFile = ({showModal,setShowModal}) => {
  return (
    <div>
        {showModal && (
        <div className="absolute bottom-16 left-4 right-4 border shadow-lg rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Attach Media</h3>
          <div className="grid grid-cols-3 gap-4">
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <Image className="w-8 h-8 mb-1" />

              <span className="text-xs">Image</span>
            </button>
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <FileVideo className="w-8 h-8 mb-1" />

              <span className="text-xs">Video</span>
            </button>
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <FileAudio className="w-8 h-8 mb-1" />

              <span className="text-xs">Audio</span>
            </button>
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600">
            <FileMinus className="w-8 h-8 mb-1" />
              <span className="text-xs">Document</span>
            </button>
          </div>
          <Button variant="outline"
            className="w-full mt-4 py-2 rounded-md"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  )
}

export default AttachFile