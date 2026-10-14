'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ResourceDetails from '@/components/ResourceDetails';
import BookResource from '@/components/BookResource';

// Mock database lookup map
const RESOURCE_DATABASE: Record<string, any> = {
  '1': {
    title: 'Alpha Boardroom',
    description:
      'Our primary high-capacity meeting space engineered for executive sprint planning, team syncs, and client presentations. Designed for seamless collaboration and hybrid communication.',
    capacity: '16 Seats',
    location: 'Floor 4 (W-402)',
    category: 'Conference',
    size: '580 sq ft',
  },
  '2': {
    title: 'Focus Pod B',
    description: 'Quiet, soundproof acoustic capsule optimized for deep individual concentration, confidential phone calls, or paired code reviews.',
    capacity: '2 Seats',
    location: 'Floor 2 (E-105)',
    category: 'Pods',
    size: '80 sq ft',
  },
};

export default function ResourceDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '1';

  // Fallback to Alpha Boardroom if id doesn't match mock database
  const resource = RESOURCE_DATABASE[id] || RESOURCE_DATABASE['1'];

  const handleReserve = (bookingData: any) => {
    console.log('Reservation submitted:', { resourceId: id, ...bookingData });
    alert(`Successfully reserved ${resource.title}!`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 sm:p-12 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          {/* Left Component: Resource Details */}
          <ResourceDetails
            title={resource.title}
            description={resource.description}
            capacity={resource.capacity}
            location={resource.location}
            category={resource.category}
            size={resource.size}
          />

          {/* Right Component: Booking Widget */}
          <BookResource onReserve={handleReserve} />
        </div>
      </div>
    </div>
  );
}