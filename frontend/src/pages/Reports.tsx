import React, { useEffect, useState } from 'react';
import { ReportAPI } from '../lib/api';
import {
  FileText,
  TrendingDown,
  TrendingUp,
  Package,
  AlertTriangle,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  ShoppingCart,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface ReportData {
  date_range: {
    start: string;
    end: string;
  };
  monthly_usage: any[];
  most_used_items: Array<{
    item_id: number;
    item_name: string;
    total_used: number;
  }>;
  low_stock_items: Array<{
    id: number;
    name: string;
    sku: string;
    quantity: number;
    reorder_point: number;
    category: string;
  }>;
  reorder_suggestions: Array<{
    id: number;
    name: string;
    sku: string;
    current_stock: number;
    monthly_avg: number;
    suggested_reorder: number;
    reorder_point: number;
    needs_reorder: boolean;
  }>;
  stock_movement: {
    stock_in: number;
    stock_out: number;
    net_change: number;
  };
  purchase_orders: {
    total: number;
    pending: number;
    approved: number;
    received: number;
  };
  requisitions: {
    total: number;
    pending: number;
    approved: number;
    fulfilled: number;
  };
}

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of current year
    end_date: new Date().toISOString().split('T')[0],
  });

  const fetchReports = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      const response = await ReportAPI.getReports(dateRange);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = () => {
    fetchReports(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Reports & Analytics"
        subtitle="Loading reports..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!reportData) {
    return (
      <DashboardLayout 
        title="Reports & Analytics"
        subtitle="No data available"
        showSearch={false}
      >
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No report data available</h3>
              <p className="text-muted-foreground">Try adjusting your date range</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Reports & Analytics"
      subtitle="Inventory insights and analytics"
      showSearch={false}
    >
      <div className="space-y-6">
        {/* Date Range Filter */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>Report Period</CardTitle>
              </div>
              <Button
                onClick={handleGenerateReport}
                disabled={isRefreshing}
                size="sm"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={dateRange.start_date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={dateRange.end_date}
                  onChange={handleDateChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock In</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                +{reportData.stock_movement.stock_in}
              </div>
              <p className="text-xs text-muted-foreground">Items received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Out</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                -{reportData.stock_movement.stock_out}
              </div>
              <p className="text-xs text-muted-foreground">Items dispensed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Change</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${reportData.stock_movement.net_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.stock_movement.net_change >= 0 ? '+' : ''}{reportData.stock_movement.net_change}
              </div>
              <p className="text-xs text-muted-foreground">Overall change</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {reportData.low_stock_items.length}
              </div>
              <p className="text-xs text-muted-foreground">Need reordering</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchase Orders & Requisitions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <CardTitle>Purchase Orders</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-semibold">{reportData.purchase_orders.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">{reportData.purchase_orders.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="text-sm font-medium text-blue-600">{reportData.purchase_orders.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Received</span>
                  <span className="text-sm font-medium text-green-600">{reportData.purchase_orders.received}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ClipboardList className="h-5 w-5 text-primary" />
                <CardTitle>Requisitions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-semibold">{reportData.requisitions.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending</span>
                  <span className="text-sm font-medium text-yellow-600">{reportData.requisitions.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Approved</span>
                  <span className="text-sm font-medium text-blue-600">{reportData.requisitions.approved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fulfilled</span>
                  <span className="text-sm font-medium text-green-600">{reportData.requisitions.fulfilled}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Most Used Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Most Used Items</CardTitle>
              </div>
              <span className="text-sm text-muted-foreground">Top 10</span>
            </div>
          </CardHeader>
          <CardContent>
            {reportData.most_used_items.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No usage data for this period</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportData.most_used_items.map((item, index) => (
                  <div key={item.item_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{item.item_name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{item.total_used} units</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        {reportData.low_stock_items.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <CardTitle>Low Stock Alert</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">SKU</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Current</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Reorder Point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reportData.low_stock_items.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.sku}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.category}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-orange-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground">{item.reorder_point}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reorder Suggestions */}
        {reportData.reorder_suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-primary" />
                <CardTitle>Reorder Suggestions</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on 3-month average usage
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Item</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">SKU</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Current Stock</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Monthly Avg</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Suggested Order</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reportData.reorder_suggestions.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.sku}</td>
                        <td className="px-4 py-3 text-sm text-right">{item.current_stock}</td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground">{item.monthly_avg}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-primary">{item.suggested_reorder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
