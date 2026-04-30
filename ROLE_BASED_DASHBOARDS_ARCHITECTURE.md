# Role-Based Dashboards - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER AUTHENTICATION                          │
│                    (AuthContext + JWT Token)                         │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DASHBOARD COMPONENT                             │
│                   (frontend/src/pages/Dashboard.tsx)                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  1. Fetch user role from AuthContext                         │   │
│  │  2. Call API: GET /api/dashboard/stats                       │   │
│  │  3. Call API: GET /api/dashboard/charts                      │   │
│  │  4. Conditional rendering based on role                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │  super_admin or  │ │   manager    │ │   pharmacist     │
    │      admin       │ │              │ │                  │
    └────────┬─────────┘ └──────┬───────┘ └────────┬─────────┘
             │                  │                   │
             ▼                  ▼                   ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
    │ AdminDashboard   │ │ManagerDash   │ │ PharmacistDash   │
    │   Component      │ │  Component   │ │   Component      │
    └──────────────────┘ └──────────────┘ └──────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  procurement_officer     │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │  ProcurementDashboard    │
                    │      Component           │
                    └──────────────────────────┘
```

---

## Backend API Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    API REQUEST: GET /api/dashboard/stats             │
│                         (with JWT token)                             │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│              DashboardController::stats(Request $request)            │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  1. Extract user from request: $user = $request->user()     │   │
│  │  2. Get user role: $role = $user->role                      │   │
│  │  3. Switch based on role                                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  super_admin or  │    │     manager      │    │   pharmacist     │
│      admin       │    │                  │    │                  │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                        │
         ▼                       ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ getAdminStats()  │    │ getManagerStats()│    │getPharmacistStats│
│                  │    │                  │    │      ()          │
│ • All inventory  │    │ • All inventory  │    │ • Inventory view │
│ • All POs        │    │ • Requisitions   │    │ • Own requisitions│
│ • All requisitions│   │ • Own stock req  │    │ • Own dispensing │
│ • All stock req  │    │ • Stock movements│    │                  │
│ • All users*     │    │ • Categories     │    │                  │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                        │
         │                       ▼                        │
         │              ┌──────────────────┐             │
         │              │ procurement_off  │             │
         │              └────────┬─────────┘             │
         │                       │                        │
         │                       ▼                        │
         │              ┌──────────────────┐             │
         │              │getProcurementStats│            │
         │              │      ()          │             │
         │              │ • All POs        │             │
         │              │ • All stock req  │             │
         │              │ • All suppliers  │             │
         │              │ • Stock in stats │             │
         │              │ • Inventory view │             │
         │              └────────┬─────────┘             │
         │                       │                        │
         └───────────────────────┴────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    JSON RESPONSE (Role-Specific Data)                │
│                  { "success": true, "data": {...} }                  │
└─────────────────────────────────────────────────────────────────────┘

* Super Admin sees ALL users, System Admin excludes Super Admins
```

---

## Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│  (Frontend)  │
└──────┬───────┘
       │
       │ 1. User logs in
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│                    AuthContext                                │
│  • Stores user data (id, name, email, role)                  │
│  • Stores JWT token                                           │
│  • Provides authentication state                             │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 2. Dashboard component mounts
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│              Dashboard Component (useEffect)                  │
│  • Calls fetchDashboardData()                                │
└──────┬───────────────────────────────────────────────────────┘
       │
       │ 3. API calls (parallel)
       │
       ├─────────────────────────┬────────────────────────────┐
       │                         │                            │
       ▼                         ▼                            ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐
│ GET /api/       │    │ GET /api/       │    │  JWT Token in       │
│ dashboard/stats │    │ dashboard/charts│    │  Authorization      │
│                 │    │                 │    │  Header             │
└────────┬────────┘    └────────┬────────┘    └─────────────────────┘
         │                      │
         │ 4. Backend processes requests
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Laravel Backend (API Controller)                │
│  • Authenticates user via JWT middleware                    │
│  • Extracts user role                                        │
│  • Queries database with role-based filters                 │
│  • Returns filtered data                                     │
└────────┬────────────────────────────────────────────────────┘
         │
         │ 5. Response (JSON)
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│              Dashboard Component (setState)                  │
│  • setStats(statsResponse.data)                             │
│  • setChartData(chartsResponse.data)                        │
└────────┬────────────────────────────────────────────────────┘
         │
         │ 6. Conditional rendering
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│           Role-Specific Dashboard Component                  │
│  • Receives stats and chartData as props                    │
│  • Renders stats cards                                       │
│  • Renders charts                                            │
│  • Renders alerts                                            │
│  • Renders quick actions (if applicable)                    │
└────────┬────────────────────────────────────────────────────┘
         │
         │ 7. Display to user
         │
         ▼
┌──────────────┐
│   Browser    │
│  (Rendered   │
│  Dashboard)  │
└──────────────┘
```

---

## Component Hierarchy

```
Dashboard.tsx (Main Container)
│
├── Sidebar
│   ├── Logo
│   ├── Navigation (role-filtered)
│   └── Footer
│
├── AppHeader
│   ├── Title
│   ├── Subtitle (Welcome message)
│   └── Menu button (mobile)
│
└── Main Content (Conditional Rendering)
    │
    ├── IF role === 'super_admin' OR 'admin'
    │   └── AdminDashboard
    │       ├── Stats Grid (8 cards)
    │       ├── Alerts Section
    │       └── Charts Section (4 charts)
    │
    ├── IF role === 'manager'
    │   └── ManagerDashboard
    │       ├── Stats Grid (9 cards)
    │       ├── Alerts Section
    │       └── Charts Section (4 charts)
    │
    ├── IF role === 'pharmacist'
    │   └── PharmacistDashboard
    │       ├── Stats Grid (6 cards)
    │       ├── Alerts Section
    │       ├── Charts Section (3 charts)
    │       └── Quick Actions
    │
    └── IF role === 'procurement_officer'
        └── ProcurementDashboard
            ├── Stats Grid (7 cards)
            ├── Alerts Section
            ├── Charts Section (5 charts)
            └── Quick Actions
```

---

## Database Query Patterns

### Super Admin / System Admin:
```sql
-- All inventory items
SELECT COUNT(*) FROM items;

-- Low stock items
SELECT COUNT(*) FROM items WHERE quantity <= reorder_point;

-- All purchase orders
SELECT COUNT(*) FROM purchase_orders;

-- All requisitions
SELECT COUNT(*) FROM requisitions;

-- All stock requests
SELECT COUNT(*) FROM stock_requests;

-- Users (filtered by role)
SELECT COUNT(*) FROM users WHERE role != 'super_admin'; -- System Admin only
SELECT COUNT(*) FROM users; -- Super Admin
```

### Manager:
```sql
-- All inventory items
SELECT COUNT(*) FROM items;

-- Requisitions (all, to approve)
SELECT COUNT(*) FROM requisitions WHERE status = 'Pending';

-- Own stock requests only
SELECT COUNT(*) FROM stock_requests WHERE user_id = ?;

-- Stock movements (weekly)
SELECT COUNT(*) FROM stock_in 
WHERE created_at BETWEEN ? AND ?;

SELECT COUNT(*) FROM stock_out 
WHERE created_at BETWEEN ? AND ?;
```

### Pharmacist:
```sql
-- Inventory (view only)
SELECT COUNT(*) FROM items;

-- Own requisitions only
SELECT COUNT(*) FROM requisitions 
WHERE user_id = ? AND status = 'Pending';

-- Own dispensing activity
SELECT COUNT(*) FROM stock_out 
WHERE user_id = ? 
AND created_at BETWEEN ? AND ?;
```

### Procurement Officer:
```sql
-- All purchase orders
SELECT COUNT(*) FROM purchase_orders;

-- All stock requests
SELECT COUNT(*) FROM stock_requests WHERE status = 'Pending';

-- All suppliers
SELECT COUNT(*) FROM suppliers WHERE status = 'Active';

-- Stock in (weekly/monthly)
SELECT COUNT(*) FROM stock_in 
WHERE created_at BETWEEN ? AND ?;
```

---

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 1: Authentication                   │
│  • JWT token validation                                      │
│  • User session management                                   │
│  • Token expiration checks                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 2: Authorization                    │
│  • Role detection from authenticated user                    │
│  • Permission checks via middleware                          │
│  • Route protection                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 3: Data Filtering                   │
│  • Role-based query filters                                  │
│  • User-specific data isolation (pharmacist, manager)        │
│  • Hierarchical data access (admin levels)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    LAYER 4: UI Rendering                     │
│  • Conditional component rendering                           │
│  • Role-specific navigation                                  │
│  • Action button visibility control                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Backend:
```
┌─────────────────────────────────────────────────────────────┐
│  1. Eager Loading                                            │
│     • with('category') for items                             │
│     • with('user') for audit logs                            │
│     • Reduces N+1 query problems                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2. Query Optimization                                       │
│     • COUNT(*) instead of fetching all records               │
│     • Indexed columns (user_id, status, created_at)          │
│     • Date range filters for performance                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  3. Caching Potential                                        │
│     • Cache dashboard stats (5-minute TTL)                   │
│     • Cache chart data (10-minute TTL)                       │
│     • Invalidate on data changes                             │
└─────────────────────────────────────────────────────────────┘
```

### Frontend:
```
┌─────────────────────────────────────────────────────────────┐
│  1. Parallel API Calls                                       │
│     • Promise.all([getStats(), getCharts()])                 │
│     • Reduces total loading time                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2. Component Lazy Loading                                   │
│     • Role-specific components loaded on demand              │
│     • Reduces initial bundle size                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  3. Chart Optimization                                       │
│     • ResponsiveContainer for adaptive sizing                │
│     • Limited data points (7 days)                           │
│     • Efficient recharts library                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Error Handling

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Error Handling                   │
│                                                               │
│  try {                                                        │
│    const [statsResponse, chartsResponse] =                   │
│      await Promise.all([                                     │
│        DashboardAPI.getStats(),                              │
│        DashboardAPI.getCharts()                              │
│      ]);                                                      │
│  } catch (error) {                                           │
│    setError(error.message);                                  │
│    // Display error UI with retry button                     │
│  }                                                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Backend Error Handling                    │
│                                                               │
│  • Database query failures → 500 Internal Server Error       │
│  • Invalid role → Default stats returned                     │
│  • Missing user → 401 Unauthorized                           │
│  • Permission denied → 403 Forbidden                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Conclusion

This architecture provides:
- ✅ **Clear separation of concerns** between roles
- ✅ **Secure data access** with multiple security layers
- ✅ **Optimized performance** with efficient queries and caching
- ✅ **Scalable design** for future role additions
- ✅ **Maintainable code** with modular components

---

**Document Version**: 1.0.0  
**Last Updated**: April 28, 2026  
**System**: Hospital Inventory Management System (SHIMS)
