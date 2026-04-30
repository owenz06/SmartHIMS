import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryAPI, CategoryAPI, SupplierAPI } from '../lib/api';
import { Package, ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [formData, setFormData] = useState({
    item_code: '',
    name: '',
    description: '',
    category_id: '',
    supplier_id: '',
    unit_of_measurement: '',
    reorder_point: '',
    unit_price: '',
    quantity: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await CategoryAPI.getCategories();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_code.trim()) newErrors.item_code = 'Item code is required';
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.unit_of_measurement.trim()) newErrors.unit_of_measurement = 'Unit is required';
    if (!formData.reorder_point) newErrors.reorder_point = 'Reorder point is required';
    if (!formData.unit_price) newErrors.unit_price = 'Unit price is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';

    // Validate numbers
    if (formData.reorder_point && isNaN(Number(formData.reorder_point))) {
      newErrors.reorder_point = 'Must be a valid number';
    }
    if (formData.unit_price && isNaN(Number(formData.unit_price))) {
      newErrors.unit_price = 'Must be a valid number';
    }
    if (formData.quantity && isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const response = await InventoryAPI.createItem({
        ...formData,
        category_id: Number(formData.category_id),
        supplier_id: Number(formData.supplier_id),
        reorder_point: Number(formData.reorder_point),
        unit_price: Number(formData.unit_price),
        quantity: Number(formData.quantity),
      });

      if (response.data.success) {
        navigate('/admin/inventory');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to create item');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Add New Item"
      subtitle="Create a new inventory item"
      showSearch={false}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/inventory')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Item Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Code & Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_code">
                    Item Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="item_code"
                    name="item_code"
                    value={formData.item_code}
                    onChange={handleChange}
                    placeholder="e.g., MED-001"
                    className={errors.item_code ? 'border-red-500' : ''}
                  />
                  {errors.item_code && (
                    <p className="text-sm text-red-500">{errors.item_code}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Item Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Paracetamol 500mg"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter item description..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Category & Supplier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      errors.category_id ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-sm text-red-500">{errors.category_id}</p>
                  )}
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
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
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
                  {errors.supplier_id && (
                    <p className="text-sm text-red-500">{errors.supplier_id}</p>
                  )}
                </div>
              </div>

              {/* Unit & Reorder Point */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_of_measurement">
                    Unit of Measurement <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unit_of_measurement"
                    name="unit_of_measurement"
                    value={formData.unit_of_measurement}
                    onChange={handleChange}
                    placeholder="e.g., pieces, boxes, bottles"
                    className={errors.unit_of_measurement ? 'border-red-500' : ''}
                  />
                  {errors.unit_of_measurement && (
                    <p className="text-sm text-red-500">{errors.unit_of_measurement}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorder_point">
                    Reorder Point <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reorder_point"
                    name="reorder_point"
                    type="number"
                    min="0"
                    value={formData.reorder_point}
                    onChange={handleChange}
                    placeholder="e.g., 10"
                    className={errors.reorder_point ? 'border-red-500' : ''}
                  />
                  {errors.reorder_point && (
                    <p className="text-sm text-red-500">{errors.reorder_point}</p>
                  )}
                </div>
              </div>

              {/* Unit Price & Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unit_price">
                    Unit Price <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="unit_price"
                    name="unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={handleChange}
                    placeholder="e.g., 25.50"
                    className={errors.unit_price ? 'border-red-500' : ''}
                  />
                  {errors.unit_price && (
                    <p className="text-sm text-red-500">{errors.unit_price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Initial Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 100"
                    className={errors.quantity ? 'border-red-500' : ''}
                  />
                  {errors.quantity && (
                    <p className="text-sm text-red-500">{errors.quantity}</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/inventory')}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Item
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

export default AddItem;
