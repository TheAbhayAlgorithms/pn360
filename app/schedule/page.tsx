'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CalendarPlus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { initialScheduledTests } from '@/lib/mockData';
import { ScheduledTest } from '@/lib/types';

export default function SchedulePage() {
  const [scheduledList, setScheduledList] = useState<ScheduledTest[]>(initialScheduledTests);
  const [schedType, setSchedType] = useState("30 MCQ Placement Test");
  const [schedDate, setSchedDate] = useState("2026-11-25");
  const [schedTime, setSchedTime] = useState("11:00");
  const [schedSuccess, setSchedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedDate || !schedTime) return;
    const newEntry: ScheduledTest = {
      id: Date.now(),
      test_type: schedType,
      date: schedDate,
      time: schedTime
    };
    setScheduledList([newEntry, ...scheduledList]);
    setSchedSuccess(true);
    setTimeout(() => setSchedSuccess(false), 4000);
  };

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
        <Link href="/" className="button button-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        
        {/* Form Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Reserve Assessment Appointment</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Select an assessment type, date, and preferred time window.
              </p>
            </div>
            <span className="badge badge-gray">Slot Booking</span>
          </div>

          {schedSuccess && (
            <div style={{ padding: '12px 16px', background: 'var(--scheme-teal-subtle)', border: '1px solid rgba(0, 180, 179, 0.4)', borderRadius: '14px', color: 'var(--scheme-deep)', fontSize: '13.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Appointment reserved successfully! Details logged to your schedule.
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
                <option value="30 MCQ Placement Test">30 MCQ Technical Assessment</option>
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
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Time</label>
                <input
                  type="time"
                  className="flat-input"
                  value={schedTime}
                  onChange={(e) => setSchedTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="button button-lg" style={{ background: 'var(--scheme-teal)' }}>
                <CalendarPlus size={16} /> Confirm Reservation
              </button>
            </div>
          </form>
        </div>

        {/* Upcoming Appointments Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Upcoming Schedule</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Your registered testing sessions.
              </p>
            </div>
            <span className="badge badge-green">{scheduledList.length} Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scheduledList.map(st => (
              <div
                key={st.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: 'var(--flat-surface-subtle)',
                  border: '1px solid var(--flat-border)',
                  borderRadius: '14px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--flat-text)' }}>
                    {st.test_type}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--flat-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {st.time}
                  </div>
                </div>
                <span className="badge badge-blue">{st.date}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
