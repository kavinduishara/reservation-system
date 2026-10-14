'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import TimeSlotPicker, {
  validateTimeSlot,
  type ResourceScheduleItem,
  type TimeSlot,
} from './TimeSlotPicker';

interface BookResourceProps {
  onReserve?: (bookingData: {
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
  }) => void;
}

const MOCK_RESOURCE_SCHEDULE: ResourceScheduleItem[] = [
  {
    id: '1',
    date: '2026-10-14',
    startTime: '08:00',
    endTime: '09:30',
    status: 'Booked',
    allocatedTo: 'Sarah Jenkins',
    note: 'Daily Standup & Sprint Sync',
  },
  {
    id: '3',
    date: '2026-10-14',
    startTime: '11:00',
    endTime: '12:30',
    status: 'Booked',
    allocatedTo: 'Kavindu Ishara',
    note: 'Q4 Architecture & Scale Review',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

/** Local YYYY-MM-DD (toISOString() is UTC and can return the wrong day). */
const toLocalDateString = (d: Date = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export default function BookResource({ onReserve }: BookResourceProps) {
  const todayString = toLocalDateString();
  const [date, setDate] = useState(todayString);
  const [slot, setSlot] = useState<TimeSlot>({ startTime: '09:30', endTime: '11:00' });
  const [purpose, setPurpose] = useState('Q4 Architecture & Scale Review');

  const { isValidRange, isOverlap } = validateTimeSlot(date, slot, MOCK_RESOURCE_SCHEDULE);
  const canSubmit = isValidRange && !isOverlap && purpose.trim().length > 0 && !!date;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onReserve?.({ date, startTime: slot.startTime, endTime: slot.endTime, purpose: purpose.trim() });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-900">Book this Resource</h2>
        <p className="text-sm text-zinc-500">Select a date and time slot to reserve</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="booking-date" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Date
            </label>
            <button
              type="button"
              onClick={() => setDate(todayString)}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 border border-zinc-200 text-sm text-zinc-900 font-medium">
            <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="date"
              id="booking-date"
              name="Date"
              value={date}
              min={todayString}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-transparent border-none focus:outline-none text-zinc-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Time view bar + start/end time selection */}
        <TimeSlotPicker
          date={date}
          value={slot}
          onChange={setSlot}
          schedule={MOCK_RESOURCE_SCHEDULE}
        />

        {/* Purpose / Meeting Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="purpose" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
              Meeting Title / Purpose
            </label>
            <span className="text-xs text-zinc-400 font-medium">Required</span>
          </div>
          <input
            id="purpose"
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full rounded-xl bg-slate-50 px-4 py-3 border border-zinc-200 text-sm text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter purpose..."
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:active:scale-100"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Reserve Resource</span>
        </button>

        <p className="text-center text-xs text-zinc-400">
          Instant confirmation &bull; Cancellation allowed up to 15m prior to start.
        </p>
      </form>
    </div>
  );
}