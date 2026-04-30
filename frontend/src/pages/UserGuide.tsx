import React from 'react';
import { Link } from 'react-router-dom';
import {
  Book,
  ArrowLeft,
  Package,
  ShoppingCart,
  ClipboardList,
  TrendingUp,
  Users,
  Settings,
  FileText,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const UserGuide: React.FC = () => {
  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      topics: [
        { name: 'System Overview', description: 'Introduction to SHIMS features and capabilities' },
        { name: 'First Login', description: 'How to access and navigate the system' },
        { name: 'Dashboard Tour', description: 'Understanding your dashboard and key metrics' },
        { name: 'User Roles', description: 'Understanding permissions and access levels' },
      ],
    },
    {
      title: 'Inventory Management',
      icon: Package,
      topics: [
        { name: 'Adding Items', description: 'How to add new inventory items' },
        { name: 'Updating Stock', description: 'Recording stock in and stock out transactions' },
        { name: 'Categories & Suppliers', description: 'Managing item categories and suppliers' },
        { name: 'Low Stock Alerts', description: 'Setting up and managing reorder points' },
      ],
    },
    {
      title: 'Purchase Orders',
      icon: ShoppingCart,
      topics: [
        { name: 'Creating Purchase Orders', description: 'Step-by-step guide to creating POs' },
        { name: 'Approval Workflow', description: 'Understanding the approval process' },
        { name: 'Receiving Items', description: 'How to receive and record delivered items' },
        { name: 'PO Status Tracking', description: 'Monitoring purchase order status' },
      ],
    },
    {
      title: 'Requisitions',
      icon: ClipboardList,
      topics: [
        { name: 'Submitting Requisitions', description: 'How to request items from inventory' },
        { name: 'Department Requisitions', description: 'Managing department-level requests' },
        { name: 'Approval Process', description: 'How requisitions are reviewed and approved' },
        { name: 'Fulfillment', description: 'Tracking requisition fulfillment' },
      ],
    },
    {
      title: 'Reports & Analytics',
      icon: BarChart3,
      topics: [
        { name: 'Stock Movement Reports', description: 'Analyzing inventory flow' },
        { name: 'Usage Analytics', description: 'Understanding item consumption patterns' },
        { name: 'Financial Reports', description: 'Inventory valuation and cost analysis' },
        { name: 'Custom Reports', description: 'Creating and exporting custom reports' },
      ],
    },
    {
      title: 'User Management',
      icon: Users,
      topics: [
        { name: 'Adding Users', description: 'How to create new user accounts' },
        { name: 'Role Assignment', description: 'Assigning roles and permissions' },
        { name: 'User Profiles', description: 'Managing user information' },
        { name: 'Access Control', description: 'Understanding security and permissions' },
      ],
    },
    {
      title: 'Settings & Configuration',
      icon: Settings,
      topics: [
        { name: 'Profile Settings', description: 'Managing your personal profile' },
        { name: 'Notification Preferences', description: 'Configuring alerts and notifications' },
        { name: 'Theme & Appearance', description: 'Customizing the interface' },
        { name: 'Security Settings', description: 'Password and security options' },
      ],
    },
    {
      title: 'Audit & Compliance',
      icon: FileText,
      topics: [
        { name: 'Audit Logs', description: 'Viewing system activity and changes' },
        { name: 'Compliance Reports', description: 'Generating compliance documentation' },
        { name: 'Data Integrity', description: 'Understanding data validation and integrity' },
        { name: 'Backup & Recovery', description: 'Data backup and recovery procedures' },
      ],
    },
  ];

  return (
    <DashboardLayout
      title="User Guide"
      subtitle="Complete documentation for all features"
      showSearch={false}
    >
      <div className="space-y-6 max-w-6xl">
        {/* Back Button */}
        <Link
          to="/help"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Help & Support
        </Link>

        {/* Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Book className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">User Guide</h1>
                <p className="text-muted-foreground">
                  Comprehensive documentation to help you make the most of the Smart Hospital
                  Inventory Management System. Browse topics below or use the search to find
                  specific information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.topics.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className="p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border"
                      >
                        <h4 className="font-medium text-foreground mb-1">{topic.name}</h4>
                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/help/tutorials"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground">
                  Watch step-by-step video guides
                </p>
              </Link>
              <Link
                to="/help/api-docs"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">API Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  For developers and integrations
                </p>
              </Link>
              <Link
                to="/help"
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">Contact Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get help from our support team
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UserGuide;
