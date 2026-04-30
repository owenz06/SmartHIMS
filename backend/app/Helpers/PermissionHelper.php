<?php

namespace App\Helpers;

use App\Models\User;

class PermissionHelper
{
    /**
     * Check if a user has a specific permission
     */
    public static function can(User $user, string $permission): bool
    {
        $rolePermissions = config("permissions.{$user->role}.permissions", []);
        
        return in_array($permission, $rolePermissions);
    }

    /**
     * Check if a user is restricted from a specific action
     */
    public static function isRestricted(User $user, string $action): bool
    {
        $roleRestrictions = config("permissions.{$user->role}.restrictions", []);
        
        return array_key_exists($action, $roleRestrictions);
    }

    /**
     * Get restriction message for a specific action
     */
    public static function getRestrictionMessage(User $user, string $action): ?string
    {
        $roleRestrictions = config("permissions.{$user->role}.restrictions", []);
        
        return $roleRestrictions[$action] ?? null;
    }

    /**
     * Check if user can edit a transaction (must be the creator)
     */
    public static function canEditTransaction(User $user, $transaction): bool
    {
        // Super admin cannot edit any transactions
        if ($user->role === 'super_admin') {
            return false;
        }

        // Other users can only edit their own transactions
        if (isset($transaction->user_id)) {
            return $transaction->user_id === $user->id;
        }

        return false;
    }

    /**
     * Check if user can delete a transaction (must be the creator)
     */
    public static function canDeleteTransaction(User $user, $transaction): bool
    {
        // Super admin cannot delete any transactions
        if ($user->role === 'super_admin') {
            return false;
        }

        // Other users can only delete their own transactions
        if (isset($transaction->user_id)) {
            return $transaction->user_id === $user->id;
        }

        return false;
    }

    /**
     * Get all permissions for a role
     */
    public static function getPermissions(string $role): array
    {
        return config("permissions.{$role}.permissions", []);
    }

    /**
     * Get all restrictions for a role
     */
    public static function getRestrictions(string $role): array
    {
        return config("permissions.{$role}.restrictions", []);
    }

    /**
     * Check if user can manage other users
     */
    public static function canManageUsers(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    /**
     * Check if user can assign roles
     * 
     * Rules:
     * - Super Admin can ONLY assign admin role
     * - System Admin can assign: manager, pharmacist, procurement_officer
     */
    public static function canAssignRole(User $user, string $targetRole): bool
    {
        // Super admin can only assign admin role
        if ($user->role === 'super_admin') {
            return $targetRole === 'admin';
        }

        // Admin can assign operational roles only
        if ($user->role === 'admin') {
            return in_array($targetRole, ['manager', 'pharmacist', 'procurement_officer']);
        }

        return false;
    }

    /**
     * Check if user can delete another user
     */
    public static function canDeleteUser(User $user, User $targetUser): bool
    {
        // Cannot delete yourself
        if ($user->id === $targetUser->id) {
            return false;
        }

        // Super admin can delete anyone including admins
        if ($user->role === 'super_admin') {
            return true;
        }

        // Admin can delete users except super_admin
        if ($user->role === 'admin' && $targetUser->role !== 'super_admin') {
            return true;
        }

        return false;
    }

    /**
     * Check if user can view audit logs
     */
    public static function canViewAuditLogs(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin', 'procurement_officer']);
    }

    /**
     * Check if user can view all reports
     */
    public static function canViewAllReports(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin', 'procurement_officer']);
    }

    /**
     * Check if user can view another user
     */
    public static function canViewUser(User $user, User $targetUser): bool
    {
        // Super admin can view anyone
        if ($user->role === 'super_admin') {
            return true;
        }

        // Admin cannot view super_admin accounts
        if ($user->role === 'admin' && $targetUser->role === 'super_admin') {
            return false;
        }

        // Admin can view other users
        if ($user->role === 'admin') {
            return true;
        }

        return false;
    }

    /**
     * Check if user can edit another user
     */
    public static function canEditUser(User $user, User $targetUser): bool
    {
        // Cannot edit yourself through this check
        if ($user->id === $targetUser->id) {
            return true; // Users can edit their own profile
        }

        // Super admin can edit anyone
        if ($user->role === 'super_admin') {
            return true;
        }

        // Admin cannot edit super_admin accounts
        if ($user->role === 'admin' && $targetUser->role === 'super_admin') {
            return false;
        }

        // Admin can edit other users
        if ($user->role === 'admin') {
            return true;
        }

        return false;
    }

    /**
     * Check if user can create a user with specific role
     * 
     * Rules:
     * - Super Admin can ONLY create System Admin (admin role)
     * - System Admin can create: manager, pharmacist, procurement_officer
     * - System Admin CANNOT create super_admin
     */
    public static function canCreateUserWithRole(User $user, string $targetRole): bool
    {
        // Super admin can ONLY create admin (System Admin)
        if ($user->role === 'super_admin') {
            return $targetRole === 'admin';
        }

        // Admin (System Admin) can create operational roles only
        if ($user->role === 'admin') {
            return in_array($targetRole, ['manager', 'pharmacist', 'procurement_officer']);
        }

        return false;
    }

    /**
     * Get filtered users list based on role permissions
     */
    public static function getFilteredUsers(User $user)
    {
        // Super admin sees all users
        if ($user->role === 'super_admin') {
            return User::all();
        }

        // Admin sees all users except super_admin
        if ($user->role === 'admin') {
            return User::where('role', '!=', 'super_admin')->get();
        }

        return collect();
    }

    /**
     * Check if user can configure inventory settings
     */
    public static function canConfigureInventory(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    /**
     * Check if user can manage notifications
     */
    public static function canManageNotifications(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }
}
