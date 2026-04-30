import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserAPI } from '../lib/api';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import DashboardLayout from '../components/DashboardLayout';

const MyProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      super_admin: 'Super Administrator',
      admin: 'Administrator',
      manager: 'Manager',
      pharmacist: 'Pharmacist',
      procurement_officer: 'Procurement Officer',
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: { [key: string]: string } = {
      super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      manager: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pharmacist: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      procurement_officer: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await UserAPI.updateUser(user.id, formData);
      
      if (response.data.success) {
        // Update the user in auth context
        updateUser({ ...user, ...formData });
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
    setIsEditing(false);
    setErrorMessage('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <DashboardLayout title="My Profile" subtitle="Loading..." showSearch={false}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="Manage your personal information"
      showSearch={false}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-green-700 dark:text-green-300">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{user.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-foreground">{user.email}</span>
                  </div>
                )}
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">{getRoleDisplayName(user.role)}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Read-only</span>
                </div>
              </div>

              {/* Account Created */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Member Since
                </label>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-foreground">
                    {user.created_at ? formatDate(user.created_at) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-lg font-semibold text-foreground mt-1">Active</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="text-lg font-semibold text-foreground mt-1">Today</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">Profile Completion</p>
                <p className="text-lg font-semibold text-foreground mt-1">100%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MyProfile;
