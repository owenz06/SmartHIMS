import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StockOutAPI } from '../lib/api';
import {
  PackageMinus,
  ArrowLeft,
  Package,
  User,
  Users,
  Calendar,
  Hash,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';

interface StockOut {
  id: number;
  item_id: number;
  item: {
    id: number;
    name: string;
    item_code: string;
    unit_of_measurement: string;
  };
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  quantity_taken: number;
  dispensed_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ViewStockOut: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [stockOut, setStockOut] = useState<StockOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStockOut();
    }
  }, [id]);

  const fetchStockOut = async () => {
    try {
      setIsLoading(true);
      const response = await StockOutAPI.getStockOut(Number(id));
      setStockOut(response.data);
    } catch (error) {
      console.error('Failed to fetch stock out record:', error);
      alert('Failed to load stock out details');
      navigate('/stock-out');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Stock Out Details"
        subtitle="Loading..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock out record...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stockOut) {
    return (
      <DashboardLayout 
        title="Stock Out Not Found"
        subtitle="The requested record could not be found"
        showSearch={false}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Stock out record not found</p>
            <Button onClick={() => navigate('/stock-out')}>
              Back to Stock Out
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Stock Out Details"
      subtitle={`Record #${stockOut.id}`}
      showSearch={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/stock-out')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stock Out
        </Button>

        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <PackageMinus className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Stock Out Record</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Dispensed on {formatDate(stockOut.created_at)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Item Name</p>
                  <p className="font-medium">{stockOut.item.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Item Code</p>
                  <p className="font-mono font-medium">{stockOut.item.item_code}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PackageMinus className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Quantity Dispensed</p>
                  <p className="font-medium text-red-600 text-lg">
                    -{stockOut.quantity_taken} {stockOut.item.unit_of_measurement}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dispensing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dispensing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Dispensed By</p>
                  <p className="font-medium">{stockOut.user.name}</p>
                  <p className="text-sm text-muted-foreground">{stockOut.user.email}</p>
                </div>
              </div>
              {stockOut.dispensed_to && (
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dispensed To</p>
                    <p className="font-medium">{stockOut.dispensed_to}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Dispensed Date & Time</p>
                  <p className="font-medium">{formatDate(stockOut.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Details */}
        {stockOut.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{stockOut.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewStockOut;
