import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CategoryAPI } from '../lib/api';
import {
  Tags,
  Search,
  Plus,
  Edit,
  Trash2,
  Package,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface Category {
  id: number;
  name: string;
  description: string | null;
  items_count: number;
  created_at: string;
  updated_at: string;
}

const Categories: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await CategoryAPI.getCategories({ search: searchTerm });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsDeleting(true);
      const response = await CategoryAPI.deleteCategory(categoryToDelete.id);
      if (response.data.success) {
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        setShowDeleteDialog(false);
        setCategoryToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete category');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Categories"
        subtitle="Loading categories..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Categories"
      subtitle={`${categories.length} categories found`}
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
                  You have oversight access to view categories. Only Inventory Managers can create, edit, or delete categories.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">All Categories</h2>
            <p className="text-sm text-muted-foreground">Manage your inventory categories</p>
          </div>
          {user?.role === 'manager' && (
            <Link to="/admin/categories/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
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
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first category'}
                </p>
                {!searchTerm && user?.role === 'manager' && (
                  <Link to="/admin/categories/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Tags className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Package className="h-3 w-3" />
                          <span>{category.items_count} items</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  {user?.role === 'manager' ? (
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/categories/${category.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCategoryToDelete(category);
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      View only - Manager access required to edit
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && categoryToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete Category</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete <strong>{categoryToDelete.name}</strong>?
                {categoryToDelete.items_count > 0 && (
                  <span className="block mt-2 text-red-600">
                    This category has {categoryToDelete.items_count} items. You cannot delete it until all items are reassigned.
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setCategoryToDelete(null);
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
                  disabled={isDeleting || categoryToDelete.items_count > 0}
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

export default Categories;
