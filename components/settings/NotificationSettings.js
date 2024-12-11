import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

export default function NotificationSettings() {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive notifications when someone interacts with your posts
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive email updates about your account activity
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </Card>
  );
}
