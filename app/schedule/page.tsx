'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CalendarPlus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Trash2,
  CalendarX,
  AlertCircle
} from 'lucide-react';
import { initialScheduledTests } from '@/lib/mockData';
import { ScheduledTest } from '@/lib/types';
import { useAuth } from '@/lib/authContext';

// Reliably parse a date & time string into a Date object
function parseScheduleDateTime(dateStr: string, timeStr: string): Date | null {
  try {
    let hours = 0;
    let minutes = 0;
    const ampmMatch = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (ampmMatch) {
      hours = parseInt(ampmMatch[1], 10);
      minutes = parseInt(ampmMatch[2], 10);
      const ampm = ampmMatch[3]?.toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      const direct = new Date(`${dateStr} ${timeStr}`);
      if (!isNaN(direct.getTime())) return direct;
      return null;
    }
    d.setHours(hours, minutes, 0, 0);
    return d;
  } catch {
    return null;
  }
}

// Check if a scheduled slot is still in the future
function isScheduleActive(st: ScheduledTest): boolean {
  const schedDate = parseScheduleDateTime(st.date, st.time);
  if (!schedDate) return true; // keep if date cannot be parsed
  return schedDate.getTime() > Date.now();
}

export default function SchedulePage() {
  const { currentUser } = useAuth();
  const [scheduledList, setScheduledList] = useState<ScheduledTest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [schedType, setSchedType] = useState("MCQ Placement Test");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("11:00");
  const [schedSuccess, setSchedSuccess] = useState<string | null>(null);
  const [schedError, setSchedError] = useState<string | null>(null);

  const storageKey = currentUser ? `pn360_schedules_${currentUser.id}` : 'pn360_schedules_guest';

  // Initialize and automatically prune expired appointments
  useEffect(() => {
    // Default form date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSchedDate(tomorrow.toISOString().split('T')[0]);

    // Load from user-specific localStorage or mock data for Abhay
    let initial: ScheduledTest[] = currentUser?.username === 'abhay' || !currentUser
      ? initialScheduledTests
      : [];

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          initial = parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read stored schedules:", e);
    }

    // Automatically remove schedules that have passed the current date and time
    const activeOnly = initial.filter(isScheduleActive);
    setScheduledList(activeOnly);
    setIsLoaded(true);
    try {
      localStorage.setItem(storageKey, JSON.stringify(activeOnly));
    } catch {}
  }, [currentUser, storageKey]);

  // Live timer check: periodically prune as soon as a slot passes
  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      setScheduledList(prev => {
        const activeOnly = prev.filter(isScheduleActive);
        if (activeOnly.length !== prev.length) {
          try {
            localStorage.setItem(storageKey, JSON.stringify(activeOnly));
          } catch {}
          return activeOnly;
        }
        return prev;
      });
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [isLoaded, storageKey]);

  // Delete single schedule manually
  const handleDeleteSchedule = (id: number) => {
    setScheduledList(prev => {
      const updated = prev.filter(st => st.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setSchedSuccess("Schedule appointment deleted.");
    setTimeout(() => setSchedSuccess(null), 3000);
  };

  // Add new schedule
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSchedError(null);

    if (!schedDate || !schedTime) return;

    // Validate that appointment is in the future
    const targetDate = parseScheduleDateTime(schedDate, schedTime);
    if (targetDate && targetDate.getTime() <= Date.now()) {
      setSchedError("Cannot schedule a test slot in the past. Please select a future date and time.");
      return;
    }

    const newEntry: ScheduledTest = {
      id: Date.now(),
      test_type: schedType,
      date: schedDate,
      time: schedTime
    };

    const updated = [newEntry, ...scheduledList.filter(isScheduleActive)];
    setScheduledList(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}

    setSchedSuccess("Appointment reserved successfully! Details logged to your schedule.");
    setTimeout(() => setSchedSuccess(null), 4000);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>
            <CalendarCheck size={13} /> PLACEMENT APPOINTMENTS
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Schedule Diagnostic Practice Slot</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Book dedicated slots for proctored technical evaluations, mock voice interviews, and campus preparation rounds.
          </p>
        </div>
        <Link href="/" className="button button-secondary" style={{ borderRadius: '12px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        
        {/* Form Card: Reserve Assessment Appointment */}
        <div className="card" style={{ borderRadius: '24px', padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800 }}>Reserve Assessment Appointment</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Select an assessment type, date, and preferred time window.
              </p>
            </div>
            <span className="badge badge-gray font-mono">Slot Booking</span>
          </div>

          {schedSuccess && (
            <div style={{ padding: '12px 16px', background: 'var(--scheme-teal-subtle)', border: '1px solid rgba(0, 180, 179, 0.4)', borderRadius: '14px', color: 'var(--scheme-deep)', fontSize: '13.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> {schedSuccess}
            </div>
          )}

          {schedError && (
            <div style={{ padding: '12px 16px', background: 'var(--scheme-coral-subtle)', border: '1px solid rgba(252, 127, 115, 0.4)', borderRadius: '14px', color: 'var(--scheme-coral-dark)', fontSize: '13.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {schedError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Assessment Type</label>
              <select
                className="flat-select"
                value={schedType}
                onChange={(e) => setSchedType(e.target.value)}
              >
                <option value="MCQ Placement Test">MCQ Technical Assessment</option>
                <option value="Proctored AI Voice Interview">Proctored AI Voice Interview</option>
                <option value="Full Placement Simulation">Full 3-Stage Placement Simulation</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="flat-input"
                  min={todayStr}
                  value={schedDate}
                  onChange={(e) => {
                    setSchedDate(e.target.value);
                    setSchedError(null);
                  }}
                  required
                />
              </div>
              <div>
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="flat-input"
                  value={schedTime}
                  onChange={(e) => {
                    setSchedTime(e.target.value);
                    setSchedError(null);
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="submit"
                className="button button-lg"
                style={{
                  background: 'var(--scheme-teal)',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '14px',
                  padding: '12px 22px'
                }}
              >
                <CalendarPlus size={16} /> Confirm Reservation
              </button>
            </div>
          </form>
        </div>

        {/* Upcoming Appointments Card */}
        <div className="card" style={{ borderRadius: '24px', padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800 }}>
                {currentUser ? `${currentUser.name.split(' ')[0]}'s Upcoming Schedule` : 'Upcoming Schedule'}
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Your private active sessions (past slots auto-cleared).
              </p>
            </div>
            <span className={`badge ${scheduledList.length > 0 ? 'badge-green' : 'badge-gray'}`} style={{ fontWeight: 800 }}>
              {scheduledList.length} Active
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {scheduledList.length === 0 ? (
              <div
                style={{
                  padding: '36px 16px',
                  textAlign: 'center',
                  background: 'var(--flat-surface-subtle)',
                  borderRadius: '16px',
                  border: '1px dashed var(--flat-border)'
                }}
              >
                <CalendarX size={34} color="var(--flat-muted)" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--flat-text)', marginBottom: '4px' }}>
                  No Upcoming Appointments
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--flat-muted)', margin: 0, maxWidth: '280px', marginInline: 'auto' }}>
                  All previous sessions have passed or concluded. Reserve a new test slot using the booking form.
                </p>
              </div>
            ) : (
              scheduledList.map(st => (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: 'var(--flat-surface-subtle)',
                    border: '1px solid var(--flat-border)',
                    borderRadius: '16px',
                    gap: '12px'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--flat-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {st.test_type}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--flat-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={12} /> {st.time}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span className="badge badge-blue font-mono" style={{ fontSize: '11.5px', padding: '4px 10px' }}>
                      {st.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSchedule(st.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--flat-muted)',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 150ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--scheme-coral)';
                        e.currentTarget.style.background = 'var(--scheme-coral-subtle)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--flat-muted)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      title="Delete scheduled slot"
                      aria-label={`Delete ${st.test_type} on ${st.date}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
