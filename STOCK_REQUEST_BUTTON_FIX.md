# Stock Request Button Fix

## Issue
The "Request Stock" button on the Stock Requests page was not functioning (dormant when tapped).

## Root Cause
The button was wrapped incorrectly with the Link component. In React/Inertia, when you wrap a Button component with a Link, the button doesn't receive the click event properly.

## Solution Applied

### 1. Fixed Button Wrapping Pattern
Changed from:
```tsx
<Link href="/admin/stock-requests/create">
    <Button>
        <Plus className="h-4 w-4 mr-2" />
        Request Stock
    </Button>
</Link>
```

To:
```tsx
<Button asChild>
    <Link href="/admin/stock-requests/create">
        <Plus className="h-4 w-4 mr-2" />
        Request Stock
    </Link>
</Button>
```

The `asChild` prop tells the Button component to pass its props to its child (the Link), making the Link behave like a button while maintaining proper navigation.

### 2. Fixed Form Submission in Show Page
- Created separate form instances for approve and reject actions
- Fixed the form data submission to properly send status and rejection_reason

### 3. Applied Fixes Across All Pages
- `resources/js/pages/admin/stock-requests.tsx` - Request Stock button and View button
- `resources/js/pages/admin/stock-requests-create.tsx` - Back and Cancel buttons
- `resources/js/pages/admin/stock-requests-show.tsx` - Back button and form submissions

### 4. Fixed Build Errors
- Fixed duplicate import in `resources/js/routes/two-factor/index.ts`
- Fixed malformed export in `resources/js/routes/verification/index.ts`

## Files Modified
1. `resources/js/pages/admin/stock-requests.tsx`
2. `resources/js/pages/admin/stock-requests-create.tsx`
3. `resources/js/pages/admin/stock-requests-show.tsx`
4. `resources/js/routes/two-factor/index.ts`
5. `resources/js/routes/verification/index.ts`

## Testing
To test the fix:
1. Log in as a Manager
2. Navigate to Stock Requests page
3. Click "Request Stock" button - should navigate to create page
4. Fill out the form and submit - should create a new request
5. Log in as Procurement Officer
6. View the request and approve/reject - should update status and add stock

## Technical Notes
- The `asChild` pattern is a Radix UI convention used by shadcn/ui components
- It allows composition of components while maintaining proper accessibility and behavior
- Always use `asChild` when wrapping interactive components with navigation elements
