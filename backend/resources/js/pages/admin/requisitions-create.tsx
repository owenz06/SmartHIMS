import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Department {
    id: number;
    name: string;
}

interface Item {
    id: number;
    name: string;
    quantity: number;
    unit_of_measurement: string;
}

interface Props {
    departments: Department[];
    items: Item[];
}

interface RequisitionItem {
    item_id: string;
    quantity: string;
}

export default function RequisitionsCreate({ departments, items }: Props) {
    const [requisitionItems, setRequisitionItems] = useState<RequisitionItem[]>([
        { item_id: '', quantity: '' }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        department_id: '',
        items: requisitionItems,
    });

    const addItem = () => {
        setRequisitionItems([...requisitionItems, { item_id: '', quantity: '' }]);
    };

    const removeItem = (index: number) => {
        const newItems = requisitionItems.filter((_, i) => i !== index);
        setRequisitionItems(newItems);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: keyof RequisitionItem, value: string) => {
        const newItems = [...requisitionItems];
        newItems[index][field] = value;
        setRequisitionItems(newItems);
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setData('items', requisitionItems);
        post('/admin/requisitions', {
            onSuccess: () => {
                // Trigger event to refetch notification count
                window.dispatchEvent(new CustomEvent('notification-read'));
            },
        });
    };

    return (
        <>
            <Head title="Create Requisition" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border px-4 sm:px-6 py-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold break-words">Create Requisition</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Request stock for your department
                    </p>
                </div>
                <Link href="/admin/requisitions">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Requisitions
                    </Button>
                </Link>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                    {/* Department Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="department_id">Department *</Label>
                        <select
                            id="department_id"
                            value={data.department_id}
                            onChange={(e) => setData('department_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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

                    {/* Items Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Items *</Label>
                            <Button type="button" onClick={addItem} variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Item
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {requisitionItems.map((reqItem, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start p-4 border border-sidebar-border rounded-md">
                                    <div className="flex-1 w-full space-y-2">
                                        <Label htmlFor={`item-${index}`}>Item</Label>
                                        <select
                                            id={`item-${index}`}
                                            value={reqItem.item_id}
                                            onChange={(e) => updateItem(index, 'item_id', e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        >
                                            <option value="">Select an item</option>
                                            {items.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.name} (Available: {item.quantity} {item.unit_of_measurement})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-full sm:w-32 space-y-2">
                                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                                        <Input
                                            id={`quantity-${index}`}
                                            type="number"
                                            min="1"
                                            value={reqItem.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                            placeholder="Qty"
                                        />
                                    </div>

                                    {requisitionItems.length > 1 && (
                                        <div className="flex justify-end sm:justify-start w-full sm:w-auto">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                                className="sm:mt-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {errors.items && (
                            <p className="text-sm text-red-500">{errors.items}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Creating...' : 'Create Requisition'}
                        </Button>
                        <Link href="/admin/requisitions" className="w-full sm:w-auto">
                            <Button type="button" variant="outline" className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

RequisitionsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
