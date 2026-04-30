import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string | null;
    items_count: number;
}

interface CategoriesProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
}

export default function Categories({ categories, canCreate, canEdit, canDelete }: CategoriesProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(`/admin/categories/${id}`);
        }
    };

    return (
        <>
            <Head title="Categories" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-sidebar-border px-4 sm:px-6 py-4 gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold">Categories</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                        Manage inventory categories
                    </p>
                </div>
                {canCreate && (
                    <Link href="/admin/categories/create" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Add Category</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </Link>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {categories.data.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            No categories found
                        </div>
                    ) : (
                        categories.data.map((category) => (
                            <div
                                key={category.id}
                                className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm break-words">{category.name}</h3>
                                        {category.description && (
                                            <p className="text-xs text-muted-foreground mt-1 break-words">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">
                                        {category.items_count}
                                    </span>
                                </div>

                                {(canEdit || canDelete) && (
                                    <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                        {canEdit && (
                                            <Link href={`/admin/categories/${category.id}/edit`} className="flex-1">
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
                                                onClick={() => handleDelete(category.id)}
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
                                <th className="pb-3 font-medium w-[25%] pr-4">NAME</th>
                                <th className="pb-3 font-medium w-[45%] pr-4">DESCRIPTION</th>
                                <th className="pb-3 font-medium w-[15%] pr-4">
                                    <span className="block">ITEMS</span>
                                    <span className="block">COUNT</span>
                                </th>
                                <th className="pb-3 font-medium w-[15%] text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b border-sidebar-border hover:bg-sidebar-accent/50 transition-colors"
                                    >
                                        <td className="py-4 font-medium pr-4 break-words">{category.name}</td>
                                        <td className="py-4 text-sm pr-4 break-words">{category.description || '-'}</td>
                                        <td className="py-4 text-sm pr-4">{category.items_count}</td>
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {canEdit && (
                                                    <Link href={`/admin/categories/${category.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(category.id)}
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

Categories.layout = (page: React.ReactNode) => <AppLayout children={page} />;
