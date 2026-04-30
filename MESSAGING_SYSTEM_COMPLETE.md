# Direct Messaging System Implementation

## Overview
Implemented a hierarchical direct messaging system that allows users to communicate according to organizational structure.

## Messaging Hierarchy Rules

### Communication Flow
- **Pharmacist** ↔ **Manager**
- **Manager** ↔ **Pharmacist** + **Procurement Officer**
- **Procurement Officer** ↔ **Manager** + **Admin/Super Admin**
- **Admin/Super Admin** ↔ **Anyone**

### Restrictions
- Users can only message roles defined in their hierarchy
- Users cannot message themselves
- Admin and Super Admin have unrestricted messaging access

## Backend Implementation

### Database Tables
1. **conversations** - Stores conversation threads between two users
   - `user1_id`, `user2_id` (ordered by ID to prevent duplicates)
   - `last_message_at` for sorting

2. **messages** - Stores individual messages
   - `conversation_id`, `sender_id`, `receiver_id`
   - `message` (text content)
   - `is_read` (boolean flag)

### Models
- **Conversation** (`app/Models/Conversation.php`)
  - Relationships: user1, user2, messages, latestMessage
  - Methods: getOtherUser(), unreadCount()

- **Message** (`app/Models/Message.php`)
  - Relationships: conversation, sender, receiver
  - Methods: markAsRead()

### Helper
- **MessageHelper** (`app/Helpers/MessageHelper.php`)
  - `canMessageUser()` - Validates if sender can message receiver
  - `getEligibleRecipients()` - Returns users the current user can message
  - `getUnreadCount()` - Returns unread message count for a user
  - `getMessagingHierarchy()` - Returns allowed roles for a role

### Controller
- **MessagesController** (`app/Http/Controllers/MessagesController.php`)
  - `index()` - List all conversations with unread counts
  - `show($conversationId)` - Display specific conversation with messages
  - `store()` - Send a new message
  - `startConversation()` - Create new conversation with a user

### Routes
```php
Route::prefix('messages')->name('messages.')->group(function () {
    Route::get('/', [MessagesController::class, 'index']);
    Route::get('/count', function () { ... }); // Unread count API
    Route::post('/start', [MessagesController::class, 'startConversation']);
    Route::post('/', [MessagesController::class, 'store']);
    Route::get('/{conversation}', [MessagesController::class, 'show']);
});
```

## Frontend Implementation

### Pages
1. **messages/index.tsx** - Conversation list page
   - Shows all conversations with latest message preview
   - Displays unread message badges
   - "New Message" dialog to start conversations
   - Only shows eligible recipients based on hierarchy

2. **messages/show.tsx** - Individual conversation page
   - Chat interface with message bubbles
   - Real-time message sending
   - Auto-scroll to latest message
   - Marks messages as read when viewed
   - Enter to send, Shift+Enter for new line

### Components Created
- **Textarea** (`resources/js/components/ui/textarea.tsx`) - Multi-line text input

### Hooks
- **use-message-count.ts** - Fetches and polls unread message count
  - Polls every 30 seconds
  - Refreshes on navigation

### Navigation
- Added "Messages" link to all role navigation configs
- Icon: MessageSquare
- Shows unread badge in sidebar (red dot + count)

### Updated Components
- **nav-main.tsx** - Added message count badge logic
- **navigation.tsx** - Added Messages to all roles (super_admin, admin, manager, pharmacist, procurement_officer)

## Permissions

Added to `config/permissions.php`:
- **super_admin**: `messages.view`, `messages.send`, `messages.send_all`
- **admin**: `messages.view`, `messages.send`, `messages.send_all`
- **manager**: `messages.view`, `messages.send`
- **pharmacist**: `messages.view`, `messages.send`
- **procurement_officer**: `messages.view`, `messages.send`

## Features

### Conversation List
- View all active conversations
- See latest message preview
- Unread message count per conversation
- Start new conversations with eligible users
- Role badges for easy identification

### Chat Interface
- Clean message bubble design
- Own messages on right (blue), received on left (gray)
- Timestamps for each message
- Auto-scroll to latest message
- Keyboard shortcuts (Enter to send)
- Message character limit: 5000

### Security
- Hierarchy validation on backend
- Cannot message unauthorized users
- Cannot access conversations you're not part of
- Toast notifications for errors

### User Experience
- Unread badge in sidebar navigation
- Real-time count updates (30s polling)
- Responsive design
- Empty states with helpful CTAs
- Role-based recipient filtering

## Testing Checklist

- [ ] Pharmacist can message Manager
- [ ] Pharmacist cannot message Procurement Officer or Admin
- [ ] Manager can message Pharmacist and Procurement Officer
- [ ] Manager cannot message Admin directly
- [ ] Procurement Officer can message Manager and Admin/Super Admin
- [ ] Admin/Super Admin can message anyone
- [ ] Unread count updates correctly
- [ ] Messages marked as read when viewed
- [ ] Cannot start duplicate conversations
- [ ] Conversation list sorted by latest message
- [ ] Message sending works correctly
- [ ] Navigation badge shows unread count

## Files Modified/Created

### Backend
- `database/migrations/2026_03_07_105118_create_conversations_table.php`
- `database/migrations/2026_03_07_105224_create_messages_table.php`
- `app/Models/Conversation.php`
- `app/Models/Message.php`
- `app/Helpers/MessageHelper.php`
- `app/Http/Controllers/MessagesController.php`
- `routes/web.php` (added MessagesController import and routes)
- `config/permissions.php` (added message permissions)

### Frontend
- `resources/js/pages/messages/index.tsx`
- `resources/js/pages/messages/show.tsx`
- `resources/js/components/ui/textarea.tsx`
- `resources/js/hooks/use-message-count.ts`
- `resources/js/config/navigation.tsx` (added Messages to all roles)
- `resources/js/components/nav-main.tsx` (added message badge)

## Next Steps (Optional Enhancements)

1. Real-time messaging with WebSockets/Pusher
2. Message search functionality
3. File attachments
4. Message reactions/emojis
5. Typing indicators
6. Message editing/deletion
7. Conversation archiving
8. Group messaging
9. Message notifications via email
10. Read receipts with timestamps
