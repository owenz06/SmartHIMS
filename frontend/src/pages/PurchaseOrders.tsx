import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PurchaseOrderAPI } from '../lib/api';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface PurchaseOrderItem {
  id: number;
  item_id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    item_code: string;
  };
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier: {
    id: number;
    name: string;
  };
  order_date: string;
  status: 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

const PurchaseOrders: React.FC = () => {
  const { user } = useAuth();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPurchaseOrders = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const response = await PurchaseOrderAPI.getPurchaseOrders(params);
      // Handle paginated response
      if (response.data.data) {
        setPurchaseOrders(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch purchase orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [filterStatus]);

  const handleDelete = async () => {
    if (!poToDelete) return;

    try {
      setIsDeleting(true);
      const response = await PurchaseOrderAPI.deletePurchaseOrder(poToDelete.id);
      if (response.data.success) {
        setPurchaseOrders(purchaseOrders.filter(po => po.id !== poToDelete.id));
        setShowDeleteDialog(false);
        setPoToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete purchase order');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
      Approved: { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
      Received: { bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Package },
      Cancelled: { bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

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
        title="Purchase Orders"
        subtitle="Loading purchase orders..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading purchase orders...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Purchase Orders"
      subtitle={`${filteredPurchaseOrders.length} purchase orders found`}
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
                  You have oversight access to view purchase orders. Only Procurement Officers can create or edit purchase orders.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Purchase Orders</h1>
            <p className="text-muted-foreground">Manage purchase orders and supplier deliveries</p>
          </div>
          {user?.role === 'procurement_officer' && (
            <Link to="/admin/purchase-orders/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create PO
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by PO number or supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'Pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('Pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filterStatus === 'Approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('Approved')}
                >
                  Approved
                </Button>
                <Button
                  variant={filterStatus === 'Received' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('Received')}
                >
                  Received
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders ({filteredPurchaseOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">PO Number</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Supplier</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Order Date</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Items</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchaseOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No purchase orders found
                      </td>
                    </tr>
                  ) : (
                    filteredPurchaseOrders.map((po) => {
                      const statusInfo = getStatusBadge(po.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <tr key={po.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-mono text-sm font-medium">{po.po_number}</td>
                          <td className="py-3 px-4">{po.supplier.name}</td>
                          <td className="py-3 px-4">{formatDate(po.order_date)}</td>
                          <td className="py-3 px-4 text-center">{po.items.length}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {po.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/admin/purchase-orders/${po.id}`}>
                                <Button variant="ghost" size="sm" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              {po.status === 'Pending' && user?.role === 'procurement_officer' && (
                                <>
                                  <Link to={`/admin/purchase-orders/${po.id}/edit`}>
                                    <Button variant="ghost" size="sm" title="Edit">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="Delete"
                                    onClick={() => {
                                      setPoToDelete(po);
                                      setShowDeleteDialog(true);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && poToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete Purchase Order</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete purchase order <strong>{poToDelete.po_number}</strong>?
                This will permanently remove the purchase order and all its items.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setPoToDelete(null);
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

export default PurchaseOrders;
