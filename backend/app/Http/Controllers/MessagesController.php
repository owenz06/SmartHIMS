<?php

namespace App\Http\Controllers;

use App\Helpers\MessageHelper;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessagesController extends Controller
{
    /**
     * Display list of conversations
     */
    public function index()
    {
        $user = auth()->user();

        // Get all conversations for this user
        $conversations = Conversation::where('user1_id', $user->id)
            ->orWhere('user2_id', $user->id)
            ->with(['user1', 'user2', 'latestMessage'])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $otherUser = $conversation->getOtherUser($user->id);
                return [
                    'id' => $conversation->id,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'role' => $otherUser->role,
                    ],
                    'latest_message' => $conversation->latestMessage ? [
                        'message' => $conversation->latestMessage->message,
                        'created_at' => $conversation->latestMessage->created_at->diffForHumans(),
                        'is_read' => $conversation->latestMessage->is_read,
                        'sender_id' => $conversation->latestMessage->sender_id,
                    ] : null,
                    'unread_count' => $conversation->unreadCount($user->id),
                    'last_message_at' => $conversation->last_message_at?->diffForHumans(),
                ];
            });

        // Get eligible recipients for new conversation
        $eligibleRecipients = MessageHelper::getEligibleRecipients($user)->map(function ($recipient) {
            return [
                'id' => $recipient->id,
                'name' => $recipient->name,
                'email' => $recipient->email,
                'role' => $recipient->role,
            ];
        });

        return Inertia::render('messages/index', [
            'conversations' => $conversations,
            'eligibleRecipients' => $eligibleRecipients,
            'unreadCount' => MessageHelper::getUnreadCount($user->id),
        ]);
    }

    /**
     * Display a specific conversation
     */
    public function show($conversationId)
    {
        $user = auth()->user();

        $conversation = Conversation::with(['user1', 'user2', 'messages.sender'])
            ->findOrFail($conversationId);

        // Verify user is part of this conversation
        if ($conversation->user1_id != $user->id && $conversation->user2_id != $user->id) {
            abort(403, 'Unauthorized access to this conversation');
        }

        // Mark all messages as read for current user
        $conversation->messages()
            ->where('receiver_id', $user->id)
            ->where('is_read', false)
            ->each(function ($message) {
                $message->markAsRead();
            });

        $otherUser = $conversation->getOtherUser($user->id);

        $messages = $conversation->messages->map(function ($message) use ($user) {
            return [
                'id' => $message->id,
                'message' => $message->message,
                'sender_id' => $message->sender_id,
                'is_own' => $message->sender_id == $user->id,
                'sender_name' => $message->sender->name,
                'created_at' => $message->created_at->format('M d, Y h:i A'),
                'is_read' => $message->is_read,
            ];
        });

        return Inertia::render('messages/show', [
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
        $receiver = \App\Models\User::findOrFail($receiverId);
        if (!MessageHelper::canMessageUser($sender, $receiver)) {
            return back()->with('error', 'You are not authorized to message this user.');
        }

        // Find or create conversation
        if ($request->conversation_id) {
            $conversation = Conversation::findOrFail($request->conversation_id);
        } else {
            $conversation = Conversation::firstOrCreate(
                [
                    'user1_id' => min($sender->id, $receiverId),
                    'user2_id' => max($sender->id, $receiverId),
                ]
            );
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

        return back()->with('success', 'Message sent successfully');
    }

    /**
     * Start a new conversation with a user
     */
    public function startConversation(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $currentUser = auth()->user();
        $otherUserId = $request->user_id;

        // Check if user can message this person
        $otherUser = \App\Models\User::findOrFail($otherUserId);
        if (!MessageHelper::canMessageUser($currentUser, $otherUser)) {
            return back()->with('error', 'You are not authorized to message this user.');
        }

        // Find or create conversation
        $conversation = Conversation::where(function ($query) use ($currentUser, $otherUserId) {
            $query->where('user1_id', min($currentUser->id, $otherUserId))
                  ->where('user2_id', max($currentUser->id, $otherUserId));
        })->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user1_id' => min($currentUser->id, $otherUserId),
                'user2_id' => max($currentUser->id, $otherUserId),
            ]);
        }

        return redirect()->route('messages.show', $conversation->id);
    }
}
