import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function SuppliersCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/suppliers');
    };

    return (
        <>
            <Head title="Add Supplier" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border px-4 sm:px-6 py-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold break-words">Add Supplier</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Create a new supplier
                    </p>
                </div>
                <Link href="/admin/suppliers">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Suppliers
                    </Button>
                </Link>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Supplier Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Supplier Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter supplier name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Contact Person */}
                    <div className="space-y-2">
                        <Label htmlFor="contact_person">Contact Person</Label>
                        <Input
                            id="contact_person"
                            value={data.contact_person}
                            onChange={(e) => setData('contact_person', e.target.value)}
                            placeholder="Enter contact person name (optional)"
                        />
                        {errors.contact_person && (
                            <p className="text-sm text-red-500">{errors.contact_person}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Enter email address (optional)"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="Enter phone number (optional)"
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Enter supplier address (optional)"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Creating...' : 'Create Supplier'}
                        </Button>
                        <Link href="/admin/suppliers" className="w-full sm:w-auto">
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

SuppliersCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
