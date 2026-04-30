import React, { useEffect, useState, useRef } from 'react';
import { MessageAPI } from '../lib/api';
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  X,
  Check,
  CheckCheck,
  User as UserIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

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
  receiver_id: number;
  is_own: boolean;
  sender_name: string;
  created_at: string;
  created_at_human: string;
  is_read: boolean;
}

interface Conversation {
  id: number;
  other_user: User;
  latest_message: {
    id: number;
    message: string;
    sender_id: number;
    sender_name: string;
    created_at: string;
    created_at_human: string;
    is_read: boolean;
  } | null;
  unread_count: number;
  last_message_at: string;
  last_message_at_human: string;
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [eligibleRecipients, setEligibleRecipients] = useState<User[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
    fetchEligibleRecipients();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await MessageAPI.getConversations();
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEligibleRecipients = async () => {
    try {
      const response = await MessageAPI.getEligibleRecipients();
      if (response.data.success) {
        setEligibleRecipients(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch recipients:', error);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await MessageAPI.getConversation(conversationId);
      if (response.data.success) {
        setMessages(response.data.data.messages);
        // Update conversation to mark as read
        setConversations(prev =>
          prev.map(conv =>
            conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowNewConversation(false);
    fetchMessages(conversation.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const receiverId = selectedConversation
      ? selectedConversation.other_user.id
      : selectedRecipient?.id;

    if (!receiverId) return;

    try {
      setIsSending(true);
      const response = await MessageAPI.sendMessage({
        receiver_id: receiverId,
        message: newMessage,
        conversation_id: selectedConversation?.id,
      });

      if (response.data.success) {
        const sentMessage = response.data.data;
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');

        // If it's a new conversation, fetch conversations to update the list
        if (!selectedConversation) {
          await fetchConversations();
          // Find and select the new conversation
          const newConv = conversations.find(
            c => c.other_user.id === receiverId
          );
          if (newConv) {
            setSelectedConversation(newConv);
            setShowNewConversation(false);
          }
        } else {
          // Update the conversation list
          fetchConversations();
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleStartNewConversation = () => {
    setShowNewConversation(true);
    setSelectedConversation(null);
    setMessages([]);
    setSelectedRecipient(null);
  };

  const handleSelectRecipient = (recipient: User) => {
    setSelectedRecipient(recipient);
    // Check if conversation already exists
    const existingConv = conversations.find(
      c => c.other_user.id === recipient.id
    );
    if (existingConv) {
      handleSelectConversation(existingConv);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.other_user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRecipients = eligibleRecipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Messages"
        subtitle="Loading messages..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Messages"
      subtitle="Internal communication system"
      showSearch={false}
    >
      <Card className="h-[calc(100vh-12rem)]">
        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-80 border-r flex flex-col">
              <div className="p-4 border-b space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Conversations</h3>
                  <Button size="sm" onClick={handleStartNewConversation}>
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {showNewConversation ? (
                  <div className="p-2">
                    <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                      Select a recipient
                    </div>
                    {filteredRecipients.map((recipient) => (
                      <button
                        key={recipient.id}
                        onClick={() => handleSelectRecipient(recipient)}
                        className={`w-full text-left p-3 hover:bg-muted/50 transition-colors rounded-lg ${
                          selectedRecipient?.id === recipient.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <UserIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{recipient.name}</div>
                            <div className="text-xs text-muted-foreground truncate capitalize">
                              {recipient.role.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <Button size="sm" onClick={handleStartNewConversation} className="mt-4">
                      Start a conversation
                    </Button>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className={`w-full text-left p-3 hover:bg-muted/50 transition-colors rounded-lg ${
                          selectedConversation?.id === conversation.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                            <UserIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-medium text-sm truncate">
                                {conversation.other_user.name}
                              </div>
                              {conversation.unread_count > 0 && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                                  {conversation.unread_count}
                                </span>
                              )}
                            </div>
                            {conversation.latest_message && (
                              <div className="text-xs text-muted-foreground truncate">
                                {conversation.latest_message.message}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground mt-1">
                              {conversation.last_message_at_human}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation || selectedRecipient ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {selectedConversation?.other_user.name || selectedRecipient?.name}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {(selectedConversation?.other_user.role || selectedRecipient?.role)?.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    {showNewConversation && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowNewConversation(false);
                          setSelectedRecipient(null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">No messages yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.is_own ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.is_own
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {!message.is_own && (
                              <div className="text-xs font-semibold mb-1">{message.sender_name}</div>
                            )}
                            <div className="text-sm whitespace-pre-wrap break-words">{message.message}</div>
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                              message.is_own ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`}>
                              <span>{message.created_at_human}</span>
                              {message.is_own && (
                                message.is_read ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 border-t">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 min-h-[80px] max-h-[200px] px-3 py-2 border border-input rounded-md bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={isSending}
                      />
                      <Button type="submit" disabled={isSending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a conversation from the list or start a new one
                    </p>
                    <Button onClick={handleStartNewConversation}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Conversation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Messages;
