import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useMemo, useEffect, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Search, X } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    quantity: number;
    unit_of_measurement: string;
    category: {
        name: string;
    };
}

interface Props {
    items: Item[];
}

export default function StockOutCreate({ items }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        item_id: '',
        quantity_taken: '',
        dispensed_to: '',
        notes: '',
    });

    const selectedItem = items.find(item => item.id === Number(data.item_id));

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        if (!searchQuery) return items;
        
        const query = searchQuery.toLowerCase();
        return items.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.category.name.toLowerCase().includes(query)
        );
    }, [items, searchQuery]);

    const handleSelectItem = (itemId: number) => {
        setData('item_id', itemId.toString());
        setShowDropdown(false);
        setSearchQuery('');
    };

    const handleClearSelection = () => {
        setData('item_id', '');
        setSearchQuery('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/stock-out');
    };

    return (
        <>
            <Head title="Dispense Stock" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border px-4 sm:px-6 py-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold break-words">Dispense Stock</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Record stock dispensing
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
                    {/* Item Selection with Search */}
                    <div className="space-y-2">
                        <Label htmlFor="item_search">Item *</Label>
                        
                        {/* Selected Item Display */}
                        {selectedItem ? (
                            <div className="flex items-center gap-2 p-3 rounded-md border border-input bg-background">
                                <div className="flex-1">
                                    <p className="font-medium">{selectedItem.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Available: {selectedItem.quantity} {selectedItem.unit_of_measurement}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearSelection}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                {/* Search Input */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="item_search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                        placeholder="Search for an item..."
                                        className="pl-10"
                                    />
                                </div>

                                {/* Dropdown List */}
                                {showDropdown && (
                                    <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md border border-input bg-background shadow-lg">
                                        {filteredItems.length === 0 ? (
                                            <div className="p-4 text-center text-sm text-muted-foreground">
                                                No items found
                                            </div>
                                        ) : (
                                            filteredItems.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleSelectItem(item.id)}
                                                    className="w-full text-left px-4 py-3 hover:bg-sidebar-accent transition-colors border-b border-sidebar-border last:border-0"
                                                >
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Available: {item.quantity} {item.unit_of_measurement} • {item.category.name}
                                                    </p>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {errors.item_id && (
                            <p className="text-sm text-red-500">{errors.item_id}</p>
                        )}
                    </div>

                    {/* Available Stock Info */}
                    {selectedItem && (
                        <div className="rounded-md bg-blue-500/10 border border-blue-500/20 p-4">
                            <p className="text-sm">
                                <span className="font-medium">Available Stock:</span>{' '}
                                {selectedItem.quantity} {selectedItem.unit_of_measurement}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Category: {selectedItem.category.name}
                            </p>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity_taken">Quantity to Dispense *</Label>
                        <Input
                            id="quantity_taken"
                            type="number"
                            min="1"
                            max={selectedItem?.quantity || undefined}
                            value={data.quantity_taken}
                            onChange={(e) => setData('quantity_taken', e.target.value)}
                            placeholder="Enter quantity"
                            className={errors.quantity_taken ? 'border-red-500' : ''}
                        />
                        {errors.quantity_taken && (
                            <p className="text-sm text-red-500">{errors.quantity_taken}</p>
                        )}
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
                            {processing ? 'Dispensing...' : 'Dispense Stock'}
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

StockOutCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
