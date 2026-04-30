import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PurchaseOrderAPI, SupplierAPI, InventoryAPI } from '../lib/api';
import { FileText, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
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
  unit_of_measurement: string;
}

interface OrderItem {
  item_id: string;
  quantity: string;
}

const AddPurchaseOrder: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    po_number: '',
    supplier_id: '',
    order_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { item_id: '', quantity: '' },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
    generatePONumber();
  }, []);

  const generatePONumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    setFormData(prev => ({ ...prev, po_number: `PO-${timestamp}` }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const addItem = () => {
    setOrderItems([...orderItems, { item_id: '', quantity: '' }]);
  };

  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.po_number.trim()) newErrors.po_number = 'PO number is required';
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.order_date) newErrors.order_date = 'Order date is required';

    // Validate items
    const validItems = orderItems.filter(item => item.item_id && item.quantity);
    if (validItems.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    orderItems.forEach((item, index) => {
      if (item.item_id && !item.quantity) {
        newErrors[`item_${index}_quantity`] = 'Quantity is required';
      }
      if (item.quantity && !item.item_id) {
        newErrors[`item_${index}_item`] = 'Item is required';
      }
      if (item.quantity && isNaN(Number(item.quantity))) {
        newErrors[`item_${index}_quantity`] = 'Must be a valid number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      const validItems = orderItems
        .filter(item => item.item_id && item.quantity)
        .map(item => ({
          item_id: Number(item.item_id),
          quantity: Number(item.quantity),
        }));

      const response = await PurchaseOrderAPI.createPurchaseOrder({
        ...formData,
        supplier_id: Number(formData.supplier_id),
        items: validItems,
      });

      if (response.data.success) {
        navigate('/admin/purchase-orders');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to create purchase order');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getItemName = (itemId: string) => {
    const item = items.find(i => i.id === Number(itemId));
    return item ? `${item.item_code} - ${item.name}` : '';
  };

  return (
    <DashboardLayout
      title="Create Purchase Order"
      subtitle="Create a new purchase order"
      showSearch={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/purchase-orders')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Purchase Orders
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Order Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="po_number">
                    PO Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="po_number"
                    name="po_number"
                    value={formData.po_number}
                    onChange={handleChange}
                    placeholder="e.g., PO-12345"
                    className={errors.po_number ? 'border-red-500' : ''}
                  />
                  {errors.po_number && (
                    <p className="text-sm text-red-500">{errors.po_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order_date">
                    Order Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="order_date"
                    name="order_date"
                    type="date"
                    value={formData.order_date}
                    onChange={handleChange}
                    className={errors.order_date ? 'border-red-500' : ''}
                  />
                  {errors.order_date && (
                    <p className="text-sm text-red-500">{errors.order_date}</p>
                  )}
                </div>
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
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
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
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Order Items</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errors.items && (
                <p className="text-sm text-red-500">{errors.items}</p>
              )}
              
              {orderItems.map((orderItem, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`item_${index}`}>
                      Item <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id={`item_${index}`}
                      value={orderItem.item_id}
                      onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        errors[`item_${index}_item`] ? 'border-red-500' : ''
                      }`}
                    >
                      <option value="">Select an item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.item_code} - {item.name}
                        </option>
                      ))}
                    </select>
                    {errors[`item_${index}_item`] && (
                      <p className="text-sm text-red-500">{errors[`item_${index}_item`]}</p>
                    )}
                  </div>

                  <div className="w-32 space-y-2">
                    <Label htmlFor={`quantity_${index}`}>
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`quantity_${index}`}
                      type="number"
                      min="1"
                      value={orderItem.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="0"
                      className={errors[`item_${index}_quantity`] ? 'border-red-500' : ''}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-sm text-red-500">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  {orderItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="mt-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/purchase-orders')}
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
                  Create Purchase Order
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddPurchaseOrder;
