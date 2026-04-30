import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  DollarSign,
  FileText,
  TrendingUp,
  Clipboard,
  ArrowUpCircle,
  ArrowDownCircle,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface ManagerDashboardProps {
  stats: any;
  chartData: any;
  user: any;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ stats, chartData, user }) => {
  const [showLowStockDetails, setShowLowStockDetails] = useState(false);

  return (
    <>
      {/* Stats Grid */}
      <div className="dashboard-grid grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
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

        {/* Inventory Value */}
        <Card className="dashboard-card">
          <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="dashboard-card-title font-medium">Inventory Value</CardTitle>
            <DollarSign className="dashboard-card-icon text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="dashboard-card-number font-bold">
              {typeof stats.inventory.total_value === 'number'
                ? stats.inventory.total_value.toLocaleString()
                : stats.inventory.total_value}
            </div>
          </CardContent>
        </Card>

        {/* Requisitions */}
        <Link to="/admin/requisitions">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Requisitions</CardTitle>
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

        {/* My Stock Requests */}
        <Link to="/stock-requests">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">My Stock Requests</CardTitle>
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

        {/* Stock Out (Weekly) */}
        <Link to="/stock-out">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Stock Out (Week)</CardTitle>
              <ArrowDownCircle className="dashboard-card-icon text-red-500" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold text-red-600">
                {stats.stock_movements.stock_out_weekly}
              </div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </Link>

        {/* Categories */}
        <Link to="/admin/categories">
          <Card className="dashboard-card cursor-pointer transition-all hover:shadow-lg hover:border-primary">
            <CardHeader className="dashboard-card-header flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="dashboard-card-title font-medium">Categories</CardTitle>
              <Layers className="dashboard-card-icon text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="dashboard-card-number font-bold">{stats.categories.total}</div>
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
                        of stock and need immediate attention.
                      </p>
                    )}
                    {stats.inventory.low_stock_items > 0 && (
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <span className="font-medium">{stats.inventory.low_stock_items}</span> items are running
                        low. Consider creating a stock request.
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
                        <Link to="/stock-requests/add">
                          <Button size="sm" variant="outline">Request Stock</Button>
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
        {/* Stock Movement Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Stock Movement Trend</span>
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

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inventory by Category</span>
              <Package className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Distribution of items across categories</p>
          </CardHeader>
          <CardContent>
            {chartData?.category_distribution && chartData.category_distribution.length > 0 ? (
              <div className="space-y-3">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.category_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.category_distribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {chartData.category_distribution.slice(0, 6).map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="truncate" title={entry.name}>
                        {entry.name.length > 20 ? entry.name.substring(0, 20) + '...' : entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                <p>No category data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requisitions Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Requisitions (Last 7 Days)</span>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
            <p className="text-sm text-muted-foreground">Daily requisition requests</p>
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

        {/* Department Usage */}
        {chartData?.department_usage && chartData.department_usage.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Usage by Department</span>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">Top departments by usage</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chartData.department_usage.map((dept: any, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate" title={dept.department}>
                        {dept.department}
                      </span>
                      <span className="text-muted-foreground ml-2">{dept.usage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0097A7] h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            chartData.department_usage.length > 0
                              ? (dept.usage / Math.max(...chartData.department_usage.map((d: any) => d.usage))) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default ManagerDashboard;
