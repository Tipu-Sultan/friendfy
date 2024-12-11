import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function ProfileSettings({ loading, handleSave }) {
  return (
    <Card className="p-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
            <Button variant="outline">Change Photo</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="johndoe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" defaultValue="+1234567890" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              className="w-full min-h-[100px] p-3 rounded-md border bg-background"
              defaultValue="Software developer and tech enthusiast."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button type="submit" disabled={loading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
