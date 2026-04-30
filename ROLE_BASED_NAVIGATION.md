# Role-Based Navigation System

## Overview

The Hospital Inventory Management System implements a comprehensive role-based navigation system that dynamically adjusts the sidebar menu based on the authenticated user's role.

## User Roles

The system supports five distinct user roles, each with specific permissions and access levels:

### 1. Super Admin
**Full System Access**
- Complete control over all system features
- User management capabilities
- System configuration access

**Navigation Items:**
- Dashboard
- Predictive Analytics
- Inventory
- Purchase Orders
- Requisitions
- Stock In
- Stock Out
- Suppliers
- Categories
- Departments
- Users
- Reports
- Audit Logs
- Notifications

### 2. Admin
**Administrative Access**
- Similar to Super Admin but may have some restrictions
- Full inventory management
- User management
- Report generation

**Navigation Items:**
- Dashboard
- Predictive Analytics
- Inventory
- Purchase Orders
- Requisitions
- Stock In
- Stock Out
- Suppliers
- Categories
- Departments
- Users
- Reports
- Audit Logs

### 3. Manager
**Inventory Management**
- Inventory monitoring and management
- Stock operations
- Requisition handling
- Report viewing

**Navigation Items:**
- Dashboard (Manager)
- Predictive Analytics
- Inventory
- Stock Out
- Requisitions
- Reports
- Notifications

### 4. Pharmacist
**Dispensing Operations**
- Stock dispensing
- Requisition creation
- Inventory viewing
- Activity tracking

**Navigation Items:**
- Dashboard (Pharmacy)
- Inventory
- Stock Out
- Requisitions
- Activity Log

### 5. Auditor
**Read-Only Access**
- Audit log viewing
- Report generation
- Inventory monitoring
- Stock movement tracking

**Navigation Items:**
- Dashboard (Auditor)
- Audit Logs
- Reports
- Inventory View
- Stock Movements

## Implementation

### File Structure

```
resources/js/
├── config/
│   └── navigation.tsx          # Navigation configuration
├── components/
│   ├── app-sidebar.tsx         # Main sidebar component
│   ├── nav-main.tsx            # Navigation menu
│   ├── nav-user.tsx            # User dropdown
│   ├── user-info.tsx           # User info with role badge
│   └── user-menu-content.tsx   # User menu dropdown content
└── types/
    └── auth.ts                 # User and role types
```

### Navigation Configuration

The navigation is configured in `resources/js/config/navigation.tsx`:

```typescript
import { navigationConfig, getNavigationForRole } from '@/config/navigation';

// Get navigation for a specific role
const navItems = getNavigationForRole('admin');

// Check if user has access to a route
const hasAccess = hasAccessToRoute('manager', '/admin/users');

// Get role display name
const roleName = getRoleDisplayName('super_admin'); // "Super Administrator"

// Get role badge color
const badgeColor = getRoleBadgeColor('pharmacist');
```

### Dynamic Sidebar

The sidebar automatically adjusts based on the authenticated user's role:

```typescript
// In app-sidebar.tsx
const { auth } = usePage().props;
const userRole = auth?.user?.role || 'pharmacist';
const mainNavItems = getNavigationForRole(userRole);
```

### Role Badge Display

User roles are displayed with color-coded badges:

```typescript
// Role badge colors
super_admin: Purple
admin: Blue
manager: Green
pharmacist: Orange
auditor: Gray
```

## Usage Examples

### Adding a New Navigation Item

1. Edit `resources/js/config/navigation.tsx`
2. Add the item to the appropriate role(s):

```typescript
export const navigationConfig: Record<UserRole, NavItem[]> = {
  admin: [
    // ... existing items
    {
      title: 'New Feature',
      href: '/admin/new-feature',
      icon: NewIcon,
    },
  ],
};
```

### Creating a New Role

1. Add the role to the `UserRole` type in `resources/js/types/auth.ts`:

```typescript
export type UserRole = 'admin' | 'super_admin' | 'manager' | 'pharmacist' | 'auditor' | 'new_role';
```

2. Add navigation configuration in `resources/js/config/navigation.tsx`:

```typescript
export const navigationConfig: Record<UserRole, NavItem[]> = {
  // ... existing roles
  new_role: [
    {
      title: 'Dashboard',
      href: '/new-role/dashboard',
      icon: LayoutDashboard,
    },
    // ... more items
  ],
};
```

3. Add role display name and badge color:

```typescript
// In getRoleDisplayName function
new_role: 'New Role Name',

// In getRoleBadgeColor function
new_role: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
```

### Checking Route Access

Use the `hasAccessToRoute` function to check if a user can access a specific route:

```typescript
import { hasAccessToRoute } from '@/config/navigation';

const canAccessUsers = hasAccessToRoute(userRole, '/admin/users');

if (canAccessUsers) {
  // Show link or allow access
}
```

## Route Mapping

### Super Admin & Admin Routes
```
/dashboard                      → Main Dashboard
/predictive-dashboard           → AI Predictions
/admin/inventory                → Inventory Management
/admin/purchase-orders          → Purchase Orders
/admin/requisitions             → Requisitions
/admin/stock-in                 → Stock In Operations
/stock-out                      → Stock Out Operations
/admin/suppliers                → Supplier Management
/admin/categories               → Category Management
/admin/departments              → Department Management
/admin/users                    → User Management
/admin/reports                  → Reports
/admin/audit-logs               → Audit Logs
/notifications                  → System Notifications
```

### Manager Routes
```
/manager/dashboard              → Manager Dashboard
/predictive-dashboard           → AI Predictions
/manager/inventory              → Inventory View
/stock-out                      → Stock Out Operations
/requisitions                   → Requisitions
/reports                        → Reports
/notifications                  → Notifications
```

### Pharmacist Routes
```
/pharmacy/dashboard             → Pharmacy Dashboard
/inventory                      → Inventory View
/stock-out                      → Dispensing
/requisitions                   → Requisitions
/activity                       → Activity Log
```

### Auditor Routes
```
/auditor/dashboard              → Auditor Dashboard
/auditor/audit-logs             → Audit Logs
/reports                        → Reports
/inventory                      → Inventory View (Read-only)
/stock-movements                → Stock Movements
```

## Backend Integration

### Laravel Middleware

Ensure your Laravel routes use the appropriate middleware:

```php
// routes/web.php

// Admin routes
Route::middleware(['auth', 'role:admin,super_admin'])->prefix('admin')->group(function () {
    Route::get('/inventory', [InventoryController::class, 'index']);
    // ... more routes
});

// Manager routes
Route::middleware(['auth', 'role:manager'])->prefix('manager')->group(function () {
    Route::get('/dashboard', [ManagerController::class, 'dashboard']);
    // ... more routes
});

// Pharmacist routes
Route::middleware(['auth', 'role:pharmacist'])->prefix('pharmacy')->group(function () {
    Route::get('/dashboard', [PharmacyController::class, 'dashboard']);
    // ... more routes
});
```

### Passing User Role to Frontend

In your Laravel controllers, ensure the user role is passed to Inertia:

```php
use Inertia\Inertia;

public function index()
{
    return Inertia::render('Dashboard', [
        'auth' => [
            'user' => [
                'id' => auth()->user()->id,
                'name' => auth()->user()->name,
                'email' => auth()->user()->email,
                'role' => auth()->user()->role, // Important!
            ],
        ],
    ]);
}
```

Or use Inertia's `HandleInertiaRequests` middleware to share user data globally:

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
            ] : null,
        ],
    ]);
}
```

## Visual Examples

### Super Admin Sidebar
```
┌─────────────────────────┐
│  🏥 Hospital SHIMS      │
├─────────────────────────┤
│  📊 Dashboard           │
│  🔮 Predictive Analytics│
│  📦 Inventory           │
│  🛒 Purchase Orders     │
│  📋 Requisitions        │
│  📥 Stock In            │
│  📤 Stock Out           │
│  🏢 Suppliers           │
│  🏷️  Categories         │
│  📦 Departments         │
│  👥 Users               │
│  📊 Reports             │
│  🛡️  Audit Logs         │
│  🔔 Notifications       │
├─────────────────────────┤
│  👤 John Doe            │
│     john@hospital.com   │
│     [Super Admin] 🟣    │
└─────────────────────────┘
```

### Manager Sidebar
```
┌─────────────────────────┐
│  🏥 Hospital SHIMS      │
├─────────────────────────┤
│  📊 Dashboard           │
│  🔮 Predictive Analytics│
│  📦 Inventory           │
│  📤 Stock Out           │
│  📋 Requisitions        │
│  📊 Reports             │
│  🔔 Notifications       │
├─────────────────────────┤
│  👤 Jane Smith          │
│     jane@hospital.com   │
│     [Manager] 🟢        │
└─────────────────────────┘
```

### Pharmacist Sidebar
```
┌─────────────────────────┐
│  🏥 Hospital SHIMS      │
├─────────────────────────┤
│  📊 Dashboard           │
│  📦 Inventory           │
│  📤 Stock Out           │
│  📋 Requisitions        │
│  📈 Activity Log        │
├─────────────────────────┤
│  👤 Mike Johnson        │
│     mike@hospital.com   │
│     [Pharmacist] 🟠     │
└─────────────────────────┘
```

## Security Considerations

1. **Frontend validation is not security** - Always validate permissions on the backend
2. **Use Laravel middleware** - Protect routes with role-based middleware
3. **Hide sensitive routes** - Don't expose admin routes to non-admin users
4. **Audit access attempts** - Log unauthorized access attempts
5. **Regular role reviews** - Periodically review user roles and permissions

## Testing

### Testing Role-Based Navigation

```typescript
// Example test
import { getNavigationForRole, hasAccessToRoute } from '@/config/navigation';

describe('Role-Based Navigation', () => {
  it('should return correct navigation for admin', () => {
    const navItems = getNavigationForRole('admin');
    expect(navItems).toHaveLength(13);
    expect(navItems[0].title).toBe('Dashboard');
  });

  it('should restrict pharmacist access to admin routes', () => {
    const hasAccess = hasAccessToRoute('pharmacist', '/admin/users');
    expect(hasAccess).toBe(false);
  });

  it('should allow admin access to inventory', () => {
    const hasAccess = hasAccessToRoute('admin', '/admin/inventory');
    expect(hasAccess).toBe(true);
  });
});
```

## Troubleshooting

### Navigation not updating after role change
- Clear browser cache
- Refresh the page
- Check if user role is properly set in the database
- Verify Inertia is sharing the updated user data

### Icons not displaying
- Ensure lucide-react is installed: `npm install lucide-react`
- Check icon imports in navigation.tsx
- Verify icon names are correct

### Role badge not showing
- Check if user.role is defined
- Verify getRoleBadgeColor function is working
- Ensure Badge component is imported

## Best Practices

1. **Keep navigation organized** - Group related items together
2. **Use descriptive titles** - Make navigation items clear and concise
3. **Consistent icons** - Use similar icon styles throughout
4. **Test all roles** - Verify navigation works for each role
5. **Document changes** - Update this file when adding new roles or routes
6. **Follow naming conventions** - Use consistent route naming
7. **Minimize navigation items** - Don't overwhelm users with too many options

## Future Enhancements

- [ ] Collapsible navigation groups
- [ ] Nested navigation items
- [ ] Custom navigation per user (beyond role)
- [ ] Navigation search functionality
- [ ] Recently accessed items
- [ ] Favorite/pinned items
- [ ] Navigation analytics
- [ ] Multi-role support (users with multiple roles)

---

For questions or issues with the navigation system, refer to the main documentation or contact the development team.
