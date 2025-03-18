import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from "react-redux";
import { reportPost } from "@/redux/slices/postSlice";

const ReportModal = ({ showModal, postId, setShowModal }) => {
  const dispatch = useDispatch();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [reportMsg, setReportMsg] = useState(null);
  const [isloading, setIsloading] = useState(false);



  const handleSubmit = async () => {
    if (!reason) return alert("Please select a reason!");
  
    try {
      setIsloading(true)
      const res = await dispatch(reportPost({ postId, reason, details })).unwrap();
      setReportMsg(res?.message); // Now it properly updates the state
      setIsloading(false)
    } catch (error) {
      console.error("Report submission failed:", error);
    }
  };
  

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent aria-describedby={true} className="p-5 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Report Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium  mb-1">Reason</label>
            <Select onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Spam">Spam</SelectItem>
                <SelectItem value="Harassment">Harassment</SelectItem>
                <SelectItem value="Hate Speech">Hate Speech</SelectItem>
                <SelectItem value="Violence">Violence</SelectItem>
                <SelectItem value="Misinformation">Misinformation</SelectItem>
                <SelectItem value="Nudity">Nudity</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Additional Details (Optional)
            </label>
            <Textarea
              placeholder="Provide more information..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <p className="text-sm ">{reportMsg && reportMsg}</p>
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!reason || isloading}>
            {isloading?"Please Wait...":"Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
