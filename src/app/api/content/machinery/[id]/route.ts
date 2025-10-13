import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MachineryItem from '@/models/MachineryItem';

// GET handler - Get a specific machinery item by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    const item = await MachineryItem.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Machinery item not found' },
        { status: 404 }
      );
    }
    
    // Transform for response (convert _id to id for frontend consumption)
    const itemObj = item.toObject();
    const { _id, ...rest } = itemObj as { _id: { toString(): string }, [key: string]: any };
    const transformedItem = {
      id: _id.toString(),
      ...rest
    };
    
    return NextResponse.json({ 
      success: true, 
      data: transformedItem 
    });
  } catch (error) {
    console.error(`Error fetching machinery item with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch machinery item' },
      { status: 500 }
    );
  }
}

// PUT handler - Update a specific machinery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    const body = await request.json();
    
    // Convert specifications from object to Map for MongoDB if present
    if (body.specifications) {
      const specifications = new Map();
      Object.entries(body.specifications).forEach(([key, value]) => {
        specifications.set(key, value);
      });
      body.specifications = specifications;
    }
    
    // Update the item in the database
    const updatedItem = await MachineryItem.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedItem) {
      return NextResponse.json(
        { success: false, message: 'Machinery item not found' },
        { status: 404 }
      );
    }
    
    // Transform for response
    const itemObj = updatedItem.toObject();
    const { _id, ...rest } = itemObj as { _id: { toString(): string }, [key: string]: any };
    const transformedItem = {
      id: _id.toString(),
      ...rest
    };
    
    return NextResponse.json({ 
      success: true, 
      data: transformedItem,
      message: 'Machinery item updated successfully'
    });
  } catch (error) {
    console.error(`Error updating machinery item with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update machinery item' },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a specific machinery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const id = params.id;
    
    // Delete the item from the database
    const deletedItem = await MachineryItem.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return NextResponse.json(
        { success: false, message: 'Machinery item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Machinery item deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting machinery item with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete machinery item' },
      { status: 500 }
    );
  }
}
