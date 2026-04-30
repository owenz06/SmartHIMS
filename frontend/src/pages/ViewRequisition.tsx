import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RequisitionAPI } from '../lib/api';
import {
  ClipboardList,
  ArrowLeft,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
  Calendar,
  Hash,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';

interface RequisitionItem {
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

interface Requisition {
  id: number;
  requisition_number: string;
  department_id: number;
  department: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  requested_date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fulfilled';
  items: RequisitionItem[];
  created_at: string;
  updated_at: string;
}

const ViewRequisition: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [requisition, setRequisition] = useState<Requisition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchRequisition();
    }
  }, [id]);

  const fetchRequisition = async () => {
    try {
      setIsLoading(true);
      const response = await RequisitionAPI.getRequisition(Number(id));
      setRequisition(response.data);
    } catch (error) {
      console.error('Failed to fetch requisition:', error);
      alert('Failed to load requisition details');
      navigate('/admin/requisitions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!requisition) return;

    if (!confirm('Approve this requisition?')) return;

    try {
      setIsUpdatingStatus(true);
      const response = await RequisitionAPI.approveRequisition(requisition.id);
      if (response.data.success) {
        setRequisition(response.data.data);
        alert('Requisition approved successfully');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to approve requisition');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReject = async () => {
    if (!requisition) return;

    if (!confirm('Reject this requisition?')) return;

    try {
      setIsUpdatingStatus(true);
      const response = await RequisitionAPI.updateRequisition(requisition.id, {
        ...requisition,
        status: 'Rejected',
        items: requisition.items.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      });

      if (response.data.success) {
        setRequisition(response.data.data);
        alert('Requisition rejected');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to reject requisition');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
      Approved: { bg: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      Fulfilled: { bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      Rejected: { bg: 'bg-red-100 text-red-800', icon: XCircle },
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
        title="Requisition Details"
        subtitle="Loading..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading requisition...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!requisition) {
    return (
      <DashboardLayout 
        title="Requisition Not Found"
        subtitle="The requested requisition could not be found"
        showSearch={false}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Requisition not found</p>
            <Button onClick={() => navigate('/admin/requisitions')}>
              Back to Requisitions
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const statusInfo = getStatusBadge(requisition.status);
  const StatusIcon = statusInfo.icon;

  return (
    <DashboardLayout
      title={`REQ ${requisition.requisition_number}`}
      subtitle={`Status: ${requisition.status}`}
      showSearch={false}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/requisitions')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requisitions
        </Button>

        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{requisition.requisition_number}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg}`}>
                      <StatusIcon className="h-4 w-4" />
                      {requisition.status}
                    </span>
                  </div>
                </div>
              </div>
              {requisition.status === 'Pending' && (
                <Link to={`/admin/requisitions/${requisition.id}/edit`}>
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
          {/* Requisition Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requisition Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Requisition Number</p>
                  <p className="font-medium">{requisition.requisition_number}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Requested Date</p>
                  <p className="font-medium">{formatDate(requisition.requested_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{requisition.department.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requester Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requested By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{requisition.user.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{requisition.user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Requested Items ({requisition.items.length})</CardTitle>
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
                  {requisition.items.map((item) => (
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
                {requisition.status === 'Pending' && (
                  <>
                    <Button
                      onClick={handleApprove}
                      disabled={isUpdatingStatus}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Requisition
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={isUpdatingStatus}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Requisition
                    </Button>
                  </>
                )}
                {requisition.status === 'Approved' && (
                  <p className="text-sm text-muted-foreground py-2">
                    This requisition has been approved and is ready for fulfillment.
                  </p>
                )}
                {requisition.status === 'Fulfilled' && (
                  <p className="text-sm text-muted-foreground py-2">
                    This requisition has been fulfilled.
                  </p>
                )}
                {requisition.status === 'Rejected' && (
                  <p className="text-sm text-muted-foreground py-2">
                    This requisition has been rejected.
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

export default ViewRequisition;
