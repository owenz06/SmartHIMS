import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequisitionAPI, DepartmentAPI, InventoryAPI } from '../lib/api';
import { ClipboardList, ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import DashboardLayout from '../components/DashboardLayout';

interface Department {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
  item_code: string;
  unit_of_measurement: string;
}

interface ReqItem {
  item_id: string;
  quantity: string;
}

const AddRequisition: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [formData, setFormData] = useState({
    requisition_number: '',
    department_id: '',
    requested_date: new Date().toISOString().split('T')[0],
    status: 'Pending',
  });
  const [reqItems, setReqItems] = useState<ReqItem[]>([
    { item_id: '', quantity: '' },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchDepartments();
    fetchItems();
    generateReqNumber();
  }, []);

  const generateReqNumber = () => {
    const timestamp = Date.now().toString().slice(-8);
    setFormData(prev => ({ ...prev, requisition_number: `REQ-${timestamp}` }));
  };

  const fetchDepartments = async () => {
    try {
      const response = await DepartmentAPI.getDepartments();
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
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

  const handleItemChange = (index: number, field: keyof ReqItem, value: string) => {
    const newItems = [...reqItems];
    newItems[index][field] = value;
    setReqItems(newItems);
  };

  const addItem = () => {
    setReqItems([...reqItems, { item_id: '', quantity: '' }]);
  };

  const removeItem = (index: number) => {
    if (reqItems.length > 1) {
      setReqItems(reqItems.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.requisition_number.trim()) newErrors.requisition_number = 'Requisition number is required';
    if (!formData.department_id) newErrors.department_id = 'Department is required';
    if (!formData.requested_date) newErrors.requested_date = 'Requested date is required';

    const validItems = reqItems.filter(item => item.item_id && item.quantity);
    if (validItems.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    reqItems.forEach((item, index) => {
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
      
      const validItems = reqItems
        .filter(item => item.item_id && item.quantity)
        .map(item => ({
          item_id: Number(item.item_id),
          quantity: Number(item.quantity),
        }));

      const response = await RequisitionAPI.createRequisition({
        ...formData,
        department_id: Number(formData.department_id),
        items: validItems,
      });

      if (response.data.success) {
        navigate('/admin/requisitions');
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert(error.response?.data?.message || 'Failed to create requisition');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Requisition"
      subtitle="Create a new stock requisition"
      showSearch={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/requisitions')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Requisitions
        </Button>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Requisition Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requisition_number">
                    Requisition Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="requisition_number"
                    name="requisition_number"
                    value={formData.requisition_number}
                    onChange={handleChange}
                    placeholder="e.g., REQ-12345"
                    className={errors.requisition_number ? 'border-red-500' : ''}
                  />
                  {errors.requisition_number && (
                    <p className="text-sm text-red-500">{errors.requisition_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requested_date">
                    Requested Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="requested_date"
                    name="requested_date"
                    type="date"
                    value={formData.requested_date}
                    onChange={handleChange}
                    className={errors.requested_date ? 'border-red-500' : ''}
                  />
                  {errors.requested_date && (
                    <p className="text-sm text-red-500">{errors.requested_date}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department_id">
                  Department <span className="text-red-500">*</span>
                </Label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    errors.department_id ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.department_id && (
                  <p className="text-sm text-red-500">{errors.department_id}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requisition Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Requested Items</CardTitle>
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
              
              {reqItems.map((reqItem, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`item_${index}`}>
                      Item <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id={`item_${index}`}
                      value={reqItem.item_id}
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
                      value={reqItem.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="0"
                      className={errors[`item_${index}_quantity`] ? 'border-red-500' : ''}
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-sm text-red-500">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>

                  {reqItems.length > 1 && (
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
              onClick={() => navigate('/admin/requisitions')}
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
                  Create Requisition
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddRequisition;
