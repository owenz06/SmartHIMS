# Debugging Black Page Issues

## What Causes a Black Page?

A black page in your React/Inertia application typically means:
- JavaScript error preventing the page from rendering
- Missing component file
- Missing or incorrect data from backend
- Import/dependency issues

## Step-by-Step Debugging

### 1. Check Browser Console (MOST IMPORTANT)
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Look for red error messages
4. The error will tell you exactly what's wrong

Common errors you might see:
- `Cannot read property 'X' of undefined` - Missing data
- `Module not found` - Missing import or file
- `X is not a function` - Wrong data type
- `Unexpected token` - Syntax error

### 2. Check Network Tab
1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for the page request (usually the URL you're visiting)
4. Click on it and check the **Response** tab
5. Verify the data structure matches what your component expects

### 3. Check Vite Dev Server
Make sure your Vite dev server is running:
```bash
npm run dev
```

If you see errors in the terminal, fix those first.

### 4. Common Issues and Fixes

#### Issue: Missing Toast Dependency
**Error**: `Cannot find module '@radix-ui/react-toast'`

**Fix**:
```bash
npm install @radix-ui/react-toast
npm run dev
```

#### Issue: Component Not Found
**Error**: `Failed to resolve component: admin/some-page`

**Fix**: Check that the file exists at `resources/js/pages/admin/some-page.tsx`

#### Issue: Props Mismatch
**Error**: `Cannot read property 'data' of undefined`

**Fix**: Check that the controller is passing the expected data:
```php
// In Controller
return inertia('admin/page', [
    'items' => $items,  // Make sure this matches what the frontend expects
]);
```

```tsx
// In Component
interface Props {
    items: Item[];  // Make sure this matches what the backend sends
}
```

#### Issue: Missing Layout
**Error**: `X.layout is not a function`

**Fix**: Make sure your page component has a layout assigned:
```tsx
import AppLayout from '@/layouts/app-layout';

export default function MyPage() {
    // ...
}

MyPage.layout = (page: React.ReactNode) => <AppLayout children={page} />;
```

### 5. Quick Fixes to Try

#### Clear Cache and Rebuild
```bash
# Stop Vite (Ctrl+C)
# Clear Laravel cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild frontend
npm run dev
```

#### Check for Syntax Errors
Look for:
- Missing closing brackets `}`, `)`, `]`
- Missing semicolons (in some cases)
- Incorrect JSX syntax
- Missing imports

#### Verify All Dependencies Are Installed
```bash
npm install
```

### 6. Specific to Your Current Setup

Since we just added the toast notification system, if you're seeing a black page:

1. **Install the missing dependency**:
```bash
npm install @radix-ui/react-toast
```

2. **Restart Vite**:
```bash
# Press Ctrl+C to stop
npm run dev
```

3. **Clear browser cache**:
- Press `Ctrl+Shift+Delete`
- Clear cached images and files
- Or do a hard refresh: `Ctrl+Shift+R`

### 7. Emergency Rollback

If you need to quickly get the site working again, you can temporarily disable the toast system:

**In `resources/js/layouts/app/app-sidebar-layout.tsx`**:
```tsx
// Comment out these lines temporarily:
// import { Toaster } from '@/components/ui/toaster';
// import { useToast } from '@/hooks/use-toast';

// And remove the useEffect and <Toaster /> component
```

### 8. Getting More Information

If the console doesn't show enough information:

1. **Check Laravel logs**:
```bash
tail -f storage/logs/laravel.log
```

2. **Enable React error boundaries** (if not already):
The error should show in the console with a stack trace

3. **Check Vite terminal output**:
Look for compilation errors in the terminal where `npm run dev` is running

## Prevention Tips

1. **Always check the console** before and after making changes
2. **Install dependencies immediately** when adding new components
3. **Test in the browser** after each significant change
4. **Keep Vite dev server running** while developing
5. **Use TypeScript** to catch errors before runtime

## Still Stuck?

If you're still seeing a black page:
1. Take a screenshot of the browser console errors
2. Check the Network tab response
3. Share the error message - it will tell us exactly what's wrong
