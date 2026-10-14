"use client";
import { MapPin, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

interface ResourceCardProps {
  title?: string;
  category?: string;
  status?: string;
  location?: string;
  capacity?: number;
  features?: string;
  onViewDetails?: () => void;
}

export default function ResourceCard({
  title ,
  category,
  status,
  location ,
  capacity ,
  features ,
  onViewDetails,
}: ResourceCardProps) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Top Badges */}
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-800">
          <Building2 className="h-3.5 w-3.5 text-zinc-500" />
          {category}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          {status}
        </span>
      </div>

      {/* Title & Info */}
      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-zinc-600">
          <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
          <span>
            {location} &bull; Capacity {capacity} &bull; {features}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onViewDetails}
        className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-zinc-900 transition-colors hover:bg-slate-100"
      >
        <span>View Details</span>
        <ArrowRight className="h-4 w-4 text-zinc-700" />
      </button>
    </div>
  );
}