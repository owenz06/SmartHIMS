import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { InventoryAPI } from '../lib/api';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface Item {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  unit_price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const Inventory: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [totalItemsInDb, setTotalItemsInDb] = useState<number>(0);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      // Request a large number of items to get all of them (or implement proper pagination)
      const response = await InventoryAPI.getItems({ per_page: 1000 });
      
      // Laravel paginated response structure
      let itemsData = [];
      
      // Check if it's a paginated response
      if (response.data.data) {
        itemsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        itemsData = response.data;
      }
      
      // Map the API response to match our Item interface
      const mappedItems = itemsData.map((item: any) => ({
        id: item.id,
        name: item.name || '',
        sku: item.item_code || '', // Map item_code to sku for display
        category: item.category?.name || 'Uncategorized',
        quantity: item.quantity || 0,
        unit: item.unit_of_measurement || '',
        reorder_level: item.reorder_point || 0,
        unit_price: parseFloat(item.unit_price) || 0,
        status: item.quantity === 0 
          ? 'out_of_stock' 
          : item.quantity <= item.reorder_point 
            ? 'low_stock' 
            : 'in_stock'
      }));
      
      setItems(mappedItems);
      
      // Store total from API
      if (response.data.total) {
        setTotalItemsInDb(response.data.total);
      }
      
      console.log('API Response:', response.data);
      console.log('Items data array:', itemsData);
      console.log('Fetched items count:', mappedItems.length);
      console.log('Total from API:', response.data.total || 'N/A');
      console.log('First 3 items:', mappedItems.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      const response = await InventoryAPI.deleteItem(itemToDelete.id);
      if (response.data.success) {
        setItems(items.filter(item => item.id !== itemToDelete.id));
        setShowDeleteDialog(false);
        setItemToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      in_stock: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      low_stock: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      out_of_stock: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return badges[status as keyof typeof badges] || badges.in_stock;
  };

  const getStatusText = (status: string) => {
    const texts = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Inventory Management"
        subtitle="Loading inventory items..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Inventory Management"
      subtitle={`${filteredItems.length} items found`}
      showSearch={false}
    >
      <div className="space-y-6">
        {/* Warning if items mismatch */}
        {totalItemsInDb > 0 && items.length < totalItemsInDb && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900 dark:text-orange-100">
                  Not all items are displayed
                </h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  Showing {items.length} of {totalItemsInDb} items. Some items may not be loading correctly.
                  Check the browser console for details.
                </p>
              </div>
            </div>
          </div>
        )}

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
                  You have oversight access to view inventory data. Only Inventory Managers can create, edit, or delete items.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">
              Manage your hospital inventory items
              {totalItemsInDb > 0 && ` • ${totalItemsInDb} total items in database`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchItems}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {user?.role === 'manager' && (
              <Link to="/admin/inventory/add">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or SKU..."
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
                  variant={filterStatus === 'in_stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('in_stock')}
                >
                  In Stock
                </Button>
                <Button
                  variant={filterStatus === 'low_stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('low_stock')}
                >
                  Low Stock
                </Button>
                <Button
                  variant={filterStatus === 'out_of_stock' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('out_of_stock')}
                >
                  Out of Stock
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle>Items ({filteredItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Quantity</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Unit Price</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        No items found
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-sm">{item.sku}</td>
                        <td className="py-3 px-4 font-medium">{item.name}</td>
                        <td className="py-3 px-4">{item.category}</td>
                        <td className="py-3 px-4 text-right">
                          {item.quantity} {item.unit}
                          {item.quantity <= item.reorder_level && (
                            <AlertTriangle className="inline-block ml-2 h-4 w-4 text-orange-500" />
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">${item.unit_price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                              item.status
                            )}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            {user?.role === 'manager' ? (
                              <>
                                <Link to={`/admin/inventory/${item.id}/edit`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete(item);
                                    setShowDeleteDialog(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            ) : (
                              <Link to={`/admin/inventory/${item.id}`}>
                                <Button variant="ghost" size="sm" title="View Details">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
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
      {showDeleteDialog && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete Item</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete <strong>{itemToDelete.name}</strong> (SKU: {itemToDelete.sku})?
                This will permanently remove the item from your inventory.
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setItemToDelete(null);
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

export default Inventory;
