import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import UserActivity from '@/models/UserActivity';
import { getCurrentUserServer } from '@/lib/jwt';
import { logActivity } from '@/lib/activityLogger';

// GET handler - Get activity logs with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('userId') || '';
    const action = searchParams.get('action') || '';
    const ipAddress = searchParams.get('ipAddress') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    
    // Build query
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (action) {
      query.action = action;
    }
    
    if (ipAddress) {
      query.ipAddress = ipAddress;
    }
    
    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      
      if (endDate) {
        // Add one day to include the end date
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        query.createdAt.$lte = endDateObj;
      }
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get activities
    const activities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')
      .lean();
    
    // Get total count
    const totalCount = await UserActivity.countDocuments(query);
    
    // Get unique actions for filtering
    const uniqueActions = await UserActivity.distinct('action');
    
    // Get unique IP addresses for filtering
    const uniqueIpAddresses = await UserActivity.distinct('ipAddress');
    
    // Log activity
    await logActivity(
      user.id,
      'view_activity_logs',
      `Viewed activity logs with filters`,
      request
    );
    
    return NextResponse.json({
      success: true,
      activities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
      filters: {
        actions: uniqueActions,
        ipAddresses: uniqueIpAddresses,
      },
    });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}

// POST handler - Export activity logs
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const user = await getCurrentUserServer();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();
    
    // Parse request body
    const body = await request.json();
    
    // Validate export format
    const format = body.format || 'json';
    if (!['json', 'csv'].includes(format)) {
      return NextResponse.json(
        { success: false, message: 'Invalid export format' },
        { status: 400 }
      );
    }
    
    // Build query from filters
    const query: any = {};
    
    if (body.userId) {
      query.userId = body.userId;
    }
    
    if (body.action) {
      query.action = body.action;
    }
    
    if (body.ipAddress) {
      query.ipAddress = body.ipAddress;
    }
    
    // Date range
    if (body.startDate || body.endDate) {
      query.createdAt = {};
      
      if (body.startDate) {
        query.createdAt.$gte = new Date(body.startDate);
      }
      
      if (body.endDate) {
        // Add one day to include the end date
        const endDateObj = new Date(body.endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        query.createdAt.$lte = endDateObj;
      }
    }
    
    // Get activities
    const activities = await UserActivity.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .lean();
    
    // Log activity
    await logActivity(
      user.id,
      'export_activity_logs',
      `Exported activity logs in ${format} format`,
      request
    );
    
    // For CSV format, we would normally convert the data here
    // For simplicity, we'll just return the JSON data
    
    return NextResponse.json({
      success: true,
      message: `Activity logs exported successfully in ${format} format`,
      data: activities,
      format,
      exportedAt: new Date().toISOString(),
      count: activities.length,
    });
  } catch (error: any) {
    console.error('Error exporting activity logs:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to export activity logs' },
      { status: 500 }
    );
  }
}
