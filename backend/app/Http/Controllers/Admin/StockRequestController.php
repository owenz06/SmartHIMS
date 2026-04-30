<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockRequest;
use App\Models\Supplier;
use App\Models\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockRequestController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Managers see their own requests, procurement officers see all
        $query = StockRequest::with(['item', 'supplier', 'requestedBy']);
        
        if ($user->role === 'manager') {
            $query->where('requested_by', $user->id);
        }
        
        $requests = $query->latest()->paginate(50);

        // Transform for frontend
        $requests->getCollection()->transform(function ($request) {
            $request->requested_by_user = $request->requestedBy;
            return $request;
        });

        return inertia('admin/stock-requests', [
            'requests' => $requests,
            'canCreate' => $user->role === 'manager',
            'canApprove' => $user->role === 'procurement_officer',
        ]);
    }

    public function create()
    {
        if (auth()->user()->role !== 'manager') {
            abort(403, 'Only managers can create stock requests.');
        }

        $items = Item::all();
        $suppliers = Supplier::all();

        return inertia('admin/stock-requests-create', [
            'items' => $items,
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        if (auth()->user()->role !== 'manager') {
            abort(403, 'Only managers can create stock requests.');
        }

        $request->validate([
            'item_id' => 'required|exists:items,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'quantity_requested' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            $stockRequest = StockRequest::create([
                'request_number' => 'SR-' . date('YmdHis'),
                'item_id' => $request->item_id,
                'supplier_id' => $request->supplier_id,
                'quantity_requested' => $request->quantity_requested,
                'requested_by' => auth()->id(),
                'status' => 'Pending',
                'notes' => $request->notes,
                'requested_date' => now(),
            ]);

            // Notify procurement officers
            SystemNotification::create([
                'title' => 'New Stock Request',
                'message' => 'Stock request ' . $stockRequest->request_number . ' has been submitted by ' . auth()->user()->name . ' for approval.',
                'target_role' => 'procurement_officer',
                'is_read' => false,
            ]);
        });

        return redirect()->route('admin.stock-requests.index')
            ->with('success', 'Stock request submitted successfully.');
    }

    public function show($id)
    {
        $stockRequest = StockRequest::with(['item', 'supplier', 'requestedBy'])->findOrFail($id);
        
        // Transform for frontend
        $stockRequest->requested_by_user = $stockRequest->requestedBy;

        return inertia('admin/stock-requests-show', [
            'stockRequest' => $stockRequest,
            'canApprove' => auth()->user()->role === 'procurement_officer' && $stockRequest->status === 'Pending',
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        if (auth()->user()->role !== 'procurement_officer') {
            abort(403, 'Only procurement officers can update stock request status.');
        }

        $request->validate([
            'status' => 'required|in:Approved,Rejected,Completed',
            'rejection_reason' => 'required_if:status,Rejected',
        ]);

        DB::transaction(function () use ($request, $id) {
            $stockRequest = StockRequest::with('requestedBy')->findOrFail($id);
            
            $stockRequest->update([
                'status' => $request->status,
                'rejection_reason' => $request->rejection_reason,
                'completed_date' => $request->status === 'Completed' ? now() : null,
            ]);

            // If approved, add stock to inventory
            if ($request->status === 'Approved' || $request->status === 'Completed') {
                $item = Item::find($stockRequest->item_id);
                $item->quantity += $stockRequest->quantity_requested;
                $item->save();

                // Create stock in record
                \App\Models\StockIn::create([
                    'item_id' => $stockRequest->item_id,
                    'supplier_id' => $stockRequest->supplier_id,
                    'quantity_received' => $stockRequest->quantity_requested,
                    'received_date' => now(),
                    'notes' => 'Stock request ' . $stockRequest->request_number . ' fulfilled',
                ]);
            }

            // Notify the requester (manager)
            $statusMessage = match($request->status) {
                'Approved' => 'Your stock request ' . $stockRequest->request_number . ' has been approved and stock has been added.',
                'Rejected' => 'Your stock request ' . $stockRequest->request_number . ' has been rejected. Reason: ' . $request->rejection_reason,
                'Completed' => 'Your stock request ' . $stockRequest->request_number . ' has been completed.',
                default => 'Your stock request ' . $stockRequest->request_number . ' status has been updated.',
            };

            SystemNotification::create([
                'title' => 'Stock Request ' . ucfirst(strtolower($request->status)),
                'message' => $statusMessage,
                'user_id' => $stockRequest->requested_by,
                'is_read' => false,
            ]);

            // If approved, notify admin about the stock addition
            if ($request->status === 'Approved' || $request->status === 'Completed') {
                SystemNotification::create([
                    'title' => 'Stock Request Approved',
                    'message' => 'Stock request ' . $stockRequest->request_number . ' has been approved by ' . auth()->user()->name . '. Stock has been added to inventory.',
                    'target_role' => 'admin',
                    'is_read' => false,
                ]);
            }
        });

        return back()->with('success', 'Stock request status updated successfully.');
    }

    public function destroy($id)
    {
        $stockRequest = StockRequest::findOrFail($id);

        if ($stockRequest->requested_by !== auth()->id() && auth()->user()->role !== 'procurement_officer') {
            abort(403, 'You do not have permission to delete this stock request.');
        }

        if ($stockRequest->status !== 'Pending') {
            abort(403, 'Cannot delete a stock request that has been processed.');
        }

        $stockRequest->delete();

        return redirect()->route('admin.stock-requests.index')
            ->with('success', 'Stock request deleted successfully.');
    }
}
