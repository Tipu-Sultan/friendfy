import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

export default function PrivacySettings() {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Profile Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Control who can see your profile
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline">Enable</Button>
        </div>
      </div>
    </Card>
  );
}
