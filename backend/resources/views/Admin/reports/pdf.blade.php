<!DOCTYPE html>
<html>
<head>
    <title>Inventory Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #666; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; border-bottom: 2px solid #333; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .stats-grid { display: table; width: 100%; margin-bottom: 20px; }
        .stat-item { display: table-cell; width: 25%; text-align: center; padding: 15px; border: 1px solid #ddd; }
        .stat-number { font-size: 18px; font-weight: bold; color: #333; }
        .stat-label { font-size: 10px; color: #666; margin-top: 5px; }
        .alert { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">SMART HOSPITAL</div>
    <div class="subtitle">Inventory Analytics Report</div>
    <div style="font-size: 12px; margin-top: 10px;">Generated on: {{ date('F d, Y') }}</div>
</div>

<!-- Summary Stats -->
<div class="section">
    <div class="section-title">Summary Statistics</div>
    <div class="stats-grid">
        <div class="stat-item">
            <div class="stat-number">{{ $monthlyUsage->sum('total') }}</div>
            <div class="stat-label">Total Usage This Year</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">{{ $lowStockItems->count() }}</div>
            <div class="stat-label">Low Stock Items</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">{{ $reorderSuggestions->count() }}</div>
            <div class="stat-label">Reorder Suggestions</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">{{ $recentAuditLogs->count() }}</div>
            <div class="stat-label">Recent Activities</div>
        </div>
    </div>
</div>

<!-- Most Used Items -->
<div class="section">
    <div class="section-title">Most Used Items</div>
    <table>
        <thead>
            <tr>
                <th>Rank</th>
                <th>Item Name</th>
                <th>Total Used</th>
            </tr>
        </thead>
        <tbody>
            @forelse($mostUsed as $index => $item)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $item->item->name }}</td>
                <td>{{ $item->total_used }} units</td>
            </tr>
            @empty
            <tr>
                <td colspan="3" style="text-align: center;">No usage data available</td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>

<!-- Low Stock Alert -->
@if($lowStockItems->count() > 0)
<div class="section">
    <div class="section-title">Low Stock Alert</div>
    <div class="alert">
        <strong>Attention:</strong> {{ $lowStockItems->count() }} items are below their reorder point and need immediate attention.
    </div>
    <table>
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Reorder Point</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($lowStockItems->take(10) as $item)
            <tr>
                <td>{{ $item->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>{{ $item->reorder_point }}</td>
                <td style="color: #d32f2f;">Critical</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

<!-- Reorder Suggestions -->
@if($reorderSuggestions->count() > 0)
<div class="section">
    <div class="section-title">AI-Powered Reorder Suggestions</div>
    <table>
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Monthly Average</th>
                <th>Suggested Order</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reorderSuggestions->take(10) as $item)
            <tr>
                <td>{{ $item['name'] }}</td>
                <td>{{ $item['current_stock'] }}</td>
                <td>{{ $item['monthly_avg'] }}</td>
                <td>{{ $item['suggested_reorder'] }} units</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endif

<!-- Recent Activities -->
<div class="section">
    <div class="section-title">Recent System Activities</div>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
                <th>Type</th>
            </tr>
        </thead>
        <tbody>
            @foreach($recentAuditLogs as $log)
            <tr>
                <td>{{ $log->created_at->format('M d, Y H:i') }}</td>
                <td>{{ $log->user->name ?? 'System' }}</td>
                <td>{{ $log->action }}</td>
                <td>{{ class_basename($log->model_type) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>

<div class="footer">
    <p>Hospital Inventory Management System - {{ date('Y') }}</p>
    <p>This report contains confidential information. Handle with care.</p>
</div>

</body>
</html>