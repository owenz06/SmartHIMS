<!DOCTYPE html>
<html>
<head>
    <title>Stock In Records</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .quantity { text-align: center; font-weight: bold; color: #2e7d32; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">SMART HOSPITAL</div>
    <div class="subtitle">Stock In Records</div>
    <div style="font-size: 12px; margin-top: 10px;">Generated on: {{ date('F d, Y H:i') }}</div>
</div>

<table>
    <thead>
        <tr>
            <th>Date</th>
            <th>Item Name</th>
            <th>Supplier</th>
            <th>Quantity Received</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        @forelse($records as $record)
        <tr>
            <td>{{ $record->created_at->format('M d, Y H:i') }}</td>
            <td>{{ $record->item->name }}</td>
            <td>{{ $record->supplier->name ?? 'N/A' }}</td>
            <td class="quantity">+{{ $record->quantity_received }}</td>
            <td>{{ $record->notes ?? '-' }}</td>
        </tr>
        @empty
        <tr>
            <td colspan="5" style="text-align: center; padding: 20px;">No stock in records found</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="footer">
    <p>Total Records: {{ $records->count() }}</p>
    <p>Total Items Received: {{ $records->sum('quantity_received') }}</p>
    <p>Hospital Inventory Management System - {{ date('Y') }}</p>
</div>

</body>
</html>