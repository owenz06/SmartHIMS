import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PurchaseOrderAPI } from '../lib/api';
import {
  FileText,
  ArrowLeft,
  Edit,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  Truck,
  Calendar,
  Hash,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';

interface PurchaseOrderItem {
  id: number;
  item_id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    item_code: string;
    unit_of_measurement: string;
  };
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier: {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
  };
  order_date: string;
  status: 'Pending' | 'Approved' | 'Received' | 'Cancelled';
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

const ViewPurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPurchaseOrder();
    }
  }, [id]);

  const fetchPurchaseOrder = async () => {
    try {
      setIsLoading(true);
      const response = await PurchaseOrderAPI.getPurchaseOrder(Number(id));
      setPurchaseOrder(response.data);
    } catch (error) {
      console.error('Failed to fetch purchase order:', error);
      alert('Failed to load purchase order details');
      navigate('/admin/purchase-orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!purchaseOrder) return;

    const confirmMessage = 
      newStatus === 'Approved' ? 'Approve this purchase order? An email will be sent to the supplier.' :
      newStatus === 'Received' ? 'Mark as received? This will update inventory quantities.' :
      newStatus === 'Cancelled' ? 'Cancel this purchase order?' :
      'Update status?';

    if (!confirm(confirmMessage)) return;

    try {
      setIsUpdatingStatus(true);
      const response = await PurchaseOrderAPI.updatePurchaseOrder(purchaseOrder.id, {
        ...purchaseOrder,
        status: newStatus,
        items: purchaseOrder.items.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      });

      if (response.data.success) {
        setPurchaseOrder(response.data.data);
        alert('Status updated successfully');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
      Approved: { bg: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      Received: { bg: 'bg-green-100 text-green-800', icon: Package },
      Cancelled: { bg: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Purchase Order Details"
        subtitle="Loading..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading purchase order...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!purchaseOrder) {
    return (
      <DashboardLayout 
        title="Purchase Order Not Found"
        subtitle="The requested purchase order could not be found"
        showSearch={false}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Purchase order not found</p>
            <Button onClick={() => navigate('/admin/purchase-orders')}>
              Back to Purchase Orders
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusBadge(purchaseOrder.status);
  const StatusIcon = statusInfo.icon;

  return (
    <DashboardLayout
      title={`PO ${purchaseOrder.po_number}`}
      subtitle={`Status: ${purchaseOrder.status}`}
      showSearch={false}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/purchase-orders')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Purchase Orders
        </Button>

        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{purchaseOrder.po_number}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg}`}>
                      <StatusIcon className="h-4 w-4" />
                      {purchaseOrder.status}
                    </span>
                  </div>
                </div>
              </div>
              {purchaseOrder.status === 'Pending' && (user?.role === 'super_admin' || user?.role === 'admin') && (
                <Link to={`/admin/purchase-orders/${purchaseOrder.id}/edit`}>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">PO Number</p>
                  <p className="font-medium">{purchaseOrder.po_number}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{formatDate(purchaseOrder.order_date)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Supplier Name</p>
                  <p className="font-medium">{purchaseOrder.supplier.name}</p>
                </div>
              </div>
              {purchaseOrder.supplier.contact_person && (
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{purchaseOrder.supplier.contact_person}</p>
                </div>
              )}
              {purchaseOrder.supplier.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{purchaseOrder.supplier.email}</p>
                </div>
              )}
              {purchaseOrder.supplier.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{purchaseOrder.supplier.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items ({purchaseOrder.items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Code</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item Name</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-4 font-mono text-sm">{item.item.item_code}</td>
                      <td className="py-3 px-4 font-medium">{item.item.name}</td>
                      <td className="py-3 px-4 text-right font-medium">{item.quantity}</td>
                      <td className="py-3 px-4">{item.item.unit_of_measurement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Status Actions */}
        {(user?.role === 'super_admin' || user?.role === 'admin') && (
          <Card>
            <CardHeader>
              <CardTitle>Status Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {purchaseOrder.status === 'Pending' && (
                  <>
                    <Button
                      onClick={() => handleStatusChange('Approved')}
                      disabled={isUpdatingStatus}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Order
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange('Cancelled')}
                      disabled={isUpdatingStatus}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
                    </Button>
                  </>
                )}
                {purchaseOrder.status === 'Approved' && (
                  <Button
                    onClick={() => handleStatusChange('Received')}
                    disabled={isUpdatingStatus}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Received
                  </Button>
                )}
                {purchaseOrder.status === 'Received' && (
                  <p className="text-sm text-muted-foreground py-2">
                    This purchase order has been received and inventory has been updated.
                  </p>
                )}
                {purchaseOrder.status === 'Cancelled' && (
                  <p className="text-sm text-muted-foreground py-2">
                    This purchase order has been cancelled.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewPurchaseOrder;
