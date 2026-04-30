import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Search, Filter, X, Download } from 'lucide-react';

interface Item {
    id: number;
    name: string;
    description: string | null;
    category: {
        id: number;
        name: string;
    };
    supplier: {
        id: number;
        name: string;
    };
    unit_of_measurement: string;
    reorder_point: number;
    quantity: number;
}

interface Category {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

interface InventoryProps {
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Category[];
    suppliers: Supplier[];
    filters: {
        search?: string;
        category_id?: string;
        supplier_id?: string;
        date_from?: string;
        date_to?: string;
    };
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canConfigure: boolean;
    viewOnly: boolean;
}

export default function Inventory({ items, categories, suppliers, filters, canCreate, canEdit, canDelete, viewOnly }: InventoryProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [categoryId, setCategoryId] = useState(filters.category_id || '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const applyFilters = () => {
        router.get('/admin/inventory', {
            search,
            category_id: categoryId,
            supplier_id: supplierId,
            date_from: dateFrom,
            date_to: dateTo,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setCategoryId('');
        setSupplierId('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/inventory', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = search || categoryId || supplierId || dateFrom || dateTo;

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            router.delete(`/admin/inventory/${id}`);
        }
    };

    return (
        <>
            <Head title="Inventory" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Inventory</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {viewOnly ? 'View available inventory items' : 'Manage your inventory items'}
                    </p>
                </div>
                {canCreate && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.open('/admin/inventory/export/pdf', '_blank')}
                            className="w-full sm:w-auto"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Export PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </Button>
                        <Link href="/admin/inventory/create">
                            <Button className="w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Add Item</span>
                                <span className="sm:hidden">Add</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {viewOnly && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                            View-only access. Contact inventory manager to modify stock.
                        </p>
                    </div>
                )}

                {/* Search and Filter Bar */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 sm:flex-none text-sm">Search</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex-1 sm:flex-none text-sm"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={clearFilters}
                                    className="text-sm"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="bg-sidebar-accent/50 rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-background border border-sidebar-border rounded-md text-sm"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Supplier Filter */}
                                <div>
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <select
                                        id="supplier"
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        className="w-full mt-1 px-3 py-2 bg-background border border-sidebar-border rounded-md text-sm"
                                    >
                                        <option value="">All Suppliers</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date From Filter */}
                                <div>
                                    <Label htmlFor="date_from">Date From</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>

                                {/* Date To Filter */}
                                <div>
                                    <Label htmlFor="date_to">Date To</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={applyFilters}>Apply Filters</Button>
                            </div>
                        </div>
                    )}

                    {/* Results Info */}
                    <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        <p>
                            Showing {items.data.length} of {items.total} items
                        </p>
                        {hasActiveFilters && (
                            <p className="text-blue-500">Filters active</p>
                        )}
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {items.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No items found
                        </div>
                    ) : (
                        items.data.map((item) => (
                            <div
                                key={item.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{item.name}</h3>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground mt-1 break-words">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        className={`text-sm font-bold px-2 py-1 rounded ${
                                            item.quantity <= item.reorder_point
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {item.quantity}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Category:</span>
                                        <p className="font-medium mt-0.5">{item.category.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Supplier:</span>
                                        <p className="font-medium mt-0.5">{item.supplier.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Reorder Point:</span>
                                        <p className="font-medium mt-0.5">{item.reorder_point}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Unit:</span>
                                        <p className="font-medium mt-0.5">{item.unit_of_measurement}</p>
                                    </div>
                                </div>

                                {(canEdit || canDelete) && (
                                    <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                        {canEdit && (
                                            <Link href={`/admin/inventory/${item.id}/edit`} className="flex-1">
                                                <Button variant="outline" size="sm" className="w-full">
                                                    <Pencil className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </Link>
                                        )}
                                        {canDelete && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="flex-1"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Delete
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-sidebar-border text-left text-xs text-muted-foreground">
                                <th className="pb-3 font-medium w-[20%] pr-4">NAME</th>
                                <th className="pb-3 font-medium w-[12%] pr-4">CATEGORY</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">SUPPLIER</th>
                                <th className="pb-3 font-medium w-[10%] pr-4">QUANTITY</th>
                                <th className="pb-3 font-medium w-[12%] pr-4">
                                    <span className="block">REORDER</span>
                                    <span className="block">POINT</span>
                                </th>
                                <th className="pb-3 font-medium w-[10%] pr-4">UNIT</th>
                                <th className="pb-3 font-medium w-[11%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No items found
                                    </td>
                                </tr>
                            ) : (
                                items.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 pr-4">
                                            <div>
                                                <p className="font-medium break-words">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground break-words">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm pr-4 break-words">{item.category.name}</td>
                                        <td className="py-4 text-sm pr-4 break-words">{item.supplier.name}</td>
                                        <td className="py-4 pr-4">
                                            <span
                                                className={`text-sm font-medium ${
                                                    item.quantity <= item.reorder_point
                                                        ? 'text-red-500'
                                                        : 'text-green-500'
                                                }`}
                                            >
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="py-4 text-sm pr-4">{item.reorder_point}</td>
                                        <td className="py-4 text-sm pr-4 break-words">{item.unit_of_measurement}</td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit && (
                                                    <Link href={`/admin/inventory/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page {items.current_page} of {items.last_page}
                        </p>
                        <div className="flex gap-2">
                            {items.links.map((link, index) => {
                                if (!link.url) return null;
                                
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        preserveState
                                        preserveScroll
                                    >
                                        <Button
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Inventory.layout = (page: React.ReactNode) => <AppLayout children={page} />;
