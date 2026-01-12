import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ExternalLink,
  Book,
  MessageCircle,
  Bug,
  Lightbulb,
  Github,
} from 'lucide-react';

export function SupportSettings() {
  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      'Support request will be submitted when backend integration is complete!',
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Get help from our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitSupport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail..."
                rows={6}
              />
            </div>

            <Button type="submit">
              <MessageCircle className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentation</CardTitle>
          <CardDescription>Learn how to use NexusFS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Getting Started Guide
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                User Documentation
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                API Reference
              </span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Check the status of NexusFS services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-mac-medium">All Systems Operational</p>
              <p className="text-sm text-muted-foreground">
                Last checked: 2 minutes ago
              </p>
            </div>
            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          </div>
          <Button variant="link" className="mt-3 p-0">
            View Status Page
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback & Suggestions</CardTitle>
          <CardDescription>Help us improve NexusFS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Bug className="h-4 w-4 mr-2" />
            Report a Bug
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Lightbulb className="h-4 w-4 mr-2" />
            Request a Feature
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community</CardTitle>
          <CardDescription>Join our community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub Repository
            </span>
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Community Forum
            </span>
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
