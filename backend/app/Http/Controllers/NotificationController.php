<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Message;
use App\Models\SystemNotification;

class NotificationController extends Controller
{
    /**
     * Server-Sent Events endpoint for real-time notifications
     */
    public function stream(Request $request)
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        $user = auth()->user();
        if (!$user) {
            return response('Unauthorized', 401);
        }

        // Get initial counts
        $unreadMessages = Message::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->count();

        $notifications = SystemNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $data = [
            'unread_messages' => $unreadMessages,
            'notifications' => $notifications,
            'timestamp' => now()->toISOString()
        ];

        $response->setContent("data: " . json_encode($data) . "\n\n");
        
        return $response;
    }

    /**
     * Get current notification counts
     */
    public function counts(Request $request)
    {
        $user = auth()->user();
        
        $unreadMessages = Message::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->count();

        $notifications = SystemNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'unread_messages' => $unreadMessages,
            'notifications' => $notifications,
            'timestamp' => now()->toISOString()
        ]);
    }

    /**
     * Mark notifications as read
     */
    public function markAsRead(Request $request)
    {
        $user = auth()->user();
        
        SystemNotification::where('user_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}