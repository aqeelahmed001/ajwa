import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MachineryOptionModel from '@/models/MachineryOption';
import { checkAdminAuth } from '@/lib/apiAuth';

// GET /api/admin/machinery-options
// Get all machinery options, optionally filtered by type
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const authError = await checkAdminAuth();
    if (authError) return authError;

    await dbConnect();
    
    // Get type from query params
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    // Build query
    const query = type ? { type } : {};
    
    // Fetch options
    const options = await MachineryOptionModel.find(query).sort({ count: -1, value: 1 });
    
    return NextResponse.json({ 
      success: true, 
      data: options 
    });
  } catch (error) {
    console.error('Error fetching machinery options:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch machinery options' },
      { status: 500 }
    );
  }
}

// POST /api/admin/machinery-options
// Create a new machinery option
export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated as admin
    const authError = await checkAdminAuth();
    if (authError) return authError;

    await dbConnect();
    
    // Get data from request body
    const data = await req.json();
    const { type, value } = data;
    
    // Validate required fields
    if (!type || !value) {
      return NextResponse.json(
        { success: false, message: 'Type and value are required' },
        { status: 400 }
      );
    }
    
    // Check if option already exists
    const existingOption = await MachineryOptionModel.findOne({ type, value });
    if (existingOption) {
      return NextResponse.json(
        { success: false, message: 'Option already exists', data: existingOption },
        { status: 409 }
      );
    }
    
    // Create new option
    const newOption = await MachineryOptionModel.create({ type, value });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Option created successfully',
      data: newOption 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating machinery option:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create machinery option' },
      { status: 500 }
    );
  }
}
