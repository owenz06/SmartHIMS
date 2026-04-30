import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StockOutAPI, InventoryAPI } from '../lib/api';
import { PackageMinus, ArrowLeft, Save } from 'lucide-react';
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
}

const AddStockOut: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    item_id: '',
    quantity_taken: '',
    dispensed_to: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  useEffect(() => {
    fetchItems();
  }, []);

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
    
    if (name === 'item_id') {
      const selectedItem = items.find(item => item.id === Number(value));
      setAvailableQuantity(selectedItem?.quantity || 0);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_id) newErrors.item_id = 'Item is required';
    if (!formData.quantity_taken) newErrors.quantity_taken = 'Quantity is required';

    if (formData.quantity_taken && isNaN(Number(formData.quantity_taken))) {
      newErrors.quantity_taken = 'Must be a valid number';
    }

    if (formData.quantity_taken && Number(formData.quantity_taken) > availableQuantity) {
      newErrors.quantity_taken = `Only ${availableQuantity} units available`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await StockOutAPI.createStockOut({
        ...formData,
        item_id: Number(formData.item_id),
        quantity_taken: Number(formData.quantity_taken),
      });

      if (response.data.success) {
        navigate('/stock-out');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to dispense stock');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Dispense Stock"
      subtitle="Record stock outflow"
      showSearch={false}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/stock-out')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stock Out
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <PackageMinus className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Stock Out Information</CardTitle>
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
                      {item.item_code} - {item.name} (Available: {item.quantity})
                    </option>
                  ))}
                </select>
                {errors.item_id && <p className="text-sm text-red-500">{errors.item_id}</p>}
                {formData.item_id && (
                  <p className="text-sm text-muted-foreground">
                    Available quantity: <strong>{availableQuantity}</strong> units
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity_taken">
                  Quantity to Dispense <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity_taken"
                  name="quantity_taken"
                  type="number"
                  min="1"
                  max={availableQuantity}
                  value={formData.quantity_taken}
                  onChange={handleChange}
                  placeholder="0"
                  className={errors.quantity_taken ? 'border-red-500' : ''}
                />
                {errors.quantity_taken && <p className="text-sm text-red-500">{errors.quantity_taken}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispensed_to">Dispensed To</Label>
                <Input
                  id="dispensed_to"
                  name="dispensed_to"
                  value={formData.dispensed_to}
                  onChange={handleChange}
                  placeholder="e.g., Ward A, Dr. Smith"
                />
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
                  onClick={() => navigate('/stock-out')}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Dispensing...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Dispense Stock
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

export default AddStockOut;
