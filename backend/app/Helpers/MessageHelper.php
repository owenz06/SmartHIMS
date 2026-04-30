<?php

namespace App\Helpers;

use App\Models\User;
use App\Models\Message;

class MessageHelper
{
    /**
     * Messaging hierarchy rules
     */
    private static $hierarchy = [
        'pharmacist' => ['manager'],
        'manager' => ['pharmacist', 'procurement_officer'],
        'procurement_officer' => ['manager', 'admin', 'super_admin'],
        'admin' => ['all'],
        'super_admin' => ['all'],
    ];

    /**
     * Check if sender can message receiver based on hierarchy
     */
    public static function canMessageUser(User $sender, User $receiver): bool
    {
        // Can't message yourself
        if ($sender->id === $receiver->id) {
            return false;
        }

        $senderRole = $sender->role;
        $receiverRole = $receiver->role;

        // Admin and Super Admin can message anyone
        if (in_array($senderRole, ['admin', 'super_admin'])) {
            return true;
        }

        // Check if receiver role is in sender's allowed list
        $allowedRoles = self::$hierarchy[$senderRole] ?? [];
        
        return in_array($receiverRole, $allowedRoles);
    }

    /**
     * Get users that the current user can message
     */
    public static function getEligibleRecipients(User $user)
    {
        $userRole = $user->role;

        // Admin and Super Admin can message anyone except themselves
        if (in_array($userRole, ['admin', 'super_admin'])) {
            return User::where('id', '!=', $user->id)->get();
        }

        // Get allowed roles for this user
        $allowedRoles = self::$hierarchy[$userRole] ?? [];

        if (empty($allowedRoles)) {
            return collect();
        }

        // Return users with allowed roles
        return User::whereIn('role', $allowedRoles)
            ->where('id', '!=', $user->id)
            ->get();
    }

    /**
     * Get unread message count for a user
     */
    public static function getUnreadCount(int $userId): int
    {
        return Message::where('receiver_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Get messaging hierarchy for a role
     */
    public static function getMessagingHierarchy(string $role): array
    {
        return self::$hierarchy[$role] ?? [];
    }
}
