import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, Code, Key, Database, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const ApiDocs: React.FC = () => {
  return (
    <DashboardLayout
      title="API Documentation"
      subtitle="For developers and integrations"
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
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">API Documentation</h1>
                <p className="text-muted-foreground">
                  RESTful API documentation for integrating with the Smart Hospital Inventory
                  Management System.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Base URL</h3>
              <code className="block p-3 bg-muted rounded-lg text-sm">
                http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Authentication</h3>
              <p className="text-sm text-muted-foreground mb-2">
                All API requests require authentication using Bearer tokens.
              </p>
              <code className="block p-3 bg-muted rounded-lg text-sm">
                Authorization: Bearer YOUR_TOKEN_HERE
              </code>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono rounded">
                    POST
                  </span>
                  <code className="text-sm">/login</code>
                </div>
                <p className="text-xs text-muted-foreground">Authenticate and get token</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono rounded">
                    POST
                  </span>
                  <code className="text-sm">/logout</code>
                </div>
                <p className="text-xs text-muted-foreground">Logout and invalidate token</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono rounded">
                    GET
                  </span>
                  <code className="text-sm">/user</code>
                </div>
                <p className="text-xs text-muted-foreground">Get authenticated user</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-mono rounded">
                    GET
                  </span>
                  <code className="text-sm">/items</code>
                </div>
                <p className="text-xs text-muted-foreground">List all inventory items</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-mono rounded">
                    POST
                  </span>
                  <code className="text-sm">/items</code>
                </div>
                <p className="text-xs text-muted-foreground">Create new item</p>
              </div>
              <div className="p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-mono rounded">
                    PUT
                  </span>
                  <code className="text-sm">/items/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Update item</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Full API Documentation Coming Soon
              </h3>
              <p className="text-muted-foreground mb-4">
                Complete API reference with examples, request/response schemas, and integration
                guides will be available soon.
              </p>
              <p className="text-sm text-muted-foreground">
                For immediate API access, check the routes in{' '}
                <code className="px-2 py-1 bg-muted rounded">backend/routes/api.php</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ApiDocs;
