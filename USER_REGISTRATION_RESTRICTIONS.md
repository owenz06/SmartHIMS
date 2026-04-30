# User Registration Restrictions Implementation

## Overview
Disabled public registration and implemented role-based user creation restrictions to ensure proper organizational hierarchy.

## Registration Rules

### Public Registration
- **DISABLED** - No one can self-register through the public registration page
- The "Sign up" link has been removed from the login page
- Attempting to access `/register` redirects to login with an error message

### User Creation Hierarchy

#### Super Admin
- Can ONLY create: **System Admin (admin role)**
- Cannot create: super_admin, manager, pharmacist, procurement_officer
- Purpose: Super Admin creates the System Admin who manages all other users

#### System Admin (admin role)
- Can create: **Manager, Pharmacist, Procurement Officer**
- Cannot create: super_admin, admin
- Purpose: System Admin manages all operational staff

#### Other Roles
- Cannot create any users
- Must request user creation through Super Admin or System Admin

## Implementation Details

### Backend Changes

#### 1. AuthController (`app/Http/Controllers/AuthController.php`)
```php
// Disabled public registration
public function showLogin()
{
    return inertia('auth/login', [
        'canResetPassword' => true,
        'canRegister' => false, // Changed from true to false
        'status' => session('status'),
    ]);
}

public function showRegister()
{
    // Redirect to login with error
    return redirect()->route('login')
        ->with('error', 'Public registration is disabled. Please contact your administrator.');
}

public function register(Request $request)
{
    // Disabled - redirects to login
    return redirect()->route('login')
        ->with('error', 'Public registration is disabled. Please contact your administrator.');
}
```

#### 2. PermissionHelper (`app/Helpers/PermissionHelper.php`)

**canCreateUserWithRole()** - Updated with strict rules:
```php
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
```

**canAssignRole()** - Updated to match creation rules:
```php
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
```

#### 3. UserManagementController (`app/Http/Controllers/Admin/UserManagementController.php`)
- Already validates role creation using `PermissionHelper::canCreateUserWithRole()`
- Already validates role assignment using `PermissionHelper::canAssignRole()`
- Now passes auth user role to frontend for UI filtering

### Frontend Changes

#### 1. Login Page (`resources/js/pages/auth/login.tsx`)
- `canRegister` prop set to `false`
- "Sign up" link no longer displayed

#### 2. Users Management Page (`resources/js/pages/admin/users.tsx`)

**Role Selection Filtering:**
```typescript
const getAvailableRoles = () => {
    if (auth.user.role === 'super_admin') {
        // Super Admin can only create System Admin
        return [
            { value: 'admin', label: 'System Admin' }
        ];
    } else if (auth.user.role === 'admin') {
        // System Admin can create operational roles
        return [
            { value: 'manager', label: 'Inventory Manager' },
            { value: 'pharmacist', label: 'Pharmacist' },
            { value: 'procurement_officer', label: 'Procurement Officer' }
        ];
    }
    return [];
};
```

**Applied to:**
- Create User Dialog - role dropdown
- Edit User Dialog - role dropdown

## Security Measures

### Backend Validation
1. Public registration routes disabled and redirect to login
2. `canCreateUserWithRole()` validates on user creation
3. `canAssignRole()` validates on user role updates
4. Both create and update operations check permissions

### Frontend Restrictions
1. Role dropdown only shows allowed roles
2. No "Sign up" link on login page
3. User management page filters available roles based on current user

### Error Handling
- Attempting public registration shows error message
- Attempting to create unauthorized role returns error via toast
- Backend validation prevents any bypass attempts

## User Workflows

### Initial Setup
1. Super Admin account created manually (database seeder or direct DB insert)
2. Super Admin logs in
3. Super Admin creates System Admin account(s)

### Ongoing User Management
1. System Admin logs in
2. System Admin creates operational users:
   - Inventory Managers
   - Pharmacists
   - Procurement Officers

### User Cannot Self-Register
- No public registration available
- Users must be created by authorized administrators
- Ensures proper onboarding and role assignment

## Testing Checklist

- [ ] Public registration page redirects to login
- [ ] Login page does not show "Sign up" link
- [ ] Super Admin can only create System Admin
- [ ] Super Admin cannot create other roles
- [ ] System Admin can create Manager, Pharmacist, Procurement Officer
- [ ] System Admin cannot create Super Admin or Admin
- [ ] Role dropdown shows only allowed roles for each user type
- [ ] Backend validation prevents unauthorized role creation
- [ ] Error messages display correctly for unauthorized attempts

## Files Modified

### Backend
- `app/Http/Controllers/AuthController.php` - Disabled public registration
- `app/Helpers/PermissionHelper.php` - Updated role creation/assignment rules
- `app/Http/Controllers/Admin/UserManagementController.php` - Pass auth user to frontend

### Frontend
- `resources/js/pages/auth/login.tsx` - Removed sign up link
- `resources/js/pages/admin/users.tsx` - Filter role options based on current user

## Notes

- Super Admin accounts should be created carefully and sparingly
- System Admin is the primary user management role
- All user creation is audited through the audit log system
- Password requirements still apply (minimum 6 characters, confirmation required)
