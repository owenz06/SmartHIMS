# Testing Predictive Analysis API

## Quick Test Instructions

### 1. Test API Endpoint Directly
Open your browser and navigate to:
```
http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public/api/predictive-analysis
```

**Expected Response** (if logged in):
```json
{
  "success": true,
  "data": {
    "predictions": [...],
    "demand_forecast": [...],
    "stock_optimization": [...],
    "seasonal_trends": [...],
    "insights": [...]
  }
}
```

**If not logged in**, you'll get a 401 Unauthorized error (this is expected).

### 2. Test via Frontend
1. Open the application: `http://localhost:3001`
2. Login with: `superadmin@hims.com` / `password123`
3. Navigate to **Predictive Analysis** page
4. Open browser DevTools (F12)
5. Go to **Console** tab
6. Look for these logs:
   ```
   Loading predictive analysis data...
   API Response: {success: true, data: {...}}
   Predictions: [...]
   Demand Forecast: [...]
   Stock Optimization: [...]
   Seasonal Trends: [...]
   Insights: [...]
   ```

### 3. Check Network Tab
1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the Predictive Analysis page
4. Look for request to: `predictive-analysis?timeRange=30days&_t=...`
5. Click on it and check:
   - **Status**: Should be `200 OK`
   - **Response**: Should show JSON with success: true
   - **Preview**: Should show the data structure

### 4. What You Should See

#### If No Stock Transaction Data Exists:
- **Predictions**: Empty array `[]` or basic calculations
- **Demand Forecast**: Empty array `[]`
- **Stock Optimization**: Array with items but 0 monthly usage
- **Seasonal Trends**: Empty array `[]`
- **Insights**: Array with basic insights (seasonal planning, etc.)

The page will show empty state messages for sections with no data.

#### If Stock Transaction Data Exists:
- **Predictions**: 4 cards with metrics
- **Demand Forecast**: Chart with historical and predicted data
- **Stock Optimization**: List of top 10 items with status
- **Seasonal Trends**: Bar chart with monthly demand
- **Insights**: List of AI-powered recommendations

### 5. Common Issues & Solutions

#### Issue: 401 Unauthorized
**Solution**: Make sure you're logged in. Check if token exists in localStorage:
```javascript
// In browser console
localStorage.getItem('auth_token')
```

#### Issue: 404 Not Found
**Solution**: Verify the API URL is correct. Check `frontend/.env`:
```
VITE_API_URL=http://localhost/Smart%20Hospital%20Inventory%20Management%20System%20(SHIMS)/backend/public
```

#### Issue: 500 Internal Server Error
**Solution**: Check Laravel logs:
```
backend/storage/logs/laravel.log
```

#### Issue: CORS Error
**Solution**: Verify CORS middleware is enabled in `backend/app/Http/Kernel.php`

### 6. Create Sample Stock Out Data (Optional)

To test with actual data, create some stock out transactions:

1. Go to **Stock Out** page
2. Click **New Stock Out**
3. Fill in the form:
   - Select an item
   - Enter quantity
   - Add dispensed to and notes
4. Submit the form
5. Repeat 5-10 times with different items and dates
6. Go back to **Predictive Analysis** page
7. Refresh and see the data populate

### 7. Database Query Test

You can also test directly in the database:

```sql
-- Check if stock_outs table has data
SELECT COUNT(*) FROM stock_outs;

-- Check recent stock outs
SELECT * FROM stock_outs ORDER BY taken_at DESC LIMIT 10;

-- Check stock outs from last month
SELECT 
    DATE_FORMAT(taken_at, '%Y-%m') as month,
    SUM(quantity_taken) as total_demand
FROM stock_outs
WHERE taken_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY month
ORDER BY month ASC;
```

### 8. Expected Console Output

When the page loads successfully, you should see:
```
Loading predictive analysis data...
API Response: {success: true, data: {…}}
Predictions: Array(4) [{…}, {…}, {…}, {…}]
Demand Forecast: Array(0) []
Stock Optimization: Array(10) [{…}, {…}, ...]
Seasonal Trends: Array(0) []
Insights: Array(1) [{…}]
```

The arrays may be empty if there's no historical data, which is normal for a new system.

## Troubleshooting Checklist

- [ ] Backend server is running (XAMPP Apache started)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] User is logged in (check localStorage for auth_token)
- [ ] API URL is correct in frontend/.env
- [ ] Routes are registered in backend/routes/api.php
- [ ] Controller exists at backend/app/Http/Controllers/Api/V1/PredictiveAnalysisController.php
- [ ] No PHP errors in backend/storage/logs/laravel.log
- [ ] Browser console shows no JavaScript errors
- [ ] Network tab shows 200 OK response for API call

## Success Criteria

✅ Page loads without errors
✅ API returns 200 OK status
✅ Console logs show API response
✅ Empty states display when no data
✅ No errors in browser console
✅ No errors in Laravel logs

The page is working correctly even if it shows empty states - this is expected when there's no historical stock transaction data yet.
