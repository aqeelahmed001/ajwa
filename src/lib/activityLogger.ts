import { NextRequest } from 'next/server';
import UserActivity from '@/models/UserActivity';
import { connectToDatabase } from '@/lib/mongodb';

/**
 * Log user activity
 * @param userId - The ID of the user performing the action
 * @param action - The action being performed
 * @param details - Additional details about the action
 * @param request - The Next.js request object (optional)
 */
export async function logActivity(
  userId: string | undefined,
  action: string,
  details?: string,
  request?: NextRequest
) {
  try {
    // Validate userId is provided
    if (!userId) {
      console.warn('Activity logging failed: No user ID provided');
      return null;
    }

    await connectToDatabase();
    
    // Extract IP address and user agent from request if available
    const ipAddress = request?.headers.get('x-forwarded-for') || 
                      request?.headers.get('x-real-ip') || 
                      'unknown';
                      
    const userAgent = request?.headers.get('user-agent') || 'unknown';
    
    // Create activity log
    const activity = new UserActivity({
      userId,
      action,
      details,
      ipAddress,
      userAgent,
    });
    
    await activity.save();
    console.log(`Activity logged: ${action} by user ${userId}`);
    
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error to prevent disrupting the main flow
    return null;
  }
}

/**
 * Get user activities with pagination
 * @param filters - Filters to apply to the query
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 */
export async function getActivities(
  filters: {
    userId?: string;
    action?: string;
    ipAddress?: string;
    startDate?: Date;
    endDate?: Date;
  },
  page = 1,
  limit = 20
) {
  try {
    await connectToDatabase();
    
    // Build query
    const query: any = {};
    
    if (filters.userId) {
      query.userId = filters.userId;
    }
    
    if (filters.action) {
      query.action = filters.action;
    }
    
    if (filters.ipAddress) {
      query.ipAddress = filters.ipAddress;
    }
    
    // Date range
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
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
    
    return {
      activities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  }
}
