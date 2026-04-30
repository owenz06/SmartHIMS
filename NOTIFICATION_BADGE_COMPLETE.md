# Notification Badge Implementation Complete

## Overview
Implemented a red notification badge on the bell icon in the sidebar that displays the count of unread notifications. The badge disappears when all notifications are read.

## Features Implemented

### 1. Notification Count Hook
- Created `resources/js/hooks/use-notification-count.ts`
- Fetches unread notification count from `/notifications/count` endpoint
- Polls for updates every 30 seconds
- Listens for custom events to refetch immediately when notifications are read

### 2. Badge Display
- Updated `resources/js/components/nav-main.tsx` to show badge on bell icon
- Red dot indicator on the bell icon itself
- Red circular badge with count (shows "9+" if count > 9)
- Badge only appears when there are unread notifications

### 3. Real-time Updates
- Badge updates when notifications are marked as read
- Badge updates when visiting the notifications page
- Badge updates when requisitions are approved/rejected (creates notifications)
- Badge updates when new requisitions are created (creates notifications)

### 4. Event System
- Custom events trigger notification count refetch:
  - `notification-read`: Fired when a notification is marked as read
  - `notifications-viewed`: Fired when the notifications page is visited

## Files Modified

1. **resources/js/hooks/use-notification-count.ts** (NEW)
   - Hook to fetch and manage notification count
   - Polls every 30 seconds
   - Listens for custom events

2. **resources/js/components/nav-main.tsx**
   - Added notification count hook
   - Display red dot on bell icon when unread notifications exist
   - Display count badge next to "Notifications" text

3. **resources/js/pages/admin/notifications.tsx**
   - Trigger `notifications-viewed` event on page load
   - Trigger `notification-read` event when marking as read

4. **resources/js/pages/admin/requisitions-show.tsx**
   - Trigger `notification-read` event when approving/rejecting requisitions

5. **resources/js/pages/admin/requisitions-create.tsx**
   - Trigger `notification-read` event when creating new requisitions

## How It Works

1. When the sidebar loads, the `useNotificationCount` hook fetches the unread count
2. The count is displayed as a red badge on the bell icon if > 0
3. The badge shows the exact count (or "9+" if more than 9)
4. When a user:
   - Marks a notification as read
   - Views the notifications page
   - Approves/rejects a requisition
   - Creates a new requisition
   
   The count is immediately refetched and the badge updates

5. The count also auto-refreshes every 30 seconds to catch new notifications

## Visual Design

- Red circular badge with white text
- Small red dot on the bell icon itself
- Badge appears on the right side of the navigation item
- Matches the dark theme design
- Shows "9+" for counts greater than 9

## Backend Integration

Uses existing `/notifications/count` endpoint that:
- Filters by user role and user_id
- Returns count of unread notifications
- Already implemented in `routes/web.php`

## Testing

To test the notification badge:
1. Log in as a pharmacist
2. Create a requisition (manager should see badge)
3. Log in as manager
4. Check bell icon - should show red badge with count
5. Click on Notifications - badge should remain
6. Mark notification as read - badge should update/disappear
7. Approve/reject requisition - pharmacist should see badge
