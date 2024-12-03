import { Card } from '@/components/ui/card';

export default function EmptyChat() {
  return (
    <Card className="h-full flex items-center justify-center">
      <div className="text-center">
        <h3 className="font-semibold text-xl mb-2">Select a chat</h3>
        <p className="text-muted-foreground">
          Choose a conversation from the list to start chatting
        </p>
      </div>
    </Card>
  );
}
