import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    quantity: number;
    unit_of_measurement: string;
    category: {
        name: string;
    };
}

interface StockOut {
    id: number;
    item_id: number;
    quantity_taken: number;
    dispensed_to: string;
    notes: string | null;
}

interface Props {
    stockOut: StockOut;
    items: Item[];
}

export default function StockOutEdit({ stockOut, items }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        quantity_taken: stockOut.quantity_taken.toString(),
        dispensed_to: stockOut.dispensed_to || '',
        notes: stockOut.notes || '',
    });

    const selectedItem = items.find(item => item.id === stockOut.item_id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/stock-out/${stockOut.id}`);
    };

    return (
        <>
            <Head title="Edit Stock Out" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border px-4 sm:px-6 py-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold break-words">Edit Stock Out</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Update stock dispensing record
                    </p>
                </div>
                <Link href="/stock-out">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Stock Out
                    </Button>
                </Link>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Item Info (Read-only) */}
                    <div className="space-y-2">
                        <Label>Item</Label>
                        <div className="rounded-md bg-sidebar-accent p-3">
                            <p className="font-medium">{selectedItem?.name}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Available: {selectedItem?.quantity} {selectedItem?.unit_of_measurement}
                            </p>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity_taken">Quantity Dispensed *</Label>
                        <Input
                            id="quantity_taken"
                            type="number"
                            min="1"
                            value={data.quantity_taken}
                            onChange={(e) => setData('quantity_taken', e.target.value)}
                            placeholder="Enter quantity"
                            className={errors.quantity_taken ? 'border-red-500' : ''}
                        />
                        {errors.quantity_taken && (
                            <p className="text-sm text-red-500">{errors.quantity_taken}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Original quantity: {stockOut.quantity_taken}
                        </p>
                    </div>

                    {/* Dispensed To */}
                    <div className="space-y-2">
                        <Label htmlFor="dispensed_to">Dispensed To *</Label>
                        <Input
                            id="dispensed_to"
                            value={data.dispensed_to}
                            onChange={(e) => setData('dispensed_to', e.target.value)}
                            placeholder="Enter patient/department name"
                            className={errors.dispensed_to ? 'border-red-500' : ''}
                        />
                        {errors.dispensed_to && (
                            <p className="text-sm text-red-500">{errors.dispensed_to}</p>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Enter any additional notes (optional)"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                        {errors.notes && (
                            <p className="text-sm text-red-500">{errors.notes}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Updating...' : 'Update Record'}
                        </Button>
                        <Link href="/stock-out" className="w-full sm:w-auto">
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

StockOutEdit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
