import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface SmartReorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: number;
    name: string;
    currentStock: number;
    reorderPoint: number;
    unitPrice: number;
    supplier: string;
  };
  aiRecommendation: {
    suggestedQuantity: number;
    estimatedDeliveryDate: string;
    predictedUsage: number;
    confidence: number;
    reasoning: string[];
  };
  onConfirm: (quantity: number) => void;
}

export function SmartReorderModal({
  open,
  onOpenChange,
  item,
  aiRecommendation,
  onConfirm,
}: SmartReorderModalProps) {
  const [quantity, setQuantity] = useState(aiRecommendation.suggestedQuantity);

  const totalCost = quantity * item.unitPrice;
  const daysOfSupply = Math.floor(quantity / (aiRecommendation.predictedUsage / 30));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI-Powered Reorder Recommendation
          </DialogTitle>
          <DialogDescription>
            Smart suggestions based on historical data and predictive analytics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Info */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <Badge variant="outline">{item.supplier}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Stock</p>
                <p className="font-medium">{item.currentStock} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reorder Point</p>
                <p className="font-medium">{item.reorderPoint} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Unit Price</p>
                <p className="font-medium">${item.unitPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                AI Recommendation
              </h4>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                {aiRecommendation.confidence}% Confidence
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Predicted Usage</p>
                  <p className="font-medium">{aiRecommendation.predictedUsage} units/month</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Est. Delivery</p>
                  <p className="font-medium">{aiRecommendation.estimatedDeliveryDate}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Reasoning:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {aiRecommendation.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Order Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={1}
              />
              <p className="text-xs text-muted-foreground">
                AI suggests: {aiRecommendation.suggestedQuantity} units
              </p>
            </div>

            {/* Order Summary */}
            <div className="rounded-lg border p-4 space-y-2">
              <h4 className="font-semibold text-sm">Order Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-medium">{quantity} units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Unit Price</span>
                  <span className="font-medium">${item.unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Days of Supply</span>
                  <span className="font-medium">{daysOfSupply} days</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-base">
                  <span className="font-semibold flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Total Cost
                  </span>
                  <span className="font-bold">${totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(quantity)}>Create Purchase Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
