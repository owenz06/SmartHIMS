# Toast Notification System Setup

## Overview
Implemented a toast notification system to replace 403 error pages with user-friendly popup messages.

## Installation Required

Run the following command to install the required dependency:

```bash
npm install @radix-ui/react-toast
```

## What Was Changed

### 1. Created Toast Components
- `resources/js/components/ui/toast.tsx` - Toast UI component
- `resources/js/components/ui/toaster.tsx` - Toast container component
- `resources/js/hooks/use-toast.ts` - Toast hook for managing toast state

### 2. Updated Exception Handling
- `bootstrap/app.php` - Added custom exception handler for 403 errors
  - Catches 403 Forbidden errors for Inertia requests
  - Returns back with error message instead of showing error page

### 3. Updated Middleware
- `app/Http/Middleware/HandleInertiaRequests.php` - Added flash message sharing
  - Shares success, error, warning, and info messages with frontend

### 4. Updated Layout
- `resources/js/layouts/app/app-sidebar-layout.tsx` - Added Toaster component and flash message handling
  - Listens for flash messages
  - Displays them as toast notifications automatically

## How It Works

1. When a user tries to perform an unauthorized action, the controller calls `abort(403, 'Custom message')`
2. The exception handler in `bootstrap/app.php` catches the 403 error
3. Instead of showing the error page, it redirects back with a flash error message
4. The `HandleInertiaRequests` middleware shares the flash message with the frontend
5. The `app-sidebar-layout` component detects the flash message and displays it as a toast
6. The toast appears in the top-right corner with the error message

## Usage in Controllers

Controllers already use this pattern:

```php
if (!PermissionHelper::can(auth()->user(), 'resource.create')) {
    abort(403, "You're not allowed to perform this action!");
}
```

The message will automatically appear as a toast notification instead of a 403 error page.

## Toast Types

The system supports 4 types of flash messages:

- **error** - Red destructive toast (for permission errors)
- **success** - Green success toast
- **warning** - Yellow warning toast
- **info** - Blue info toast

## Example Usage

### From Controller
```php
// Error
return back()->with('error', "You're not allowed to perform this action!");

// Success
return redirect()->route('admin.users.index')->with('success', 'User created successfully!');

// Warning
return back()->with('warning', 'This action cannot be undone.');

// Info
return back()->with('info', 'Your changes have been saved.');
```

### From Frontend (using the hook)
```tsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
    const { toast } = useToast();
    
    const handleAction = () => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "You're not allowed to perform this action!",
        });
    };
}
```

## Next Steps

1. Run `npm install @radix-ui/react-toast`
2. Run `npm run dev` to rebuild the frontend
3. Test by trying to perform an unauthorized action (e.g., pharmacist trying to edit inventory)
4. You should see a toast notification instead of a 403 error page

## Styling

The toast uses the existing dark theme and matches the application's design system. It appears in the top-right corner and automatically dismisses after a few seconds.
