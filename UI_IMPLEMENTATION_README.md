# Hospital Inventory Management System - UI/UX Implementation

## 🎨 Overview

This is a modern, AI-powered hospital inventory management system with predictive analytics. The UI is built with React, TypeScript, Inertia.js, and Tailwind CSS, featuring a comprehensive design system focused on proactive inventory management.

## 📁 Project Structure

```
resources/js/
├── components/
│   ├── ui/                          # Core UI components
│   │   ├── demand-chart.tsx         # Forecast visualization
│   │   ├── predictive-alert.tsx     # Smart alert component
│   │   ├── stat-card.tsx            # Metric display cards
│   │   └── stock-level-indicator.tsx # Visual stock status
│   │
│   └── inventory/                   # Inventory-specific components
│       ├── demand-heatmap.tsx       # Usage pattern visualization
│       ├── inventory-table.tsx      # Comprehensive item listing
│       └── smart-reorder-modal.tsx  # AI-powered reorder interface
│
├── pages/
│   └── predictive-dashboard.tsx     # Main dashboard page
│
├── data/
│   └── sample-dashboard-data.ts     # Sample data for testing
│
└── layouts/
    └── app-layout.tsx               # Main application layout
```

## 🚀 Getting Started

### Prerequisites

```bash
# Node.js 18+ and npm
node --version
npm --version

# PHP 8.2+ and Composer
php --version
composer --version
```

### Installation

1. **Install Dependencies**
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

2. **Build Assets**
```bash
# Development build with hot reload
npm run dev

# Production build
npm run build
```

3. **Run the Application**
```bash
# Start Laravel development server
php artisan serve

# In another terminal, start Vite
npm run dev
```

## 🎯 Key Features

### 1. Predictive Dashboard

The main dashboard provides:
- Real-time inventory metrics
- AI-powered stockout predictions
- Demand forecasting charts
- Priority item monitoring
- Quick action buttons

**Usage:**
```tsx
import PredictiveDashboard from '@/pages/predictive-dashboard';

// The dashboard automatically loads with sample data
// In production, pass real data from your Laravel backend
```

### 2. Smart Alert System

Predictive alerts warn staff before stockouts occur:

```tsx
<PredictiveAlert
  itemName="Surgical Gloves"
  currentStock={150}
  predictedStockout="March 15, 2026"
  daysUntilStockout={14}
  severity="critical"
  recommendedAction="Order 500 units based on historical usage"
  onAction={() => handleCreatePO()}
/>
```

**Alert Levels:**
- 🔴 **Critical**: < 7 days until stockout
- 🟡 **Warning**: 7-30 days until stockout
- 🔵 **Info**: Trend changes or seasonal patterns

### 3. Demand Forecasting

Visual charts show historical and predicted demand:

```tsx
<DemandChart
  title="Surgical Supplies Demand"
  data={[
    { date: 'Mar 1', actual: 142, predicted: 145 },
    { date: 'Mar 2', predicted: 148 },
    // ...more data
  ]}
  unit="units"
  trend={{ value: 8.5, isPositive: true }}
/>
```

### 4. Stock Level Indicators

Visual progress bars show stock status:

```tsx
<StockLevelIndicator
  current={150}
  reorderPoint={200}
  maximum={1000}
  unit="units"
  showLabel={true}
/>
```

**Features:**
- Color-coded status (Critical/Low/Healthy)
- Reorder point marker
- Real-time updates
- Accessibility compliant

### 5. Inventory Table

Comprehensive item listing with:
- Search and filter
- Sortable columns
- Stock level visualization
- Demand trends
- Quick actions

```tsx
<InventoryTable
  items={inventoryItems}
  onViewDetails={(id) => console.log('View', id)}
  onEdit={(id) => console.log('Edit', id)}
  onReorder={(id) => console.log('Reorder', id)}
/>
```

### 6. Smart Reorder Modal

AI-powered purchase order creation:

```tsx
<SmartReorderModal
  open={isOpen}
  onOpenChange={setIsOpen}
  item={selectedItem}
  aiRecommendation={{
    suggestedQuantity: 500,
    estimatedDeliveryDate: 'March 8, 2026',
    predictedUsage: 420,
    confidence: 92,
    reasoning: [
      'Historical usage shows 35 units/day',
      'Seasonal trend indicates 15% increase',
      // ...more reasoning
    ],
  }}
  onConfirm={(quantity) => handleCreatePO(quantity)}
/>
```

### 7. Demand Heatmap

Visualize usage patterns by day and hour:

```tsx
<DemandHeatmap
  data={[
    {
      day: 'Mon',
      hours: [2, 3, 4, 5, 8, 12, 18, 22, 25, 28, ...],
    },
    // ...more days
  ]}
  title="Weekly Demand Patterns"
  description="Hourly distribution throughout the week"
/>
```

## 🎨 Design System

### Colors

```typescript
// Status Colors
const colors = {
  critical: '#DC2626',   // Red
  warning: '#EAB308',    // Yellow
  success: '#16A34A',    // Green
  info: '#3B82F6',       // Blue
  ai: '#9333EA',         // Purple (for AI features)
};
```

### Typography

```typescript
// Text Styles
const typography = {
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-semibold',
  h3: 'text-xl font-semibold',
  body: 'text-base',
  small: 'text-sm',
};
```

### Spacing

```typescript
// Consistent spacing
const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
};
```

## 📊 Sample Data

Use the provided sample data for testing:

```typescript
import {
  sampleStats,
  sampleAlerts,
  sampleTopItems,
  sampleDemandForecast,
  sampleInventoryItems,
  sampleDemandHeatmap,
  sampleAIRecommendation,
} from '@/data/sample-dashboard-data';

// Use in your components
<PredictiveDashboard
  stats={sampleStats}
  alerts={sampleAlerts}
  topItems={sampleTopItems}
  demandForecast={sampleDemandForecast}
/>
```

## 🔌 Backend Integration

### Laravel Controller Example

```php
// app/Http/Controllers/DashboardController.php
public function index()
{
    return Inertia::render('predictive-dashboard', [
        'stats' => [
            'totalItems' => Item::count(),
            'lowStockItems' => Item::where('quantity', '<=', 'reorder_point')->count(),
            'predictedStockouts' => $this->getPredictedStockouts(),
            'pendingOrders' => PurchaseOrder::where('status', 'pending')->count(),
        ],
        'alerts' => $this->getAIAlerts(),
        'topItems' => $this->getHighPriorityItems(),
        'demandForecast' => $this->getDemandForecast(),
    ]);
}
```

### API Routes

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/inventory/predictions', [PredictionController::class, 'index']);
    Route::get('/inventory/demand-forecast', [PredictionController::class, 'forecast']);
    Route::post('/inventory/reorder', [InventoryController::class, 'reorder']);
});
```

## 🧪 Testing

### Component Testing

```typescript
// Example test for PredictiveAlert
import { render, screen } from '@testing-library/react';
import { PredictiveAlert } from '@/components/ui/predictive-alert';

test('renders critical alert correctly', () => {
  render(
    <PredictiveAlert
      itemName="Surgical Gloves"
      currentStock={150}
      predictedStockout="March 15, 2026"
      daysUntilStockout={14}
      severity="critical"
      recommendedAction="Order 500 units"
    />
  );

  expect(screen.getByText('Surgical Gloves')).toBeInTheDocument();
  expect(screen.getByText('14 days')).toBeInTheDocument();
});
```

## 📱 Responsive Design

The UI is fully responsive:

- **Desktop (1920px+)**: 3-column layout with full visualizations
- **Tablet (768px-1919px)**: 2-column layout with condensed charts
- **Mobile (<768px)**: Single column with stacked cards

## ♿ Accessibility

All components follow WCAG 2.1 AA guidelines:

- ✅ Color contrast ratios ≥ 4.5:1
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus indicators
- ✅ ARIA labels

## 🎯 Performance Optimization

- **Lazy loading**: Charts load on demand
- **Virtual scrolling**: Large tables render efficiently
- **Debounced search**: Reduces unnecessary renders
- **Memoization**: Components cache expensive calculations
- **Code splitting**: Reduces initial bundle size

## 🔧 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        critical: '#DC2626',
        warning: '#EAB308',
        success: '#16A34A',
        ai: '#9333EA',
      },
    },
  },
};
```

### Adding New Components

1. Create component in `resources/js/components/`
2. Export from index file
3. Import and use in pages

```typescript
// components/ui/my-component.tsx
export function MyComponent() {
  return <div>My Component</div>;
}

// pages/my-page.tsx
import { MyComponent } from '@/components/ui/my-component';
```

## 📚 Documentation

- **Design Guide**: See `UI_UX_DESIGN_GUIDE.md`
- **Component API**: Check individual component files
- **Sample Data**: See `resources/js/data/sample-dashboard-data.ts`

## 🐛 Troubleshooting

### Common Issues

**Issue**: Components not rendering
```bash
# Clear cache and rebuild
npm run build
php artisan optimize:clear
```

**Issue**: Styles not applying
```bash
# Rebuild Tailwind CSS
npm run dev
```

**Issue**: TypeScript errors
```bash
# Check types
npm run type-check
```

## 🚀 Deployment

### Production Build

```bash
# Build optimized assets
npm run build

# Optimize Laravel
php artisan optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Environment Variables

```env
# .env
APP_ENV=production
APP_DEBUG=false
VITE_APP_URL=https://your-domain.com
```

## 📈 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Advanced ML model integration
- [ ] Custom report builder
- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] Multi-language support
- [ ] Dark mode enhancements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For questions or issues:
- Check the documentation
- Review sample code
- Contact the development team

---

Built with ❤️ for healthcare professionals
