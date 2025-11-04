import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Brand from '@/models/Brand';

// GET all active brands for public frontend
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    console.log('Public API: Fetching active brands...');
    
    // Only return active brands for the public API
    const brands = await Brand.find({ isActive: true }).sort({ order: 1 });
    
    console.log(`Public API: Found ${brands.length} active brands`);
    console.log('Brand data from database:', JSON.stringify(brands, null, 2));
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Public API: Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
