import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';

/**
 * GET handler - Get all public categories
 * This endpoint is for public use and only returns active categories
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId');
    
    // Build query - only return active categories for public use
    const query: any = { isActive: true };
    
    if (parentId === 'null') {
      query.parentId = null;
    } else if (parentId) {
      query.parentId = parentId;
    }
    
    // Fetch categories
    const categories = await CategoryModel.find(query)
      .sort({ order: 1, name: 1 })
      .lean();
    
    // Transform _id to id for frontend compatibility
    const transformedCategories = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      parentId: category.parentId ? category.parentId.toString() : null,
      order: category.order,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    }));
    
    return NextResponse.json({ 
      success: true,
      categories: transformedCategories 
    });
  } catch (error: any) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}
