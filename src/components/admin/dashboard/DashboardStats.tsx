"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Users, Package, Star, CheckCircle, Activity, Cloud } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  machinery: {
    total: number;
    available: number;
    featured: number;
  };
  activity: {
    recent: any[];
    byDate: Record<string, any[]>;
    byType: Record<string, number>;
  };
  cloudinary: {
    status: string;
    usage?: any;
    resources?: {
      count: number;
      total: number;
    };
    error?: string;
  };
}

import { useDashboard } from './DashboardProvider';

export function DashboardStats() {
  const { data, loading, error } = useDashboard();

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* User Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.users.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.users.active || 0} active users
                </p>
                <div className="mt-2">
                  <Progress 
                    value={data?.users.total ? (data.users.active / data.users.total) * 100 : 0} 
                    className="h-1" 
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Machinery Stats Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.machinery.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.machinery.available || 0} available
                </p>
                <div className="mt-2">
                  <Progress 
                    value={data?.machinery.total ? (data.machinery.available / data.machinery.total) * 100 : 0} 
                    className="h-1" 
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Featured Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Items</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{data?.machinery.featured || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {data?.machinery.total ? 
                    `${Math.round((data.machinery.featured / data.machinery.total) * 100)}% of total` : 
                    '0% of total'}
                </p>
                <div className="mt-2">
                  <Progress 
                    value={data?.machinery.total ? (data.machinery.featured / data.machinery.total) * 100 : 0} 
                    className="h-1" 
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Cloudinary Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cloudinary Status</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="flex items-center">
                  <div className={`h-2 w-2 rounded-full mr-2 ${
                    data?.cloudinary.status === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div className="text-sm font-medium">
                    {data?.cloudinary.status === 'connected' ? 'Connected' : 'Error'}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.cloudinary.resources ? 
                    `${data.cloudinary.resources.count} resources` : 
                    'No data available'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>User actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.activity.recent && data.activity.recent.length > 0 ? (
                data.activity.recent.map((activity, index) => (
                  <div key={index} className="flex items-center">
                    <div className="mr-4">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.action.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.userId?.name || 'Unknown user'} • 
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
