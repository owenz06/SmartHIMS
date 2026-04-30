import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, CheckCircle, Sparkles, Bug, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import DashboardLayout from '../components/DashboardLayout';

const ReleaseNotes: React.FC = () => {
  const releases = [
    {
      version: '1.0.0',
      date: 'April 27, 2026',
      type: 'Major Release',
      highlights: [
        'Initial release of Smart Hospital Inventory Management System',
        'Complete inventory management with real-time tracking',
        'Purchase order and requisition workflows',
        'User management with role-based access control',
        'Reports and analytics dashboard',
        'Audit logging for compliance',
        'Dark mode support',
      ],
      features: [
        'Dashboard with key metrics and charts',
        'Inventory management (CRUD operations)',
        'Stock In/Out transaction recording',
        'Purchase order creation and approval',
        'Requisition management',
        'Category and supplier management',
        'Department management',
        'User management with 5 roles',
        'Reports and analytics',
        'Audit logs',
        'Messaging system',
        'Notifications',
        'Settings and preferences',
        'Help and support center',
      ],
      improvements: [],
      bugFixes: [],
    },
  ];

  return (
    <DashboardLayout
      title="Release Notes"
      subtitle="Latest updates and features"
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
                <ExternalLink className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Release Notes</h1>
                <p className="text-muted-foreground">
                  Stay up to date with the latest features, improvements, and bug fixes in the
                  Smart Hospital Inventory Management System.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Releases */}
        {releases.map((release, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Version {release.version}</CardTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{release.date}</span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-primary/10 dark:bg-primary/20 text-primary rounded-full text-xs font-medium">
                      {release.type}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Highlights */}
              {release.highlights.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Highlights
                  </h3>
                  <ul className="space-y-2">
                    {release.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features */}
              {release.features.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <Zap className="h-5 w-5 text-primary" />
                    New Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {release.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {release.improvements.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Improvements
                  </h3>
                  <ul className="space-y-2">
                    {release.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bug Fixes */}
              {release.bugFixes.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-foreground mb-3">
                    <Bug className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    Bug Fixes
                  </h3>
                  <ul className="space-y-2">
                    {release.bugFixes.map((fix, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{fix}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Footer */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                Have feedback or suggestions? <Link to="/help" className="text-primary hover:underline">Contact Support</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ReleaseNotes;
