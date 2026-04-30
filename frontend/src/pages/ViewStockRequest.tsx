import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StockRequestAPI } from '../lib/api';
import {
  ArrowLeft,
  Package,
  User,
  Calendar,
  Hash,
  Truck,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface StockRequest {
  id: number;
  request_number: string;
  item: {
    id: number;
    name: string;
    item_code: string;
  };
  supplier: {
    id: number;
    name: string;
  } | null;
  quantity_requested: number;
  requested_by_user: {
    id: number;
    name: string;
    email: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  notes: string | null;
  rejection_reason: string | null;
  requested_date: string;
  completed_date: string | null;
  created_at: string;
  updated_at: string;
}

const ViewStockRequest: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<StockRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setIsLoading(true);
      const response = await StockRequestAPI.getStockRequest(parseInt(id!));
      if (response.data.success) {
        setRequest(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stock request:', error);
      alert('Failed to load stock request');
      navigate('/admin/stock-requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request) return;

    try {
      setIsProcessing(true);
      const response = await StockRequestAPI.updateStockRequestStatus(request.id, {
        status: 'Approved',
      });

      if (response.data.success) {
        setShowApproveDialog(false);
        fetchRequest(); // Refresh data
        alert('Stock request approved successfully. Stock has been added to inventory.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve stock request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setIsProcessing(true);
      const response = await StockRequestAPI.updateStockRequestStatus(request.id, {
        status: 'Rejected',
        rejection_reason: rejectionReason,
      });

      if (response.data.success) {
        setShowRejectDialog(false);
        fetchRequest(); // Refresh data
        alert('Stock request rejected successfully.');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject stock request');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
      Approved: { bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      Rejected: { bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
      Completed: { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
    };
    return badges[status as keyof typeof badges] || badges.Pending;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canApproveReject = user?.role === 'procurement_officer' && request?.status === 'Pending';

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Stock Request Details"
        subtitle="Loading..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock request...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!request) {
    return (
      <DashboardLayout 
        title="Stock Request Not Found"
        subtitle="The requested stock request could not be found"
        showSearch={false}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Stock request not found</p>
            <Button onClick={() => navigate('/admin/stock-requests')} className="mt-4">
              Back to Stock Requests
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusBadge(request.status);
  const StatusIcon = statusInfo.icon;

  return (
    <DashboardLayout
      title="Stock Request Details"
      subtitle={`Request #${request.request_number}`}
      showSearch={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/stock-requests')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stock Requests
        </Button>

        {/* Status Banner */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Request #{request.request_number}</h2>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg}`}>
                  <StatusIcon className="h-4 w-4" />
                  {request.status}
                </span>
              </div>
              {canApproveReject && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectDialog(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => setShowApproveDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Request Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Item Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Item Name</Label>
                <p className="font-medium">{request.item.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Item Code</Label>
                <p className="font-mono text-sm">{request.item.item_code}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Quantity Requested</Label>
                <p className="font-medium text-lg">{request.quantity_requested}</p>
              </div>
            </CardContent>
          </Card>

          {/* Request Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Requested By
                </Label>
                <p className="font-medium">{request.requested_by_user.name}</p>
                <p className="text-sm text-muted-foreground">{request.requested_by_user.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Requested Date
                </Label>
                <p className="font-medium">{formatDate(request.requested_date)}</p>
              </div>
              {request.supplier && (
                <div>
                  <Label className="text-muted-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Preferred Supplier
                  </Label>
                  <p className="font-medium">{request.supplier.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        {request.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{request.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Rejection Reason */}
        {request.status === 'Rejected' && request.rejection_reason && (
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="h-5 w-5" />
                Rejection Reason
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">{request.rejection_reason}</p>
            </CardContent>
          </Card>
        )}

        {/* Completion Info */}
        {request.completed_date && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                This request was completed on {formatDate(request.completed_date)}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Approve Dialog */}
      {showApproveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle>Approve Stock Request</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will add stock to inventory
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to approve this stock request?
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>{request.quantity_requested}</strong> units of <strong>{request.item.name}</strong> will be added to inventory.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveDialog(false)}
                  disabled={isProcessing}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Approving...' : 'Approve'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Reject Stock Request</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please provide a reason
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="rejection_reason">
                    Rejection Reason <span className="text-red-500">*</span>
                  </Label>
                  <textarea
                    id="rejection_reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this request is being rejected..."
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md bg-background border-input resize-none mt-2"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectDialog(false);
                      setRejectionReason('');
                    }}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={isProcessing || !rejectionReason.trim()}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isProcessing ? 'Rejecting...' : 'Reject'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewStockRequest;
