import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Supplier {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
}

interface SuppliersProps {
    suppliers: Supplier[];
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function Suppliers({ suppliers, canCreate, canEdit, canDelete }: SuppliersProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            router.delete(`/admin/suppliers/${id}`);
        }
    };

    return (
        <>
            <Head title="Suppliers" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Suppliers</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage your suppliers
                    </p>
                </div>
                {canCreate && (
                    <Link href="/admin/suppliers/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Add Supplier</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {suppliers.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No suppliers found
                        </div>
                    ) : (
                        suppliers.map((supplier) => (
                            <div
                                key={supplier.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{supplier.name}</h3>
                                        {supplier.email && (
                                            <p className="text-xs text-muted-foreground mt-1 break-words">
                                                {supplier.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <p className="font-medium mt-0.5 break-words">{supplier.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Address:</span>
                                        <p className="font-medium mt-0.5 break-words">{supplier.address || '-'}</p>
                                    </div>
                                </div>

                                {(canEdit || canDelete) && (
                                    <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                        {canEdit && (
                                            <Link href={`/admin/suppliers/${supplier.id}/edit`} className="flex-1">
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
                                                onClick={() => handleDelete(supplier.id)}
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
                                <th className="pb-3 font-medium w-[20%] pr-4">EMAIL</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">PHONE</th>
                                <th className="pb-3 font-medium w-[30%] pr-4">ADDRESS</th>
                                <th className="pb-3 font-medium w-[15%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        No suppliers found
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((supplier) => (
                                    <tr
                                        key={supplier.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 font-medium pr-4 break-words">{supplier.name}</td>
                                        <td className="py-4 text-sm pr-4 break-words">{supplier.email || '-'}</td>
                                        <td className="py-4 text-sm pr-4 break-words">{supplier.phone || '-'}</td>
                                        <td className="py-4 text-sm pr-4 break-words">{supplier.address || '-'}</td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit && (
                                                    <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(supplier.id)}
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
        </>
    );
}

Suppliers.layout = (page: React.ReactNode) => <AppLayout children={page} />;
