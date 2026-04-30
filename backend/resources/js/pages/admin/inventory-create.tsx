import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface Category {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    suppliers: Supplier[];
}

export default function InventoryCreate({ categories, suppliers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        supplier_id: '',
        unit_of_measurement: '',
        reorder_point: '',
        quantity: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/inventory');
    };

    return (
        <>
            <Head title="Add Inventory Item" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Add Inventory Item</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Add a new item to your inventory
                    </p>
                </div>
                <Link href="/admin/inventory" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Back to Inventory</span>
                        <span className="sm:hidden">Back</span>
                    </Button>
                </Link>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 sm:space-y-6">
                    {/* Item Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter item name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Enter item description"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category_id">Category *</Label>
                        <select
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

                    {/* Supplier */}
                    <div className="space-y-2">
                        <Label htmlFor="supplier_id">Supplier *</Label>
                        <select
                            id="supplier_id"
                            value={data.supplier_id}
                            onChange={(e) => setData('supplier_id', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

                    {/* Unit of Measurement */}
                    <div className="space-y-2">
                        <Label htmlFor="unit_of_measurement">Unit of Measurement *</Label>
                        <Input
                            id="unit_of_measurement"
                            value={data.unit_of_measurement}
                            onChange={(e) => setData('unit_of_measurement', e.target.value)}
                            placeholder="e.g., boxes, bottles, units"
                            className={errors.unit_of_measurement ? 'border-red-500' : ''}
                        />
                        {errors.unit_of_measurement && (
                            <p className="text-sm text-red-500">{errors.unit_of_measurement}</p>
                        )}
                    </div>

                    {/* Quantity and Reorder Point */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Initial Quantity *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min="0"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                placeholder="0"
                                className={errors.quantity ? 'border-red-500' : ''}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500">{errors.quantity}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reorder_point">Reorder Point *</Label>
                            <Input
                                id="reorder_point"
                                type="number"
                                min="1"
                                value={data.reorder_point}
                                onChange={(e) => setData('reorder_point', e.target.value)}
                                placeholder="10"
                                className={errors.reorder_point ? 'border-red-500' : ''}
                            />
                            {errors.reorder_point && (
                                <p className="text-sm text-red-500">{errors.reorder_point}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Adding...' : 'Add Item'}
                        </Button>
                        <Link href="/admin/inventory" className="w-full sm:w-auto">
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

InventoryCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
