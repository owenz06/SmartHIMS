<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockRequest;
use App\Models\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockRequestController extends Controller
{
    /**
     * Display a listing of stock requests.
     * Managers see their own requests, procurement officers see all.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = StockRequest::with(['item', 'supplier', 'requestedBy']);
        
        // Filter by role
        if ($user->role === 'manager') {
            $query->where('requested_by', $user->id);
        }
        
        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('request_number', 'like', "%{$search}%")
                  ->orWhereHas('item', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('requestedBy', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $requests = $query->latest()->get();
        
        // Transform for frontend
        $requests->transform(function ($request) {
            $request->requested_by_user = $request->requestedBy;
            return $request;
        });
        
        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    /**
     * Store a newly created stock request.
     * Only managers can create stock requests.
     */
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'manager') {
            return response()->json([
                'success' => false,
                'message' => 'Only managers can create stock requests.',
            ], 403);
        }

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'quantity_requested' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $stockRequest = DB::transaction(function () use ($validated) {
            $stockRequest = StockRequest::create([
                'request_number' => 'SR-' . date('YmdHis') . '-' . rand(1000, 9999),
                'item_id' => $validated['item_id'],
                'supplier_id' => $validated['supplier_id'] ?? null,
                'quantity_requested' => $validated['quantity_requested'],
                'requested_by' => auth()->id(),
                'status' => 'Pending',
                'notes' => $validated['notes'] ?? null,
                'requested_date' => now(),
            ]);

            // Notify procurement officers
            SystemNotification::create([
                'title' => 'New Stock Request',
                'message' => 'Stock request ' . $stockRequest->request_number . ' has been submitted by ' . auth()->user()->name . ' for approval.',
                'target_role' => 'procurement_officer',
                'is_read' => false,
            ]);

            return $stockRequest;
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock request created successfully.',
            'data' => $stockRequest->load(['item', 'supplier', 'requestedBy']),
        ], 201);
    }

    /**
     * Display the specified stock request.
     */
    public function show($id)
    {
        $stockRequest = StockRequest::with(['item', 'supplier', 'requestedBy'])->findOrFail($id);
        
        $user = auth()->user();
        
        // Managers can only view their own requests
        if ($user->role === 'manager' && $stockRequest->requested_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to view this stock request.',
            ], 403);
        }
        
        // Transform for frontend
        $stockRequest->requested_by_user = $stockRequest->requestedBy;

        return response()->json([
            'success' => true,
            'data' => $stockRequest,
        ]);
    }

    /**
     * Update the specified stock request.
     * Only managers can update their own pending requests.
     */
    public function update(Request $request, $id)
    {
        $stockRequest = StockRequest::findOrFail($id);
        
        $user = auth()->user();
        
        // Only managers can update their own pending requests
        if ($user->role !== 'manager' || $stockRequest->requested_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to update this stock request.',
            ], 403);
        }
        
        if ($stockRequest->status !== 'Pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot update a stock request that has been processed.',
            ], 403);
        }

        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'quantity_requested' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $stockRequest->update([
            'item_id' => $validated['item_id'],
            'supplier_id' => $validated['supplier_id'] ?? null,
            'quantity_requested' => $validated['quantity_requested'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Stock request updated successfully.',
            'data' => $stockRequest->load(['item', 'supplier', 'requestedBy']),
        ]);
    }

    /**
     * Update the status of a stock request.
     * Only procurement officers can approve/reject requests.
     */
    public function updateStatus(Request $request, $id)
    {
        if (auth()->user()->role !== 'procurement_officer') {
            return response()->json([
                'success' => false,
                'message' => 'Only procurement officers can update stock request status.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:Approved,Rejected,Completed',
            'rejection_reason' => 'required_if:status,Rejected|nullable|string',
        ]);

        $stockRequest = DB::transaction(function () use ($validated, $id) {
            $stockRequest = StockRequest::with('requestedBy')->findOrFail($id);
            
            if ($stockRequest->status !== 'Pending') {
                throw new \Exception('This stock request has already been processed.');
            }
            
            $stockRequest->update([
                'status' => $validated['status'],
                'rejection_reason' => $validated['rejection_reason'] ?? null,
                'completed_date' => in_array($validated['status'], ['Approved', 'Completed']) ? now() : null,
            ]);

            // If approved, add stock to inventory
            if ($validated['status'] === 'Approved' || $validated['status'] === 'Completed') {
                $item = Item::find($stockRequest->item_id);
                $item->quantity += $stockRequest->quantity_requested;
                $item->save();

                // Create stock in record
                StockIn::create([
                    'item_id' => $stockRequest->item_id,
                    'supplier_id' => $stockRequest->supplier_id,
                    'quantity_received' => $stockRequest->quantity_requested,
                    'received_date' => now(),
                    'notes' => 'Stock request ' . $stockRequest->request_number . ' fulfilled',
                ]);
            }

            // Notify the requester (manager)
            $statusMessage = match($validated['status']) {
                'Approved' => 'Your stock request ' . $stockRequest->request_number . ' has been approved and stock has been added.',
                'Rejected' => 'Your stock request ' . $stockRequest->request_number . ' has been rejected. Reason: ' . ($validated['rejection_reason'] ?? 'No reason provided'),
                'Completed' => 'Your stock request ' . $stockRequest->request_number . ' has been completed.',
                default => 'Your stock request ' . $stockRequest->request_number . ' status has been updated.',
            };

            SystemNotification::create([
                'title' => 'Stock Request ' . ucfirst(strtolower($validated['status'])),
                'message' => $statusMessage,
                'user_id' => $stockRequest->requested_by,
                'is_read' => false,
            ]);

            // If approved, notify admins about the stock addition
            if ($validated['status'] === 'Approved' || $validated['status'] === 'Completed') {
                SystemNotification::create([
                    'title' => 'Stock Request Approved',
                    'message' => 'Stock request ' . $stockRequest->request_number . ' has been approved by ' . auth()->user()->name . '. Stock has been added to inventory.',
                    'target_role' => 'admin',
                    'is_read' => false,
                ]);
            }

            return $stockRequest;
        });

        return response()->json([
            'success' => true,
            'message' => 'Stock request status updated successfully.',
            'data' => $stockRequest->load(['item', 'supplier', 'requestedBy']),
        ]);
    }

    /**
     * Remove the specified stock request.
     * Managers can delete their own pending requests.
     * Procurement officers can delete any pending request.
     */
    public function destroy($id)
    {
        $stockRequest = StockRequest::findOrFail($id);
        
        $user = auth()->user();
        
        // Check permissions
        if ($user->role === 'manager' && $stockRequest->requested_by !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete this stock request.',
            ], 403);
        }
        
        if (!in_array($user->role, ['manager', 'procurement_officer'])) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to delete stock requests.',
            ], 403);
        }
        
        if ($stockRequest->status !== 'Pending') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a stock request that has been processed.',
            ], 403);
        }

        $stockRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Stock request deleted successfully.',
        ]);
    }
}
