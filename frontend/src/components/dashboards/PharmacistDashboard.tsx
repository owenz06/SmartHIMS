import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  FileText,
  Activity,
  ChevronRight,
  Pill,
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

interface PharmacistDashboardProps {
  stats: any;
  chartData: any;
  user: any;
}

const PharmacistDashboard: React.FC<PharmacistDashboardProps> = ({ stats, chartData, user }) => {
  const [showLowStockDetails, setShowLowStockDetails] = useState(false);

  return (
    <>
      {/* Stats Grid */}
      <div className="dashboard-grid grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
        {/* Total Items */}
        <Link to="/admin/inventory">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Available Items</CardTitle>
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

        {/* Out of Stock */}
        <Link to="/admin/inventory">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="dashboard-card-icon text-red-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-red-500">
                {stats.inventory.out_of_stock_items}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* My Requisitions */}
        <Link to="/admin/requisitions">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">My Requisitions</CardTitle>
              <FileText className="dashboard-card-icon text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Total:</p>
                  <p className="dashboard-card-number font-bold">{stats.requisitions.total}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Pending:</p>
                  <p className="text-sm font-semibold">{stats.requisitions.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Dispensed This Week */}
        <Link to="/stock-out">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Dispensed (Week)</CardTitle>
              <Pill className="dashboard-card-icon text-green-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-green-600">
                {stats.dispensing.weekly}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </Link>

        {/* Dispensed This Month */}
        <Link to="/stock-out">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Dispensed (Month)</CardTitle>
              <Activity className="dashboard-card-icon text-blue-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-blue-600">
                {stats.dispensing.monthly}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Alerts Section */}
      {(stats.inventory.low_stock_items > 0 || stats.inventory.out_of_stock_items > 0) && (
        <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                    Inventory Alerts
                  </h3>
                  <div className="space-y-2">
                    {stats.inventory.out_of_stock_items > 0 && (
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <span className="font-medium">{stats.inventory.out_of_stock_items}</span> items are out
                        of stock. Consider creating a requisition.
                      </p>
                    )}
                    {stats.inventory.low_stock_items > 0 && (
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <span className="font-medium">{stats.inventory.low_stock_items}</span> items are running
                        low. You may need to request stock soon.
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
                        <Link to="/admin/inventory">
                          <Button size="sm" variant="outline">View</Button>
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
        {/* Dispensing Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Dispensing Activity</span>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days dispensing records</p>
          </CardHeader>
          <CardContent>
            {chartData?.dispensing_chart && chartData.dispensing_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.dispensing_chart}>
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
                    name="Dispensed"
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No dispensing data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Requisitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>My Requisitions</span>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Last 7 days requisition requests</p>
          </CardHeader>
          <CardContent>
            {chartData?.requisitions_chart && chartData.requisitions_chart.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.requisitions_chart}>
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
                    name="Requisitions"
                    dot={{ fill: '#0097A7' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No requisition data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Movement Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Overall Stock Movement</span>
              <Package className="h-5 w-5 text-muted-foreground" />
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
          <p className="text-sm text-muted-foreground">Common tasks for pharmacists</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Link to="/stock-out" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <Pill className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Dispense Stock
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Record medication dispensing
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/requisitions/create" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      Create Requisition
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Request stock from manager
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors" />
              </div>
            </Link>

            <Link to="/admin/inventory" className="group">
              <div className="relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg hover:scale-105 active:scale-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                    <Package className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      View Inventory
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check available stock levels
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

export default PharmacistDashboard;
