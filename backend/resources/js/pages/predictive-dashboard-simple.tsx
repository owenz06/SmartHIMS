import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PredictiveDashboard({ stats, alerts, topItems, demandForecast }: any) {
  console.log('Predictive Dashboard Props:', { stats, alerts, topItems, demandForecast });
  
  return (
    <>
      <Head title="Predictive Dashboard" />
      
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Predictive Dashboard</h1>
          <p className="text-gray-600">AI-powered insights for proactive inventory management</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalItems || 0}</div>
              <p className="text-xs text-gray-500">Active inventory items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.lowStockItems || 0}</div>
              <p className="text-xs text-gray-500">Below reorder point</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Predicted Stockouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.predictedStockouts || 0}</div>
              <p className="text-xs text-gray-500">Next 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
              <p className="text-xs text-gray-500">Awaiting delivery</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Predictive Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alerts && alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert: any) => (
                  <div key={alert.id} className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold">{alert.itemName}</h3>
                    <p className="text-sm text-gray-600">Current Stock: {alert.currentStock}</p>
                    <p className="text-sm text-gray-600">Predicted Stockout: {alert.predictedStockout}</p>
                    <p className="text-sm text-gray-600">Days Until Stockout: {alert.daysUntilStockout}</p>
                    <p className="text-sm mt-2">{alert.recommendedAction}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No alerts at this time</p>
            )}
          </CardContent>
        </Card>
        
        {/* Top Items */}
        <Card>
          <CardHeader>
            <CardTitle>High-Priority Items</CardTitle>
          </CardHeader>
          <CardContent>
            {topItems && topItems.length > 0 ? (
              <div className="space-y-3">
                {topItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Stock: {item.currentStock}</p>
                      <p className="text-sm text-gray-500">Reorder: {item.reorderPoint}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items to display</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

PredictiveDashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;
