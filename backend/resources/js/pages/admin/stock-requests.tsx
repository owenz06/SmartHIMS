import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Trash2 } from 'lucide-react';

interface StockRequest {
    id: number;
    request_number: string;
    item: {
        id: number;
        name: string;
    };
    supplier: {
        id: number;
        name: string;
    } | null;
    quantity_requested: number;
    requested_by_user: {
        id: number;
        name: string;
    };
    status: string;
    requested_date: string;
}

interface Props {
    requests: {
        data: StockRequest[];
    };
    canCreate: boolean;
    canApprove: boolean;
}

export default function StockRequests({ requests, canCreate, canApprove }: Props) {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'approved':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'completed':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this stock request?')) {
            router.delete(`/admin/stock-requests/${id}`);
        }
    };

    return (
        <>
            <Head title="Stock Requests" />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Stock Requests</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {canCreate ? 'Request stock from procurement' : 'Manage stock requests from managers'}
                    </p>
                </div>
                {canCreate && (
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/admin/stock-requests/create">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Request Stock</span>
                            <span className="sm:hidden">Request</span>
                        </Link>
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {requests.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No stock requests found
                        </div>
                    ) : (
                        requests.data.map((request) => (
                            <div
                                key={request.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{request.request_number}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">{request.item.name}</p>
                                    </div>
                                    <Badge className={getStatusColor(request.status)}>
                                        {request.status}
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Supplier:</span>
                                        <p className="font-medium mt-0.5">{request.supplier?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Quantity:</span>
                                        <p className="font-medium mt-0.5">{request.quantity_requested}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-muted-foreground">Requested By:</span>
                                        <p className="font-medium mt-0.5">{request.requested_by_user.name}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                    <Button variant="outline" size="sm" asChild className="flex-1">
                                        <Link href={`/admin/stock-requests/${request.id}`}>
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                    {request.status === 'Pending' && canCreate && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(request.id)}
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
                                <th className="pb-3 font-medium w-[15%] pr-4">
                                    <span className="block">REQUEST</span>
                                    <span className="block">NUMBER</span>
                                </th>
                                <th className="pb-3 font-medium w-[20%] pr-4">ITEM</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">SUPPLIER</th>
                                <th className="pb-3 font-medium w-[10%] pr-4">QUANTITY</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">
                                    <span className="block">REQUESTED</span>
                                    <span className="block">BY</span>
                                </th>
                                <th className="pb-3 font-medium w-[10%] pr-4">STATUS</th>
                                <th className="pb-3 font-medium w-[15%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                        No stock requests found
                                    </td>
                                </tr>
                            ) : (
                                requests.data.map((request) => (
                                    <tr
                                        key={request.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 pr-4 break-words">{request.request_number}</td>
                                        <td className="py-4 pr-4 break-words">{request.item.name}</td>
                                        <td className="py-4 pr-4 break-words">{request.supplier?.name || '-'}</td>
                                        <td className="py-4 pr-4">{request.quantity_requested}</td>
                                        <td className="py-4 pr-4 break-words">{request.requested_by_user.name}</td>
                                        <td className="py-4 pr-4">
                                            <Badge className={getStatusColor(request.status)}>
                                                {request.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/admin/stock-requests/${request.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                {request.status === 'Pending' && canCreate && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(request.id)}
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

StockRequests.layout = (page: React.ReactNode) => <AppLayout children={page} />;
