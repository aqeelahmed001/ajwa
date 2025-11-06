import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import mongoose from 'mongoose';

// Helper function to check if ID is valid
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database connection is established before proceeding
    // The improved connectToDatabase function will wait until the connection is fully established
    const mongooseInstance = await connectToDatabase();
    
    // Double check connection state - this is just for logging
    console.log('MongoDB connection state before GET by ID:', mongooseInstance.connection.readyState);
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const category = await CategoryModel.findById(id).lean();
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Transform for response
    const transformedCategory = {
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
    };
    
    return NextResponse.json({ category: transformedCategory });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database connection is established before proceeding
    // The improved connectToDatabase function will wait until the connection is fully established
    const mongooseInstance = await connectToDatabase();
    
    // Double check connection state - this is just for logging
    console.log('MongoDB connection state before PUT:', mongooseInstance.connection.readyState);
    
    const { id } = params;
    const data = await request.json();
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    // Check if category with same name already exists (excluding current category)
    const existingCategory = await CategoryModel.findOne({ 
      name: data.name,
      _id: { $ne: id }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    
    // Update category
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      {
        name: data.name,
        description: data.description,
        image: data.image,
        parentId: data.parentId || null,
        order: data.order,
        isActive: data.isActive
      },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Transform for response
    const transformedCategory = {
      id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      description: updatedCategory.description || '',
      image: updatedCategory.image || '',
      parentId: updatedCategory.parentId ? updatedCategory.parentId.toString() : null,
      order: updatedCategory.order,
      isActive: updatedCategory.isActive,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt
    };
    
    return NextResponse.json({ 
      message: 'Category updated successfully', 
      category: transformedCategory 
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure database connection is established before proceeding
    // The improved connectToDatabase function will wait until the connection is fully established
    const mongooseInstance = await connectToDatabase();
    
    // Double check connection state - this is just for logging
    console.log('MongoDB connection state before DELETE:', mongooseInstance.connection.readyState);
    
    const { id } = params;
    
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    // Check if category has child categories
    const childCategories = await CategoryModel.findOne({ parentId: id });
    if (childCategories) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories. Delete or reassign subcategories first.' },
        { status: 400 }
      );
    }
    
    // Delete category
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);
    
    if (!deletedCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      id
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', details: error.message },
      { status: 500 }
    );
  }
}
