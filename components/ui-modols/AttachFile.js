import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileAudio, FileVideo, Image, FileMinus } from "lucide-react";

const AttachFile = ({ showModal, setShowModal }) => {
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-gray-700">
            Attach Media
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 text-center">
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
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttachFile;