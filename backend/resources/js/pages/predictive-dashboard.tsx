import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { StatCard } from '@/components/ui/stat-card';
import { PredictiveAlert } from '@/components/ui/predictive-alert';
import { DemandChart } from '@/components/ui/demand-chart';
import { StockLevelIndicator } from '@/components/ui/stock-level-indicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Activity,
  Calendar,
  Filter,
  Download,
} from 'lucide-react';

interface PredictiveDashboardProps {
  stats: {
    totalItems: number;
    lowStockItems: number;
    predictedStockouts: number;
    pendingOrders: number;
  };
  alerts: Array<{
    id: number;
    itemName: string;
    currentStock: number;
    predictedStockout: string;
    daysUntilStockout: number;
    severity: 'critical' | 'warning' | 'info';
    recommendedAction: string;
  }>;
  topItems: Array<{
    id: number;
    name: string;
    category: string;
    currentStock: number;
    reorderPoint: number;
    maxStock: number;
    demandTrend: number;
  }>;
  demandForecast: Array<{
    date: string;
    actual?: number;
    predicted: number;
  }>;
}

export default function PredictiveDashboard({
  stats,
  alerts,
  topItems,
  demandForecast,
}: PredictiveDashboardProps) {
  return (
    <>
      <Head title="Predictive Dashboard" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Predictive Dashboard</h1>
            <p className="text-muted-foreground">
              AI-powered insights for proactive inventory management
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            icon={Package}
            trend={{ value: 12, isPositive: true }}
            description="Active inventory items"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon={AlertTriangle}
            variant="warning"
            description="Below reorder point"
          />
          <StatCard
            title="Predicted Stockouts"
            value={stats.predictedStockouts}
            icon={TrendingUp}
            variant="danger"
            description="Next 30 days"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={ShoppingCart}
            description="Awaiting delivery"
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Alerts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Predictive Alerts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Predictive Alerts
                    </CardTitle>
                    <CardDescription>
                      AI-predicted stockouts based on usage patterns
                    </CardDescription>
                  </div>
                  <Badge variant="destructive">{alerts.length} Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.slice(0, 5).map((alert) => (
                  <PredictiveAlert
                    key={alert.id}
                    itemName={alert.itemName}
                    currentStock={alert.currentStock}
                    predictedStockout={alert.predictedStockout}
                    daysUntilStockout={alert.daysUntilStockout}
                    severity={alert.severity}
                    recommendedAction={alert.recommendedAction}
                    onAction={() => console.log('Create PO for', alert.itemName)}
                  />
                ))}
                {alerts.length > 5 && (
                  <Button variant="outline" className="w-full">
                    View All {alerts.length} Alerts
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Demand Forecast Chart */}
            <DemandChart
              title="Overall Demand Forecast"
              data={demandForecast}
              unit="items"
              trend={{ value: 8.5, isPositive: true }}
            />
          </div>

          {/* Right Column - Top Items */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>High-Priority Items</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {topItems.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                      <Badge
                        variant={item.demandTrend > 0 ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {item.demandTrend > 0 ? '+' : ''}
                        {item.demandTrend}%
                      </Badge>
                    </div>
                    <StockLevelIndicator
                      current={item.currentStock}
                      reorderPoint={item.reorderPoint}
                      maximum={item.maxStock}
                      showLabel={false}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Purchase Order
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Stock In
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Analytics Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs for Additional Views */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="suppliers">By Supplier</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest inventory movements and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Activity timeline will be displayed here...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

PredictiveDashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;
