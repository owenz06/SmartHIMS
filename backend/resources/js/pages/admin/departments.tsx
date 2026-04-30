import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Department {
    id: number;
    name: string;
    description: string | null;
}

interface DepartmentsProps {
    departments: {
        data: Department[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function Departments({ departments, canCreate, canEdit, canDelete }: DepartmentsProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(`/admin/departments/${id}`);
        }
    };

    return (
        <>
            <Head title="Departments" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Departments</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage hospital departments
                    </p>
                </div>
                {canCreate && (
                    <Link href="/admin/departments/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Add Department</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {departments.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No departments found
                        </div>
                    ) : (
                        departments.data.map((department) => (
                            <div
                                key={department.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{department.name}</h3>
                                        {department.description && (
                                            <p className="text-xs text-muted-foreground mt-1 break-words">
                                                {department.description}
                                            </p>
                                        )}
                                        {!department.description && (
                                            <p className="text-xs text-muted-foreground italic mt-1">
                                                No description
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {(canEdit || canDelete) && (
                                    <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                        {canEdit && (
                                            <Link href={`/admin/departments/${department.id}/edit`} className="flex-1">
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
                                                onClick={() => handleDelete(department.id)}
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
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-sidebar-border text-left text-xs text-muted-foreground">
                                <th className="pb-3 font-medium w-[25%] pr-4">NAME</th>
                                <th className="pb-3 font-medium w-[60%] pr-4">DESCRIPTION</th>
                                <th className="pb-3 font-medium w-[15%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                                        No departments found
                                    </td>
                                </tr>
                            ) : (
                                departments.data.map((department) => (
                                    <tr
                                        key={department.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 font-medium pr-4">{department.name}</td>
                                        <td className="py-4 text-sm pr-4">
                                            <div className="whitespace-normal">
                                                {department.description || <span className="text-muted-foreground italic">No description</span>}
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit && (
                                                    <Link href={`/admin/departments/${department.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(department.id)}
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

Departments.layout = (page: React.ReactNode) => <AppLayout children={page} />;
