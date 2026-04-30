import { Head, useForm } from '@inertiajs/react';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

interface Props {
    users: User[];
    auth: {
        user: {
            role: string;
        };
    };
}

const roleColors: Record<string, string> = {
    super_admin: 'bg-purple-500',
    admin: 'bg-blue-500',
    manager: 'bg-green-500',
    pharmacist: 'bg-yellow-500',
    procurement_officer: 'bg-gray-500',
};

const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    pharmacist: 'Pharmacist',
    procurement_officer: 'Procurement Officer',
};

export default function Users({ users, auth }: Props) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Determine available roles based on current user's role
    const getAvailableRoles = () => {
        if (!auth?.user?.role) return [];
        
        if (auth.user.role === 'super_admin') {
            // Super Admin can only create System Admin
            return [
                { value: 'admin', label: 'System Admin' }
            ];
        } else if (auth.user.role === 'admin') {
            // System Admin can create operational roles
            return [
                { value: 'manager', label: 'Inventory Manager' },
                { value: 'pharmacist', label: 'Pharmacist' },
                { value: 'procurement_officer', label: 'Procurement Officer' }
            ];
        }
        return [];
    };

    const availableRoles = getAvailableRoles();
    const defaultRole = availableRoles.length > 0 ? availableRoles[0].value : 'pharmacist';

    const createForm = useForm({
        name: '',
        email: '',
        role: defaultRole,
        password: '',
        password_confirmation: '',
    });

    const editForm = useForm({
        name: '',
        email: '',
        role: '',
    });

    const deleteForm = useForm({});

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/users', {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            editForm.put(`/admin/users/${selectedUser.id}`, {
                onSuccess: () => {
                    setIsEditOpen(false);
                    setSelectedUser(null);
                    editForm.reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedUser) {
            deleteForm.delete(`/admin/users/${selectedUser.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedUser(null);
                },
            });
        }
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setIsEditOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    return (
        <AppSidebarLayout>
            <Head title="Users" />
            <div className="p-4 sm:p-6">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <CardTitle className="text-xl sm:text-2xl">User Management</CardTitle>
                        <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Add User</span>
                            <span className="sm:hidden">Add</span>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {users && users.length > 0 ? (
                            <>
                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-3">
                                    {users.map((user) => (
                                        <div
                                            key={user.id}
                                            className="border border-sidebar-border rounded-lg p-4 space-y-3 bg-card shadow-sm"
                                        >
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm break-words">{user.name}</h3>
                                                    <p className="text-xs text-muted-foreground mt-1 break-words">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Badge className={roleColors[user.role]}>
                                                    {roleLabels[user.role] || user.role}
                                                </Badge>
                                            </div>
                                            
                                            <div className="text-xs">
                                                <span className="text-muted-foreground">Created:</span>
                                                <p className="font-medium mt-0.5">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex gap-2 pt-2 border-t border-sidebar-border">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openEditDialog(user)}
                                                    className="flex-1"
                                                >
                                                    <Pencil className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(user)}
                                                    className="flex-1"
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Created</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <Badge className={roleColors[user.role]}>
                                                            {roleLabels[user.role] || user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openEditDialog(user)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => openDeleteDialog(user)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                No users found. Click "Add User" to create one.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Create User Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                            Add a new user to the system. They will receive login credentials.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreate}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={createForm.data.name}
                                    onChange={(e) => createForm.setData('name', e.target.value)}
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-500">{createForm.errors.name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={(e) => createForm.setData('email', e.target.value)}
                                    required
                                />
                                {createForm.errors.email && (
                                    <p className="text-sm text-red-500">{createForm.errors.email}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    value={createForm.data.role}
                                    onChange={(e) => createForm.setData('role', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                {createForm.errors.role && (
                                    <p className="text-sm text-red-500">{createForm.errors.role}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={createForm.data.password}
                                    onChange={(e) => createForm.setData('password', e.target.value)}
                                    required
                                />
                                {createForm.errors.password && (
                                    <p className="text-sm text-red-500">{createForm.errors.password}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={createForm.data.password_confirmation}
                                    onChange={(e) =>
                                        createForm.setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing && <Spinner />}
                                Create User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information. Password will remain unchanged.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEdit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-500">{editForm.errors.name}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    required
                                />
                                {editForm.errors.email && (
                                    <p className="text-sm text-red-500">{editForm.errors.email}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <select
                                    id="edit-role"
                                    value={editForm.data.role}
                                    onChange={(e) => editForm.setData('role', e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                {editForm.errors.role && (
                                    <p className="text-sm text-red-500">{editForm.errors.role}</p>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing && <Spinner />}
                                Update User
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.name}? This action cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                        >
                            {deleteForm.processing && <Spinner />}
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppSidebarLayout>
    );
}
