"use client";

import { useState, useEffect } from 'react';
import type { StockItem } from '@/lib/types';
import { Header } from '@/components/layout/header';
import { ItemEntryForm } from '@/components/stock/item-entry-form';
import { StockTable } from '@/components/stock/stock-table';
import { StockSummary } from '@/components/stock/stock-summary';
import { useToast } from '@/hooks/use-toast';

// Define initial data outside the component or load from a persistent source
const initialStock: Omit<StockItem, '_id'>[] = [
  { name: 'Modern Armchair - Ash Gray', description: 'Comfortable modern armchair in ash gray', quantity: 15 },
  { name: 'Scandinavian Coffee Table - Oak', description: 'Minimalist oak coffee table', quantity: 8 },
  { name: 'Boho Chic Throw Pillow - Set of 2', description: 'Decorative throw pillows with boho pattern', quantity: 25 },
  { name: 'Industrial Bookshelf - Metal & Wood', description: 'Sturdy industrial-style bookshelf', quantity: 5 },
  { name: 'Minimalist Floor Lamp - Black', description: 'Sleek black floor lamp with adjustable head', quantity: 12 },
];

export default function Home() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setStockItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
        toast({
          title: "Error",
          description: "Failed to load items. Please refresh the page.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [toast]);

  const handleAddItem = (newItem: { name: string; quantity: number }) => {
    setStockItems(prevItems => [...prevItems, { ...newItem, _id: crypto.randomUUID(), description: '' }]);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-card h-32 rounded-lg shadow-lg p-4">
                <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted-foreground/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="h-6 bg-muted-foreground/20 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-10 bg-muted-foreground/10 rounded"></div>
              <div className="h-10 bg-muted-foreground/10 rounded"></div>
              <div className="h-10 bg-primary/20 rounded w-24"></div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="h-6 bg-muted-foreground/20 rounded w-1/4 mb-4"></div>
            <div className="h-40 bg-muted-foreground/10 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-8">
        <StockSummary items={stockItems} />
        <ItemEntryForm onAddItem={handleAddItem} />
        <StockTable items={stockItems} setItems={setStockItems} />
      </main>
    </div>
  );
}
