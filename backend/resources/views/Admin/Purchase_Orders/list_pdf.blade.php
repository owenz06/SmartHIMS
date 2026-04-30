<!DOCTYPE html>
<html>
<head>
    <title>Purchase Orders List</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .title { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .status { padding: 3px 8px; border-radius: 3px; font-size: 10px; }
        .status-pending { background-color: #fff3cd; color: #856404; }
        .status-approved { background-color: #d1ecf1; color: #0c5460; }
        .status-received { background-color: #d4edda; color: #155724; }
        .status-cancelled { background-color: #f8d7da; color: #721c24; }
        .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">SMART HOSPITAL</div>
    <div class="subtitle">Purchase Orders List</div>
    <div style="font-size: 12px; margin-top: 10px;">Generated on: {{ date('F d, Y') }}</div>
</div>

<table>
    <thead>
        <tr>
            <th>PO Number</th>
            <th>Supplier</th>
            <th>Order Date</th>
            <th>Items</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @forelse($orders as $order)
        <tr>
            <td>{{ $order->po_number }}</td>
            <td>{{ $order->supplier->name }}</td>
            <td>{{ $order->order_date }}</td>
            <td>{{ $order->items->count() }} items</td>
            <td>
                <span class="status status-{{ strtolower($order->status) }}">
                    {{ ucfirst($order->status) }}
                </span>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="5" style="text-align: center; padding: 20px;">No purchase orders found</td>
        </tr>
        @endforelse
    </tbody>
</table>

<div class="footer">
    <p>Total Purchase Orders: {{ $orders->count() }}</p>
    <p>Hospital Inventory Management System - {{ date('Y') }}</p>
</div>

</body>
</html>