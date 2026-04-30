<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Helpers\MessageHelper;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    /**
     * Get all conversations for the authenticated user
     */
    public function conversations()
    {
        $user = auth()->user();

        $conversations = Conversation::where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->with(['user1', 'user2', 'latestMessage.sender'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $otherUser = $conversation->getOtherUser($user->id);
                $latestMessage = $conversation->latestMessage;
                
                return [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'role' => $otherUser->role,
                    ],
                    'latest_message' => $latestMessage ? [
                        'id' => $latestMessage->id,
                        'message' => $latestMessage->message,
                        'sender_id' => $latestMessage->sender_id,
                        'sender_name' => $latestMessage->sender->name,
                        'created_at' => $latestMessage->created_at->toISOString(),
                        'created_at_human' => $latestMessage->created_at->diffForHumans(),
                        'is_read' => $latestMessage->is_read,
                    ] : null,
                    'unread_count' => $conversation->unreadCount($user->id),
                    'last_message_at' => $conversation->last_message_at?->toISOString(),
                    'last_message_at_human' => $conversation->last_message_at?->diffForHumans(),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    /**
     * Get messages for a specific conversation
     */
    public function show(Conversation $conversation)
    {
        $user = auth()->user();

        // Verify user is part of this conversation
        if ($conversation->user1_id != $user->id && $conversation->user2_id != $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this conversation',
            ], 403);
        }

        // Mark all messages as read for current user
        $conversation->messages()
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->each(function ($message) {
                $message->markAsRead();
            });

        $otherUser = $conversation->getOtherUser($user->id);

        $messages = $conversation->messages()->with('sender')->get()->map(function ($message) use ($user) {
            return [
                'id' => $message->id,
                'message' => $message->message,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'is_own' => $message->sender_id == $user->id,
                'sender_name' => $message->sender->name,
                'created_at' => $message->created_at->toISOString(),
                'created_at_human' => $message->created_at->diffForHumans(),
                'is_read' => $message->is_read,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'conversation' => [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'role' => $otherUser->role,
                    ],
                ],
                'messages' => $messages,
            ],
        ]);
    }

    /**
     * Send a new message
     */
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:5000',
            'conversation_id' => 'nullable|exists:conversations,id',
        ]);

        $sender = auth()->user();
        $receiverId = $request->receiver_id;

        // Check if sender can message this receiver
        $receiver = User::findOrFail($receiverId);
        if (!MessageHelper::canMessageUser($sender, $receiver)) {
            return response()->json([
                'success' => false,
                'message' => 'You are not authorized to message this user.',
            ], 403);
        }

        // Find or create conversation
        if ($request->conversation_id) {
            $conversation = Conversation::findOrFail($request->conversation_id);
        } else {
            $conversation = Conversation::firstOrCreate([
                'user1_id' => min($sender->id, $receiverId),
                'user2_id' => max($sender->id, $receiverId),
            ]);
        }

        // Create message
        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'message' => $request->message,
        ]);

        // Update conversation last_message_at
        $conversation->update(['last_message_at' => now()]);

        // Load sender relationship
        $message->load('sender');

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'id' => $message->id,
                'message' => $message->message,
                'sender_id' => $message->sender_id,
                'receiver_id' => $message->receiver_id,
                'is_own' => true,
                'sender_name' => $message->sender->name,
                'created_at' => $message->created_at->toISOString(),
                'created_at_human' => $message->created_at->diffForHumans(),
                'is_read' => $message->is_read,
                'conversation_id' => $conversation->id,
            ],
        ], 201);
    }

    /**
     * Get eligible recipients for new conversation
     */
    public function eligibleRecipients()
    {
        $user = auth()->user();
        
        $recipients = MessageHelper::getEligibleRecipients($user)->map(function ($recipient) {
            return [
                'id' => $recipient->id,
                'name' => $recipient->name,
                'email' => $recipient->email,
                'role' => $recipient->role,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $recipients,
        ]);
    }

    /**
     * Get unread messages count
     */
    public function unreadCount()
    {
        $user = auth()->user();
        $count = MessageHelper::getUnreadCount($user->id);

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count,
            ],
        ]);
    }

    /**
     * Mark conversation as read
     */
    public function markAsRead(Conversation $conversation)
    {
        $user = auth()->user();

        // Verify user is part of this conversation
        if ($conversation->user1_id != $user->id && $conversation->user2_id != $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access to this conversation',
            ], 403);
        }

        $conversation->messages()
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->each(function ($message) {
                $message->markAsRead();
            });

        return response()->json([
            'success' => true,
            'message' => 'Messages marked as read',
        ]);
    }
}
