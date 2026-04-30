import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, User, Search, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LatestMessage {
  message: string;
  created_at: string;
  is_read: boolean;
  sender_id: number;
}

interface Conversation {
  id: number;
  other_user: User;
  latest_message: LatestMessage | null;
  unread_count: number;
  last_message_at: string | null;
}

interface Props {
  conversations: Conversation[];
  eligibleRecipients: User[];
  unreadCount: number;
}

export default function MessagesIndex({ conversations, eligibleRecipients, unreadCount }: Props) {
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartConversation = () => {
    if (!selectedRecipient) return;

    router.post('/messages/start', {
      user_id: selectedRecipient,
    });
    setIsDialogOpen(false);
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-500',
      admin: 'bg-blue-500',
      manager: 'bg-green-500',
      pharmacist: 'bg-orange-500',
      procurement_officer: 'bg-gray-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  const getRoleDisplayName = (role: string) => {
    const names: Record<string, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      manager: 'Manager',
      pharmacist: 'Pharmacist',
      procurement_officer: 'Procurement Officer',
    };
    return names[role] || role;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.other_user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppSidebarLayout>
      <Head title="Messages" />

      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread messages` : 'All caught up'}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full h-12 w-12">
                <Edit className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Message</DialogTitle>
                <DialogDescription>
                  Start a conversation with a team member
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">To:</label>
                  <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleRecipients.map((recipient) => (
                        <SelectItem key={recipient.id} value={recipient.id.toString()}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold",
                              getRoleBadgeColor(recipient.role)
                            )}>
                              {recipient.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{recipient.name}</p>
                              <p className="text-xs text-gray-500">
                                {getRoleDisplayName(recipient.role)}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStartConversation}
                  disabled={!selectedRecipient}
                  className="w-full"
                >
                  Start Chat
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="h-20 w-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                {searchQuery 
                  ? 'Try searching for a different name'
                  : 'Start a conversation to communicate with your team members'
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  New Message
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => router.visit(`/messages/${conversation.id}`)}
                >
                  {/* Profile Picture */}
                  <div className="relative">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold",
                      getRoleBadgeColor(conversation.other_user.role)
                    )}>
                      {conversation.other_user.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conversation.other_user.name}
                      </h3>
                      {conversation.latest_message && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatTime(conversation.latest_message.created_at)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        {conversation.latest_message ? (
                          <p className={cn(
                            "text-sm truncate",
                            conversation.unread_count > 0 && !conversation.latest_message.is_read
                              ? "text-gray-900 dark:text-white font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          )}>
                            {conversation.latest_message.message}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
                            No messages yet
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {getRoleDisplayName(conversation.other_user.role)}
                        </p>
                      </div>
                      
                      {conversation.unread_count > 0 && (
                        <div className="ml-2">
                          <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppSidebarLayout>
  );
}
