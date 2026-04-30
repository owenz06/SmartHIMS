<!DOCTYPE html>
<html>
<head>
    <title>Inventory List</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; font-size: 10px; }
        .low-stock { background-color: #ffebee; color: #c62828; }
        .normal-stock { color: #2e7d32; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">SMART HOSPITAL</div>
    <div class="subtitle">Inventory Items List</div>
    <div style="font-size: 12px; margin-top: 10px;">Generated on: {{ date('F d, Y H:i') }}</div>
</div>

<table>
    <thead>
        <tr>
            <th>Item Name</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Current Stock</th>
            <th>Unit</th>
            <th>Reorder Point</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse($items as $item)
        <tr class="{{ $item->quantity <= $item->reorder_point ? 'low-stock' : '' }}">
            <td>{{ $item->name }}</td>
            <td>{{ $item->category->name ?? 'N/A' }}</td>
            <td>{{ $item->supplier->name ?? 'N/A' }}</td>
            <td>{{ $item->quantity }}</td>
            <td>{{ $item->unit_of_measurement }}</td>
            <td>{{ $item->reorder_point }}</td>
            <td>
                @if($item->quantity <= $item->reorder_point)
                    <span style="color: #c62828;">Low Stock</span>
                @elseif($item->quantity <= ($item->reorder_point * 1.5))
                    <span style="color: #f57c00;">Warning</span>
                @else
                    <span style="color: #2e7d32;">Normal</span>
                @endif
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="7" style="text-align: center; padding: 20px;">No inventory items found</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="footer">
    <p>Total Items: {{ $items->count() }}</p>
    <p>Low Stock Items: {{ $items->where('quantity', '<=', $items->pluck('reorder_point'))->count() }}</p>
    <p>Hospital Inventory Management System - {{ date('Y') }}</p>
</div>

</body>
</html>