import { useState, useRef, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import { ArrowLeft, Send, User, Phone, Video, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: number;
  message: string;
  sender_id: number;
  is_own: boolean;
  sender_name: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: number;
  other_user: User;
}

interface Props {
  conversation: Conversation;
  messages: Message[];
}

export default function MessagesShow({ conversation, messages }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data, setData, post, processing, reset } = useForm({
    receiver_id: conversation.other_user.id,
    conversation_id: conversation.id,
    message: '',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.message.trim()) return;

    post('/messages', {
      preserveScroll: true,
      onSuccess: () => {
        reset('message');
      },
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentMessage = data.message;
      const newMessage = currentMessage.slice(0, start) + emoji + currentMessage.slice(end);
      
      setData('message', newMessage);
      
      // Set cursor position after the emoji
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setData('message', data.message + emoji);
    }
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
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <AppSidebarLayout>
      <Head title={`Chat with ${conversation.other_user.name}`} />

      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header - WhatsApp style */}
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.visit('/messages')}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            {/* Profile Picture */}
            <div className="relative">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm",
                getRoleBadgeColor(conversation.other_user.role)
              )}>
                {conversation.other_user.name.charAt(0).toUpperCase()}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            
            <div className="flex-1">
              <h1 className="font-semibold text-gray-900 dark:text-white">
                {conversation.other_user.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getRoleDisplayName(conversation.other_user.role)} • Online
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area - WhatsApp style background */}
        <div 
          className="flex-1 overflow-y-auto px-4 py-6 space-y-3"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#f0f2f5'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                No messages yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Start the conversation with {conversation.other_user.name}
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const showDate = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== 
                  new Date(message.created_at).toDateString();
                
                return (
                  <div key={message.id}>
                    {/* Date separator */}
                    {showDate && (
                      <div className="flex justify-center mb-4">
                        <div className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full shadow-sm">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {new Date(message.created_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* Message bubble */}
                    <div
                      className={cn(
                        'flex mb-1',
                        message.is_own ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-2 shadow-sm relative',
                          message.is_own
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {message.message}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <p
                            className={cn(
                              'text-xs',
                              message.is_own
                                ? 'text-primary-foreground/70'
                                : 'text-gray-500 dark:text-gray-400'
                            )}
                          >
                            {formatTime(message.created_at)}
                          </p>
                          {message.is_own && (
                            <div className="flex">
                              <div className={cn(
                                "h-4 w-4 flex items-center justify-center",
                                message.is_read ? "text-blue-400" : "text-primary-foreground/70"
                              )}>
                                <svg viewBox="0 0 16 15" className="h-3 w-3 fill-current">
                                  <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l3.61 3.463c.143.14.361.125.484-.033L10.91 3.879a.366.366 0 0 0-.064-.512z"/>
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area - Modern messaging style */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            {/* Emoji button */}
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            
            {/* Message input */}
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={data.message}
                onChange={(e) => setData('message', e.target.value)}
                placeholder="Type a message..."
                className="min-h-[44px] max-h-[120px] resize-none rounded-3xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            
            {/* Send button */}
            <Button
              type="submit"
              disabled={processing || !data.message.trim()}
              size="icon"
              className={cn(
                "h-11 w-11 rounded-full shrink-0 transition-all duration-200",
                data.message.trim() 
                  ? "bg-primary hover:bg-primary/90 scale-100" 
                  : "bg-gray-300 dark:bg-gray-600 scale-95"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
