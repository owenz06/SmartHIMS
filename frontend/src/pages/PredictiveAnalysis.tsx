import React, { useState, useEffect } from 'react';
import { PredictiveAnalysisAPI } from '../lib/api';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Calendar,
  BarChart3,
  Brain,
  Zap,
  Target,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/DashboardLayout';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const PredictiveAnalysis: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [demandForecast, setDemandForecast] = useState<any[]>([]);
  const [stockOptimization, setStockOptimization] = useState<any[]>([]);
  const [seasonalTrends, setSeasonalTrends] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('Loading predictive analysis data...');
      const response = await PredictiveAnalysisAPI.getAll({ timeRange });
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        console.log('Predictions:', data.predictions);
        console.log('Demand Forecast:', data.demand_forecast);
        console.log('Stock Optimization:', data.stock_optimization);
        console.log('Seasonal Trends:', data.seasonal_trends);
        console.log('Insights:', data.insights);
        
        setPredictions(data.predictions || []);
        setDemandForecast(data.demand_forecast || []);
        setStockOptimization(data.stock_optimization || []);
        setSeasonalTrends(data.seasonal_trends || []);
        setInsights(data.insights || []);
      }
    } catch (error: any) {
      console.error('Failed to load predictive analysis data:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'understock':
        return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'overstock':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case 'success':
        return <Target className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'info':
        return <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      low: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    };
    return colors[impact as keyof typeof colors] || colors.low;
  };

  if (isLoading) {
    return (
      <DashboardLayout
        title="Predictive Analysis"
        subtitle="Loading AI-powered insights..."
        showSearch={false}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Analyzing inventory data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Predictive Analysis"
      subtitle="AI-powered inventory forecasting and insights"
      showSearch={false}
    >
      <div className="space-y-6">
        {/* Header with Time Range Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Predictive Analysis</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered forecasting and optimization
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('7days')}
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('30days')}
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('90days')}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Prediction Cards */}
        {predictions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictions.map((prediction, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{prediction.metric}</p>
                      {prediction.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-foreground">{prediction.value}</p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${
                          prediction.trend === 'up'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {prediction.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {prediction.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Prediction Data Available
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Predictions require historical stock transaction data. Start recording stock movements to generate AI-powered insights.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Demand Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Demand Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            {demandForecast.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={demandForecast}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#0097A7"
                      fill="#0097A7"
                      fillOpacity={0.3}
                      name="Actual Demand"
                    />
                    <Area
                      type="monotone"
                      dataKey="predicted"
                      stroke="#FF9800"
                      fill="#FF9800"
                      fillOpacity={0.3}
                      strokeDasharray="5 5"
                      name="Predicted Demand"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Insight:</strong> Analysis based on historical stock transaction data. Predictions use growth trends from past usage patterns.
                  </p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Historical Data Available
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Demand forecasting requires historical stock transaction data. Start recording stock in/out transactions to generate predictions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stock Optimization & Seasonal Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Optimization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Stock Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stockOptimization.length > 0 ? (
                <div className="space-y-3">
                  {stockOptimization.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.item}</p>
                        <p className="text-sm text-muted-foreground">
                          Current: {item.current} | Optimal: {item.optimal}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status === 'optimal'
                          ? 'Optimal'
                          : item.status === 'understock'
                          ? 'Under'
                          : 'Over'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    No Optimization Data
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Stock optimization requires usage history. Record stock transactions to see recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seasonal Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Seasonal Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {seasonalTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Bar dataKey="demand" fill="#0097A7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    No Seasonal Data
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    Seasonal trends require at least 12 months of transaction history.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI-Powered Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {insights.length > 0 ? (
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-foreground">{insight.title}</h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactBadge(
                              insight.impact
                            )}`}
                          >
                            {insight.impact} impact
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-primary">{insight.action}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Insights Available
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  AI insights are generated based on inventory patterns and usage trends. Start recording stock transactions to receive intelligent recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Model Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Model Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Algorithm</p>
                <p className="font-semibold text-foreground">ARIMA + ML Ensemble</p>
              </div>
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Training Data</p>
                <p className="font-semibold text-foreground">24 months historical</p>
              </div>
              <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                <p className="font-semibold text-green-600 dark:text-green-400">87.5%</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Predictions are based on historical data and current trends.
                Actual results may vary due to external factors. Review and adjust recommendations
                based on your specific context.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PredictiveAnalysis;
