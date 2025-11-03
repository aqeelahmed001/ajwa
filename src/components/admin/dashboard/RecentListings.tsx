"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Star, Clock, DollarSign, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MachineryItem {
  id: string;
  name: string;
  slug: string;
  manufacturer: string;
  modelNumber: string;
  price: number;
  priceFormatted: string;
  location: string;
  condition: string;
  featured: boolean;
  availability: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
}

interface RecentListingsProps {
  listings: MachineryItem[];
  loading: boolean;
}

export function RecentListings({ listings, loading }: RecentListingsProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Recent Listings</CardTitle>
          <CardDescription>Latest machinery items added to inventory</CardDescription>
        </div>
        <Package className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <Link 
                href={`/admin/content/machinery-management/${listing.id}`} 
                key={listing.id} 
                className="flex items-start space-x-4 border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer no-underline text-foreground"
              >
                <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium line-clamp-1 flex-1">
                      {listing.name}
                      {listing.featured && (
                        <span className="ml-2">
                          <Star className="h-3 w-3 inline text-amber-500" />
                        </span>
                      )}
                    </h4>
                    <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(listing.createdAt)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {listing.manufacturer} {listing.modelNumber}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <DollarSign className="h-3 w-3" />
                      {listing.priceFormatted}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <MapPin className="h-3 w-3" />
                      {listing.location}
                    </Badge>
                    <Badge 
                      variant={listing.availability === 'available' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {listing.availability}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Link href="/admin/content/machinery-management" className="w-full">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            View All Listings <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
