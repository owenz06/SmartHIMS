import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserAPI } from '../lib/api';
import {
  Users as UsersIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  UserCog,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

interface User {
  id: number;
  name: string;
  email: string;
  role: string; // Changed from specific union to string to handle any role value
  created_at: string;
  updated_at: string;
}

type RoleKey = 'super_admin' | 'admin' | 'manager' | 'pharmacist' | 'procurement_officer';

const roleConfig: Record<RoleKey, {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}> = {
  super_admin: {
    label: 'Super Admin',
    icon: ShieldCheck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  manager: {
    label: 'Manager',
    icon: UserCog,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  pharmacist: {
    label: 'Pharmacist',
    icon: UserCog,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
  },
  procurement_officer: {
    label: 'Procurement Officer',
    icon: UserCog,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
};

// Helper function to safely get role config
const getRoleConfig = (role: string) => {
  const normalizedRole = role?.toLowerCase().trim() as RoleKey;
  return roleConfig[normalizedRole] || roleConfig.manager; // Default to manager if role not found
};

const Users: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter users based on current user's role
  const getFilteredUsers = (allUsers: User[]) => {
    if (currentUser?.role === 'super_admin') {
      // Super Admin can see all users (System Admins and operational users)
      return allUsers.filter(u => u.role !== 'super_admin'); // Exclude other Super Admins
    } else if (currentUser?.role === 'admin') {
      // System Admin can see all users (including Super Admins for viewing)
      return allUsers;
    }
    return allUsers;
  };

  // Check if current user can manage a specific user
  const canManageUser = (targetUser: User) => {
    if (currentUser?.role === 'super_admin') {
      // Super Admin can only manage System Admins (not operational users)
      return targetUser.role === 'admin';
    } else if (currentUser?.role === 'admin') {
      // System Admin can manage operational users (not Super Admins, not System Admins, not themselves)
      return targetUser.role !== 'super_admin' && 
             targetUser.role !== 'admin' && 
             targetUser.id !== currentUser.id;
    }
    return false;
  };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;

      const response = await UserAPI.getUsers(params);
      if (response.data.success) {
        const allUsers = response.data.data;
        // Filter users based on current user's role
        const filteredUsers = getFilteredUsers(allUsers);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      const response = await UserAPI.deleteUser(userToDelete.id);
      if (response.data.success) {
        setUsers(users.filter(u => u.id !== userToDelete.id));
        setShowDeleteDialog(false);
        setUserToDelete(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="User Management"
        subtitle="Loading users..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="User Management"
      subtitle={`${users.length} users found`}
      showSearch={false}
    >
      <div className="space-y-6">
        {/* User Management Hierarchy Notice */}
        {currentUser?.role === 'super_admin' && (
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-purple-900 dark:text-purple-100">
                  Super Admin - System Admin Management
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  You can create and manage System Admin accounts. You can view operational users (Managers, Pharmacists, Procurement Officers) but cannot edit or delete them.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentUser?.role === 'admin' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  System Admin - Operational User Management
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  You can create and manage operational users (Managers, Pharmacists, Procurement Officers). You can view Super Admin and System Admin accounts but cannot create or edit them.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {currentUser?.role === 'super_admin' ? 'All Users' : 'All Users'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentUser?.role === 'super_admin' 
                ? 'Manage System Admins and view operational users'
                : 'Manage operational users (Admins are view-only)'
              }
            </p>
          </div>
          {(currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
            <Link to="/admin/users/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All Roles</option>
                {currentUser?.role === 'super_admin' ? (
                  // Super Admin sees all roles except Super Admin
                  <>
                    <option value="admin">System Admin</option>
                    <option value="manager">Manager</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="procurement_officer">Procurement Officer</option>
                  </>
                ) : (
                  // System Admin sees all roles including Super Admin
                  <>
                    <option value="super_admin">Super Admin</option>
                    <option value="admin">System Admin</option>
                    <option value="manager">Manager</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="procurement_officer">Procurement Officer</option>
                  </>
                )}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {currentUser?.role === 'super_admin' ? 'No users found' : 'No users found'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || roleFilter 
                    ? 'Try adjusting your filters' 
                    : currentUser?.role === 'super_admin'
                      ? 'Get started by creating your first System Admin'
                      : 'Get started by creating your first user'
                  }
                </p>
                {!searchTerm && !roleFilter && (currentUser?.role === 'super_admin' || currentUser?.role === 'admin') && (
                  <Link to="/admin/users/create">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {users.map((user) => {
                      const roleInfo = getRoleConfig(user.role);
                      const RoleIcon = roleInfo.icon;
                      
                      return (
                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${roleInfo.bgColor}`}>
                                <RoleIcon className={`h-5 w-5 ${roleInfo.color}`} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-foreground">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-foreground">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color}`}>
                              <RoleIcon className="h-3 w-3" />
                              {roleInfo.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {canManageUser(user) ? (
                                <>
                                  <Link to={`/admin/users/${user.id}/edit`}>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setUserToDelete(user);
                                      setShowDeleteDialog(true);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  View only
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle>Delete User</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground mb-4">
                Are you sure you want to delete <strong>{userToDelete.name}</strong> ({userToDelete.email})?
                {!canManageUser(userToDelete) && (
                  <span className="block mt-2 text-red-600">
                    You do not have permission to delete this user.
                  </span>
                )}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setUserToDelete(null);
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
                  disabled={isDeleting || !canManageUser(userToDelete)}
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

export default Users;
