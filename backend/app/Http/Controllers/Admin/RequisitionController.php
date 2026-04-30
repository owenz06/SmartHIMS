<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\AuditHelper;
use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Item;
use App\Models\Requisition;
use App\Models\RequisitionItem;
use App\Models\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RequisitionController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Requisition::with('department', 'user');
        
        // Pharmacists see only their own requisitions
        if ($user->role === 'pharmacist') {
            $query->where('user_id', $user->id);
        }
        
        // Managers see only requisitions from pharmacists (not their own stock requests)
        elseif ($user->role === 'manager') {
            $query->whereHas('user', function ($q) {
                $q->where('role', 'pharmacist');
            });
        }
        
        // Procurement officers should NOT see requisitions (they see Stock Requests instead)
        elseif ($user->role === 'procurement_officer') {
            // Return empty result - procurement officers use Stock Requests page
            $query->whereRaw('1 = 0'); // Always false condition
        }
        
        // Admin and super_admin see all requisitions
        // No additional filtering needed

        $requisitions = $query->latest()->paginate(15);

        return inertia('admin/requisitions', [
            'requisitions' => $requisitions,
            'canCreate' => PermissionHelper::can($user, 'requisitions.create'),
            'canEdit' => PermissionHelper::can($user, 'requisitions.update'),
            'canDelete' => PermissionHelper::can($user, 'requisitions.delete'),
            'canApprove' => PermissionHelper::can($user, 'requisitions.approve'),
        ]);
    }

    public function create()
    {
        if (! PermissionHelper::can(auth()->user(), 'requisitions.create')) {
            abort(403, 'You do not have permission to create requisitions.');
        }

        $departments = Department::all();
        $items = Item::all();

        return inertia('admin/requisitions-create', [
            'departments' => $departments,
            'items' => $items,
        ]);
    }

    public function store(Request $request)
    {
        if (! PermissionHelper::can(auth()->user(), 'requisitions.create')) {
            abort(403, 'You do not have permission to create requisitions.');
        }

        $request->validate([
            'department_id' => 'required|exists:departments,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request) {
            $requisition = Requisition::create([
                'requisition_number' => 'REQ-'.date('YmdHis'),
                'department_id' => $request->department_id,
                'user_id' => Auth::id(),
                'status' => 'Pending',
                'requested_date' => now(),
            ]);

            foreach ($request->items as $item) {
                RequisitionItem::create([
                    'requisition_id' => $requisition->id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            // Notify managers about new requisition from pharmacist
            SystemNotification::create([
                'title' => 'New Requisition Submitted',
                'message' => 'Requisition '.$requisition->requisition_number.' has been submitted by '.auth()->user()->name.' and requires approval.',
                'target_role' => 'manager',
                'user_id' => null,
                'is_read' => false,
            ]);

            AuditHelper::log('created', $requisition, null, $requisition->toArray());
        });

        return redirect()->route('admin.requisitions.index')
            ->with('success', 'Requisition created successfully.');
    }

    public function show(string $id)
    {
        $requisition = Requisition::with(['department', 'user', 'items.item'])->findOrFail($id);

        return inertia('admin/requisitions-show', [
            'requisition' => $requisition,
            'canApprove' => PermissionHelper::can(auth()->user(), 'requisitions.approve'),
        ]);
    }

    public function edit(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'requisitions.update')) {
            abort(403, 'You do not have permission to edit requisitions.');
        }

        $requisition = Requisition::with('items')->findOrFail($id);
        $departments = Department::all();
        $items = Item::all();

        return inertia('admin/requisitions-edit', [
            'requisition' => $requisition,
            'departments' => $departments,
            'items' => $items,
        ]);
    }

    public function update(Request $request, string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'requisitions.update')) {
            abort(403, 'You do not have permission to edit requisitions.');
        }

        $request->validate([
            'department_id' => 'required|exists:departments,id',
            'items' => 'required|array',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $id) {
            $requisition = Requisition::with('items')->findOrFail($id);
            $oldData = $requisition->toArray();

            $requisition->department_id = $request->department_id;
            $requisition->save();

            // Delete old items
            $requisition->items()->delete();

            // Add new items
            foreach ($request->items as $item) {
                RequisitionItem::create([
                    'requisition_id' => $requisition->id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            AuditHelper::log('updated', $requisition, $oldData, $requisition->toArray());
        });

        return redirect()->route('admin.requisitions.index')
            ->with('success', 'Requisition updated successfully.');
    }

    public function updateStatus(Request $request, string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'requisitions.approve')) {
            abort(403, 'You do not have permission to approve requisitions.');
        }

        $request->validate([
            'status' => 'required|in:Pending,Approved,Rejected,Completed',
        ]);

        DB::transaction(function () use ($request, $id) {
            $requisition = Requisition::with('user')->findOrFail($id);
            $previousStatus = $requisition->status;
            $oldData = ['status' => $previousStatus];

            $requisition->status = $request->status;
            $requisition->save();

            // Notify the requester about status change
            $statusMessage = $request->status === 'Approved' 
                ? 'Your requisition '.$requisition->requisition_number.' has been approved and will be processed soon.'
                : 'Your requisition '.$requisition->requisition_number.' has been rejected. Please contact the manager for more details.';

            SystemNotification::create([
                'title' => 'Requisition '.ucfirst(strtolower($request->status)),
                'message' => $statusMessage,
                'target_role' => null,
                'user_id' => $requisition->user_id,
                'is_read' => false,
            ]);

            AuditHelper::log('status_updated', $requisition, $oldData, ['status' => $requisition->status]);
        });

        return back()->with('success', 'Requisition status updated successfully.');
    }

    public function destroy(string $id)
    {
        if (! PermissionHelper::can(auth()->user(), 'requisitions.delete')) {
            abort(403, 'You do not have permission to delete requisitions.');
        }

        DB::transaction(function () use ($id) {
            $requisition = Requisition::with('items')->findOrFail($id);
            $oldData = $requisition->toArray();

            $requisition->items()->delete();
            $requisition->delete();

            AuditHelper::log('deleted', $requisition, $oldData, null);
        });

        return redirect()->route('admin.requisitions.index')
            ->with('success', 'Requisition deleted successfully.');
    }
}
