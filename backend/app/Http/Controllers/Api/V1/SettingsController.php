<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class SettingsController extends Controller
{
    /**
     * Update user password
     */
    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => ['required', 'string', Password::min(8)],
            'confirm_password' => 'required|string|same:new_password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect',
            ], 422);
        }

        // Update password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Get user preferences
     */
    public function getPreferences(Request $request)
    {
        $user = $request->user();
        
        // Get preferences from user settings (assuming you have a preferences column or separate table)
        $preferences = $user->preferences ?? [
            'theme' => 'light',
            'language' => 'en',
            'timezone' => 'UTC',
            'notifications' => [
                'email_notifications' => true,
                'push_notifications' => true,
                'low_stock_alerts' => true,
                'purchase_order_updates' => true,
                'requisition_updates' => true,
                'system_updates' => false,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $preferences,
        ]);
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'theme' => 'nullable|string|in:light,dark',
            'language' => 'nullable|string',
            'timezone' => 'nullable|string',
            'notifications' => 'nullable|array',
            'notifications.email_notifications' => 'nullable|boolean',
            'notifications.push_notifications' => 'nullable|boolean',
            'notifications.low_stock_alerts' => 'nullable|boolean',
            'notifications.purchase_order_updates' => 'nullable|boolean',
            'notifications.requisition_updates' => 'nullable|boolean',
            'notifications.system_updates' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        
        // Get current preferences
        $preferences = $user->preferences ?? [];
        
        // Update preferences
        if ($request->has('theme')) {
            $preferences['theme'] = $request->theme;
        }
        
        if ($request->has('language')) {
            $preferences['language'] = $request->language;
        }
        
        if ($request->has('timezone')) {
            $preferences['timezone'] = $request->timezone;
        }
        
        if ($request->has('notifications')) {
            $preferences['notifications'] = array_merge(
                $preferences['notifications'] ?? [],
                $request->notifications
            );
        }
        
        // Save preferences (you may need to add a preferences column to users table)
        $user->preferences = $preferences;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Preferences updated successfully',
            'data' => $preferences,
        ]);
    }

    /**
     * Update theme preference
     */
    public function updateTheme(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'theme' => 'required|string|in:light,dark',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $preferences = $user->preferences ?? [];
        $preferences['theme'] = $request->theme;
        $user->preferences = $preferences;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Theme updated successfully',
            'data' => ['theme' => $request->theme],
        ]);
    }

    /**
     * Update notification preferences
     */
    public function updateNotifications(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email_notifications' => 'nullable|boolean',
            'push_notifications' => 'nullable|boolean',
            'low_stock_alerts' => 'nullable|boolean',
            'purchase_order_updates' => 'nullable|boolean',
            'requisition_updates' => 'nullable|boolean',
            'system_updates' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $preferences = $user->preferences ?? [];
        
        $preferences['notifications'] = [
            'email_notifications' => $request->input('email_notifications', true),
            'push_notifications' => $request->input('push_notifications', true),
            'low_stock_alerts' => $request->input('low_stock_alerts', true),
            'purchase_order_updates' => $request->input('purchase_order_updates', true),
            'requisition_updates' => $request->input('requisition_updates', true),
            'system_updates' => $request->input('system_updates', false),
        ];
        
        $user->preferences = $preferences;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Notification preferences updated successfully',
            'data' => $preferences['notifications'],
        ]);
    }
}
