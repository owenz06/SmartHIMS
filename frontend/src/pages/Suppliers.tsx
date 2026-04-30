import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SupplierAPI } from '../lib/api';
import {
  Truck,
  Search,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

const Suppliers: React.FC = () => {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await SupplierAPI.getSuppliers({ search: searchTerm });
      if (response.data.success) {
        setSuppliers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      setIsDeleting(true);
      const response = await SupplierAPI.deleteSupplier(supplierToDelete.id);
      if (response.data.success) {
        setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
        setShowDeleteDialog(false);
        setSupplierToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete supplier');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Suppliers"
        subtitle="Loading suppliers..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading suppliers...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Suppliers"
      subtitle={`${suppliers.length} suppliers found`}
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
                  You have oversight access to view suppliers. Only Procurement Officers can create, edit, or delete suppliers.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Suppliers</h2>
            <p className="text-sm text-muted-foreground">Manage your supplier contacts</p>
          </div>
          {user?.role === 'procurement_officer' && (
            <Link to="/admin/suppliers/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        {suppliers.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No suppliers found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search' : 'Get started by adding your first supplier'}
                </p>
                {!searchTerm && user?.role === 'procurement_officer' && (
                  <Link to="/admin/suppliers/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Supplier
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{supplier.name}</CardTitle>
                        {supplier.contact_person && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {supplier.contact_person}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {supplier.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{supplier.email}</span>
                      </div>
                    )}
                    {supplier.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{supplier.phone}</span>
                      </div>
                    )}
                    {supplier.address && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{supplier.address}</span>
                      </div>
                    )}
                  </div>
                  {user?.role === 'procurement_officer' ? (
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/suppliers/${supplier.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSupplierToDelete(supplier);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      View only - Procurement Officer access required to edit
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && supplierToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete Supplier</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete <strong>{supplierToDelete.name}</strong>?
                This will permanently remove the supplier from your system.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setSupplierToDelete(null);
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

export default Suppliers;
