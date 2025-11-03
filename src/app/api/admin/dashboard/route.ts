import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import MachineryItem from '@/models/MachineryItem';
import UserActivity from '@/models/UserActivity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get dashboard data
    const [
      totalUsers,
      activeUsers,
      totalMachineryItems,
      availableMachineryItems,
      featuredMachineryItems,
      recentActivities,
      recentListings,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      MachineryItem.countDocuments(),
      MachineryItem.countDocuments({ availability: 'available' }),
      MachineryItem.countDocuments({ featured: true }),
      UserActivity.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('userId', 'name email')
        .lean(),
      MachineryItem.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    // Get Cloudinary stats
    let cloudinaryStats = null;
    try {
      const cloudinaryUsage = await cloudinary.api.usage();
      const cloudinaryResources = await cloudinary.api.resources({
        type: 'upload',
        max_results: 1,
      });
      
      cloudinaryStats = {
        usage: cloudinaryUsage,
        resources: {
          count: cloudinaryResources.resources.length,
          total: cloudinaryResources.total_count,
        },
        status: 'connected',
      };
    } catch (error) {
      console.error('Error fetching Cloudinary stats:', error);
      cloudinaryStats = {
        status: 'error',
        error: 'Failed to connect to Cloudinary',
      };
    }

    // Group activities by date
    const activityByDate = recentActivities.reduce((acc: any, activity: any) => {
      const date = new Date(activity.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(activity);
      return acc;
    }, {});

    // Group activities by type
    const activityByType = recentActivities.reduce((acc: any, activity: any) => {
      if (!acc[activity.action]) {
        acc[activity.action] = 0;
      }
      acc[activity.action]++;
      return acc;
    }, {});

    // Return dashboard data
    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      machinery: {
        total: totalMachineryItems,
        available: availableMachineryItems,
        featured: featuredMachineryItems,
      },
      activity: {
        recent: recentActivities,
        byDate: activityByDate,
        byType: activityByType,
      },
      listings: {
        recent: recentListings,
      },
      cloudinary: cloudinaryStats,
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
