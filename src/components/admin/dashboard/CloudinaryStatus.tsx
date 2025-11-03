"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Cloud, AlertCircle, CheckCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface CloudinaryStatusProps {
  cloudinaryData: {
    status: string;
    usage?: {
      plan?: string;
      credits?: {
        limit?: number;
        used?: number;
      };
      bandwidth?: {
        limit?: number;
        used?: number;
      };
      storage?: {
        limit?: number;
        used?: number;
      };
    };
    resources?: {
      count: number;
      total: number;
    };
    error?: string;
  } | null;
  loading: boolean;
}

export function CloudinaryStatus({ cloudinaryData, loading }: CloudinaryStatusProps) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cloudinary Status</CardTitle>
            <CardDescription>Media storage and delivery</CardDescription>
          </div>
          <Cloud className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="flex items-center mb-4">
              {cloudinaryData?.status === 'connected' ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className="font-medium">
                {cloudinaryData?.status === 'connected' ? 'Connected' : 'Connection Error'}
              </span>
            </div>

            {cloudinaryData?.error && (
              <div className="text-sm text-red-500 mb-4">
                Error: {cloudinaryData.error}
              </div>
            )}

            {cloudinaryData?.status === 'connected' && (
              <div className="space-y-4">
                {/* Plan Info */}
                {cloudinaryData.usage?.plan && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Plan:</span> {cloudinaryData.usage.plan}
                  </div>
                )}

                {/* Resources */}
                {cloudinaryData.resources && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Resources:</span>
                      <span>{cloudinaryData.resources.count} / {cloudinaryData.resources.total || 'Unlimited'}</span>
                    </div>
                    {cloudinaryData.resources.total && (
                      <Progress 
                        value={(cloudinaryData.resources.count / cloudinaryData.resources.total) * 100} 
                        className="h-1" 
                      />
                    )}
                  </div>
                )}

                {/* Storage */}
                {cloudinaryData.usage?.storage?.used !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Storage:</span>
                      <span>
                        {formatBytes(cloudinaryData.usage.storage.used)} 
                        {cloudinaryData.usage.storage.limit && ` / ${formatBytes(cloudinaryData.usage.storage.limit)}`}
                      </span>
                    </div>
                    {cloudinaryData.usage.storage.limit && (
                      <Progress 
                        value={(cloudinaryData.usage.storage.used / cloudinaryData.usage.storage.limit) * 100} 
                        className="h-1" 
                      />
                    )}
                  </div>
                )}

                {/* Bandwidth */}
                {cloudinaryData.usage?.bandwidth?.used !== undefined && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Bandwidth:</span>
                      <span>
                        {formatBytes(cloudinaryData.usage.bandwidth.used)}
                        {cloudinaryData.usage.bandwidth.limit && ` / ${formatBytes(cloudinaryData.usage.bandwidth.limit)}`}
                      </span>
                    </div>
                    {cloudinaryData.usage.bandwidth.limit && (
                      <Progress 
                        value={(cloudinaryData.usage.bandwidth.used / cloudinaryData.usage.bandwidth.limit) * 100} 
                        className="h-1" 
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
