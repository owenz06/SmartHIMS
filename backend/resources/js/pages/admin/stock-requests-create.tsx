import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { SearchableSelectSimple, type SearchableSelectOption } from '@/components/ui/searchable-select-simple';

interface Item {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface Props {
    items: Item[];
    suppliers: Supplier[];
}

export default function StockRequestsCreate({ items, suppliers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        item_id: '',
        supplier_id: '',
        quantity_requested: '',
        notes: '',
    });

    // Convert items to searchable select options
    const itemOptions: SearchableSelectOption[] = items.map((item) => ({
        value: item.id.toString(),
        label: item.name,
    }));

    // Convert suppliers to searchable select options
    const supplierOptions: SearchableSelectOption[] = suppliers.map((supplier) => ({
        value: supplier.id.toString(),
        label: supplier.name,
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/stock-requests');
    };

    return (
        <>
            <Head title="Request Stock" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
                <div>
                    <h1 className="text-2xl font-semibold">Request Stock</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Submit a stock request to procurement
                    </p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/admin/stock-requests">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Link>
                </Button>
            </div>

            {/* Form */}
            <div className="p-6">
                <div className="max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Item Selection */}
                        <div>
                            <Label htmlFor="item_id">Item *</Label>
                            <SearchableSelectSimple
                                options={itemOptions}
                                value={data.item_id}
                                onValueChange={(value) => setData('item_id', value)}
                                placeholder="Select an item"
                                searchPlaceholder="Search items..."
                                className="mt-1"
                            />
                            {errors.item_id && (
                                <p className="text-sm text-red-500 mt-1">{errors.item_id}</p>
                            )}
                        </div>

                        {/* Supplier Selection */}
                        <div>
                            <Label htmlFor="supplier_id">Preferred Supplier (Optional)</Label>
                            <SearchableSelectSimple
                                options={supplierOptions}
                                value={data.supplier_id}
                                onValueChange={(value) => setData('supplier_id', value)}
                                placeholder="Select a supplier"
                                searchPlaceholder="Search suppliers..."
                                className="mt-1"
                            />
                            {errors.supplier_id && (
                                <p className="text-sm text-red-500 mt-1">{errors.supplier_id}</p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div>
                            <Label htmlFor="quantity_requested">Quantity Requested *</Label>
                            <Input
                                id="quantity_requested"
                                type="number"
                                min="1"
                                value={data.quantity_requested}
                                onChange={(e) => setData('quantity_requested', e.target.value)}
                                className="mt-1"
                                required
                            />
                            {errors.quantity_requested && (
                                <p className="text-sm text-red-500 mt-1">{errors.quantity_requested}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={4}
                                className="w-full mt-1 px-3 py-2 bg-background border border-sidebar-border rounded-md"
                                placeholder="Add any additional information about this request..."
                            />
                            {errors.notes && (
                                <p className="text-sm text-red-500 mt-1">{errors.notes}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/stock-requests">
                                Cancel
                            </Link>
                        </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

StockRequestsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
