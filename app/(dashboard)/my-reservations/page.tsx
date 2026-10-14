'use client';

import React, { useState } from 'react';
import PageTitle from '@/components/PageTitle';
import ReservationTable, { ReservationItem } from '@/components/ReservationTable';

export default function MyReservationsPage() {
  // Parent state containing data list
  const [reservations, setReservations] = useState<ReservationItem[]>([
    {
      id: 1,
      resource: '4K Podcasting Kit',
      startTime: 'Oct 25, 10:00 AM',
      endTime: 'Oct 25, 12:00 PM',
      status: 'Confirmed',
      actions: {
        showCancel: true,
        canCancel: true, // Enabled cancel action
      },
    },
    {
      id: 2,
      resource: 'Tesla Model 3 Pool Car',
      startTime: 'Oct 26, 08:00 AM',
      endTime: 'Oct 26, 06:00 PM',
      status: 'Pending',
      actions: {
        showAccept: true,
        canAccept: true,
        showReject: true,
        canReject: true,
        showCancel: false, // Hidden cancel for pending manager review
      },
    },
    {
      id: 3,
      resource: 'Alpha Boardroom',
      startTime: 'Oct 28, 01:00 PM',
      endTime: 'Oct 28, 03:00 PM',
      status: 'Confirmed',
      actions: {
        showCancel: true,
        canCancel: false, // Disabled cancel (e.g., too close to start time)
      },
    },
  ]);

  // Parent action handlers
  const handleCancel = (item: ReservationItem) => {
    console.log('Cancelling reservation:', item.id);
    // Process state change in parent
    setReservations((prev) =>
      prev.map((res) => (res.id === item.id ? { ...res, status: 'Cancelled' } : res))
    );
  };

  const handleAccept = (item: ReservationItem) => {
    console.log('Accepting reservation:', item.id);
    setReservations((prev) =>
      prev.map((res) => (res.id === item.id ? { ...res, status: 'Confirmed' } : res))
    );
  };

  const handleReject = (item: ReservationItem) => {
    console.log('Rejecting reservation:', item.id);
    setReservations((prev) =>
      prev.map((res) => (res.id === item.id ? { ...res, status: 'Rejected' } : res))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 sm:p-10 font-sans">
      <div className="mx-auto max-w-6xl">
        <PageTitle
          title="My Reservations"
          description="View my active bookings or cancel requests."
        />

        <div className="mt-6">
          <ReservationTable
            data={reservations}
            onCancel={handleCancel}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </div>
      </div>
    </div>
  );
}