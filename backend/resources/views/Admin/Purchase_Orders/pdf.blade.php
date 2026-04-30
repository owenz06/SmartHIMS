<!DOCTYPE html>
<html>
<head>
    <title>Purchase Order</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        .header { text-align:center; }
        .title { font-size:22px; font-weight:bold; }
        table { width:100%; border-collapse: collapse; margin-top:20px;}
        th, td { border:1px solid #000; padding:8px; text-align:left;}
        .right { text-align:right; }
    </style>
</head>
<body>

<div class="header">
    <div class="title">SMART HOSPITAL</div>
    <div>Inventory Management System</div>
</div>

<hr>

<h3>Purchase Order: {{ $order->po_number }}</h3>
<p><strong>Supplier:</strong> {{ $order->supplier->name }}</p>
<p><strong>Date:</strong> {{ $order->order_date }}</p>
<p><strong>Status:</strong> {{ $order->status }}</p>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Item</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        @foreach($order->items as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $item->item->ItemName }}</td>
            <td>{{ $item->quantity }}</td>
        </tr>
        @endforeach
    </tbody>
</table>

<br><br>

<p>Authorized By: ___________________________</p>
<p>Signature: ________________________________</p>

</body>
</html>