import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, AlertTriangle, Activity, Download } from 'lucide-react';

interface ReportsProps {
    monthlyUsage: Array<{
        month: number;
        total: number;
    }>;
    mostUsed: Array<{
        item_id: number;
        total_used: number;
        item: {
            name: string;
        };
    }>;
    reorderSuggestions: Array<{
        id: number;
        name: string;
        current_stock: number;
        monthly_avg: number;
        suggested_reorder: number;
        reorder_point: number;
        needs_reorder: boolean;
    }>;
    lowStockItems: Array<{
        id: number;
        name: string;
        quantity: number;
        reorder_point: number;
    }>;
    recentAuditLogs: Array<{
        id: number;
        action: string;
        model_type: string;
        user: {
            name: string;
        };
        created_at: string;
    }>;
}

export default function Reports({
    monthlyUsage,
    mostUsed,
    reorderSuggestions,
    lowStockItems,
    recentAuditLogs,
}: ReportsProps) {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return (
        <>
            <Head title="Reports" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Reports</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        View inventory analytics and reports
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => window.open('/admin/reports/export/pdf', '_blank')}
                    className="w-full sm:w-auto"
                >
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Export Report</span>
                    <span className="sm:hidden">Export</span>
                </Button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Usage</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold">
                                {monthlyUsage.reduce((sum, m) => sum + m.total, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">This year</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Low Stock Items</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold">{lowStockItems.length}</div>
                            <p className="text-xs text-muted-foreground">Needs attention</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Reorder Suggestions</CardTitle>
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold">{reorderSuggestions.length}</div>
                            <p className="text-xs text-muted-foreground">Items to reorder</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Recent Activities</CardTitle>
                            <Activity className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold">{recentAuditLogs.length}</div>
                            <p className="text-xs text-muted-foreground">Last 10 actions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Most Used Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Most Used Items</CardTitle>
                            <CardDescription>Top 5 items by usage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mostUsed.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No data available</p>
                                ) : (
                                    mostUsed.map((item, index) => (
                                        <div key={item.item_id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium">{item.item.name}</span>
                                            </div>
                                            <Badge variant="secondary">{item.total_used} units</Badge>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Low Stock Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock Alert</CardTitle>
                            <CardDescription>Items below reorder point</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lowStockItems.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">All items are well stocked</p>
                                ) : (
                                    lowStockItems.slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{item.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-red-500">{item.quantity}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    / {item.reorder_point}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reorder Suggestions */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Reorder Suggestions</CardTitle>
                            <CardDescription>AI-powered recommendations based on usage patterns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-sidebar-border text-left text-sm text-muted-foreground">
                                            <th className="pb-3 font-medium">ITEM</th>
                                            <th className="pb-3 font-medium">CURRENT STOCK</th>
                                            <th className="pb-3 font-medium">MONTHLY AVG</th>
                                            <th className="pb-3 font-medium">SUGGESTED ORDER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reorderSuggestions.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-4 text-center text-sm text-muted-foreground">
                                                    No reorder suggestions at this time
                                                </td>
                                            </tr>
                                        ) : (
                                            reorderSuggestions.map((item) => (
                                                <tr key={item.id} className="border-b border-sidebar-border">
                                                    <td className="py-3 text-sm font-medium">{item.name}</td>
                                                    <td className="py-3 text-sm">{item.current_stock}</td>
                                                    <td className="py-3 text-sm">{item.monthly_avg}</td>
                                                    <td className="py-3">
                                                        <Badge variant="default">{item.suggested_reorder} units</Badge>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Reports.layout = (page: React.ReactNode) => <AppLayout children={page} />;
