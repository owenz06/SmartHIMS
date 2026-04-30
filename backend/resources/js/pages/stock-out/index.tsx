import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock Out', href: '/stock-out' },
];

interface StockOutRecord {
    id: number;
    item: {
        name: string;
    };
    user: {
        name: string;
    };
    quantity_taken: number;
    dispensed_to: string;
    created_at: string;
}

interface Props {
    records: {
        data: StockOutRecord[];
    };
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function StockOutIndex({ records, canCreate, canEdit, canDelete }: Props) {
    const deleteForm = useForm({});
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this stock out record? This will restore the stock quantity.')) {
            setDeletingId(id);
            deleteForm.delete(`/stock-out/${id}`, {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Out" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Stock Out Management</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Record and manage stock dispensing
                    </p>
                </div>
                {canCreate && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.open('/stock-out/export/pdf', '_blank')}
                            className="w-full sm:w-auto"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Export PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </Button>
                        <Link href="/stock-out/create" className="w-full sm:w-auto">
                            <Button className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Dispense Stock</span>
                                <span className="sm:hidden">Dispense</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {records.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No stock out records found
                        </div>
                    ) : (
                        records.data.map((record) => (
                            <div
                                key={record.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{record.item.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            ID: {record.id}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold px-2 py-1 rounded bg-red-100 text-red-700">
                                        -{record.quantity_taken}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Dispensed To:</span>
                                        <p className="font-medium mt-0.5">{record.dispensed_to}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">User:</span>
                                        <p className="font-medium mt-0.5">{record.user.name}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground">Date:</span>
                                        <p className="font-medium mt-0.5">
                                            {new Date(record.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                    <Link href={`/stock-out/${record.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                    </Link>
                                    {canEdit && (
                                        <Link href={`/stock-out/${record.id}/edit`} className="flex-1">
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
                                            onClick={() => handleDelete(record.id)}
                                            disabled={deletingId === record.id}
                                            className="flex-1"
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="border-b border-sidebar-border text-left text-xs text-muted-foreground">
                                <th className="pb-3 font-medium w-[8%] pr-4">ID</th>
                                <th className="pb-3 font-medium w-[20%] pr-4">ITEM</th>
                                <th className="pb-3 font-medium w-[12%] pr-4">QUANTITY</th>
                                <th className="pb-3 font-medium w-[18%] pr-4">
                                    <span className="block">DISPENSED</span>
                                    <span className="block">TO</span>
                                </th>
                                <th className="pb-3 font-medium w-[15%] pr-4">USER</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">DATE</th>
                                <th className="pb-3 font-medium w-[12%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No stock out records found
                                    </td>
                                </tr>
                            ) : (
                                records.data.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4">{record.id}</td>
                                        <td className="py-4">{record.item.name}</td>
                                        <td className="py-4">{record.quantity_taken}</td>
                                        <td className="py-4 text-muted-foreground">{record.dispensed_to}</td>
                                        <td className="py-4 text-muted-foreground">{record.user.name}</td>
                                        <td className="py-4 text-muted-foreground">
                                            {new Date(record.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/stock-out/${record.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {canEdit && (
                                                    <Link href={`/stock-out/${record.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(record.id)}
                                                        disabled={deletingId === record.id}
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
            </div>
        </AppLayout>
    );
}
