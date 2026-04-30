import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, Building2, AlertTriangle, FileText, ShoppingCart, PackageMinus, Bell, Activity, ArrowRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    totalUsers?: number;
    totalItems?: number;
    totalSuppliers?: number;
    totalDepartments?: number;
    lowStockItems?: number;
    lowStockItemsList?: any[];
    pendingRequisitions?: number;
    pendingPOs?: number;
    todayStockOuts?: number;
    recentLogs?: any[];
    totalAuditLogs?: number;
    inventoryDistribution?: any[];
    stockRequestsWeekly?: number;
    stockRequestsMonthly?: number;
    purchaseOrdersWeekly?: number;
    purchaseOrdersMonthly?: number;
    procurementSuppliers?: number;
    stockInWeekly?: number;
    stockInMonthly?: number;
    recentInventoryItems?: any[];
    stockRequestsChart?: any[];
    purchaseOrdersChart?: any[];
    stockInChart?: any[];
    suppliersChart?: any[];
    managerStockRequestsWeekly?: number;
    managerStockInWeekly?: number;
    managerStockInMonthly?: number;
    stockOutsWeekly?: number;
    stockOutsMonthly?: number;
    managerStockRequestsChart?: any[];
    managerStockInChart?: any[];
    managerStockOutsChart?: any[];
    managerRequisitionsChart?: any[];
    pharmacistDispensedWeekly?: number;
    pharmacistDispensedChart?: any[];
    inventoryChart?: any[];
    requisitionsChart?: any[];
    stockOutsChart?: any[];
}

export default function Dashboard({
    totalUsers,
    totalItems,
    totalSuppliers,
    totalDepartments,
    lowStockItems,
    lowStockItemsList,
    pendingRequisitions,
    pendingPOs,
    todayStockOuts,
    recentLogs,
    totalAuditLogs,
    inventoryDistribution,
    stockRequestsWeekly,
    stockRequestsMonthly,
    purchaseOrdersWeekly,
    purchaseOrdersMonthly,
    procurementSuppliers,
    stockInWeekly,
    stockInMonthly,
    recentInventoryItems,
    stockRequestsChart,
    purchaseOrdersChart,
    stockInChart,
    suppliersChart,
    managerStockRequestsWeekly,
    managerStockInWeekly,
    managerStockInMonthly,
    stockOutsWeekly,
    stockOutsMonthly,
    managerStockRequestsChart,
    managerStockInChart,
    managerStockOutsChart,
    managerRequisitionsChart,
    pharmacistDispensedWeekly,
    pharmacistDispensedChart,
    inventoryChart,
    requisitionsChart,
    stockOutsChart,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-2 md:gap-4 p-2 md:p-4">
                {/* Stats Grid */}
                <div className="dashboard-grid grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {totalUsers !== undefined && (
                        <Link href="/admin/users">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Total Users</CardTitle>
                                    <Users className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="dashboard-card-number font-bold">{totalUsers}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {totalItems !== undefined && (
                        <Link href="/admin/inventory">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Total Items</CardTitle>
                                    <Package className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="dashboard-card-number font-bold">{totalItems}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {totalSuppliers !== undefined && !procurementSuppliers && (
                        <Link href="/admin/suppliers">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Total Suppliers</CardTitle>
                                    <Building2 className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="dashboard-card-number font-bold">{totalSuppliers}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {/* Pharmacist Card - Dispensed This Week */}
                    {pharmacistDispensedWeekly !== undefined && (
                        <Link href="/stock-out">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Dispensed This Week</CardTitle>
                                    <PackageMinus className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="dashboard-card-number font-bold">{pharmacistDispensedWeekly}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Total items dispensed</p>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {lowStockItems !== undefined && (
                        <Link href="/admin/inventory">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Low Stock Items</CardTitle>
                                    <AlertTriangle className="dashboard-card-icon text-orange-500" />
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="dashboard-card-number font-bold text-orange-500">{lowStockItems}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {/* Manager Cards */}
                    {managerStockRequestsWeekly !== undefined && (
                        <Link href="/admin/stock-requests">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Stock Requests</CardTitle>
                                    <FileText className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">This Week:</p>
                                        <p className="dashboard-card-number font-bold">{managerStockRequestsWeekly}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {pendingRequisitions !== undefined && (
                        <Link href="/admin/requisitions">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Pending Requisitions</CardTitle>
                                    <FileText className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">{pendingRequisitions}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {pendingPOs !== undefined && (
                        <Link href="/admin/purchase-orders">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Pending Purchase Orders</CardTitle>
                                    <ShoppingCart className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">{pendingPOs}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {todayStockOuts !== undefined && !stockOutsWeekly && !pharmacistDispensedWeekly && (
                        <Link href="/stock-out">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Today's Stock Outs</CardTitle>
                                    <PackageMinus className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">{todayStockOuts}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {managerStockInWeekly !== undefined && managerStockInMonthly !== undefined && (
                        <Link href="/admin/stock-in">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Stock In</CardTitle>
                                    <Package className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Week:</p>
                                            <p className="dashboard-card-number font-bold">{managerStockInWeekly}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Month:</p>
                                            <p className="dashboard-card-number font-bold">{managerStockInMonthly}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {stockOutsWeekly !== undefined && stockOutsMonthly !== undefined && (
                        <Link href="/stock-out">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Stock Outs</CardTitle>
                                    <PackageMinus className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Week:</p>
                                            <p className="dashboard-card-number font-bold">{stockOutsWeekly}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Month:</p>
                                            <p className="dashboard-card-number font-bold">{stockOutsMonthly}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {totalDepartments !== undefined && (
                        <Link href="/admin/departments">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Total Departments</CardTitle>
                                    <Building2 className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">{totalDepartments}</div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {totalAuditLogs !== undefined && (
                        <Link href="/admin/audit-logs">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[120px] md:min-h-[140px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Recent Activity</CardTitle>
                                    <Activity className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">View</div>
                                    <p className="text-xs text-muted-foreground mt-1">Activity Logs</p>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {/* Procurement Officer Cards */}
                    {stockRequestsWeekly !== undefined && stockRequestsMonthly !== undefined && (
                        <Link href="/admin/stock-requests">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Stock Requests</CardTitle>
                                    <FileText className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Week:</p>
                                            <p className="dashboard-card-number font-bold">{stockRequestsWeekly}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Month:</p>
                                            <p className="dashboard-card-number font-bold">{stockRequestsMonthly}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {purchaseOrdersWeekly !== undefined && purchaseOrdersMonthly !== undefined && (
                        <Link href="/admin/purchase-orders">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Purchase Orders</CardTitle>
                                    <ShoppingCart className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Week:</p>
                                            <p className="dashboard-card-number font-bold">{purchaseOrdersWeekly}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Month:</p>
                                            <p className="dashboard-card-number font-bold">{purchaseOrdersMonthly}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {procurementSuppliers !== undefined && (
                        <Link href="/admin/suppliers">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Total Suppliers</CardTitle>
                                    <Building2 className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">{procurementSuppliers}</div>
                                    <p className="text-xs text-muted-foreground mt-1">Active suppliers</p>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {stockInWeekly !== undefined && stockInMonthly !== undefined && (
                        <Link href="/admin/stock-in">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Stock In</CardTitle>
                                    <Package className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Week:</p>
                                            <p className="dashboard-card-number font-bold">{stockInWeekly}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-muted-foreground">This Month:</p>
                                            <p className="dashboard-card-number font-bold">{stockInMonthly}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {recentInventoryItems !== undefined && recentInventoryItems.length > 0 && (
                        <Link href="/admin/inventory">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Recent Inventory</CardTitle>
                                    <Package className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="dashboard-card-number font-bold">{recentInventoryItems.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Latest: {recentInventoryItems[0]?.name}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    )}

                    {stockRequestsWeekly !== undefined && (
                        <Link href="/admin/audit-logs">
                            <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary min-h-[140px] md:min-h-[160px]">
                                <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
                                    <CardTitle className="dashboard-card-title font-medium">Recent Activity</CardTitle>
                                    <Activity className="dashboard-card-icon text-muted-foreground" />
                                </CardHeader>
                                <CardContent className="dashboard-card-content pt-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">View all activity logs</p>
                                        <ArrowRight className="dashboard-card-icon text-muted-foreground" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    )}
                </div>

                {/* Procurement Officer Charts */}
                {stockRequestsChart && purchaseOrdersChart && stockInChart && (
                    <div className="grid gap-2 md:gap-4 grid-cols-1 lg:grid-cols-2">
                        {/* Stock Requests Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm sm:text-base">Stock Requests Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={stockRequestsChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Purchase Orders Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Purchase Orders Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={purchaseOrdersChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Stock In Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Stock In Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={stockInChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#fbbf24" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Recent Inventory Items */}
                        {recentInventoryItems && recentInventoryItems.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Recent Inventory Items</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentInventoryItems.map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between border-b pb-2">
                                                <div>
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.category?.name || 'No Category'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">
                                                        {item.quantity} {item.unit_of_measurement}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Manager Charts */}
                {managerStockRequestsChart && managerStockInChart && managerStockOutsChart && managerRequisitionsChart && (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                        {/* Stock Requests Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Stock Requests Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={managerStockRequestsChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Requisitions Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Requisitions Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={managerRequisitionsChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Stock In Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Stock In Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={managerStockInChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#fbbf24" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Stock Outs Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Stock Outs Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={managerStockOutsChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#ef4444" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Pharmacist Charts */}
                {pharmacistDispensedChart && lowStockItemsList && (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                        {/* Dispensed Items Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Dispensed Items Trend (Last 7 Days)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={pharmacistDispensedChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Low Stock Items Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Low Stock Items</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                                    {lowStockItemsList.length > 0 ? (
                                        lowStockItemsList.slice(0, 5).map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between border-b pb-2">
                                                <div>
                                                    <p className="font-medium text-sm">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.category?.name || 'No Category'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium text-orange-500">
                                                        {item.quantity} {item.unit_of_measurement}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Reorder: {item.reorder_point}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-8">
                                            All items are well stocked
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Low Stock Items List */}
                {lowStockItemsList && lowStockItemsList.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {lowStockItemsList.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-2">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.category?.name || 'No Category'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-orange-500">
                                                {item.quantity} {item.unit_of_measurement}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Reorder: {item.reorder_point}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Admin/Super Admin Charts */}
                {(inventoryChart || requisitionsChart || stockOutsChart || inventoryDistribution) && (
                    <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                        {/* Inventory Distribution Pie Chart */}
                        {inventoryDistribution && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Inventory Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={inventoryDistribution}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={70}
                                                fill="#8884d8"
                                                dataKey="value"
                                                labelLine={false}
                                                fontSize={12}
                                            >
                                                {inventoryDistribution.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: any, name: any) => [value, name]} />
                                            <Legend 
                                                wrapperStyle={{ fontSize: '12px' }}
                                                iconType="square"
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Inventory Items Trend */}
                        {inventoryChart && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Inventory Items Added (7 Days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={inventoryChart}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" fill="#82ca9d" name="Items Added" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Requisitions Trend */}
                        {requisitionsChart && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Requisitions (7 Days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={requisitionsChart}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="count" stroke="#ffc658" name="Requisitions" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {/* Stock Outs Trend */}
                        {stockOutsChart && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Stock Dispensed (7 Days)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={stockOutsChart}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" fill="#ff7c7c" name="Items Dispensed" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
