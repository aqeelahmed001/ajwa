import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MachineryOptionModel from '@/models/MachineryOption';
import { checkAdminAuth } from '@/lib/apiAuth';

// GET /api/admin/machinery-options/[id]
// Get a specific machinery option by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated as admin
    const authError = await checkAdminAuth();
    if (authError) return authError;

    await dbConnect();
    
    const option = await MachineryOptionModel.findById(params.id);
    
    if (!option) {
      return NextResponse.json(
        { success: false, message: 'Option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: option 
    });
  } catch (error) {
    console.error(`Error fetching machinery option ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch machinery option' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/machinery-options/[id]
// Update a machinery option
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated as admin
    const authError = await checkAdminAuth();
    if (authError) return authError;

    await dbConnect();
    
    const data = await req.json();
    const { value } = data;
    
    // Validate required fields
    if (!value) {
      return NextResponse.json(
        { success: false, message: 'Value is required' },
        { status: 400 }
      );
    }
    
    // Find and update the option
    const updatedOption = await MachineryOptionModel.findByIdAndUpdate(
      params.id,
      { value },
      { new: true }
    );
    
    if (!updatedOption) {
      return NextResponse.json(
        { success: false, message: 'Option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Option updated successfully',
      data: updatedOption 
    });
  } catch (error) {
    console.error(`Error updating machinery option ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update machinery option' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/machinery-options/[id]
// Delete a machinery option
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated as admin
    const authError = await checkAdminAuth();
    if (authError) return authError;

    await dbConnect();
    
    const deletedOption = await MachineryOptionModel.findByIdAndDelete(params.id);
    
    if (!deletedOption) {
      return NextResponse.json(
        { success: false, message: 'Option not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Option deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting machinery option ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete machinery option' },
      { status: 500 }
    );
  }
}
