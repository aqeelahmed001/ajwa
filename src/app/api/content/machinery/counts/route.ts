import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MachineryItem from '@/models/MachineryItem';
import mongoose from 'mongoose';

/**
 * GET handler - Get machinery counts by category
 * This endpoint returns the count of machinery items for each category
 */
export async function GET(request: NextRequest) {
  try {
    // Ensure database connection is established
    await connectToDatabase();
    
    // Get all machinery items to analyze
    const allMachinery = await MachineryItem.find().lean();
    console.log(`Found ${allMachinery.length} total machinery items`);
    
    // Aggregate to count machinery items by category slug
    const categoryCounts = await MachineryItem.aggregate([
      { $match: { availability: { $ne: 'Sold' } } }, // Count all items that aren't sold
      { $group: { _id: '$categorySlug', count: { $sum: 1 } } }
    ]);
    
    // Also get counts by category name
    const categoryNameCounts = await MachineryItem.aggregate([
      { $match: { availability: { $ne: 'Sold' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get all unique categories with their slugs for better matching
    const categoryMapping = await MachineryItem.aggregate([
      { $group: { 
        _id: '$category', 
        categorySlug: { $first: '$categorySlug' },
        count: { $sum: 1 }
      }}
    ]);
    
    console.log('Category slug counts:', categoryCounts);
    console.log('Category name counts:', categoryNameCounts);
    console.log('Category mappings:', categoryMapping);
    
    // Transform the results into a more usable format
    const counts: Record<string, number> = {};
    
    // Add counts by categorySlug
    categoryCounts.forEach(item => {
      if (item._id) {
        counts[item._id.toString()] = item.count;
      }
    });
    
    // Add counts by category name
    categoryNameCounts.forEach(item => {
      if (item._id) {
        const categoryName = item._id.toString();
        counts[categoryName] = item.count;
      }
    });
    
    // Add counts using the category mapping for better matching
    categoryMapping.forEach(item => {
      if (item._id && item.categorySlug) {
        const categoryName = item._id.toString();
        const categorySlug = item.categorySlug.toString();
        
        // Make sure we have both name and slug
        counts[categoryName] = item.count;
        counts[categorySlug] = item.count;
        
        // Also add lowercase versions for case-insensitive matching
        counts[categoryName.toLowerCase()] = item.count;
        counts[categorySlug.toLowerCase()] = item.count;
      }
    });
    
    console.log('Machinery counts by category:', counts);
    
    return NextResponse.json({ 
      success: true,
      counts
    });
  } catch (error: any) {
    console.error('Error fetching machinery counts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch machinery counts', details: error.message },
      { status: 500 }
    );
  }
}
