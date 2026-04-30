import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';
import { Eye, Download } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock In', href: '/admin/stock-in' },
];

interface StockInRecord {
    id: number;
    item: {
        name: string;
    };
    supplier: {
        name: string;
    };
    quantity_received: number;
    created_at: string;
    notes?: string;
}

interface Props {
    records: StockInRecord[];
}

export default function StockIn({ records }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock In" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Stock In Management</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        View automatically generated incoming stock records
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => window.open('/admin/stock-in/export/pdf', '_blank')}
                        className="w-full sm:w-auto"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Export PDF</span>
                        <span className="sm:hidden">PDF</span>
                    </Button>
                    <div className="px-3 sm:px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
                        <p className="text-xs sm:text-sm text-blue-500">
                            Auto-generated from inventory changes
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {records.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No stock in records found
                        </div>
                    ) : (
                        records.map((record) => (
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
                                    <span className="text-sm font-bold px-2 py-1 rounded bg-green-100 text-green-700">
                                        {record.quantity_received}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Supplier:</span>
                                        <p className="font-medium mt-0.5">{record.supplier.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Date:</span>
                                        <p className="font-medium mt-0.5">
                                            {new Date(record.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-sidebar-border">
                                    <Link href={`/admin/stock-in/${record.id}`} className="block">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-3 w-3 mr-1" />
                                            View Details
                                        </Button>
                                    </Link>
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
                                <th className="pb-3 font-medium w-[10%] pr-4">ID</th>
                                <th className="pb-3 font-medium w-[25%] pr-4">ITEM</th>
                                <th className="pb-3 font-medium w-[20%] pr-4">SUPPLIER</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">QUANTITY</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">DATE</th>
                                <th className="pb-3 font-medium w-[15%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No stock in records found
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="border-b border-sidebar-border/50 hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4">{record.id}</td>
                                        <td className="py-4">{record.item.name}</td>
                                        <td className="py-4 text-muted-foreground">{record.supplier.name}</td>
                                        <td className="py-4">{record.quantity_received}</td>
                                        <td className="py-4 text-muted-foreground">
                                            {new Date(record.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/stock-in/${record.id}`}>
                                                    <button className="rounded p-2 hover:bg-sidebar-accent transition-colors">
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                </Link>
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
