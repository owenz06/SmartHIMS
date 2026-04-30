import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Truck,
  Clipboard,
  ArrowUpCircle,
  TrendingUp,
  Activity,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProcurementDashboardProps {
  stats: any;
  chartData: any;
  user: any;
}

const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({ stats, chartData, user }) => {
  const [showLowStockDetails, setShowLowStockDetails] = useState(false);

  return (
    <>
      {/* Stats Grid */}
      <div className="dashboard-grid grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        {/* Purchase Orders */}
        <Link to="/admin/purchase-orders">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Purchase Orders</CardTitle>
              <ShoppingCart className="dashboard-card-icon text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total:</p>
                  <p className="dashboard-card-number font-bold">{stats.purchase_orders.total}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Pending:</p>
                  <p className="text-sm font-semibold">{stats.purchase_orders.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Stock Requests */}
        <Link to="/admin/stock-requests">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Stock Requests</CardTitle>
              <Clipboard className="dashboard-card-icon text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total:</p>
                  <p className="dashboard-card-number font-bold">{stats.stock_requests.total}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Pending:</p>
                  <p className="text-sm font-semibold">{stats.stock_requests.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Suppliers */}
        <Link to="/admin/suppliers">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Suppliers</CardTitle>
              <Truck className="dashboard-card-icon text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold">{stats.suppliers.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Active: {stats.suppliers.active}</p>
            </CardContent>
          </Card>
        </Link>

        {/* Stock In (Weekly) */}
        <Link to="/admin/stock-in">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Stock In (Week)</CardTitle>
              <ArrowUpCircle className="dashboard-card-icon text-green-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-green-600">
                {stats.stock_movements.stock_in_weekly}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </Link>

        {/* Stock In (Monthly) */}
        <Link to="/admin/stock-in">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Stock In (Month)</CardTitle>
              <ArrowUpCircle className="dashboard-card-icon text-blue-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-blue-600">
                {stats.stock_movements.stock_in_monthly}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </Link>

        {/* Total Items */}
        <Link to="/admin/inventory">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Total Items</CardTitle>
              <Package className="dashboard-card-icon text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold">{stats.inventory.total_items}</div>
            </CardContent>
          </Card>
        </Link>

        {/* Low Stock Items */}
        <Link to="/admin/inventory">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="dashboard-card-icon text-orange-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-orange-500">
                {stats.inventory.low_stock_items}
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Alerts Section */}
      {stats.inventory.low_stock_items > 0 && (
        <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Procurement Alerts
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      <span className="font-medium">{stats.inventory.low_stock_items}</span> items are running
                      low. Consider creating purchase orders.
                    </p>
                    {stats.stock_requests.pending > 0 && (
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <span className="font-medium">{stats.stock_requests.pending}</span> stock requests are
                        pending approval.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLowStockDetails(!showLowStockDetails)}
                className="ml-4"
              >
                {showLowStockDetails ? 'Hide' : 'View'} Details
                <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${showLowStockDetails ? 'rotate-90' : ''}`} />
              </Button>
            </div>

            {/* Low Stock Items Details */}
            {showLowStockDetails && (
              <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                {chartData?.low_stock_items && chartData.low_stock_items.length > 0 ? (
                  <div className="space-y-2">
                    {chartData.low_stock_items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-white dark:bg-orange-900 rounded">
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Current: {item.current_quantity} | Min: {item.reorder_point} | {item.category}
                          </p>
                        </div>
                        <Link to="/admin/purchase-orders/create">
                          <Button size="sm" variant="outline">Create PO</Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    No low stock items to display
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mb-6">
        {/* Purchase Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Purchase Orders</span>
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days purchase orders</p>
          </CardHeader>
          <CardContent>
            {chartData?.purchase_orders_chart && chartData.purchase_orders_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.purchase_orders_chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" fontSize={12} stroke="#888888" />
                  <YAxis fontSize={12} stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#0097A7"
                    strokeWidth={2}
                    name="Purchase Orders"
                    dot={{ fill: '#0097A7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No purchase order data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock In Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stock Receiving</span>
              <ArrowUpCircle className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days stock received</p>
          </CardHeader>
          <CardContent>
            {chartData?.stock_in_chart && chartData.stock_in_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.stock_in_chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" fontSize={12} stroke="#888888" />
                  <YAxis fontSize={12} stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Stock In"
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No stock in data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stock Requests</span>
              <Clipboard className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days stock requests</p>
          </CardHeader>
          <CardContent>
            {chartData?.stock_requests_chart && chartData.stock_requests_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.stock_requests_chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" fontSize={12} stroke="#888888" />
                  <YAxis fontSize={12} stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Stock Requests"
                    dot={{ fill: '#f59e0b' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No stock request data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Latest procurement activities</p>
          </CardHeader>
          <CardContent>
            {chartData?.recent_activity && chartData.recent_activity.length > 0 ? (
              <div className="space-y-4">
                {chartData.recent_activity.map((activity: any) => {
                  const colorMap: Record<string, string> = {
                    success: 'bg-green-500',
                    info: 'bg-blue-500',
                    warning: 'bg-orange-500',
                    error: 'bg-red-500',
                  };
                  const dotColor = colorMap[activity.type] || 'bg-gray-500';

                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${dotColor} mt-2`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} • {activity.created_at}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Movement Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Stock Movement</span>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days stock in vs stock out</p>
          </CardHeader>
          <CardContent>
            {chartData?.stock_trend && chartData.stock_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.stock_trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="day" fontSize={12} stroke="#888888" />
                  <YAxis fontSize={12} stroke="#888888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="stockIn"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Stock In"
                    dot={{ fill: '#10b981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="stockOut"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Stock Out"
                    dot={{ fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No stock movement data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            Quick Actions
          </CardTitle>
          <p className="text-sm text-muted-foreground">Common procurement tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/admin/purchase-orders/create" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Create PO
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      New purchase order
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/stock-in/create" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <ArrowUpCircle className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Receive Stock
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Record incoming shipment
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/suppliers" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                    <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Manage Suppliers
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      View and edit suppliers
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/stock-requests" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <Clipboard className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      View Requests
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Review stock requests
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProcurementDashboard;