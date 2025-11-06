import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import mongoose from 'mongoose';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is established before proceeding
    // The improved connectToDatabase function will wait until the connection is fully established
    const mongooseInstance = await connectToDatabase();
    
    // Get query parameters
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId');
    const isActive = url.searchParams.get('isActive');
    
    // Build query
    const query: any = {};
    
    if (parentId === 'null') {
      query.parentId = null;
    } else if (parentId) {
      query.parentId = parentId;
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Double check connection state - this is just for logging
    console.log('MongoDB connection state before query:', mongooseInstance.connection.readyState);
    
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
      categories: transformedCategories 
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    // Ensure database connection is established before proceeding
    // The improved connectToDatabase function will wait until the connection is fully established
    const mongooseInstance = await connectToDatabase();
    
    // Double check connection state - this is just for logging
    console.log('MongoDB connection state before POST operation:', mongooseInstance.connection.readyState);
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Check if category with same name already exists
    const existingCategory = await CategoryModel.findOne({ name: data.name });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    
    // Create new category
    const newCategory = new CategoryModel({
      name: data.name,
      description: data.description,
      image: data.image,
      parentId: data.parentId || null,
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true
    });
    
    // Save the category and immediately fetch it as a plain object
    await newCategory.save();
    
    // Fetch the saved document using lean() to get a plain JavaScript object
    const savedDoc = await CategoryModel.findById(newCategory._id).lean();
    
    if (!savedDoc) {
      throw new Error('Failed to retrieve saved category');
    }
    
    // Transform for response
    const category = {
      id: savedDoc._id.toString(),
      name: savedDoc.name,
      slug: savedDoc.slug,
      description: savedDoc.description || '',
      image: savedDoc.image || '',
      parentId: savedDoc.parentId ? savedDoc.parentId.toString() : null,
      order: savedDoc.order,
      isActive: savedDoc.isActive,
      createdAt: savedDoc.createdAt,
      updatedAt: savedDoc.updatedAt
    };
    
    return NextResponse.json({ 
      message: 'Category created successfully', 
      category 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', details: error.message },
      { status: 500 }
    );
  }
}
