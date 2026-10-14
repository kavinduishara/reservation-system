import React from 'react';
import { Users, MapPin, Building, Maximize2 } from 'lucide-react';

interface ResourceDetailsProps {
  title: string;
  description: string;
  capacity: string | number;
  location: string;
  category: string;
  size: string;
}

export default function ResourceDetails({
  title,
  description,
  capacity,
  location,
  category,
  size,
}: ResourceDetailsProps) {
  return (
    <div className="flex flex-col space-y-6">
      {/* Title & Description */}
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">{title}</h1>
        <p className="text-base leading-relaxed text-zinc-600">{description}</p>
      </div>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Capacity */}
        <div className="flex flex-col space-y-1 rounded-2xl bg-slate-50/80 p-5 border border-zinc-100">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Capacity</span>
          <div className="flex items-center gap-2 text-zinc-900 font-semibold">
            <Users className="h-5 w-5 text-indigo-600" />
            <span>{capacity}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col space-y-1 rounded-2xl bg-slate-50/80 p-5 border border-zinc-100">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Location</span>
          <div className="flex items-center gap-2 text-zinc-900 font-semibold">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <span>{location}</span>
          </div>
        </div>

        {/* Category */}
        <div className="flex flex-col space-y-1 rounded-2xl bg-slate-50/80 p-5 border border-zinc-100">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Category</span>
          <div className="flex items-center gap-2 text-zinc-900 font-semibold">
            <Building className="h-5 w-5 text-indigo-600" />
            <span>{category}</span>
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col space-y-1 rounded-2xl bg-slate-50/80 p-5 border border-zinc-100">
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Size</span>
          <div className="flex items-center gap-2 text-zinc-900 font-semibold">
            <Maximize2 className="h-5 w-5 text-indigo-600" />
            <span>{size}</span>
          </div>
        </div>
      </div>
    </div>
  );
}