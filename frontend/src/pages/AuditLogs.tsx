import React, { useEffect, useState } from 'react';
import { AuditLogAPI } from '../lib/api';
import {
  Shield,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Eye,
  Activity,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  model_type: string;
  model_id: number;
  old_values: any;
  new_values: any;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface Stats {
  total_logs: number;
  action_breakdown: Record<string, number>;
  model_breakdown: Record<string, number>;
  top_users: Array<{
    user_id: number;
    user_name: string;
    count: number;
  }>;
}

const actionColors: Record<string, { bg: string; text: string; label: string }> = {
  created: { bg: 'bg-green-100', text: 'text-green-700', label: 'Created' },
  updated: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Updated' },
  deleted: { bg: 'bg-red-100', text: 'text-red-700', label: 'Deleted' },
  approved: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Approved' },
  received: { bg: 'bg-teal-100', text: 'text-teal-700', label: 'Received' },
  fulfilled: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Fulfilled' },
};

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    model_type: '',
    start_date: '',
    end_date: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page: currentPage,
        per_page: 25,
      };

      if (searchTerm) params.search = searchTerm;
      if (filters.action) params.action = filters.action;
      if (filters.model_type) params.model_type = filters.model_type;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const response = await AuditLogAPI.getAuditLogs(params);
      if (response.data.success) {
        setLogs(response.data.data);
        setTotalPages(response.data.last_page);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params: any = {};
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const response = await AuditLogAPI.getStats(params);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [currentPage, filters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchLogs();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleViewDetails = async (log: AuditLog) => {
    setSelectedLog(log);
    setShowDetails(true);
  };

  const getActionConfig = (action: string) => {
    return actionColors[action] || { bg: 'bg-gray-100', text: 'text-gray-700', label: action };
  };

  const formatModelType = (modelType: string) => {
    return modelType.replace(/([A-Z])/g, ' $1').trim();
  };

  if (isLoading && logs.length === 0) {
    return (
      <DashboardLayout 
        title="Audit Logs"
        subtitle="Loading audit logs..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading audit logs...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Audit Logs"
      subtitle="System activity and audit trail"
      showSearch={false}
    >
      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_logs}</div>
                <p className="text-xs text-muted-foreground">Logged actions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Active User</CardTitle>
                <User className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold truncate">
                  {stats.top_users && stats.top_users.length > 0 ? stats.top_users[0].user_name : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.top_users && stats.top_users.length > 0 ? `${stats.top_users[0].count} actions` : '0 actions'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Common Action</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold capitalize">
                  {stats.action_breakdown && Object.keys(stats.action_breakdown).length > 0
                    ? Object.entries(stats.action_breakdown).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.action_breakdown && Object.keys(stats.action_breakdown).length > 0
                    ? `${Object.entries(stats.action_breakdown).sort((a, b) => (b[1] as number) - (a[1] as number))[0][1]} times`
                    : '0 times'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Most Modified</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {stats.model_breakdown && Object.keys(stats.model_breakdown).length > 0
                    ? formatModelType(
                        Object.entries(stats.model_breakdown).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0]
                      )
                    : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.model_breakdown && Object.keys(stats.model_breakdown).length > 0
                    ? `${Object.entries(stats.model_breakdown).sort((a, b) => (b[1] as number) - (a[1] as number))[0][1]} changes`
                    : '0 changes'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Activity Log</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by user, action, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <select
                      id="action"
                      name="action"
                      value={filters.action}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Actions</option>
                      <option value="created">Created</option>
                      <option value="updated">Updated</option>
                      <option value="deleted">Deleted</option>
                      <option value="approved">Approved</option>
                      <option value="received">Received</option>
                      <option value="fulfilled">Fulfilled</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model_type">Model Type</Label>
                    <select
                      id="model_type"
                      name="model_type"
                      value={filters.model_type}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">All Types</option>
                      <option value="Item">Item</option>
                      <option value="PurchaseOrder">Purchase Order</option>
                      <option value="Requisition">Requisition</option>
                      <option value="StockIn">Stock In</option>
                      <option value="StockOut">Stock Out</option>
                      <option value="Supplier">Supplier</option>
                      <option value="Category">Category</option>
                      <option value="Department">Department</option>
                      <option value="User">User</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={filters.start_date}
                      onChange={handleFilterChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      name="end_date"
                      type="date"
                      value={filters.end_date}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardContent className="p-0">
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No audit logs found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || filters.action || filters.model_type
                    ? 'Try adjusting your filters'
                    : 'No activity has been logged yet'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Model
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Model ID
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {logs.map((log) => {
                      const actionConfig = getActionConfig(log.action);
                      return (
                        <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-foreground">
                              {log.user?.name || 'System'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.user?.email || 'Automated'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionConfig.bg} ${actionConfig.text}`}
                            >
                              {actionConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                            {formatModelType(log.model_type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            #{log.model_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(log)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      {showDetails && selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  <CardTitle>Audit Log Details</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedLog.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="text-sm font-medium">{selectedLog.user?.name || 'System'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <p className="text-sm font-medium capitalize">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Model</Label>
                  <p className="text-sm font-medium">
                    {formatModelType(selectedLog.model_type)} #{selectedLog.model_id}
                  </p>
                </div>
              </div>

              {selectedLog.old_values && Object.keys(selectedLog.old_values).length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">Old Values</Label>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.new_values && Object.keys(selectedLog.new_values).length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-2 block">New Values</Label>
                  <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowDetails(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AuditLogs;
