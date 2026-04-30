<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SystemNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        $query = SystemNotification::query()
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('target_role', $user->role)
                  ->orWhereNull('target_role');
            });

        // Filter by read status
        if ($request->filled('is_read')) {
            $query->where('is_read', $request->boolean('is_read'));
        }

        $perPage = (int) $request->get('per_page', 25);

        $notifications = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $notifications->items(),
            'total' => $notifications->total(),
            'unread_count' => SystemNotification::where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('target_role', $user->role)
                  ->orWhereNull('target_role');
            })->where('is_read', false)->count(),
            'current_page' => $notifications->currentPage(),
            'per_page' => $notifications->perPage(),
            'last_page' => $notifications->lastPage(),
        ]);
    }

    /**
     * Get unread notifications count
     */
    public function unreadCount()
    {
        $user = auth()->user();

        $count = SystemNotification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere('target_role', $user->role)
              ->orWhereNull('target_role');
        })->where('is_read', false)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'unread_count' => $count,
            ],
        ]);
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(SystemNotification $notification)
    {
        $user = auth()->user();

        // Verify user can access this notification
        if ($notification->user_id && $notification->user_id != $user->id) {
            if ($notification->target_role != $user->role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this notification',
                ], 403);
            }
        }

        $notification->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notification marked as read',
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = auth()->user();

        SystemNotification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere('target_role', $user->role)
              ->orWhereNull('target_role');
        })->where('is_read', false)->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'All notifications marked as read',
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy(SystemNotification $notification)
    {
        $user = auth()->user();

        // Verify user can access this notification
        if ($notification->user_id && $notification->user_id != $user->id) {
            if ($notification->target_role != $user->role) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to this notification',
                ], 403);
            }
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification deleted',
        ]);
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead()
    {
        $user = auth()->user();

        SystemNotification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhere('target_role', $user->role)
              ->orWhereNull('target_role');
        })->where('is_read', true)->delete();

        return response()->json([
            'success' => true,
            'message' => 'All read notifications deleted',
        ]);
    }
}
