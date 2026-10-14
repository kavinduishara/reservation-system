"use client"
import PageTitle from '@/components/PageTitle';
import ResourceCard from '@/components/ResourceCard';

// 1. Mock Data List
const MOCK_RESOURCES = [
  {
    id: '1',
    title: 'Alpha Boardroom',
    category: 'Rooms',
    status: 'Available',
    location: 'Floor 4, West Wing',
    capacity: 16,
    features: 'Video Conference',
  },
  {
    id: '2',
    title: 'Focus Pod B',
    category: 'Pods',
    status: 'Reserved',
    location: 'Floor 2, East Wing',
    capacity: 2,
    features: 'Soundproof',
  },
  {
    id: '3',
    title: 'VR Development Rig',
    category: 'Hardware',
    status: 'Available',
    location: 'Lab 101',
    capacity: 1,
    features: 'Meta Quest 3 & Workstation',
  },
  {
    id: '4',
    title: 'Design Studio',
    category: 'Rooms',
    status: 'Maintenance',
    location: 'Floor 3, Central',
    capacity: 8,
    features: '4K Monitors & Smartboard',
  },
  {
    id: '5',
    title: '4K Field Camera Kit',
    category: 'Gear',
    status: 'Available',
    location: 'Equipment Closet B',
    capacity: 1,
    features: 'Tripod & Wireless Mic',
  },
  {
    id: '6',
    title: 'Beta Conference Room',
    category: 'Rooms',
    status: 'Available',
    location: 'Floor 4, East Wing',
    capacity: 10,
    features: 'Zoom Room Enabled',
  },
];

export default function AllReservations() {
  const handleViewDetails = (title: string) => {
    console.log(`Navigating to details for: ${title}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 sm:p-10 font-sans">
      {/* Container */}
      <div className="mx-auto max-w-7xl">
        {/* Title Header */}
        <PageTitle
          title="Available Resources"
          description="Select and reserve team spaces, gear, and hardware."
        />

        {/* Resource Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_RESOURCES.map((resource) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              category={resource.category}
              status={resource.status}
              location={resource.location}
              capacity={resource.capacity}
              features={resource.features}
              onViewDetails={() => handleViewDetails(resource.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}