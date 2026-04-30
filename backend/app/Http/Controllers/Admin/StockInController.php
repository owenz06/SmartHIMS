<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\PermissionHelper;
use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockInController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check view permission
        if (! PermissionHelper::can($user, 'stock_in.view')) {
            abort(403, 'You do not have permission to view stock in records.');
        }

        $records = StockIn::with(['item', 'supplier'])->latest()->get();

        return inertia('admin/stock-in', [
            'records' => $records,
        ]);
    }

    public function show($id)
    {
        if (! PermissionHelper::can(auth()->user(), 'stock_in.view')) {
            abort(403, 'You do not have permission to view stock in records.');
        }

        $record = StockIn::with(['item', 'supplier'])->findOrFail($id);

        return inertia('admin/stock-in-show', [
            'record' => $record,
        ]);
    }
}
    public function exportPDF()
    {
        $records = StockIn::with(['item', 'supplier'])
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.stock_in.pdf', compact('records'));

        return $pdf->download('stock_in_records_' . date('Y-m-d') . '.pdf');
    }