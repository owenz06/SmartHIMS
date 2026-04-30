import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RequisitionAPI } from '../lib/api';
import {
  ClipboardList,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface RequisitionItem {
  id: number;
  item_id: number;
  quantity: number;
  item: {
    id: number;
    name: string;
    item_code: string;
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
  };
  requested_date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Fulfilled';
  items: RequisitionItem[];
  created_at: string;
  updated_at: string;
}

const Requisitions: React.FC = () => {
  const { user } = useAuth();
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reqToDelete, setReqToDelete] = useState<Requisition | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequisitions = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }
      const response = await RequisitionAPI.getRequisitions(params);
      // Handle paginated response
      if (response.data.data) {
        setRequisitions(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch requisitions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, [filterStatus]);

  const handleDelete = async () => {
    if (!reqToDelete) return;

    try {
      setIsDeleting(true);
      const response = await RequisitionAPI.deleteRequisition(reqToDelete.id);
      if (response.data.success) {
        setRequisitions(requisitions.filter(req => req.id !== reqToDelete.id));
        setShowDeleteDialog(false);
        setReqToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete requisition');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredRequisitions = requisitions.filter((req) => {
    const matchesSearch =
      req.requisition_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
      Approved: { bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
      Fulfilled: { bg: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: CheckCircle },
      Rejected: { bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
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
        title="Requisitions"
        subtitle="Loading requisitions..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading requisitions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Requisitions"
      subtitle={`${filteredRequisitions.length} requisitions found`}
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
                  You have oversight access to view requisitions. Only Pharmacists can create requisitions, and only Managers can approve them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Requisitions</h1>
            <p className="text-muted-foreground">Manage stock requisition requests</p>
          </div>
          {user?.role === 'pharmacist' && (
            <Link to="/admin/requisitions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Requisition
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
                    placeholder="Search by requisition number, department, or user..."
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
                  variant={filterStatus === 'Fulfilled' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('Fulfilled')}
                >
                  Fulfilled
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Requisitions ({filteredRequisitions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Req. Number</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Requested By</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Items</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequisitions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        No requisitions found
                      </td>
                    </tr>
                  ) : (
                    filteredRequisitions.map((req) => {
                      const statusInfo = getStatusBadge(req.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <tr key={req.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-mono text-sm font-medium">{req.requisition_number}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {req.department.name}
                            </div>
                          </td>
                          <td className="py-3 px-4">{req.user.name}</td>
                          <td className="py-3 px-4">{formatDate(req.requested_date)}</td>
                          <td className="py-3 px-4 text-center">{req.items.length}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Link to={`/admin/requisitions/${req.id}`}>
                                <Button variant="ghost" size="sm" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              {req.status === 'Pending' && user?.role === 'pharmacist' && (
                                <>
                                  <Link to={`/admin/requisitions/${req.id}/edit`}>
                                    <Button variant="ghost" size="sm" title="Edit">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    title="Delete"
                                    onClick={() => {
                                      setReqToDelete(req);
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
      {showDeleteDialog && reqToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete Requisition</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete requisition <strong>{reqToDelete.requisition_number}</strong>?
                This will permanently remove the requisition and all its items.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setReqToDelete(null);
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

export default Requisitions;
