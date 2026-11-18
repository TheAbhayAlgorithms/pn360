'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gauge,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  ListChecks,
  Mic,
  CalendarCheck,
  Briefcase,
  History,
  UploadCloud,
  Sparkles,
  AlertTriangle,
  Building2,
  CalendarPlus
} from 'lucide-react';
import DiagnosticChart from '@/components/DiagnosticChart';
import { defaultJobs, initialAssessmentRecords, initialScheduledTests } from '@/lib/mockData';
import { auditResumeATS } from '@/lib/gemini';
import { ATSResult, ScheduledTest } from '@/lib/types';

export default function Dashboard() {
  const [readiness, setReadiness] = useState(72);
  const [resumeScore, setResumeScore] = useState(84);
  const [mockScore, setMockScore] = useState(73);
  const [interviewScore, setInterviewScore] = useState(65);

  // Resume Benchmark State
  const [selectedRole, setSelectedRole] = useState("Software Development Engineer");
  const [resumeText, setResumeText] = useState(
    "Abhay Raj Singh • B.Tech Computer Science (GPA 8.8)\nSkills: Python, Django, SQL, Data Structures, Algorithms, Docker, REST APIs, Git, Linux.\nProjects: Built scalable microservice for e-commerce catalog with Redis caching, reducing query latency by 35%.\nExperience: Engineering Intern working on distributed data pipelines."
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);

  // Scheduler State
  const [scheduledList, setScheduledList] = useState<ScheduledTest[]>(initialScheduledTests);
  const [schedType, setSchedType] = useState("30 MCQ Placement Test");
  const [schedDate, setSchedDate] = useState("2026-11-25");
  const [schedTime, setSchedTime] = useState("11:00");
  const [schedSuccess, setSchedSuccess] = useState(false);

  const handleBenchmarkResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setIsAuditing(true);
    try {
      const result = await auditResumeATS(resumeText, selectedRole);
      setAtsResult(result);
      setResumeScore(result.score);
      // recalculate overall readiness
      const newOverall = Math.round(result.score * 0.25 + mockScore * 0.35 + interviewScore * 0.40);
      setReadiness(newOverall);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* SECTION 1: HERO READINESS & NEXT ACTION */}
      <div className="grid-split-hero">
        
        {/* Left: Placement Readiness Gauge Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-blue">
                <Gauge size={14} /> Readiness Index
              </span>
              <span className="badge badge-gray">
                Engineering Track
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', margin: '10px 0 16px' }}>
              <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--flat-text)', letterSpacing: '-0.03em' }}>
                {readiness}%
              </span>
              <span className={`badge ${readiness >= 75 ? 'badge-green' : readiness >= 60 ? 'badge-blue' : 'badge-amber'}`} style={{ fontSize: '13px', padding: '4px 10px' }}>
                {readiness >= 75 ? 'Offer Ready' : readiness >= 60 ? 'In Training' : 'Diagnostic Phase'}
              </span>
            </div>

            {/* Flat Progress Track */}
            <div className="flat-progress" style={{ marginBottom: '18px' }}>
              <div
                className={`flat-progress-fill ${readiness >= 75 ? 'fill-green' : 'fill-blue'}`}
                style={{ width: `${readiness}%` }}
              ></div>
            </div>

            {/* 3 Pillars Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', background: 'var(--flat-surface-subtle)', border: '1px solid var(--flat-border)', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>1. ATS Resume</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--flat-blue-dark)', marginTop: '2px' }}>{resumeScore}%</div>
                <div style={{ fontSize: '10.5px', color: 'var(--flat-subtle)' }}>Weight: 25%</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--flat-border)', borderRight: '1px solid var(--flat-border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>2. 30 MCQs</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--flat-green-dark)', marginTop: '2px' }}>{mockScore}%</div>
                <div style={{ fontSize: '10.5px', color: 'var(--flat-subtle)' }}>Weight: 35%</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>3. AI Interview</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--flat-purple)', marginTop: '2px' }}>{interviewScore}%</div>
                <div style={{ fontSize: '10.5px', color: 'var(--flat-subtle)' }}>Weight: 40%</div>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <span style={{ fontSize: '12px', color: 'var(--flat-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} color="var(--flat-green-dark)" /> Proctored Benchmark Standard
            </span>
            <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
              Passing Cutoff: <strong>60%</strong>
            </span>
          </div>
        </div>

        {/* Right: Coordinated Next Action Banner */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--flat-surface)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge badge-amber">
                <Sparkles size={13} /> Recommended Next Milestone
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--flat-muted)' }}>
                Diagnostic Phase
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
              <div className="icon-tile icon-tile-lg icon-tile-blue">
                <ListChecks size={26} color="#FFFFFF" />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--flat-text)', marginBottom: '6px' }}>
                  Take 30 MCQ Technical Assessment
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', lineHeight: '1.5' }}>
                  Complete the timed 30 multiple-choice assessment covering core algorithms, system architecture, and code predictions. Fully proctored for authentic placement preparation.
                </p>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <span className="badge badge-green" style={{ fontSize: '11.5px' }}>
              <CheckCircle2 size={13} /> Instant Verification
            </span>
            <Link href="/mcq-test" className="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Start 30 MCQs</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>

      {/* SECTION 2: 3-STAGE PLACEMENT READINESS CURRICULUM */}
      <div>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--flat-text)' }}>
            Placement Readiness Curriculum
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--flat-muted)' }}>
            Complete the three sequential diagnostic rounds to achieve full recruiter certification.
          </p>
        </div>

        <div className="grid-3">
          
          {/* Stage 1: Resume ATS */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-gray font-mono">STAGE 01</span>
                <span className="badge badge-green">
                  <CheckCircle2 size={13} /> ATS: {resumeScore}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="icon-tile icon-tile-sm icon-tile-orange">
                  <FileCheck size={16} color="#FFFFFF" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)' }}>
                  1. Resume ATS Benchmark
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--flat-muted)', lineHeight: '1.5' }}>
                Audit your resume using Gemini 2.5. Extract keywords, detect missing competencies, and calculate target role fit.
              </p>
            </div>
            <div className="card-footer">
              <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>Weight: 25%</span>
              <a href="#resume-audit-section" className="button button-secondary btn-sm">
                Audit Resume →
              </a>
            </div>
          </div>

          {/* Stage 2: 30 MCQ Tech Test */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-gray font-mono">STAGE 02</span>
                <span className="badge badge-blue">
                  <ListChecks size={13} /> Score: {mockScore}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="icon-tile icon-tile-sm icon-tile-blue">
                  <ListChecks size={16} color="#FFFFFF" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)' }}>
                  2. 30 MCQ Technical Test
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--flat-muted)', lineHeight: '1.5' }}>
                30 high-impact technical questions across Data Structures, Algorithms, OS, DBMS, and Code analysis with instant scoring.
              </p>
            </div>
            <div className="card-footer">
              <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>Weight: 35%</span>
              <Link href="/mcq-test" className="button btn-sm">
                Start 30 MCQs →
              </Link>
            </div>
          </div>

          {/* Stage 3: AI Interview */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-gray font-mono">STAGE 03</span>
                <span className="badge badge-purple">
                  <Mic size={13} /> Score: {interviewScore}%
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="icon-tile icon-tile-sm icon-tile-purple">
                  <Mic size={16} color="#FFFFFF" />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)' }}>
                  3. AI Voice Interview
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--flat-muted)', lineHeight: '1.5' }}>
                Real-time speech recognition with speech synthesis and webcam proctoring. Evaluated using STAR criteria.
              </p>
            </div>
            <div className="card-footer">
              <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>Weight: 40%</span>
              <Link href="/ai-interview" className="button button-secondary btn-sm">
                Enter Interview Room →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: RESUME AUDIT SECTION & DIAGNOSTIC TREND */}
      <div className="grid-split-work" id="resume-audit-section">
        
        {/* Left: Resume ATS Benchmarker */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={18} color="var(--flat-orange)" />
                Benchmark Resume with Gemini ATS
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Select role and evaluate your resume for keyword gap analysis.
              </p>
            </div>
            <span className="badge badge-blue">
              ATS: {resumeScore}%
            </span>
          </div>

          <form onSubmit={handleBenchmarkResume}>
            <div className="form-group">
              <label className="form-label">Target Role Specification</label>
              <select
                className="flat-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {defaultJobs.map(j => (
                  <option key={j.id} value={j.title}>
                    {j.title} • {j.company} ({j.salary})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Resume Content / Project Portfolio</label>
              <textarea
                className="flat-textarea"
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content, experience, skills, and projects here..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
                Evaluated in-memory with Gemini 2.5
              </span>
              <button
                type="submit"
                disabled={isAuditing}
                className="button"
                style={{ background: 'var(--flat-orange-dark)' }}
              >
                {isAuditing ? 'Analyzing Resume...' : 'Benchmark Resume'}
              </button>
            </div>
          </form>

          {/* Audit Results Box */}
          {atsResult && (
            <div style={{ marginTop: '16px', padding: '14px', background: 'var(--flat-surface-subtle)', border: '1px solid var(--flat-border)', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: 'var(--flat-text)', fontSize: '14px' }}>
                  ATS Result: {atsResult.score}% Fit for {atsResult.role}
                </span>
                <span className="badge badge-green">Audit Complete</span>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', display: 'block', marginBottom: '4px' }}>
                  EXTRACTED SKILLS:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {atsResult.extractedSkills.map((sk, idx) => (
                    <span key={idx} className="badge badge-blue" style={{ fontSize: '11px' }}>{sk}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', display: 'block', marginBottom: '4px' }}>
                  MISSING KEYWORDS TO ADD:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {atsResult.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="badge badge-orange" style={{ fontSize: '11px' }}>{kw}</span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', display: 'block', marginBottom: '4px' }}>
                  HIGH-IMPACT RECOMMENDATION:
                </span>
                <p style={{ fontSize: '12.5px', color: 'var(--flat-text)', margin: 0 }}>
                  • {atsResult.whatToAdd[0]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Placement Diagnostic Trend Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)' }}>
                Placement Diagnostic Trend
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Score trajectories across 30 MCQs and Proctored Voice Interviews.
              </p>
            </div>
            <span className="badge badge-gray">4 Assessment Rounds</span>
          </div>

          <div style={{ padding: '8px 0' }}>
            <DiagnosticChart />
          </div>

          <div className="card-footer">
            <span style={{ fontSize: '12px', color: 'var(--flat-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', background: '#2196F3' }}></span> 30 MCQs
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', background: '#4CAF50' }}></span> AI Interview
              </span>
            </span>
            <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
              Goal: <strong>≥ 75%</strong>
            </span>
          </div>
        </div>

      </div>

      {/* SECTION 4: APPOINTMENT SCHEDULER & RECRUITER TECH OPENINGS */}
      <div className="grid-2">
        
        {/* Left: Mock Slot Scheduler */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={18} color="var(--flat-blue)" />
                Schedule Practice Appointment
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Reserve a proctored diagnostic testing slot.
              </p>
            </div>
            <span className="badge badge-gray">Reservation</span>
          </div>

          {schedSuccess && (
            <div style={{ padding: '10px 14px', background: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '6px', color: '#2E7D32', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> Appointment scheduled successfully!
            </div>
          )}

          <form onSubmit={handleScheduleSubmit}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="button">
                <CalendarPlus size={15} /> Set Appointment
              </button>
            </div>
          </form>

          {/* Upcoming list */}
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--flat-border)', paddingTop: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', display: 'block', marginBottom: '8px' }}>
              UPCOMING APPOINTMENTS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {scheduledList.map(st => (
                <div key={st.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--flat-surface-subtle)', border: '1px solid var(--flat-border)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--flat-text)' }}>{st.test_type}</span>
                  <span className="badge badge-blue" style={{ fontSize: '11px' }}>{st.date} • {st.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Target Recruiter Openings */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="var(--flat-green)" />
                Target Recruiter Tech Openings
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Curated active roles for diagnostic readiness alignment.
              </p>
            </div>
            <span className="badge badge-green">Active Drives</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {defaultJobs.slice(0, 4).map(job => (
              <div
                key={job.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  background: 'var(--flat-surface-subtle)',
                  border: '1px solid var(--flat-border)',
                  borderRadius: '6px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--flat-text)' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--flat-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={13} /> {job.company} • <span style={{ color: 'var(--flat-green-dark)', fontWeight: 700 }}>{job.salary}</span>
                  </div>
                </div>
                <Link href={`/mcq-test?role=${encodeURIComponent(job.title)}`} className="button button-secondary btn-sm">
                  Practice →
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SECTION 5: ASSESSMENT AUDIT LOG */}
      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--flat-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--flat-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={18} color="var(--flat-purple)" />
              Academic Assessment Audit Log
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
              Official verification archive of diagnostic rounds and proctoring logs.
            </p>
          </div>
          <span className="badge badge-gray">Proctored Archive</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="flat-table">
            <thead>
              <tr>
                <th>Assessment Round</th>
                <th>Technology Track</th>
                <th>Timestamp</th>
                <th>Proctoring Violations</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {initialAssessmentRecords.map(rec => (
                <tr key={rec.id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{rec.type}</span>
                  </td>
                  <td>
                    <span className="badge badge-gray">{rec.technology}</span>
                  </td>
                  <td style={{ color: 'var(--flat-muted)', fontSize: '12.5px' }}>
                    {rec.date}
                  </td>
                  <td>
                    {rec.violations > 0 ? (
                      <span className="badge badge-orange">
                        <AlertTriangle size={13} /> {rec.violations} warning{rec.violations > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="badge badge-green">
                        <CheckCircle2 size={13} /> Clean
                      </span>
                    )}
                  </td>
                  <td>
                    <strong style={{ fontSize: '14.5px', color: rec.passed ? 'var(--flat-green-dark)' : 'var(--flat-orange-dark)' }}>
                      {rec.score}%
                    </strong>
                  </td>
                  <td>
                    {rec.passed ? (
                      <span className="badge badge-green">Passed</span>
                    ) : (
                      <span className="badge badge-orange">Cutoff Missed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
