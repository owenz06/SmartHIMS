import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

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
    notes: string | null;
    rejection_reason: string | null;
    requested_date: string;
    completed_date: string | null;
}

interface Props {
    stockRequest: StockRequest;
    canApprove: boolean;
}

export default function StockRequestsShow({ stockRequest, canApprove }: Props) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const { data, setData, post, processing } = useForm({
        status: '',
        rejection_reason: '',
    });

    const approveForm = useForm({
        status: 'Approved',
    });

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

    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this stock request? Stock will be added to inventory.')) {
            approveForm.post(`/admin/stock-requests/${stockRequest.id}/status`);
        }
    };

    const handleReject = (e: React.FormEvent) => {
        e.preventDefault();
        setData('status', 'Rejected');
        post(`/admin/stock-requests/${stockRequest.id}/status`, {
            onSuccess: () => {
                setShowRejectForm(false);
            },
        });
    };

    return (
        <>
            <Head title={`Stock Request ${stockRequest.request_number}`} />
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Stock Request Details</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        {stockRequest.request_number}
                    </p>
                </div>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/admin/stock-requests">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Back</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </Button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Request Info */}
                <div className="bg-sidebar-accent/50 rounded-lg p-4 sm:p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Request Number</p>
                            <p className="font-medium mt-1 text-sm sm:text-base break-words">{stockRequest.request_number}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Status</p>
                            <Badge className={`mt-1 ${getStatusColor(stockRequest.status)}`}>
                                {stockRequest.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Requested By</p>
                            <p className="font-medium mt-1 text-sm sm:text-base break-words">{stockRequest.requested_by_user.name}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Item</p>
                            <p className="font-medium mt-1 text-sm sm:text-base break-words">{stockRequest.item.name}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Quantity Requested</p>
                            <p className="font-medium mt-1 text-sm sm:text-base">{stockRequest.quantity_requested}</p>
                        </div>
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Preferred Supplier</p>
                            <p className="font-medium mt-1 text-sm sm:text-base break-words">{stockRequest.supplier?.name || 'Not specified'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Requested Date</p>
                        <p className="font-medium mt-1 text-sm sm:text-base">
                            {new Date(stockRequest.requested_date).toLocaleString()}
                        </p>
                    </div>
                    {stockRequest.notes && (
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Notes</p>
                            <p className="mt-1 text-sm sm:text-base break-words">{stockRequest.notes}</p>
                        </div>
                    )}
                    {stockRequest.rejection_reason && (
                        <div>
                            <p className="text-xs sm:text-sm text-muted-foreground">Rejection Reason</p>
                            <p className="mt-1 text-red-500 text-sm sm:text-base break-words">{stockRequest.rejection_reason}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                {canApprove && !showRejectForm && (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <Button
                            onClick={handleApprove}
                            disabled={approveForm.processing}
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Approve & Add Stock</span>
                            <span className="sm:hidden">Approve</span>
                        </Button>
                        <Button
                            onClick={() => setShowRejectForm(true)}
                            variant="destructive"
                            className="w-full sm:w-auto"
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Reject Request</span>
                            <span className="sm:hidden">Reject</span>
                        </Button>
                    </div>
                )}

                {/* Reject Form */}
                {showRejectForm && (
                    <div className="bg-sidebar-accent/50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-lg font-semibold mb-4">Reject Stock Request</h3>
                        <form onSubmit={handleReject} className="space-y-4">
                            <div>
                                <Label htmlFor="rejection_reason">Rejection Reason *</Label>
                                <textarea
                                    id="rejection_reason"
                                    value={data.rejection_reason}
                                    onChange={(e) => setData('rejection_reason', e.target.value)}
                                    rows={4}
                                    className="w-full mt-1 px-3 py-2 bg-background border border-sidebar-border rounded-md text-sm"
                                    placeholder="Explain why this request is being rejected..."
                                    required
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Button type="submit" variant="destructive" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? 'Rejecting...' : 'Confirm Rejection'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowRejectForm(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

StockRequestsShow.layout = (page: React.ReactNode) => <AppLayout children={page} />;
