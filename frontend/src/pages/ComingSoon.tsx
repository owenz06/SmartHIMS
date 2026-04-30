import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

interface ComingSoonProps {
  pageName: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ pageName, description }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Construction className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {pageName}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {description || 'This page is currently under development and will be available soon.'}
          </p>
          
          <Link to="/dashboard">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
