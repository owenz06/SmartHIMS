import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    viewHref?: string;
    editHref?: string;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}

export function ActionButtons({
    onView,
    onEdit,
    onDelete,
    viewHref,
    editHref,
    showView = false,
    showEdit = true,
    showDelete = true,
}: ActionButtonsProps) {
    const handleView = () => {
        if (viewHref) {
            router.visit(viewHref);
        } else if (onView) {
            onView();
        }
    };

    const handleEdit = () => {
        if (editHref) {
            router.visit(editHref);
        } else if (onEdit) {
            onEdit();
        }
    };

    return (
        <div className="flex justify-end gap-2">
            {showView && (onView || viewHref) && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleView}
                    title="View"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            )}
            {showEdit && (onEdit || editHref) && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    title="Edit"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}
            {showDelete && onDelete && (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={onDelete}
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4 text-white" />
                </Button>
            )}
        </div>
    );
}
