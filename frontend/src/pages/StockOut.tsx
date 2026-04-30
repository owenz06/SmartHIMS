import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StockOutAPI } from '../lib/api';
import {
  PackageMinus,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  User,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface StockOut {
  id: number;
  item_id: number;
  item: {
    id: number;
    name: string;
    item_code: string;
  };
  user_id: number;
  user: {
    id: number;
    name: string;
  };
  quantity_taken: number;
  dispensed_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const StockOut: React.FC = () => {
  const { user } = useAuth();
  const [stockOuts, setStockOuts] = useState<StockOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stockOutToDelete, setStockOutToDelete] = useState<StockOut | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStockOuts = async () => {
    try {
      setIsLoading(true);
      const response = await StockOutAPI.getStockOuts();
      if (response.data.data) {
        setStockOuts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stock out records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockOuts();
  }, []);

  const handleDelete = async () => {
    if (!stockOutToDelete) return;

    try {
      setIsDeleting(true);
      const response = await StockOutAPI.deleteStockOut(stockOutToDelete.id);
      if (response.data.success) {
        setStockOuts(stockOuts.filter(so => so.id !== stockOutToDelete.id));
        setShowDeleteDialog(false);
        setStockOutToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete stock out record');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredStockOuts = stockOuts.filter((stockOut) => {
    const matchesSearch =
      stockOut.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockOut.item.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stockOut.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stockOut.dispensed_to && stockOut.dispensed_to.toLowerCase().includes(searchTerm.toLowerCase()));
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
        title="Stock Out"
        subtitle="Loading stock out records..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock out records...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Stock Out"
      subtitle={`${filteredStockOuts.length} records found`}
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
                  You have oversight access to view stock out records. Only Managers and Pharmacists can dispense stock.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Out</h1>
            <p className="text-muted-foreground">Dispense items and record stock outflows</p>
          </div>
          {(user?.role === 'manager' || user?.role === 'pharmacist') && (
            <Link to="/stock-out/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Dispense Stock
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
                placeholder="Search by item name, code, user, or dispensed to..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stock Out Table */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Out Records ({filteredStockOuts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Code</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Name</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Dispensed To</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">By</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStockOuts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        No stock out records found
                      </td>
                    </tr>
                  ) : (
                    filteredStockOuts.map((stockOut) => (
                      <tr key={stockOut.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{stockOut.item.item_code}</td>
                        <td className="py-3 px-4 font-medium">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {stockOut.item.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-red-600">
                          -{stockOut.quantity_taken}
                        </td>
                        <td className="py-3 px-4">{stockOut.dispensed_to || '-'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {stockOut.user.name}
                          </div>
                        </td>
                        <td className="py-3 px-4">{formatDate(stockOut.created_at)}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/stock-out/${stockOut.id}`}>
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {user?.role === 'manager' && stockOut.user_id === user.id && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                title="Delete"
                                onClick={() => {
                                  setStockOutToDelete(stockOut);
                                  setShowDeleteDialog(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
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

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && stockOutToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete Stock Out Record</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete this stock out record for <strong>{stockOutToDelete.item.name}</strong>?
                This will reverse the inventory update (add back {stockOutToDelete.quantity_taken} units).
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setStockOutToDelete(null);
                  }}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StockOut;
