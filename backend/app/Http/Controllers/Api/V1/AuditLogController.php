<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        // Filter by model type
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->input('model_type'));
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->input('start_date'));
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->input('end_date'));
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('model_type', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = (int) $request->get('per_page', 25);

        $logs = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $logs->items(),
            'total' => $logs->total(),
            'current_page' => $logs->currentPage(),
            'per_page' => $logs->perPage(),
            'last_page' => $logs->lastPage(),
        ]);
    }

    public function show(AuditLog $auditLog)
    {
        $auditLog->load('user');

        return response()->json([
            'success' => true,
            'data' => $auditLog,
        ]);
    }

    public function stats(Request $request)
    {
        $startDate = $request->input('start_date', now()->subYear()->toDateString()); // Changed from 30 days to 1 year
        $endDate = $request->input('end_date', now()->toDateString());

        $totalLogs = AuditLog::whereBetween('created_at', [$startDate, $endDate])->count();

        $actionBreakdown = AuditLog::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->get()
            ->pluck('count', 'action');

        $modelBreakdown = AuditLog::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('model_type, COUNT(*) as count')
            ->groupBy('model_type')
            ->get()
            ->pluck('count', 'model_type');

        $topUsers = AuditLog::whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('user_id, COUNT(*) as count')
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->orderByDesc('count')
            ->take(5)
            ->with('user')
            ->get()
            ->map(function ($log) {
                return [
                    'user_id' => $log->user_id,
                    'user_name' => $log->user->name ?? 'Unknown',
                    'count' => $log->count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_logs' => $totalLogs,
                'action_breakdown' => $actionBreakdown,
                'model_breakdown' => $modelBreakdown,
                'top_users' => $topUsers,
            ],
        ]);
    }
}
