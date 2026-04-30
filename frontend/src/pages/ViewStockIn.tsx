import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StockInAPI } from '../lib/api';
import {
  PackagePlus,
  ArrowLeft,
  Package,
  Truck,
  Calendar,
  Hash,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';

interface StockIn {
  id: number;
  item_id: number;
  item: {
    id: number;
    name: string;
    item_code: string;
    unit_of_measurement: string;
  };
  supplier_id: number;
  supplier: {
    id: number;
    name: string;
    contact_person: string | null;
    email: string | null;
    phone: string | null;
  };
  quantity_received: number;
  received_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const ViewStockIn: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [stockIn, setStockIn] = useState<StockIn | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStockIn();
    }
  }, [id]);

  const fetchStockIn = async () => {
    try {
      setIsLoading(true);
      const response = await StockInAPI.getStockIn(Number(id));
      setStockIn(response.data);
    } catch (error) {
      console.error('Failed to fetch stock in record:', error);
      alert('Failed to load stock in details');
      navigate('/admin/stock-in');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Stock In Details"
        subtitle="Loading..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading stock in record...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!stockIn) {
    return (
      <DashboardLayout 
        title="Stock In Not Found"
        subtitle="The requested record could not be found"
        showSearch={false}
      >
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Stock in record not found</p>
            <Button onClick={() => navigate('/admin/stock-in')}>
              Back to Stock In
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Stock In Details"
      subtitle={`Record #${stockIn.id}`}
      showSearch={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/stock-in')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stock In
        </Button>

        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <PackagePlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">Stock In Record</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Recorded on {formatDate(stockIn.created_at)}
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
                  <p className="font-medium">{stockIn.item.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Item Code</p>
                  <p className="font-mono font-medium">{stockIn.item.item_code}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PackagePlus className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Quantity Received</p>
                  <p className="font-medium text-green-600 text-lg">
                    +{stockIn.quantity_received} {stockIn.item.unit_of_measurement}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Supplier Name</p>
                  <p className="font-medium">{stockIn.supplier.name}</p>
                </div>
              </div>
              {stockIn.supplier.contact_person && (
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{stockIn.supplier.contact_person}</p>
                </div>
              )}
              {stockIn.supplier.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{stockIn.supplier.email}</p>
                </div>
              )}
              {stockIn.supplier.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{stockIn.supplier.phone}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Received Date</p>
                <p className="font-medium">{formatDate(stockIn.received_date)}</p>
              </div>
            </div>
            {stockIn.notes && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{stockIn.notes}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ViewStockIn;
