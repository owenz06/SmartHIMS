import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StockRequestAPI, InventoryAPI, SupplierAPI } from '../lib/api';
import { ArrowLeft, Save, Package, Truck, Hash, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface Item {
  id: number;
  name: string;
  item_code: string;
  quantity: number;
  unit_of_measurement: string;
}

interface Supplier {
  id: number;
  name: string;
}

const AddStockRequest: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState({
    item_id: '',
    supplier_id: '',
    quantity_requested: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not manager
  useEffect(() => {
    if (user?.role !== 'manager') {
      navigate('/admin/stock-requests');
    }
  }, [user, navigate]);

  // Fetch items and suppliers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, suppliersRes] = await Promise.all([
          InventoryAPI.getItems({ per_page: 1000 }),
          SupplierAPI.getSuppliers({ per_page: 1000 }),
        ]);

        if (itemsRes.data.data) {
          setItems(itemsRes.data.data);
        }
        if (suppliersRes.data.success) {
          setSuppliers(suppliersRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_id) {
      newErrors.item_id = 'Item is required';
    }

    if (!formData.quantity_requested) {
      newErrors.quantity_requested = 'Quantity is required';
    } else if (parseInt(formData.quantity_requested) <= 0) {
      newErrors.quantity_requested = 'Quantity must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await StockRequestAPI.createStockRequest({
        item_id: parseInt(formData.item_id),
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null,
        quantity_requested: parseInt(formData.quantity_requested),
        notes: formData.notes || null,
      });

      if (response.data.success) {
        navigate('/admin/stock-requests');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to create stock request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const selectedItem = items.find(item => item.id === parseInt(formData.item_id));

  return (
    <DashboardLayout
      title="New Stock Request"
      subtitle="Request stock items from procurement"
      showSearch={false}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/stock-requests')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stock Requests
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Request Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Selection */}
              <div className="space-y-2">
                <Label htmlFor="item_id">
                  Item <span className="text-red-500">*</span>
                </Label>
                <select
                  id="item_id"
                  name="item_id"
                  value={formData.item_id}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md bg-background ${
                    errors.item_id ? 'border-red-500' : 'border-input'
                  }`}
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.item_code}) - Current Stock: {item.quantity} {item.unit_of_measurement}
                    </option>
                  ))}
                </select>
                {errors.item_id && (
                  <p className="text-sm text-red-500">{errors.item_id}</p>
                )}
              </div>

              {/* Current Stock Info */}
              {selectedItem && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Current Stock Level
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        {selectedItem.name}: <strong>{selectedItem.quantity} {selectedItem.unit_of_measurement}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity_requested">
                  Quantity Requested <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="quantity_requested"
                    name="quantity_requested"
                    type="number"
                    min="1"
                    value={formData.quantity_requested}
                    onChange={handleChange}
                    placeholder="e.g., 100"
                    className={`pl-10 ${errors.quantity_requested ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.quantity_requested && (
                  <p className="text-sm text-red-500">{errors.quantity_requested}</p>
                )}
              </div>

              {/* Supplier (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="supplier_id">
                  Preferred Supplier <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <select
                    id="supplier_id"
                    name="supplier_id"
                    value={formData.supplier_id}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-md bg-background border-input"
                  >
                    <option value="">No preference</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Suggest a supplier if you have a preference
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">
                  Notes <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Add any additional information or special requirements..."
                    rows={4}
                    className="w-full pl-10 px-3 py-2 border rounded-md bg-background border-input resize-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/stock-requests')}
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Your request will be submitted to the Procurement team</li>
              <li>Procurement Officers will review your request</li>
              <li>You'll be notified when your request is approved or rejected</li>
              <li>If approved, the stock will be added to inventory automatically</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AddStockRequest;
