import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserAPI } from '../lib/api';
import { UserPlus, ArrowLeft, Save, Shield, ShieldCheck, Eye, UserCog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'manager',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Define roles based on current user's role
  const getAllRoles = () => {
    const allRoles = [
      { value: 'super_admin', label: 'Super Admin', icon: ShieldCheck, description: 'Full system access' },
      { value: 'admin', label: 'System Admin', icon: Shield, description: 'Manage users and inventory' },
      { value: 'manager', label: 'Manager', icon: UserCog, description: 'Manage inventory and stock' },
      { value: 'pharmacist', label: 'Pharmacist', icon: UserCog, description: 'Dispense medications and manage stock out' },
      { value: 'procurement_officer', label: 'Procurement Officer', icon: UserCog, description: 'Manage purchase orders and suppliers' },
    ];

    if (currentUser?.role === 'super_admin') {
      // Super Admin can only create System Admins
      return allRoles.filter(r => r.value === 'admin');
    } else if (currentUser?.role === 'admin') {
      // System Admin can ONLY create operational users (NOT Super Admin or System Admin)
      return allRoles.filter(r => r.value !== 'super_admin' && r.value !== 'admin');
    }

    return allRoles;
  };

  const roles = getAllRoles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await UserAPI.createUser(formData);

      if (response.data.success) {
        navigate('/admin/users');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to create user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={currentUser?.role === 'super_admin' ? 'Add System Admin' : 'Add New User'}
      subtitle={currentUser?.role === 'super_admin' ? 'Create a new System Admin account' : 'Create a new system user'}
      showSearch={false}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/users')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <UserPlus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>User Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                  autoFocus
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., john.doe@hospital.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={errors.password_confirmation ? 'border-red-500' : ''}
                  />
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500">{errors.password_confirmation}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">
                  User Role <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const RoleIcon = role.icon;
                    return (
                      <label
                        key={role.value}
                        className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.role === role.value
                            ? 'border-primary bg-primary/5'
                            : 'border-input hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={formData.role === role.value}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <RoleIcon className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{role.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{role.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddUser;
