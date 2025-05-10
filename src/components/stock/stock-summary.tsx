"use client";

import type { FC } from 'react';
import type { StockItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hash, ShoppingBag } from 'lucide-react';

interface StockSummaryProps {
  items: StockItem[];
}

export const StockSummary: FC<StockSummaryProps> = ({ items }) => {
  const totalUniqueProducts = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const summaryCards = [
    {
      title: "Total Products",
      value: totalUniqueProducts.toLocaleString(),
      icon: ShoppingBag,
      description: "Number of unique item types in stock.",
    },
    {
      title: "Total Quantity",
      value: totalQuantity.toLocaleString(),
      icon: Hash,
      description: "Total number of all items in stock.",
    },
  ];

  return (
    <section aria-labelledby="stock-summary-heading">
      <h2 id="stock-summary-heading" className="sr-only">Stock Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Updated to md:grid-cols-2 */}
        {summaryCards.map((card) => (
          <Card key={card.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground pt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
