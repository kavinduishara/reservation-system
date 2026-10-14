import React from 'react';

export interface ReservationItem {
  id: string | number;
  resource: string;
  startTime: string;
  endTime: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Rejected' | string;
  // Per-row action controls (can be passed or computed by parent)
  actions?: {
    canCancel?: boolean;
    showCancel?: boolean;
    canAccept?: boolean;
    showAccept?: boolean;
    canReject?: boolean;
    showReject?: boolean;
  };
}

interface ReservationTableProps {
  data: ReservationItem[];
  onCancel?: (item: ReservationItem) => void;
  onAccept?: (item: ReservationItem) => void;
  onReject?: (item: ReservationItem) => void;
}

export default function ReservationTable({
  data,
  onCancel,
  onAccept,
  onReject,
}: ReservationTableProps) {
  // Dynamic status pill styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
            Cancelled
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="border-b border-zinc-200 bg-zinc-50/75 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            <tr>
              <th className="px-6 py-4">Resource</th>
              <th className="px-6 py-4">Start Time</th>
              <th className="px-6 py-4">End Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                  No reservations found.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                // Default visibility/enabled rules if not explicitly set by parent
                const showCancel = item.actions?.showCancel ?? true;
                const canCancel = item.actions?.canCancel ?? true;

                const showAccept = item.actions?.showAccept ?? false;
                const canAccept = item.actions?.canAccept ?? true;

                const showReject = item.actions?.showReject ?? false;
                const canReject = item.actions?.canReject ?? true;

                return (
                  <tr key={item.id} className="transition-colors hover:bg-zinc-50/50">
                    <td className="px-6 py-4 font-semibold text-zinc-900">{item.resource}</td>
                    <td className="px-6 py-4 text-zinc-600">{item.startTime}</td>
                    <td className="px-6 py-4 text-zinc-600">{item.endTime}</td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {/* Accept Button */}
                        {showAccept && (
                          <button
                            onClick={() => canAccept && onAccept?.(item)}
                            disabled={!canAccept}
                            className={`text-xs font-medium transition-colors ${
                              canAccept
                                ? 'text-emerald-600 hover:text-emerald-800'
                                : 'cursor-not-allowed text-zinc-300'
                            }`}
                          >
                            Accept
                          </button>
                        )}

                        {/* Reject Button */}
                        {showReject && (
                          <button
                            onClick={() => canReject && onReject?.(item)}
                            disabled={!canReject}
                            className={`text-xs font-medium transition-colors ${
                              canReject
                                ? 'text-rose-600 hover:text-rose-800'
                                : 'cursor-not-allowed text-zinc-300'
                            }`}
                          >
                            Reject
                          </button>
                        )}

                        {/* Cancel Button */}
                        {showCancel && (
                          <button
                            onClick={() => canCancel && onCancel?.(item)}
                            disabled={!canCancel}
                            className={`text-xs font-medium transition-colors ${
                              canCancel
                                ? 'text-zinc-600 hover:text-zinc-900'
                                : 'cursor-not-allowed text-zinc-300'
                            }`}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}