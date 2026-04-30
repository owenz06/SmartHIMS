import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2, FileText, Download } from 'lucide-react';

interface PurchaseOrder {
    id: number;
    po_number: string;
    supplier: {
        id: number;
        name: string;
    };
    order_date: string;
    status: string;
    items: Array<{
        id: number;
        item: {
            name: string;
        };
        quantity: number;
    }>;
}

interface PurchaseOrdersProps {
    orders: {
        data: PurchaseOrder[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function PurchaseOrders({ orders, canCreate, canEdit, canDelete }: PurchaseOrdersProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this purchase order?')) {
            router.delete(`/admin/purchase-orders/${id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'approved':
                return 'bg-blue-500/10 text-blue-500';
            case 'received':
                return 'bg-green-500/10 text-green-500';
            case 'cancelled':
                return 'bg-red-500/10 text-red-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <>
            <Head title="Purchase Orders" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Purchase Orders</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage purchase orders
                    </p>
                </div>
                {canCreate && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => window.open('/admin/purchase-orders/export/pdf', '_blank')}
                            className="w-full sm:w-auto"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Export PDF</span>
                            <span className="sm:hidden">PDF</span>
                        </Button>
                        <Link href="/admin/purchase-orders/create" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                <span className="hidden sm:inline">Create Order</span>
                                <span className="sm:hidden">Create</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {orders.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No purchase orders found
                        </div>
                    ) : (
                        orders.data.map((order) => (
                            <div
                                key={order.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">
                                            {order.po_number}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {order.supplier.name}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status}
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Order Date:</span>
                                        <p className="font-medium mt-0.5">
                                            {new Date(order.order_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Items:</span>
                                        <p className="font-medium mt-0.5">{order.items.length} items</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                    <Link href={`/admin/purchase-orders/${order.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(`/admin/purchase-orders/${order.id}/pdf`, '_blank')}
                                        className="flex-1"
                                    >
                                        <FileText className="h-3 w-3 mr-1" />
                                        PDF
                                    </Button>
                                    {canEdit && (
                                        <Link href={`/admin/purchase-orders/${order.id}/edit`} className="flex-1">
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
                                            onClick={() => handleDelete(order.id)}
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
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-sidebar-border text-left text-sm text-muted-foreground">
                                <th className="pb-3 font-medium">PO NUMBER</th>
                                <th className="pb-3 font-medium">SUPPLIER</th>
                                <th className="pb-3 font-medium">ORDER DATE</th>
                                <th className="pb-3 font-medium">ITEMS</th>
                                <th className="pb-3 font-medium">STATUS</th>
                                <th className="pb-3 font-medium text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No purchase orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.data.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 font-medium">{order.po_number}</td>
                                        <td className="py-4 text-sm">{order.supplier.name}</td>
                                        <td className="py-4 text-sm">
                                            {new Date(order.order_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 text-sm">{order.items.length} items</td>
                                        <td className="py-4">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/purchase-orders/${order.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(`/admin/purchase-orders/${order.id}/pdf`, '_blank')}
                                                >
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                                {canEdit && (
                                                    <Link href={`/admin/purchase-orders/${order.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(order.id)}
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

PurchaseOrders.layout = (page: React.ReactNode) => <AppLayout children={page} />;
