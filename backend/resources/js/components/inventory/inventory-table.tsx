import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StockLevelIndicator } from '@/components/ui/stock-level-indicator';
import {
  MoreHorizontal,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Eye,
  Edit,
  ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: number;
  itemCode: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  predictedStockout?: string;
  demandTrend: number;
}

interface InventoryTableProps {
  items: InventoryItem[];
  onViewDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onReorder: (id: number) => void;
}

export function InventoryTable({ items, onViewDetails, onEdit, onReorder }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof InventoryItem;
    direction: 'asc' | 'desc';
  } | null>(null);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof InventoryItem) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (percentage <= 25) return { label: 'Critical', variant: 'destructive' as const };
    if (percentage <= 50) return { label: 'Low', variant: 'warning' as const };
    return { label: 'Healthy', variant: 'success' as const };
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('itemCode')}
                  className="h-8 px-2"
                >
                  Item Code
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="h-8 px-2"
                >
                  Name
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort('demandTrend')}
                  className="h-8 px-2"
                >
                  Trend
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>Predicted Stockout</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              sortedItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.itemCode}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.supplier}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-48">
                        <StockLevelIndicator
                          current={item.currentStock}
                          reorderPoint={item.reorderPoint}
                          maximum={item.maxStock}
                          showLabel={false}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.demandTrend > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={cn(
                            'text-sm font-medium',
                            item.demandTrend > 0 ? 'text-green-600' : 'text-red-600'
                          )}
                        >
                          {item.demandTrend > 0 ? '+' : ''}
                          {item.demandTrend}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.predictedStockout ? (
                        <Badge variant="destructive" className="text-xs">
                          {item.predictedStockout}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewDetails(item.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(item.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReorder(item.id)}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Reorder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {sortedItems.length} of {items.length} items
        </p>
      </div>
    </div>
  );
}
