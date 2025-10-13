import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MachineryItem from '@/models/MachineryItem';
import { slugify } from '@/lib/slugify';

// GET handler - Get all machinery items or filter by query params
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const manufacturer = searchParams.get('manufacturer');
    const featured = searchParams.get('featured');
    
    // Build query object
    const query: Record<string, any> = {};
    
    if (category) {
      query.category = category;
    }
    
    if (manufacturer) {
      query.manufacturer = manufacturer;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Fetch items from database
    const items = await MachineryItem.find(query).sort({ featured: -1, createdAt: -1 });
    
    // Transform for response (convert _id to id for frontend consumption)
    const transformedItems = items.map(item => {
      const itemObj = item.toObject();
      const { _id, ...rest } = itemObj as { _id: { toString(): string }, [key: string]: any };
      const nameValue = rest.name ?? '';
      const categoryValue = rest.category ?? '';
      const slug = rest.slug || (nameValue ? slugify(nameValue) : _id.toString());
      const categorySlug = rest.categorySlug || (categoryValue ? slugify(categoryValue) : 'machinery');

      return {
        id: _id.toString(),
        slug,
        categorySlug,
        ...rest
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      data: transformedItems
    });
  } catch (error) {
    console.error('Error fetching machinery items:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch machinery items' },
      { status: 500 }
    );
  }
}

// POST handler - Create a new machinery item
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.manufacturer || !body.modelNumber) {
      return NextResponse.json(
        { success: false, message: 'Name, manufacturer, and model are required' },
        { status: 400 }
      );
    }
    
    // Create new item in database
    const newItem = new MachineryItem(body);
    await newItem.save();
    
    // Transform for response
    const savedItem = newItem.toObject();
    // Use type assertion to handle the _id
    const { _id, ...rest } = savedItem as { _id: { toString(): string }, [key: string]: any };
    const nameValue = rest.name ?? '';
    const categoryValue = rest.category ?? '';
    const slug = rest.slug || (nameValue ? slugify(nameValue) : _id.toString());
    const categorySlug = rest.categorySlug || (categoryValue ? slugify(categoryValue) : 'machinery');
    const transformedItem = {
      id: _id.toString(),
      slug,
      categorySlug,
      ...rest
    };
    
    return NextResponse.json({ 
      success: true, 
      data: transformedItem,
      message: 'Machinery item created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating machinery item:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create machinery item' },
      { status: 500 }
    );
  }
}
