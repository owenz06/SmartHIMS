<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use Illuminate\Http\Request;

class RequisitionController extends Controller
{
    public function index(Request $request)
    {
        $query = Requisition::with(['department', 'user', 'items.item']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('department_id')) {
            $query->where('department_id', $request->integer('department_id'));
        }

        $perPage = (int) $request->get('per_page', 25);

        return response()->json(
            $query->orderByDesc('requested_date')->paginate($perPage)
        );
    }

    public function show(Requisition $requisition)
    {
        $requisition->load(['department', 'user', 'items.item']);

        return response()->json($requisition);
    }

    public function store(Request $request)
    {
        // Only Pharmacist can create requisitions
        if (!in_array(auth()->user()->role, ['pharmacist'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Pharmacists can create requisitions.',
            ], 403);
        }

        $validated = $request->validate([
            'requisition_number' => 'required|string|max:255|unique:requisitions,requisition_number',
            'department_id' => 'required|exists:departments,id',
            'requested_date' => 'required|date',
            'status' => 'nullable|in:Pending,Approved,Rejected,Fulfilled',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        \DB::beginTransaction();
        try {
            $requisition = Requisition::create([
                'requisition_number' => $validated['requisition_number'],
                'department_id' => $validated['department_id'],
                'user_id' => auth()->id(),
                'requested_date' => $validated['requested_date'],
                'status' => $validated['status'] ?? 'Pending',
            ]);

            foreach ($validated['items'] as $item) {
                $requisition->items()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            \DB::commit();

            $requisition->load(['department', 'user', 'items.item']);

            return response()->json([
                'success' => true,
                'message' => 'Requisition created successfully',
                'data' => $requisition,
            ], 201);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create requisition',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, Requisition $requisition)
    {
        // Super Admin and System Admin cannot update requisitions
        if (in_array(auth()->user()->role, ['super_admin', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Super Admin and System Admin cannot update requisitions.',
            ], 403);
        }

        // Pharmacist can only update their own pending requisitions
        if (auth()->user()->role === 'pharmacist' && $requisition->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only update your own requisitions.',
            ], 403);
        }

        $validated = $request->validate([
            'requisition_number' => 'required|string|max:255|unique:requisitions,requisition_number,' . $requisition->id,
            'department_id' => 'required|exists:departments,id',
            'requested_date' => 'required|date',
            'status' => 'nullable|in:Pending,Approved,Rejected,Fulfilled',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        \DB::beginTransaction();
        try {
            $requisition->update([
                'requisition_number' => $validated['requisition_number'],
                'department_id' => $validated['department_id'],
                'requested_date' => $validated['requested_date'],
                'status' => $validated['status'] ?? $requisition->status,
            ]);

            // Delete existing items and recreate
            $requisition->items()->delete();

            foreach ($validated['items'] as $item) {
                $requisition->items()->create([
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            \DB::commit();

            $requisition->load(['department', 'user', 'items.item']);

            return response()->json([
                'success' => true,
                'message' => 'Requisition updated successfully',
                'data' => $requisition,
            ]);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update requisition',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Requisition $requisition)
    {
        // Super Admin and System Admin cannot delete requisitions
        if (in_array(auth()->user()->role, ['super_admin', 'admin'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Super Admin and System Admin cannot delete requisitions.',
            ], 403);
        }

        // Only allow deletion of pending or rejected requisitions
        if (!in_array($requisition->status, ['Pending', 'Rejected'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete approved or fulfilled requisitions',
            ], 422);
        }

        $requisition->items()->delete();
        $requisition->delete();

        return response()->json([
            'success' => true,
            'message' => 'Requisition deleted successfully',
        ]);
    }

    public function approve(Requisition $requisition)
    {
        // Only Manager can approve requisitions
        if (!in_array(auth()->user()->role, ['manager'])) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only Inventory Managers can approve requisitions.',
            ], 403);
        }

        if ($requisition->status !== 'Pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending requisitions can be approved',
            ], 422);
        }

        $requisition->update(['status' => 'Approved']);
        $requisition->load(['department', 'user', 'items.item']);

        return response()->json([
            'success' => true,
            'message' => 'Requisition approved successfully',
            'data' => $requisition,
        ]);
    }
}
