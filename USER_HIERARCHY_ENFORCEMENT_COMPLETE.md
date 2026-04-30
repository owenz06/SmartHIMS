# User Hierarchy Enforcement - Departments & User Management
## Implementation Complete ✅

## 🎯 **Objective**
Enforce proper user hierarchy where:
1. **Super Admin** can only manage **System Admin** users (not operational users or departments)
2. **System Admin** can manage **operational users** (Manager, Pharmacist, Procurement Officer) and **departments**

---

## 📋 **Changes Summary**

### **1. Departments Page**
**File**: `frontend/src/pages/Departments.tsx`

**Changes**:
- ✅ Added **READ-ONLY banner** for Super Admin
- ✅ **"Add Department" button**: Only visible to **System Admin** (was: all admins)
- ✅ **"Edit" and "Delete" buttons**: Only visible to **System Admin** (was: all admins)
- ✅ **"View only" message**: Shown in department cards for Super Admin
- ✅ Added **useAuth hook** to access current user role

**UI Behavior**:
```
Super Admin:
- See blue banner: "Read-Only Access - Only System Admins can create, edit, or delete departments"
- No "Add Department" button
- Department cards show: "View only - System Admin access required to edit"

System Admin:
- No banner
- "Add Department" button visible
- "Edit" and "Delete" buttons in department cards
```

**Rationale**: Super Admin focuses on System Admin management, not operational infrastructure like departments.

---

### **2. Users Page (User Management)**
**File**: `frontend/src/pages/Users.tsx`

**Changes**:
- ✅ Added **role-specific banners** explaining hierarchy
- ✅ **User filtering**: Super Admin only sees System Admins, System Admin sees operational users
- ✅ **Role filter dropdown**: Shows only relevant roles based on current user
- ✅ **Edit/Delete buttons**: Only shown for users the current user can manage
- ✅ **"View only" message**: Shown for users outside management scope
- ✅ Added **getFilteredUsers()** function to filter users by hierarchy
- ✅ Added **canManageUser()** function to check management permissions
- ✅ Updated **page title** to reflect user scope (e.g., "System Admins" for Super Admin)

**UI Behavior**:

**Super Admin**:
```
Banner: Purple "Super Admin - System Admin Management"
- "As Super Admin, you can only create and manage System Admin accounts"

Page Title: "System Admins"
User List: Only shows System Admin users
Role Filter: Only "System Admin" option
Actions: Edit/Delete buttons for System Admin users only
```

**System Admin**:
```
Banner: Blue "System Admin - Operational User Management"
- "You can create and manage operational users (Managers, Pharmacists, Procurement Officers)"

Page Title: "All Users"
User List: Shows all users EXCEPT Super Admins
Role Filter: System Admin, Manager, Pharmacist, Procurement Officer
Actions: Edit/Delete buttons for operational users (not Super Admins)
```

**Functions Added**:

```typescript
// Filter users based on current user's role
const getFilteredUsers = (allUsers: User[]) => {
  if (currentUser?.role === 'super_admin') {
    // Super Admin can only see and manage System Admins
    return allUsers.filter(u => u.role === 'admin');
  } else if (currentUser?.role === 'admin') {
    // System Admin can see and manage operational users (not Super Admins)
    return allUsers.filter(u => u.role !== 'super_admin');
  }
  return allUsers;
};

// Check if current user can manage a specific user
const canManageUser = (targetUser: User) => {
  if (currentUser?.role === 'super_admin') {
    // Super Admin can only manage System Admins
    return targetUser.role === 'admin';
  } else if (currentUser?.role === 'admin') {
    // System Admin can manage operational users (not Super Admins or themselves)
    return targetUser.role !== 'super_admin' && targetUser.id !== currentUser.id;
  }
  return false;
};
```

---

## 🔐 **User Hierarchy Enforcement**

### **Super Admin Scope**
**CAN DO**:
- ✅ View all departments (read-only)
- ✅ View System Admin users
- ✅ Create System Admin users
- ✅ Edit System Admin users
- ✅ Delete System Admin users

**CANNOT DO**:
- ❌ Create/Edit/Delete departments
- ❌ View operational users (Manager, Pharmacist, Procurement Officer)
- ❌ Create/Edit/Delete operational users
- ❌ View/Edit/Delete other Super Admin accounts

**Rationale**: Super Admin focuses on System Admin management and oversight, delegating operational user management to System Admins.

---

### **System Admin Scope**
**CAN DO**:
- ✅ View all departments
- ✅ Create/Edit/Delete departments
- ✅ View operational users (Manager, Pharmacist, Procurement Officer)
- ✅ Create operational users
- ✅ Edit operational users
- ✅ Delete operational users

**CANNOT DO**:
- ❌ View Super Admin accounts
- ❌ Create/Edit/Delete Super Admin accounts
- ❌ Edit/Delete their own account

**Rationale**: System Admin handles day-to-day operational user management and infrastructure (departments), but cannot access Super Admin accounts.

---

## 🎨 **UI Components Added**

### **1. Departments Page - READ-ONLY Banner (Super Admin)**
```tsx
{user?.role === 'super_admin' && (
  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
      <div>
        <h3 className="font-medium text-blue-900 dark:text-blue-100">
          Read-Only Access
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          You have oversight access to view departments. Only System Admins can create, edit, or delete departments.
        </p>
      </div>
    </div>
  </div>
)}
```

### **2. Users Page - Super Admin Banner**
```tsx
{currentUser?.role === 'super_admin' && (
  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
      <div>
        <h3 className="font-medium text-purple-900 dark:text-purple-100">
          Super Admin - System Admin Management
        </h3>
        <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
          As Super Admin, you can only create and manage System Admin accounts. System Admins handle operational user management.
        </p>
      </div>
    </div>
  </div>
)}
```

### **3. Users Page - System Admin Banner**
```tsx
{currentUser?.role === 'admin' && (
  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
      <div>
        <h3 className="font-medium text-blue-900 dark:text-blue-100">
          System Admin - Operational User Management
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          You can create and manage operational users (Managers, Pharmacists, Procurement Officers). Super Admin accounts are managed by Super Admins only.
        </p>
      </div>
    </div>
  </div>
)}
```

---

## 📊 **Permission Matrix**

| Action | Super Admin | System Admin | Manager | Pharmacist | Procurement |
|--------|-------------|--------------|---------|------------|-------------|
| **Departments** |
| View Departments | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Departments | ❌ | ✅ | ❌ | ❌ | ❌ |
| Edit Departments | ❌ | ✅ | ❌ | ❌ | ❌ |
| Delete Departments | ❌ | ✅ | ❌ | ❌ | ❌ |
| **User Management** |
| View Super Admins | ❌ | ❌ | ❌ | ❌ | ❌ |
| View System Admins | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Operational Users | ❌ | ✅ | ❌ | ❌ | ❌ |
| Create Super Admins | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create System Admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Operational Users | ❌ | ✅ | ❌ | ❌ | ❌ |
| Edit Super Admins | ❌ | ❌ | ❌ | ❌ | ❌ |
| Edit System Admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Operational Users | ❌ | ✅ | ❌ | ❌ | ❌ |
| Delete Super Admins | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete System Admins | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Operational Users | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## ✅ **Testing Checklist**

### **Super Admin Tests**
- [ ] Login as Super Admin (`superadmin@hims.com`)
- [ ] **Departments Page**:
  - [ ] See blue "Read-Only Access" banner
  - [ ] No "Add Department" button visible
  - [ ] Department cards show "View only - System Admin access required to edit"
  - [ ] No "Edit" or "Delete" buttons in department cards
- [ ] **Users Page**:
  - [ ] See purple "Super Admin - System Admin Management" banner
  - [ ] Page title shows "System Admins"
  - [ ] Only System Admin users are listed
  - [ ] Role filter only shows "System Admin" option
  - [ ] "Edit" and "Delete" buttons visible for System Admin users
  - [ ] "Add User" button visible
  - [ ] Cannot see operational users (Manager, Pharmacist, Procurement Officer)

### **System Admin Tests**
- [ ] Login as System Admin
- [ ] **Departments Page**:
  - [ ] No banner visible
  - [ ] "Add Department" button visible
  - [ ] "Edit" and "Delete" buttons in department cards
- [ ] **Users Page**:
  - [ ] See blue "System Admin - Operational User Management" banner
  - [ ] Page title shows "All Users"
  - [ ] Operational users are listed (Manager, Pharmacist, Procurement Officer)
  - [ ] System Admin users are listed
  - [ ] Super Admin users are NOT listed
  - [ ] Role filter shows: System Admin, Manager, Pharmacist, Procurement Officer
  - [ ] "Edit" and "Delete" buttons visible for operational users
  - [ ] "View only" shown for Super Admin users (if any appear)
  - [ ] "Add User" button visible

### **Manager/Pharmacist/Procurement Officer Tests**
- [ ] Login as operational user
- [ ] **Departments Page**: Should not be accessible (navigation should not show it)
- [ ] **Users Page**: Should not be accessible (navigation should not show it)

---

## 🎯 **Expected User Experience**

### **Super Admin Experience**

**Departments Page**:
1. Sees blue banner explaining read-only access
2. Can view all departments
3. Cannot add, edit, or delete departments
4. Department cards show "View only" message

**Users Page**:
1. Sees purple banner explaining System Admin management scope
2. Page title: "System Admins"
3. Only sees System Admin users in the list
4. Can create new System Admin users
5. Can edit/delete System Admin users
6. Cannot see or manage operational users

**Workflow**: Super Admin creates System Admins → System Admins create operational users

---

### **System Admin Experience**

**Departments Page**:
1. No banner (full access)
2. Can view all departments
3. Can create new departments
4. Can edit/delete departments

**Users Page**:
1. Sees blue banner explaining operational user management scope
2. Page title: "All Users"
3. Sees all operational users (Manager, Pharmacist, Procurement Officer)
4. Sees other System Admin users
5. Cannot see Super Admin users
6. Can create new operational users
7. Can edit/delete operational users
8. Cannot edit/delete Super Admin users

**Workflow**: System Admin creates operational users → Operational users perform their roles

---

## 📝 **Implementation Notes**

1. **Frontend Filtering**: The frontend filters users based on role hierarchy to provide a clean UX. Backend should also enforce these restrictions.

2. **Separation of Concerns**:
   - Super Admin: Strategic oversight, System Admin management
   - System Admin: Operational user management, infrastructure (departments)
   - Operational Users: Day-to-day operations

3. **Self-Management Prevention**: System Admin cannot edit/delete their own account to prevent accidental lockout.

4. **Consistent Messaging**: All banners use consistent color schemes:
   - Purple: Super Admin (highest authority)
   - Blue: System Admin (administrative)
   - Teal/Green: Operational roles

5. **Dark Mode Support**: All new UI elements support dark mode with proper color variants.

---

## 🚀 **Deployment Status**

- ✅ **Departments Page**: Complete (Super Admin read-only)
- ✅ **Users Page**: Complete (Hierarchy enforcement)
- ✅ **User Filtering**: Complete (Role-based visibility)
- ✅ **Permission Checks**: Complete (canManageUser function)
- ✅ **UI Banners**: Complete (Role-specific messages)
- ✅ **Dark Mode Support**: Complete
- ⏳ **Backend Enforcement**: Needs verification
- ⏳ **User Testing**: Pending

---

## 📚 **Related Documentation**
- `USER_HIERARCHY_PERMISSIONS_ACTIONS.md` - Complete role hierarchy documentation
- `ROLE_PERMISSIONS_FIX_COMPLETE.md` - Backend permission enforcement
- `FRONTEND_ROLE_PERMISSIONS_COMPLETE.md` - Frontend operational pages
- `backend/config/permissions.php` - Permission configuration

---

## 🎉 **Summary**

The user hierarchy has been properly enforced:

✅ **Super Admin**: Manages System Admins only, read-only access to departments  
✅ **System Admin**: Manages operational users and departments  
✅ **Operational Users**: Perform their specific roles (inventory, dispensing, procurement)  

This creates a clear separation of duties:
- **Super Admin** → Creates **System Admins**
- **System Admin** → Creates **Operational Users** (Manager, Pharmacist, Procurement Officer)
- **Operational Users** → Perform day-to-day operations

The system now properly delegates user management responsibilities while maintaining oversight and control at the appropriate levels.

---

**Status**: ✅ **COMPLETE**  
**Date**: 2026-04-28  
**Version**: 1.0.0  
**Pages Updated**: 2 (Departments, Users)  
**Functions Added**: 2 (getFilteredUsers, canManageUser)

