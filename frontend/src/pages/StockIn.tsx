import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StockInAPI } from '../lib/api';
import {
  PackagePlus,
  Search,
  Plus,
  Eye,
  AlertCircle,
  Truck,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface StockIn {
  id: number;
  item_id: number;
  item: {
    id: number;
    name: string;
    item_code: string;
  };
  supplier_id: number;
  supplier: {
    id: number;
    name: string;
  };
  quantity_received: number;
  received_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const StockIn: React.FC = () => {
  const { user } = useAuth();
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStockIns = async () => {
    try {
      setIsLoading(true);
      const response = await StockInAPI.getStockIns();
      if (response.data.data) {
        setStockIns(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stock in records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockIns();
  }, []);

  const filteredStockIns = stockIns.filter((stockIn) => {
    const matchesSearch =
      stockIn.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockIn.item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockIn.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Stock In"
        subtitle="Loading stock in records..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock in records...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Stock In"
      subtitle={`${filteredStockIns.length} records found`}
      showSearch={false}
    >
      <div className="space-y-6">
        {/* READ-ONLY Notice for Super Admin and System Admin */}
        {(user?.role === 'super_admin' || user?.role === 'admin') && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Read-Only Access
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  You have oversight access to view stock in records. Only Procurement Officers can record incoming stock. Stock In records are immutable for audit compliance.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock In</h1>
            <p className="text-muted-foreground">Record incoming stock and update inventory</p>
          </div>
          {user?.role === 'procurement_officer' && (
            <Link to="/admin/stock-in/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Stock In
              </Button>
            </Link>
          )}
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by item name, code, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stock In Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock In Records ({filteredStockIns.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Code</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Received Date</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockIns.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No stock in records found
                      </td>
                    </tr>
                  ) : (
                    filteredStockIns.map((stockIn) => (
                      <tr key={stockIn.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{stockIn.item.item_code}</td>
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {stockIn.item.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            {stockIn.supplier.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          +{stockIn.quantity_received}
                        </td>
                        <td className="py-3 px-4">{formatDate(stockIn.received_date)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/stock-in/${stockIn.id}`}>
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {/* Stock In records are immutable - no edit/delete buttons */}
                          </div>
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
    </DashboardLayout>
  );
};

export default StockIn;
