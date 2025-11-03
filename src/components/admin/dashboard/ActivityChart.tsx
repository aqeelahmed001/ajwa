"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityChartProps {
  activityData: {
    byDate?: Record<string, any[]>;
    byType?: Record<string, number>;
  };
  loading: boolean;
}

export function ActivityChart({ activityData, loading }: ActivityChartProps) {
  const [view, setView] = useState<'daily' | 'byType'>('daily');

  // Process data for the charts
  const dailyData = activityData?.byDate 
    ? Object.entries(activityData.byDate).map(([date, activities]) => ({
        date,
        count: activities.length,
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  const typeData = activityData?.byType
    ? Object.entries(activityData.byType).map(([type, count]) => ({
        type: type.replace(/_/g, ' '),
        count,
      })).sort((a, b) => b.count - a.count)
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Overview</CardTitle>
        <CardDescription>User activity trends</CardDescription>
        <Tabs value={view} onValueChange={(v) => setView(v as 'daily' | 'byType')} className="mt-2">
          <TabsList>
            <TabsTrigger value="daily">Daily Activity</TabsTrigger>
            <TabsTrigger value="byType">By Action Type</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          ) : (
            <>
              {view === 'daily' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`${value} activities`, 'Count']}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString();
                      }}
                    />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {view === 'byType' && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="type" 
                      type="category" 
                      width={120}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value} activities`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
