import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

export default function ChatInput() {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-secondary rounded-full px-4 py-2 focus:outline-none"
        />
        <Button size="icon">
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
