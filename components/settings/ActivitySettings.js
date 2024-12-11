import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ActivitySettings = () => {
    return (
        <div>
            <Card className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Recent Activity</h3>
                            <p className="text-sm text-muted-foreground">
                                View your recent activity on the platform
                            </p>
                        </div>
                        <Button variant="outline">View Activity</Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium">Search History</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage your recent search history
                            </p>
                        </div>
                        <Button variant="outline">Clear History</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ActivitySettings