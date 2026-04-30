import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';

interface Requisition {
    id: number;
    requisition_number: string;
    department: {
        id: number;
        name: string;
    };
    user: {
        id: number;
        name: string;
    };
    requested_date: string;
    status: string;
}

interface RequisitionsProps {
    requisitions: {
        data: Requisition[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove: boolean;
}

export default function Requisitions({ requisitions, canCreate, canEdit, canDelete, canApprove }: RequisitionsProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this requisition?')) {
            router.delete(`/admin/requisitions/${id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-500';
            case 'approved':
                return 'bg-green-500/10 text-green-500';
            case 'rejected':
                return 'bg-red-500/10 text-red-500';
            case 'completed':
                return 'bg-blue-500/10 text-blue-500';
            default:
                return 'bg-gray-500/10 text-gray-500';
        }
    };

    return (
        <>
            <Head title="Requisitions" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Requisitions</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage department requisitions
                    </p>
                </div>
                {canCreate && (
                    <Link href="/admin/requisitions/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Create Requisition</span>
                            <span className="sm:hidden">Create</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {requisitions.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No requisitions found
                        </div>
                    ) : (
                        requisitions.data.map((requisition) => (
                            <div
                                key={requisition.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">
                                            {requisition.requisition_number}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {requisition.department.name}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(requisition.status)}>
                                        {requisition.status}
                                    </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Requested By:</span>
                                        <p className="font-medium mt-0.5">{requisition.user.name}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Date:</span>
                                        <p className="font-medium mt-0.5">
                                            {new Date(requisition.requested_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                    <Link href={`/admin/requisitions/${requisition.id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Eye className="h-3 w-3 mr-1" />
                                            View
                                        </Button>
                                    </Link>
                                    {canEdit && (
                                        <Link href={`/admin/requisitions/${requisition.id}/edit`} className="flex-1">
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
                                            onClick={() => handleDelete(requisition.id)}
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
                                    <span className="block">REQ</span>
                                    <span className="block">NUMBER</span>
                                </th>
                                <th className="pb-3 font-medium w-[18%] pr-4">DEPARTMENT</th>
                                <th className="pb-3 font-medium w-[18%] pr-4">
                                    <span className="block">REQUESTED</span>
                                    <span className="block">BY</span>
                                </th>
                                <th className="pb-3 font-medium w-[15%] pr-4">DATE</th>
                                <th className="pb-3 font-medium w-[14%] pr-4">STATUS</th>
                                <th className="pb-3 font-medium w-[20%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requisitions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                                        No requisitions found
                                    </td>
                                </tr>
                            ) : (
                                requisitions.data.map((requisition) => (
                                    <tr
                                        key={requisition.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 font-medium">{requisition.requisition_number}</td>
                                        <td className="py-4 text-sm">{requisition.department.name}</td>
                                        <td className="py-4 text-sm">{requisition.user.name}</td>
                                        <td className="py-4 text-sm">
                                            {new Date(requisition.requested_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4">
                                            <Badge className={getStatusColor(requisition.status)}>
                                                {requisition.status}
                                            </Badge>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/requisitions/${requisition.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                {canEdit && (
                                                    <Link href={`/admin/requisitions/${requisition.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(requisition.id)}
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

Requisitions.layout = (page: React.ReactNode) => <AppLayout children={page} />;
