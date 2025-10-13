import { NextRequest, NextResponse } from 'next/server';
import MachineryItem from '@/models/MachineryItem';
import dbConnect from '@/lib/dbConnect';

// GET a single machinery item by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();
    
    const { id } = params;
    const item = await MachineryItem.findById(id);
    
    if (!item) {
      return NextResponse.json({ error: 'Machinery item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ item }, { status: 200 });
  } catch (error) {
    console.error('Error fetching machinery item:', error);
    return NextResponse.json({ error: 'Failed to fetch machinery item' }, { status: 500 });
  }
}

// PUT update a machinery item by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    await dbConnect();
    
    const { id } = params;
    const data = await req.json();
    
    // Convert specifications from object to Map for MongoDB
    if (data.specifications) {
      const specifications = new Map();
      Object.entries(data.specifications).forEach(([key, value]) => {
        specifications.set(key, value);
      });
      data.specifications = specifications;
    }
    
    const updatedItem = await MachineryItem.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return NextResponse.json({ error: 'Machinery item not found' }, { status: 404 });
    }
    
    return NextResponse.json({ item: updatedItem }, { status: 200 });
  } catch (error) {
    console.error('Error updating machinery item:', error);
    return NextResponse.json({ error: 'Failed to update machinery item' }, { status: 500 });
  }
}

// DELETE a machinery item by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`DELETE API called for machinery item ID: ${params.id}`);

    await dbConnect();
    console.log('Database connected');
    
    const { id } = params;
    console.log(`Attempting to delete machinery item with ID: ${id}`);
    
    // Try to find the item first to confirm it exists
    const itemExists = await MachineryItem.findById(id);
    console.log('Item exists check:', itemExists ? 'Found' : 'Not found');
    
    if (!itemExists) {
      console.log(`Item with ID ${id} not found before deletion`);
      return NextResponse.json({ error: 'Machinery item not found' }, { status: 404 });
    }
    
    // Now delete the item
    const deletedItem = await MachineryItem.findByIdAndDelete(id);
    console.log('Delete operation result:', deletedItem ? 'Item found and deleted' : 'Item not found');
    
    if (!deletedItem) {
      console.log(`Machinery item with ID ${id} not found`);
      return NextResponse.json({ error: 'Machinery item not found' }, { status: 404 });
    }
    
    console.log(`Successfully deleted machinery item with ID: ${id}`);
    return NextResponse.json({ 
      message: 'Machinery item deleted successfully',
      id: id 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting machinery item:', error);
    return NextResponse.json({ error: 'Failed to delete machinery item' }, { status: 500 });
  }
}
