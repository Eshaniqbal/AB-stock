import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import mongoose from 'mongoose';

// GET - Fetch item
export async function GET(
  request: Request,
  context: any
) {
  try {
    await connectDB();
    const { params } = await context;
    const item = await mongoose.models.Item.findById(params.id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT - Update item
export async function PUT(
  request: Request,
  context: any
) {
  try {
    await connectDB();
    const { params } = await context;
    const body = await request.json();

    // Only allow updating fields that exist in the schema
    const updateFields: any = {};
    if (typeof body.name === 'string') updateFields.name = body.name;
    if (typeof body.quantity === 'number') updateFields.quantity = body.quantity;
    if (typeof body.description === 'string') updateFields.description = body.description;
    updateFields.updatedAt = new Date();

    if (Object.keys(updateFields).length === 1 && updateFields.updatedAt) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const item = await mongoose.models.Item.findByIdAndUpdate(
      params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete item
export async function DELETE(
  request: Request,
  context: any
) {
  try {
    await connectDB();
    const { params } = await context;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 });
    }

    const item = await mongoose.models.Item.findByIdAndDelete(params.id);
    
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Failed to delete item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
