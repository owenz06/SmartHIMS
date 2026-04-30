# Visual Mockups - Hospital Inventory Management System

## 🎨 Complete UI/UX Visual Guide

This document provides ASCII art mockups and detailed descriptions of each screen and component.

---

## 1. Main Dashboard (Desktop View)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  🏥 Hospital Inventory System                    👤 John Doe  🔔 3  ⚙️  [Dark Mode]    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  📊 Predictive Dashboard                                    [🔍 Filter] [📥 Export]     │
│  AI-powered insights for proactive inventory management                                 │
│                                                                                          │
│  ┌──────────────────┬──────────────────┬──────────────────┬──────────────────┐        │
│  │  📦 Total Items  │  ⚠️  Low Stock   │  🔮 Predicted    │  🛒 Pending      │        │
│  │                  │                  │     Stockouts    │     Orders       │        │
│  │      1,234       │        23        │        15        │        8         │        │
│  │   +12% ↑ 🟢     │    Warning 🟡   │   Next 30 days   │   In Transit     │        │
│  └──────────────────┴──────────────────┴──────────────────┴──────────────────┘        │
│                                                                                          │
│  ┌────────────────────────────────────────────────────┬──────────────────────────────┐ │
│  │  🔔 Predictive Alerts                    [15 Active]│  ⭐ High-Priority Items      │ │
│  │  AI-predicted stockouts based on usage patterns    │                              │ │
│  │                                                     │  ┌────────────────────────┐ │ │
│  │  ┌──────────────────────────────────────────────┐  │  │ Surgical Gloves (M)    │ │ │
│  │  │ 🔴 CRITICAL                        [14 days]  │  │  │ PPE                    │ │ │
│  │  │ Surgical Gloves (Size M)                     │  │  │ ████████░░░░░░░░ 45%  │ │ │
│  │  │                                               │  │  │ +15% ↑                │ │ │
│  │  │ Current Stock: 150 units                     │  │  └────────────────────────┘ │ │
│  │  │ Predicted Stockout: March 15, 2026           │  │                              │ │
│  │  │                                               │  │  ┌────────────────────────┐ │ │
│  │  │ 💡 Recommended Action:                       │  │  │ N95 Masks              │ │ │
│  │  │ Order 500 units immediately. Historical data │  │  │ PPE                    │ │ │
│  │  │ shows 35 units/day usage during flu season.  │  │  │ ██████████░░░░░░ 60%  │ │ │
│  │  │                                               │  │  │ +12% ↑                │ │ │
│  │  │              [Create Purchase Order]          │  │  └────────────────────────┘ │ │
│  │  └──────────────────────────────────────────────┘  │                              │ │
│  │                                                     │  ┌────────────────────────┐ │ │
│  │  ┌──────────────────────────────────────────────┐  │  │ Insulin Syringes       │ │ │
│  │  │ 🟡 WARNING                         [21 days]  │  │  │ Medical Supplies       │ │ │
│  │  │ N95 Respirator Masks                         │  │  │ ████░░░░░░░░░░░░ 25%  │ │ │
│  │  │                                               │  │  │ -5% ↓                 │ │ │
│  │  │ Current Stock: 300 units                     │  │  └────────────────────────┘ │ │
│  │  │ Predicted Stockout: March 22, 2026           │  │                              │ │
│  │  │                                               │  │  Quick Actions              │ │
│  │  │ 💡 Recommended Action:                       │  │  ┌────────────────────────┐ │ │
│  │  │ Order 1000 units. Demand increasing by 15%   │  │  │ 🛒 Create PO           │ │ │
│  │  │ week-over-week.                              │  │  │ 📦 Stock In            │ │ │
│  │  │                                               │  │  │ 📅 View Schedule       │ │ │
│  │  │              [Create Purchase Order]          │  │  │ 📊 Analytics Report    │ │ │
│  │  └──────────────────────────────────────────────┘  │  └────────────────────────┘ │ │
│  │                                                     │                              │ │
│  │  ┌──────────────────────────────────────────────┐  │                              │ │
│  │  │ 🔵 INFO                            [35 days]  │  │                              │ │
│  │  │ Sterile Bandages (4x4)                       │  │                              │ │
│  │  │ Current Stock: 450 units                     │  │                              │ │
│  │  │ Predicted Stockout: April 5, 2026            │  │                              │ │
│  │  └──────────────────────────────────────────────┘  │                              │ │
│  │                                                     │                              │ │
│  │                  [View All 15 Alerts]               │                              │ │
│  └────────────────────────────────────────────────────┴──────────────────────────────┘ │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  📈 Overall Demand Forecast                                          +8.5% ↑ 🟢  │  │
│  │  Historical and predicted demand                                                  │  │
│  │                                                                                   │  │
│  │  160 ┤                                                                            │  │
│  │  150 ┤                                    ╭─╮                                     │  │
│  │  140 ┤                          ╭─╮     ╭╯ ╰╮   ╭ ╮ ╭ ╮                         │  │
│  │  130 ┤                    ╭─╮  ╭╯ ╰╮   ╭╯   ╰╮ ╭╯ ╰╮│ ╰╮                        │  │
│  │  120 ┤              ╭─╮  ╭╯ ╰╮╭╯   ╰╮ ╭╯     ╰╯   ╰╯  ╰╮                       │  │
│  │  110 ┤        ╭─╮  ╭╯ ╰╮╭╯   ╰╯     ╰╯                 ╰╮                      │  │
│  │  100 ┼────────┴─┴──┴───┴┴─────────────────────────────────                      │  │
│  │      └─────────────────────────────────────────────────────                      │  │
│  │      Feb 24  Feb 26  Feb 28  Mar 2   Mar 4   Mar 6                              │  │
│  │                                                                                   │  │
│  │      ■ Actual    ■ Predicted                                                     │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  [Overview] [By Category] [By Supplier] [Trends]                                 │  │
│  │                                                                                   │  │
│  │  Recent Activity                                                                 │  │
│  │  Latest inventory movements and predictions                                      │  │
│  │                                                                                   │  │
│  │  🕐 2 hours ago  │  Stock In: Surgical Gloves (+200 units)                      │  │
│  │  🕐 5 hours ago  │  🔮 AI Alert: N95 Masks predicted stockout in 21 days        │  │
│  │  🕐 1 day ago    │  Purchase Order #PO-2026-045 delivered                       │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Inventory Table View

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  📦 Inventory Management                                                                 │
│                                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐                    │
│  │  🔍 Search by name, code, or category...                       │  [+ Add Item]      │
│  └────────────────────────────────────────────────────────────────┘                    │
│                                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Item Code ↕ │ Name ↕        │ Category │ Stock Level      │ Trend │ Stockout │ ⋮ │  │
│  ├──────────────────────────────────────────────────────────────────────────────────┤  │
│  │ PPE-001     │ Surgical      │ PPE      │ ████░░░░░░ 45%  │ +15%↑│ Mar 15   │ ⋮ │  │
│  │             │ Gloves (M)    │          │ 150/1000 units  │ 🟢   │ 🔴       │   │  │
│  │             │ MedSupply Co. │          │                 │      │          │   │  │
│  ├──────────────────────────────────────────────────────────────────────────────────┤  │
│  │ PPE-002     │ N95 Masks     │ PPE      │ ██████░░░░ 60%  │ +12%↑│ Mar 22   │ ⋮ │  │
│  │             │ SafetyFirst   │          │ 300/1500 units  │ 🟢   │ 🟡       │   │  │
│  ├──────────────────────────────────────────────────────────────────────────────────┤  │
│  │ MED-101     │ Insulin       │ Medical  │ ███░░░░░░░ 25%  │ -5% ↓│ Mar 10   │ ⋮ │  │
│  │             │ Syringes      │ Supplies │ 85/500 units    │ 🔴   │ 🔴       │   │  │
│  │             │ PharmaTech    │          │                 │      │          │   │  │
│  ├──────────────────────────────────────────────────────────────────────────────────┤  │
│  │ WND-201     │ Sterile       │ Wound    │ ████████░░ 75%  │ +8% ↑│ Apr 5    │ ⋮ │  │
│  │             │ Bandages      │ Care     │ 450/1000 units  │ 🟢   │ 🔵       │   │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  Showing 4 of 1,234 items                                          [← 1 2 3 ... 124 →] │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘

Context Menu (⋮):
┌──────────────────────┐
│ 👁️  View Details     │
│ ✏️  Edit Item        │
│ 🛒 Reorder           │
│ 📊 View Analytics    │
│ 🗑️  Delete           │
└──────────────────────┘
```

---

## 3. Smart Reorder Modal

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  🧠 AI-Powered Reorder Recommendation                                          [✕]  │
│  Smart suggestions based on historical data and predictive analytics               │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  Surgical Gloves (Size M)                                    [MedSupply Co.] │  │
│  │                                                                               │  │
│  │  Current Stock        Reorder Point        Unit Price                        │  │
│  │  150 units            200 units            $12.50                            │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  🧠 AI Recommendation                                      [92% Confidence]  │  │
│  │                                                                               │  │
│  │  📈 Predicted Usage              📅 Est. Delivery                            │  │
│  │  420 units/month                 March 8, 2026                               │  │
│  │                                                                               │  │
│  │  ─────────────────────────────────────────────────────────────────────────  │  │
│  │                                                                               │  │
│  │  Reasoning:                                                                  │  │
│  │  • Historical usage shows 35 units/day average over the past 30 days        │  │
│  │  • Seasonal trend indicates 15% increase during March-April period          │  │
│  │  • Current supplier has 5-day average delivery time                         │  │
│  │  • Safety stock calculation suggests 500 units for 2-week buffer            │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│  Order Quantity                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  500                                                                         │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│  AI suggests: 500 units                                                             │
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  Order Summary                                                               │  │
│  │                                                                               │  │
│  │  Quantity                                              500 units              │  │
│  │  Unit Price                                            $12.50                 │  │
│  │  Days of Supply                                        14 days                │  │
│  │  ─────────────────────────────────────────────────────────────────────────  │  │
│  │  💵 Total Cost                                         $6,250.00              │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                     │
│                                              [Cancel]  [Create Purchase Order]     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Demand Heatmap

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│  🔥 Demand Patterns                                              [Peak: 12:00, 13:00]│
│  Hourly demand distribution throughout the week                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│         0:00    3:00    6:00    9:00    12:00   15:00   18:00   21:00             │
│                                                                                     │
│  Mon    ░░░░░░░░░░░░░░░░████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Tue    ░░░░░░░░░░░░░░░░████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Wed    ░░░░░░░░░░░░░░░░████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Thu    ░░░░░░░░░░░░░░░░████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Fri    ░░░░░░░░░░░░░░░░████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Sat    ░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  Sun    ░░░░░░░░░░░░░░░░████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                                                     │
│         Low  ░░░░  ████  ████  ████  ████  High                                   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Mobile View (Responsive)

```
┌─────────────────────────┐
│  ☰  Hospital Inventory  │
├─────────────────────────┤
│                         │
│  📦 Total Items         │
│      1,234              │
│   +12% ↑ 🟢            │
│                         │
│  ⚠️  Low Stock          │
│        23               │
│    Warning 🟡          │
│                         │
│  🔮 Predicted Stockouts │
│        15               │
│   Next 30 days          │
│                         │
│  🛒 Pending Orders      │
│         8               │
│   In Transit            │
│                         │
├─────────────────────────┤
│  🔔 Alerts (15)         │
├─────────────────────────┤
│                         │
│  🔴 Surgical Gloves     │
│  Stock: 150 units       │
│  Stockout: 14 days      │
│  [Create PO]            │
│                         │
│  🟡 N95 Masks           │
│  Stock: 300 units       │
│  Stockout: 21 days      │
│  [Create PO]            │
│                         │
│  [View All Alerts]      │
│                         │
├─────────────────────────┤
│  ⭐ High-Priority       │
├─────────────────────────┤
│                         │
│  Surgical Gloves        │
│  ████████░░░░░░ 45%    │
│  +15% ↑                │
│                         │
│  N95 Masks              │
│  ██████████░░░░ 60%    │
│  +12% ↑                │
│                         │
├─────────────────────────┤
│  [🛒] [📦] [📊] [⚙️]   │
└─────────────────────────┘
```

---

## 6. Color Palette

```
Status Colors:
┌─────────────────────────────────────────────────────────┐
│  🔴 Critical    #DC2626  ████████  Immediate action     │
│  🟡 Warning     #EAB308  ████████  Action needed soon   │
│  🟢 Healthy     #16A34A  ████████  Stock levels good    │
│  🔵 Info        #3B82F6  ████████  Informational        │
│  🟣 AI/Predict  #9333EA  ████████  ML insights          │
└─────────────────────────────────────────────────────────┘

Background Colors:
┌─────────────────────────────────────────────────────────┐
│  Light Mode   #FFFFFF  ████████  Primary background    │
│  Dark Mode    #0F172A  ████████  Primary background    │
│  Card Light   #F8FAFC  ████████  Card background       │
│  Card Dark    #1E293B  ████████  Card background       │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Typography Scale

```
┌─────────────────────────────────────────────────────────┐
│  H1  Dashboard Title        3xl  Bold    48px          │
│  H2  Section Headers        2xl  Semibold 36px         │
│  H3  Card Titles            xl   Semibold 24px         │
│  Body  Regular Text         base Regular  16px         │
│  Small  Helper Text         sm   Regular  14px         │
│  Tiny  Timestamps           xs   Regular  12px         │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Icon System

```
Status Icons:
🔴 Critical Alert
🟡 Warning Alert
🔵 Info Alert
🟢 Healthy Status
🧠 AI Recommendation
🔮 Prediction
📈 Trending Up
📉 Trending Down

Action Icons:
🛒 Create Purchase Order
📦 Stock In
📤 Stock Out
✏️  Edit
🗑️  Delete
👁️  View
📊 Analytics
📅 Calendar
🔍 Search
⚙️  Settings
🔔 Notifications
```

---

## 9. Component States

### Button States
```
Default:    [Create Purchase Order]
Hover:      [Create Purchase Order]  (slightly darker)
Active:     [Create Purchase Order]  (pressed effect)
Disabled:   [Create Purchase Order]  (grayed out)
Loading:    [⟳ Creating...]
```

### Alert States
```
Critical:   🔴 Red border, red background
Warning:    🟡 Yellow border, yellow background
Info:       🔵 Blue border, blue background
Success:    🟢 Green border, green background
```

### Stock Level States
```
Critical:   ███░░░░░░░░░░░░░ (< 25%)  Red
Low:        ██████░░░░░░░░░░ (25-50%) Yellow
Medium:     ████████████░░░░ (50-75%) Blue
Healthy:    ████████████████ (> 75%)  Green
```

---

## 10. Animation Examples

### Alert Entrance
```
Frame 1:  [                    ]  (invisible)
Frame 2:  [░                   ]  (fade in)
Frame 3:  [░░░                 ]  (slide in)
Frame 4:  [░░░░░░              ]  (continue)
Frame 5:  [Alert Content Here  ]  (fully visible)
```

### Loading Spinner
```
Frame 1:  ⠋
Frame 2:  ⠙
Frame 3:  ⠹
Frame 4:  ⠸
Frame 5:  ⠼
Frame 6:  ⠴
Frame 7:  ⠦
Frame 8:  ⠧
```

### Progress Bar Fill
```
0%:   [░░░░░░░░░░░░░░░░]
25%:  [████░░░░░░░░░░░░]
50%:  [████████░░░░░░░░]
75%:  [████████████░░░░]
100%: [████████████████]
```

---

This visual guide provides a complete overview of the UI/UX design for the hospital inventory management system. All components are designed to be intuitive, accessible, and focused on predictive analytics.
