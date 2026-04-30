<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Role-Based Permissions Configuration
    |--------------------------------------------------------------------------
    |
    | This file defines the permissions for each role in the system.
    | Each role has a set of allowed actions and restrictions.
    |
    */

    'super_admin' => [
        'permissions' => [
            // User Management
            'users.view',
            'users.create',
            'users.update',
            'users.deactivate',
            'users.delete',
            'users.assign_roles',
            
            // System Access
            'audit_logs.view',
            'reports.view_all',
            'settings.configure',
            
            // Messages (Can message anyone)
            'messages.view',
            'messages.send',
            'messages.send_all',
            
            // Read-only access to operational data
            'inventory.view',
            'purchase_orders.view',
            'requisitions.view',
            'stock_movements.view',
            'stock_in.view',
            'stock_out.view',
            'suppliers.view',
            'categories.view',
            'departments.view',
            'departments.create',
            'departments.update',
            'departments.delete',
        ],
        'restrictions' => [
            // Cannot modify transactions
            'transactions.edit' => 'Cannot edit transactions created by other users',
            'transactions.delete' => 'Cannot delete transactions created by other users',
            
            // Cannot alter logs
            'audit_logs.edit' => 'Cannot alter historical activity logs',
            'audit_logs.delete' => 'Cannot delete audit logs',
            
            // Cannot interfere in operations
            'purchase_orders.create' => 'Cannot create purchase orders',
            'purchase_orders.edit' => 'Cannot edit purchase orders',
            'purchase_orders.delete' => 'Cannot delete purchase orders',
            'requisitions.create' => 'Cannot create requisitions',
            'requisitions.edit' => 'Cannot edit requisitions',
            'requisitions.delete' => 'Cannot delete requisitions',
            'stock_in.create' => 'Cannot create stock in records',
            'stock_in.update' => 'Cannot update stock in records',
            'stock_in.delete' => 'Cannot delete stock in records',
            'stock_out.create' => 'Cannot create stock out records',
            'stock_out.update' => 'Cannot update stock out records',
            'stock_out.delete' => 'Cannot delete stock out records',
            'inventory.create' => 'Cannot create inventory items',
            'inventory.update' => 'Cannot edit inventory items',
            'inventory.delete' => 'Cannot delete inventory items',
            'suppliers.create' => 'Cannot create suppliers',
            'suppliers.update' => 'Cannot edit suppliers',
            'suppliers.delete' => 'Cannot delete suppliers',
            'categories.create' => 'Cannot create categories',
            'categories.update' => 'Cannot edit categories',
            'categories.delete' => 'Cannot delete categories',
        ],
    ],

    'admin' => [
        'permissions' => [
            // User Management (except Super Admin)
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.assign_roles',
            
            // Read-only operational access (like super_admin)
            'inventory.view',
            'purchase_orders.view',
            'requisitions.view',
            'stock_movements.view',
            'stock_in.view',
            'stock_out.view',
            'suppliers.view',
            'categories.view',
            'departments.view',
            'departments.create',
            'departments.update',
            'departments.delete',
            
            // Monitoring & Reporting
            'audit_logs.view',
            'reports.view_all',
            'settings.view',
            'notifications.view',
            'notifications.manage',
            
            // Messages (Can message anyone)
            'messages.view',
            'messages.send',
            'messages.send_all',
        ],
        'restrictions' => [
            // Cannot view/manage Super Admin
            'users.view_super_admin' => 'Cannot view Super Admin account details',
            'users.edit_super_admin' => 'Cannot edit Super Admin accounts',
            'users.delete_super_admin' => 'Cannot delete Super Admin accounts',
            'users.create_super_admin' => 'Cannot create Super Admin accounts',
            'users.assign_super_admin_role' => 'Cannot assign super_admin role',
            
            // Cannot perform operational actions
            'inventory.create' => 'Cannot create inventory items',
            'inventory.update' => 'Cannot edit inventory items',
            'inventory.delete' => 'Cannot delete inventory items',
            'inventory.configure' => 'Cannot configure inventory settings',
            
            'purchase_orders.create' => 'Cannot create purchase orders',
            'purchase_orders.update' => 'Cannot edit purchase orders',
            'purchase_orders.delete' => 'Cannot delete purchase orders',
            'purchase_orders.approve' => 'Cannot approve purchase orders',
            
            'requisitions.create' => 'Cannot create requisitions',
            'requisitions.update' => 'Cannot edit requisitions',
            'requisitions.delete' => 'Cannot delete requisitions',
            'requisitions.approve' => 'Cannot approve requisitions',
            
            'stock_in.create' => 'Cannot create stock in records',
            'stock_in.update' => 'Cannot update stock in records',
            'stock_in.delete' => 'Cannot delete stock in records',
            
            'stock_out.create' => 'Cannot create stock out records',
            'stock_out.update' => 'Cannot update stock out records',
            'stock_out.delete' => 'Cannot delete stock out records',
            
            'suppliers.create' => 'Cannot create suppliers',
            'suppliers.update' => 'Cannot edit suppliers',
            'suppliers.delete' => 'Cannot delete suppliers',
            
            'categories.create' => 'Cannot create categories',
            'categories.update' => 'Cannot edit categories',
            'categories.delete' => 'Cannot delete categories',
            
            // Cannot alter logs
            'audit_logs.edit' => 'Cannot alter historical activity logs',
            'audit_logs.delete' => 'Cannot delete audit logs',
            
            // System restrictions
            'settings.configure' => 'Cannot configure global system settings',
        ],
    ],

    'manager' => [
        'permissions' => [
            // Inventory Management (Full Control)
            'inventory.view',
            'inventory.create',
            'inventory.update',
            'inventory.delete',
            'inventory.configure',
            
            // Stock Management
            'stock_in.view',
            'stock_out.view',
            'stock_out.create',
            'stock_out.update',
            'stock_out.delete',
            'stock_out.approve',
            
            // Requisitions (Approve)
            'requisitions.view',
            'requisitions.approve',
            
            // Categories and Suppliers
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',
            'suppliers.view',
            'departments.view',
            
            // Purchase Orders (View Only)
            'purchase_orders.view',
            
            // Reports
            'reports.view_stock',
            'reports.view_department',
            
            // Alerts
            'alerts.view',
            'notifications.view',
            
            // Messages (Can message Pharmacist and Procurement Officer)
            'messages.view',
            'messages.send',
        ],
        'restrictions' => [
            // User Management
            'users.manage' => 'Cannot manage users',
            'users.view' => 'Cannot view users',
            
            // Stock In (Automatically generated)
            'stock_in.create' => 'Stock In records are automatically generated from inventory changes',
            'stock_in.update' => 'Cannot manually edit Stock In records',
            'stock_in.delete' => 'Cannot delete Stock In records',
            
            // Procurement Records
            'purchase_orders.create' => 'Cannot create purchase orders',
            'purchase_orders.update' => 'Cannot edit procurement records',
            'purchase_orders.delete' => 'Cannot delete purchase orders',
            'purchase_orders.approve' => 'Cannot approve purchase orders',
            
            'suppliers.create' => 'Cannot create suppliers',
            'suppliers.update' => 'Cannot edit suppliers',
            'suppliers.delete' => 'Cannot delete suppliers',
            
            // Audit Logs
            'audit_logs.view' => 'Cannot view audit logs',
            'audit_logs.delete' => 'Cannot delete audit logs',
            
            // System Settings
            'settings.configure' => 'Cannot configure system settings',
        ],
    ],

    'pharmacist' => [
        'permissions' => [
            // Inventory (View Only)
            'inventory.view',
            
            // Stock Out (Dispensing)
            'stock_out.view',
            'stock_out.create',
            
            // Requisitions (Request Stock)
            'requisitions.view',
            'requisitions.create',
            
            // Notifications
            'notifications.view',
            'alerts.view',
            
            // Messages (Can message Manager)
            'messages.view',
            'messages.send',
        ],
        'restrictions' => [
            // User Management
            'users.manage' => 'Cannot manage users',
            'users.view' => 'Cannot view users',
            
            // Inventory Management
            'inventory.create' => 'Cannot create inventory items',
            'inventory.update' => 'Cannot edit stock quantities manually',
            'inventory.delete' => 'Cannot delete inventory items',
            'inventory.configure' => 'Cannot configure inventory settings',
            
            // Stock In
            'stock_in.create' => 'Cannot create stock in records',
            'stock_in.update' => 'Cannot edit stock in records',
            'stock_in.delete' => 'Cannot delete stock in records',
            
            // Purchase Orders
            'purchase_orders.view' => 'Cannot view purchase orders',
            'purchase_orders.create' => 'Cannot create purchase orders',
            'purchase_orders.update' => 'Cannot edit purchase orders',
            'purchase_orders.delete' => 'Cannot delete purchase orders',
            
            // Requisitions
            'requisitions.update' => 'Cannot edit requisitions after submission',
            'requisitions.delete' => 'Cannot delete requisitions',
            'requisitions.approve' => 'Cannot approve requisitions',
            
            // Master Data
            'suppliers.view' => 'Cannot view suppliers',
            'suppliers.manage' => 'Cannot manage suppliers',
            'categories.manage' => 'Cannot manage categories',
            'departments.manage' => 'Cannot manage departments',
            
            // Reports and Audit
            'reports.view' => 'Cannot view reports',
            'audit_logs.view' => 'Cannot view audit logs',
            
            // Settings
            'settings.configure' => 'Cannot configure system settings',
        ],
    ],

    'procurement_officer' => [
        'permissions' => [
            // Purchase Orders
            'purchase_orders.view',
            'purchase_orders.create',
            'purchase_orders.update',
            'purchase_orders.submit',
            
            // Suppliers (Full CRUD)
            'suppliers.view',
            'suppliers.create',
            'suppliers.update',
            'suppliers.delete',
            
            // Stock In (Receiving)
            'stock_in.view',
            'stock_in.create',
            
            // Inventory (View Only)
            'inventory.view',
            
            // Reports
            'reports.view_procurement',
            
            // Requisitions (View for procurement planning)
            'requisitions.view',
            
            // Audit Logs
            'audit_logs.view',
            
            // Messages (Can message Manager and Admin/Super Admin)
            'messages.view',
            'messages.send',
        ],
        'restrictions' => [
            // User Management
            'users.manage' => 'Cannot manage users',
            'users.view' => 'Cannot view users',
            
            // Stock Management
            'stock_out.create' => 'Cannot modify stock manually',
            'inventory.update' => 'Cannot modify inventory manually',
            'inventory.delete' => 'Cannot delete inventory items',
            
            // Approvals
            'purchase_orders.approve' => 'Cannot approve purchase orders',
            'requisitions.approve' => 'Cannot approve requisitions',
            
            // Master Data
            'categories.manage' => 'Cannot manage categories',
            'departments.manage' => 'Cannot manage departments',
            
            // Settings
            'settings.configure' => 'Cannot configure system settings',
        ],
    ],
];
