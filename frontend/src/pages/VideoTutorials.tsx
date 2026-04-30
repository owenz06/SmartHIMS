import React from 'react';
import { Link } from 'react-router-dom';
import { Video, ArrowLeft, Play, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';

const VideoTutorials: React.FC = () => {
  const tutorials = [
    {
      category: 'Getting Started',
      videos: [
        {
          title: 'System Overview & Dashboard Tour',
          duration: '5:30',
          description: 'Learn about the main features and navigate the dashboard',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Dashboard+Tour',
        },
        {
          title: 'Understanding User Roles',
          duration: '3:45',
          description: 'Overview of different user roles and permissions',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=User+Roles',
        },
      ],
    },
    {
      category: 'Inventory Management',
      videos: [
        {
          title: 'Adding New Inventory Items',
          duration: '4:20',
          description: 'Step-by-step guide to adding items to inventory',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Add+Items',
        },
        {
          title: 'Recording Stock In & Stock Out',
          duration: '6:15',
          description: 'How to record inventory transactions',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Stock+Transactions',
        },
        {
          title: 'Setting Up Low Stock Alerts',
          duration: '3:30',
          description: 'Configure reorder points and notifications',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Stock+Alerts',
        },
      ],
    },
    {
      category: 'Purchase Orders',
      videos: [
        {
          title: 'Creating a Purchase Order',
          duration: '7:00',
          description: 'Complete walkthrough of the PO creation process',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Create+PO',
        },
        {
          title: 'Approving Purchase Orders',
          duration: '4:45',
          description: 'How managers approve and process purchase orders',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Approve+PO',
        },
        {
          title: 'Receiving Ordered Items',
          duration: '5:30',
          description: 'Recording received items and updating inventory',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Receive+Items',
        },
      ],
    },
    {
      category: 'Reports & Analytics',
      videos: [
        {
          title: 'Generating Stock Movement Reports',
          duration: '5:00',
          description: 'Create and export inventory reports',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Reports',
        },
        {
          title: 'Understanding Analytics Dashboard',
          duration: '6:30',
          description: 'Interpret charts and analytics data',
          thumbnail: 'https://via.placeholder.com/400x225/0097A7/FFFFFF?text=Analytics',
        },
      ],
    },
  ];

  return (
    <DashboardLayout
      title="Video Tutorials"
      subtitle="Step-by-step video guides"
      showSearch={false}
    >
      <div className="space-y-6 max-w-7xl">
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
                <Video className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Video Tutorials</h1>
                <p className="text-muted-foreground">
                  Watch step-by-step video guides to learn how to use the Smart Hospital
                  Inventory Management System effectively.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tutorial Categories */}
        {tutorials.map((category, categoryIndex) => (
          <Card key={categoryIndex}>
            <CardHeader>
              <CardTitle>{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.videos.map((video, videoIndex) => (
                  <div
                    key={videoIndex}
                    className="group cursor-pointer"
                  >
                    <div className="relative rounded-lg overflow-hidden mb-3 bg-muted">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Coming Soon */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                More Tutorials Coming Soon
              </h3>
              <p className="text-muted-foreground mb-4">
                We're constantly creating new video tutorials to help you master the system.
              </p>
              <Link to="/help">
                <Button variant="outline">
                  Back to Help Center
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VideoTutorials;
