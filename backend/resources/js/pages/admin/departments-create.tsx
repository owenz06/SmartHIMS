import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function DepartmentsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/departments');
    };

    return (
        <>
            <Head title="Add Department" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sidebar-border px-4 sm:px-6 py-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold break-words">Add Department</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Create a new department
                    </p>
                </div>
                <Link href="/admin/departments">
                    <Button variant="outline" className="w-full sm:w-auto">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Departments
                    </Button>
                </Link>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Department Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Enter department name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Enter department description (optional)"
                            rows={4}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Creating...' : 'Create Department'}
                        </Button>
                        <Link href="/admin/departments" className="w-full sm:w-auto">
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

DepartmentsCreate.layout = (page: React.ReactNode) => <AppLayout children={page} />;
