'use client';

import React, { useMemo } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

// ---- Types ------------------------------------------------------------------

export interface ResourceScheduleItem {
  id: string;
  date: string;      // e.g., "2026-10-14"
  startTime: string; // Stored in 24-hr: "08:00"
  endTime: string;   // Stored in 24-hr: "09:30"
  status: 'Booked' | 'Available';
  allocatedTo?: string;
  note?: string;
}

export interface TimeSlot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

interface TimeSlotPickerProps {
  date: string;
  value: TimeSlot;
  onChange: (next: TimeSlot) => void;
  schedule: ResourceScheduleItem[];
}

// ---- Constants & helpers ----------------------------------------------------

const DAY_START_MIN = 8 * 60;  // 08:00
const DAY_END_MIN = 18 * 60;   // 18:00
const DAY_SPAN_MIN = DAY_END_MIN - DAY_START_MIN;
const DEFAULT_DURATION_MIN = 30;

const pad = (n: number) => String(n).padStart(2, '0');

/** "HH:MM" -> minutes since midnight. Returns NaN for empty/invalid input. */
const toMinutes = (time: string) => {
  if (!time) return NaN;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

/** minutes since midnight -> "HH:MM" */
const toTimeString = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** minutes since midnight -> % position along the 08:00–18:00 track */
const minutesToPercent = (minutes: number) =>
  clamp(((minutes - DAY_START_MIN) / DAY_SPAN_MIN) * 100, 0, 100);

const HOUR_TICKS = [8, 10, 12, 14, 16, 18].map((h) => ({
  label: h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`,
  left: minutesToPercent(h * 60),
}));

/**
 * Pure validation shared by this component and the parent form.
 * - isValidRange: both set, inside working hours, end strictly after start
 * - isOverlap: clashes with a *Booked* item on the selected date
 *   (half-open intervals, so back-to-back bookings are allowed)
 */
export function validateTimeSlot(
  date: string,
  { startTime, endTime }: TimeSlot,
  schedule: ResourceScheduleItem[]
) {
  const startMin = toMinutes(startTime);
  const endMin = toMinutes(endTime);

  const isValidRange =
    !Number.isNaN(startMin) &&
    !Number.isNaN(endMin) &&
    startMin >= DAY_START_MIN &&
    endMin <= DAY_END_MIN &&
    endMin > startMin;

  const isOverlap =
    isValidRange &&
    schedule.some((item) => {
      if (item.date !== date || item.status !== 'Booked') return false;
      return startMin < toMinutes(item.endTime) && endMin > toMinutes(item.startTime);
    });

  return { isValidRange, isOverlap, startMin, endMin };
}

// ---- Component --------------------------------------------------------------

export default function TimeSlotPicker({ date, value, onChange, schedule }: TimeSlotPickerProps) {
  const { startTime, endTime } = value;

  const { isValidRange, isOverlap, startMin, endMin } = useMemo(
    () => validateTimeSlot(date, value, schedule),
    [date, value, schedule]
  );

  // Schedule blocks for the selected date, positioned on the timeline
  const timeGaps = useMemo(
    () =>
      schedule
        .filter((item) => item.date === date)
        .map((item) => {
          const left = minutesToPercent(toMinutes(item.startTime));
          const right = minutesToPercent(toMinutes(item.endTime));
          return { ...item, left, width: Math.max(0, right - left) };
        }),
    [schedule, date]
  );

  // Selected-range block: width = end - start (never negative)
  const selectedLeft = isValidRange ? minutesToPercent(startMin) : 0;
  const selectedWidth = isValidRange ? minutesToPercent(endMin) - minutesToPercent(startMin) : 0;

  const handleStartChange = (raw: string) => {
    if (!raw) {
      onChange({ startTime: '', endTime });
      return;
    }
    // Start: min 08:00, max 18:00
    const clamped = clamp(toMinutes(raw), DAY_START_MIN, DAY_END_MIN);
    const nextStart = toTimeString(clamped);

    // Keep end after start
    const nextEnd =
      Number.isNaN(endMin) || endMin <= clamped
        ? toTimeString(Math.min(clamped + DEFAULT_DURATION_MIN, DAY_END_MIN))
        : endTime;

    onChange({ startTime: nextStart, endTime: nextEnd });
  };

  const handleEndChange = (raw: string) => {
    if (!raw) {
      onChange({ startTime, endTime: '' });
      return;
    }
    // End: min = start time, max 18:00
    const lower = Number.isNaN(startMin) ? DAY_START_MIN : startMin;
    onChange({ startTime, endTime: toTimeString(clamp(toMinutes(raw), lower, DAY_END_MIN)) });
  };

  return (
    <div className="space-y-5">
      {/* Availability Timeline Visualizer Box */}
      <div className="rounded-xl bg-slate-50/80 p-4 border border-zinc-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
          <span className="font-semibold text-zinc-700">Working Hours Availability (08:00 AM – 06:00 PM)</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-300"></span>Booked</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-200"></span>Available</span>
            <span className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${isOverlap ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              Your selection
            </span>
          </div>
        </div>

        {/* Timeline Track */}
        <div className="relative h-8 w-full rounded-lg bg-zinc-200/50 overflow-hidden border border-zinc-200">
          {timeGaps.map((gap) => (
            <div
              key={gap.id}
              style={{ left: `${gap.left}%`, width: `${gap.width}%` }}
              className={`absolute top-0 bottom-0 flex items-center justify-center text-[10px] font-semibold border-r border-white/60 ${
                gap.status === 'Booked'
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
              title={`${gap.startTime} - ${gap.endTime} (${gap.status}): ${gap.note ?? ''}`}
            >
              <span className="truncate px-1">{gap.status === 'Booked' ? gap.allocatedTo : 'Open'}</span>
            </div>
          ))}

          {timeGaps.length === 0 && (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              No schedule entries for this date.
            </div>
          )}

          {/* Selected range overlay: width = end - start */}
          {isValidRange && (
            <div
              style={{ left: `${selectedLeft}%`, width: `${selectedWidth}%` }}
              className={`pointer-events-none absolute top-0 bottom-0 z-10 rounded border-2 transition-all ${
                isOverlap
                  ? 'bg-red-400/40 border-red-500'
                  : 'bg-emerald-400/40 border-emerald-500'
              }`}
              title="Your selected time"
            />
          )}
        </div>

        {/* Hour Markers (positioned to match the track's percentages) */}
        <div className="relative h-4 text-xs text-zinc-400">
          {HOUR_TICKS.map((tick, i) => (
            <span
              key={tick.label}
              style={{ left: `${tick.left}%` }}
              className={`absolute ${
                i === 0 ? '' : i === HOUR_TICKS.length - 1 ? '-translate-x-full' : '-translate-x-1/2'
              }`}
            >
              {tick.label}
            </span>
          ))}
        </div>
      </div>

      {/* Start and End Times */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Start Time */}
        <div className="space-y-1.5">
          <label htmlFor="start-time" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
            Start Time
          </label>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 border border-zinc-200 text-sm text-zinc-900 font-medium">
            <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="time"
              id="start-time"
              name="startTime"
              min="08:00"
              max="18:00"
              value={startTime}
              onChange={(e) => handleStartChange(e.target.value)}
              required
              className="w-full bg-transparent border-none focus:outline-none text-zinc-900 cursor-pointer"
            />
          </div>
        </div>

        {/* End Time */}
        <div className="space-y-1.5">
          <label htmlFor="end-time" className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
            End Time
          </label>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 border border-zinc-200 text-sm text-zinc-900 font-medium">
            <Clock className="h-4 w-4 text-zinc-400 shrink-0" />
            <input
              type="time"
              id="end-time"
              name="endTime"
              min={startTime || '08:00'}
              max="18:00"
              value={endTime}
              onChange={(e) => handleEndChange(e.target.value)}
              required
              className="w-full bg-transparent border-none focus:outline-none text-zinc-900 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Validation messages */}
      {isOverlap && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>This time overlaps an existing booking. Please choose a different slot.</span>
        </div>
      )}
      {!isOverlap && !isValidRange && startTime && endTime && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>End time must be after the start time, and both must be between 8:00 AM and 6:00 PM.</span>
        </div>
      )}
    </div>
  );
}