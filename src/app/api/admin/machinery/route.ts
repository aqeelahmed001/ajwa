import { NextRequest, NextResponse } from 'next/server';
import MachineryItem, { MachineryItemDocument } from '@/models/MachineryItem';
import dbConnect from '@/lib/dbConnect';

// GET all machinery items
export async function GET(req: NextRequest) {
  try {

    await dbConnect();
    
    // Parse query parameters
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    
    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    const items = await MachineryItem.find(query).sort({ createdAt: -1 });
    
    // Transform MongoDB documents to ensure they have an id field
    const transformedItems = items.map(item => {
      const itemObj = item.toObject();
      // Add id field if it doesn't exist (using _id)
      if (!itemObj.id && itemObj._id) {
        itemObj.id = itemObj._id.toString();
      }
      return itemObj;
    });
    
    console.log(`Returning ${transformedItems.length} machinery items`);
    return NextResponse.json({ items: transformedItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching machinery items:', error);
    return NextResponse.json({ error: 'Failed to fetch machinery items' }, { status: 500 });
  }
}

// POST create new machinery item
export async function POST(req: NextRequest) {
  try {

    await dbConnect();
    
    const data = await req.json();
    
    // Convert specifications from object to Map for MongoDB
    const specifications = new Map();
    if (data.specifications) {
      Object.entries(data.specifications).forEach(([key, value]) => {
        specifications.set(key, value);
      });
      data.specifications = specifications;
    }
    
    const newItem = await MachineryItem.create(data);
    
    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating machinery item:', error);
    return NextResponse.json({ error: 'Failed to create machinery item' }, { status: 500 });
  }
}
