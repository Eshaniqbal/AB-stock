import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Item from '@/models/Item';

// GET all items
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = {};
    if (search) {
      query = {
        name: { $regex: search, $options: 'i' }
      };
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST new item
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate required fields
    if (!data.name || typeof data.quantity !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: name and quantity are required' },
        { status: 400 }
      );
    }

    const item = await Item.create({
      name: data.name,
      quantity: data.quantity,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create item:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
} 