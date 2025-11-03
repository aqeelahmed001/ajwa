"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DashboardStats } from './DashboardStats';
import { ActivityChart } from './ActivityChart';
import { CloudinaryStatus } from './CloudinaryStatus';
import { RecentActivity } from './RecentActivity';
import { RecentListings } from './RecentListings';

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
  listings: {
    recent: any[];
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

interface DashboardContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  data: null,
  loading: true,
  error: null,
  refreshData: async () => {},
});

export function useDashboard() {
  return useContext(DashboardContext);
}

interface DashboardProviderProps {
  children?: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const dashboardData = await response.json();
      setData(dashboardData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refreshData: fetchDashboardData }}>
      <div className="space-y-6">
        <DashboardStats />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActivityChart 
            activityData={data?.activity || { byDate: {}, byType: {} }} 
            loading={loading} 
          />
          <CloudinaryStatus 
            cloudinaryData={data?.cloudinary || { status: 'loading' }} 
            loading={loading} 
          />
        </div>
        
        <RecentListings
          listings={data?.listings?.recent || []}
          loading={loading}
        />
      </div>
    </DashboardContext.Provider>
  );
}
