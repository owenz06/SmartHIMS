import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StockInAPI, SupplierAPI, InventoryAPI } from '../lib/api';
import { PackagePlus, ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface Supplier {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  item_code: string;
}

const AddStockIn: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    item_id: '',
    supplier_id: '',
    quantity_received: '',
    received_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await SupplierAPI.getSuppliers();
      if (response.data.success) {
        setSuppliers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await InventoryAPI.getItems();
      if (response.data.data) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_id) newErrors.item_id = 'Item is required';
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.quantity_received) newErrors.quantity_received = 'Quantity is required';
    if (!formData.received_date) newErrors.received_date = 'Received date is required';

    if (formData.quantity_received && isNaN(Number(formData.quantity_received))) {
      newErrors.quantity_received = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await StockInAPI.createStockIn({
        ...formData,
        item_id: Number(formData.item_id),
        supplier_id: Number(formData.supplier_id),
        quantity_received: Number(formData.quantity_received),
      });

      if (response.data.success) {
        navigate('/admin/stock-in');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to record stock in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Record Stock In"
      subtitle="Add incoming stock to inventory"
      showSearch={false}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/stock-in')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stock In
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <PackagePlus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Stock In Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="item_id">
                  Item <span className="text-red-500">*</span>
                </Label>
                <select
                  id="item_id"
                  name="item_id"
                  value={formData.item_id}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
                    errors.item_id ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_code} - {item.name}
                    </option>
                  ))}
                </select>
                {errors.item_id && <p className="text-sm text-red-500">{errors.item_id}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_id">
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <select
                  id="supplier_id"
                  name="supplier_id"
                  value={formData.supplier_id}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
                    errors.supplier_id ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
                {errors.supplier_id && <p className="text-sm text-red-500">{errors.supplier_id}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity_received">
                    Quantity Received <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity_received"
                    name="quantity_received"
                    type="number"
                    min="1"
                    value={formData.quantity_received}
                    onChange={handleChange}
                    placeholder="0"
                    className={errors.quantity_received ? 'border-red-500' : ''}
                  />
                  {errors.quantity_received && <p className="text-sm text-red-500">{errors.quantity_received}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="received_date">
                    Received Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="received_date"
                    name="received_date"
                    type="date"
                    value={formData.received_date}
                    onChange={handleChange}
                    className={errors.received_date ? 'border-red-500' : ''}
                  />
                  {errors.received_date && <p className="text-sm text-red-500">{errors.received_date}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any notes..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/stock-in')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Recording...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Record Stock In
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

export default AddStockIn;
