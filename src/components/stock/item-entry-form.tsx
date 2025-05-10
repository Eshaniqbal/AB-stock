"use client";

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: "Item name is required." }).max(100),
  quantity: z.coerce.number().int().min(0, { message: "Quantity must be zero or more." }),
});

type ItemFormValues = z.infer<typeof formSchema>;

interface ItemEntryFormProps {
  onAddItem: (data: ItemFormValues) => void;
}

export const ItemEntryForm: FC<ItemEntryFormProps> = ({ onAddItem }) => {
  const { toast } = useToast();
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 0,
    },
  });

  const onSubmit = async (data: ItemFormValues) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create item');
      }

      const newItem = await response.json();
      onAddItem(newItem);
      
      toast({
        title: "Item Added",
        description: `${data.name} has been added to your inventory.`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Item</CardTitle>
        <CardDescription>Enter the details of the new stock item below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Velvet Cushion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full md:w-auto">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Item
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
