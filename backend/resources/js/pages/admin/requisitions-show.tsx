import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

interface RequisitionItem {
    id: number;
    quantity: number;
    item: {
        id: number;
        name: string;
        unit_of_measurement: string;
        quantity: number;
    };
}

interface Requisition {
    id: number;
    requisition_number: string;
    status: string;
    requested_date: string;
    department: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        name: string;
    };
    items: RequisitionItem[];
}

interface Props {
    requisition: Requisition;
    canApprove: boolean;
}

export default function RequisitionsShow({ requisition, canApprove }: Props) {
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

    const handleStatusUpdate = (status: string) => {
        if (confirm(`Are you sure you want to ${status.toLowerCase()} this requisition?`)) {
            router.post(`/admin/requisitions/${requisition.id}/status`, { status }, {
                onSuccess: () => {
                    // Trigger event to refetch notification count
                    window.dispatchEvent(new CustomEvent('notification-read'));
                },
            });
        }
    };

    return (
        <>
            <Head title={`Requisition ${requisition.requisition_number}`} />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-sidebar-border px-6 py-4">
                <div>
                    <h1 className="text-2xl font-semibold">Requisition Details</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {requisition.requisition_number}
                    </p>
                </div>
                <Link href="/admin/requisitions">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Requisitions
                    </Button>
                </Link>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Requisition Info */}
                <div className="bg-sidebar-accent/50 rounded-lg p-6 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Requisition Number</p>
                            <p className="font-medium mt-1">{requisition.requisition_number}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className={`mt-1 ${getStatusColor(requisition.status)}`}>
                                {requisition.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="font-medium mt-1">{requisition.department.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Requested By</p>
                            <p className="font-medium mt-1">{requisition.user.name}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Requested Date</p>
                        <p className="font-medium mt-1">
                            {new Date(requisition.requested_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

                {/* Items Table */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Requested Items</h2>
                    <div className="overflow-x-auto border border-sidebar-border rounded-lg">
                        <table className="w-full table-fixed">
                            <thead className="bg-sidebar-accent/50">
                                <tr className="text-left text-xs text-muted-foreground">
                                    <th className="p-4 font-medium w-[30%]">ITEM NAME</th>
                                    <th className="p-4 font-medium w-[20%]">
                                        <span className="block">QUANTITY</span>
                                        <span className="block">REQUESTED</span>
                                    </th>
                                    <th className="p-4 font-medium w-[25%]">
                                        <span className="block">AVAILABLE</span>
                                        <span className="block">STOCK</span>
                                    </th>
                                    <th className="p-4 font-medium w-[25%]">STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requisition.items.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-t border-sidebar-border hover:bg-sidebar-accent/30 transition-colors"
                                    >
                                        <td className="p-4">{item.item.name}</td>
                                        <td className="p-4">
                                            {item.quantity} {item.item.unit_of_measurement}
                                        </td>
                                        <td className="p-4">
                                            <span className={item.item.quantity >= item.quantity ? 'text-green-500' : 'text-red-500'}>
                                                {item.item.quantity} {item.item.unit_of_measurement}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {item.item.quantity >= item.quantity ? (
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                                                    Available
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                                                    Insufficient
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Buttons */}
                {canApprove && requisition.status.toLowerCase() === 'pending' && (
                    <div className="flex gap-4 pt-4">
                        <Button
                            onClick={() => handleStatusUpdate('Approved')}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Requisition
                        </Button>
                        <Button
                            onClick={() => handleStatusUpdate('Rejected')}
                            variant="destructive"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Requisition
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}

RequisitionsShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
