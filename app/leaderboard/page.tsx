'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  Star,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  Calendar,
  Activity,
  CheckCircle2,
  Sparkles,
  User
} from 'lucide-react';

interface GrowthPoint {
  label: string; // e.g., "W1", "Aug", "2023"
  mcq: number;
  interview: number;
  overall: number;
  rank: number;
}

interface StudentHistory {
  weekly: GrowthPoint[];
  monthly: GrowthPoint[];
  yearly: GrowthPoint[];
}

interface LeaderboardStudent {
  rank: number;
  previousRank: number; // For movement delta: previous - current
  name: string;
  track: string;
  resume: number;
  mcq: number;
  interview: number;
  overall: number;
  status: string;
  history: StudentHistory;
}

const mockLeaderboard: LeaderboardStudent[] = [
  {
    rank: 1,
    previousRank: 1,
    name: "Priya Sharma",
    track: "Software Engineering",
    resume: 94,
    mcq: 90,
    interview: 92,
    overall: 92,
    status: "Offered • Google",
    history: {
      weekly: [
        { label: "Week 1", mcq: 86, interview: 88, overall: 88, rank: 1 },
        { label: "Week 2", mcq: 88, interview: 90, overall: 90, rank: 1 },
        { label: "Week 3", mcq: 90, interview: 91, overall: 91, rank: 1 },
        { label: "Week 4", mcq: 90, interview: 92, overall: 92, rank: 1 }
      ],
      monthly: [
        { label: "August", mcq: 82, interview: 80, overall: 82, rank: 1 },
        { label: "September", mcq: 85, interview: 86, overall: 86, rank: 1 },
        { label: "October", mcq: 88, interview: 89, overall: 89, rank: 1 },
        { label: "November", mcq: 90, interview: 92, overall: 92, rank: 1 }
      ],
      yearly: [
        { label: "2023", mcq: 72, interview: 68, overall: 70, rank: 3 },
        { label: "2024", mcq: 80, interview: 76, overall: 78, rank: 2 },
        { label: "2025", mcq: 86, interview: 84, overall: 86, rank: 1 },
        { label: "2026", mcq: 90, interview: 92, overall: 92, rank: 1 }
      ]
    }
  },
  {
    rank: 2,
    previousRank: 3,
    name: "Rohan Verma",
    track: "Backend & Systems",
    resume: 88,
    mcq: 86,
    interview: 88,
    overall: 87,
    status: "Offered • Microsoft",
    history: {
      weekly: [
        { label: "Week 1", mcq: 80, interview: 81, overall: 81, rank: 3 },
        { label: "Week 2", mcq: 82, interview: 83, overall: 83, rank: 3 },
        { label: "Week 3", mcq: 84, interview: 85, overall: 85, rank: 3 },
        { label: "Week 4", mcq: 86, interview: 88, overall: 87, rank: 2 }
      ],
      monthly: [
        { label: "August", mcq: 76, interview: 74, overall: 75, rank: 4 },
        { label: "September", mcq: 80, interview: 78, overall: 79, rank: 3 },
        { label: "October", mcq: 83, interview: 82, overall: 83, rank: 3 },
        { label: "November", mcq: 86, interview: 88, overall: 87, rank: 2 }
      ],
      yearly: [
        { label: "2023", mcq: 65, interview: 60, overall: 64, rank: 6 },
        { label: "2024", mcq: 74, interview: 70, overall: 73, rank: 4 },
        { label: "2025", mcq: 82, interview: 80, overall: 81, rank: 3 },
        { label: "2026", mcq: 86, interview: 88, overall: 87, rank: 2 }
      ]
    }
  },
  {
    rank: 3,
    previousRank: 2,
    name: "Sneha Patel",
    track: "Cloud & DevOps",
    resume: 86,
    mcq: 84,
    interview: 85,
    overall: 85,
    status: "Shortlisted • Amazon",
    history: {
      weekly: [
        { label: "Week 1", mcq: 85, interview: 86, overall: 86, rank: 2 },
        { label: "Week 2", mcq: 86, interview: 86, overall: 86, rank: 2 },
        { label: "Week 3", mcq: 85, interview: 85, overall: 85, rank: 2 },
        { label: "Week 4", mcq: 84, interview: 85, overall: 85, rank: 3 }
      ],
      monthly: [
        { label: "August", mcq: 80, interview: 82, overall: 81, rank: 2 },
        { label: "September", mcq: 82, interview: 84, overall: 83, rank: 2 },
        { label: "October", mcq: 85, interview: 86, overall: 86, rank: 2 },
        { label: "November", mcq: 84, interview: 85, overall: 85, rank: 3 }
      ],
      yearly: [
        { label: "2023", mcq: 70, interview: 72, overall: 71, rank: 2 },
        { label: "2024", mcq: 76, interview: 78, overall: 77, rank: 3 },
        { label: "2025", mcq: 83, interview: 84, overall: 84, rank: 2 },
        { label: "2026", mcq: 84, interview: 85, overall: 85, rank: 3 }
      ]
    }
  },
  {
    rank: 4,
    previousRank: 6, // Moved UP 2 places! (from #6 to #4)
    name: "Abhay Raj Singh (You)",
    track: "Software Engineering",
    resume: 84,
    mcq: 73,
    interview: 65,
    overall: 72,
    status: "In Diagnostic Review",
    history: {
      weekly: [
        { label: "Week 1", mcq: 58, interview: 50, overall: 54, rank: 6 },
        { label: "Week 2", mcq: 68, interview: 62, overall: 64, rank: 6 },
        { label: "Week 3", mcq: 73, interview: 60, overall: 68, rank: 5 },
        { label: "Week 4", mcq: 73, interview: 65, overall: 72, rank: 4 }
      ],
      monthly: [
        { label: "August", mcq: 50, interview: 44, overall: 50, rank: 8 },
        { label: "September", mcq: 60, interview: 52, overall: 58, rank: 7 },
        { label: "October", mcq: 68, interview: 58, overall: 65, rank: 6 },
        { label: "November", mcq: 73, interview: 65, overall: 72, rank: 4 }
      ],
      yearly: [
        { label: "2023", mcq: 44, interview: 40, overall: 45, rank: 12 },
        { label: "2024", mcq: 56, interview: 48, overall: 54, rank: 9 },
        { label: "2025", mcq: 66, interview: 58, overall: 64, rank: 7 },
        { label: "2026", mcq: 73, interview: 65, overall: 72, rank: 4 }
      ]
    }
  },
  {
    rank: 5,
    previousRank: 4,
    name: "Kunal Deshmukh",
    track: "Full Stack Platform",
    resume: 78,
    mcq: 70,
    interview: 72,
    overall: 72,
    status: "Eligible for Drives",
    history: {
      weekly: [
        { label: "Week 1", mcq: 72, interview: 74, overall: 73, rank: 4 },
        { label: "Week 2", mcq: 72, interview: 72, overall: 73, rank: 4 },
        { label: "Week 3", mcq: 71, interview: 72, overall: 72, rank: 4 },
        { label: "Week 4", mcq: 70, interview: 72, overall: 72, rank: 5 }
      ],
      monthly: [
        { label: "August", mcq: 65, interview: 66, overall: 66, rank: 6 },
        { label: "September", mcq: 68, interview: 70, overall: 69, rank: 5 },
        { label: "October", mcq: 71, interview: 72, overall: 72, rank: 4 },
        { label: "November", mcq: 70, interview: 72, overall: 72, rank: 5 }
      ],
      yearly: [
        { label: "2023", mcq: 50, interview: 52, overall: 52, rank: 8 },
        { label: "2024", mcq: 60, interview: 62, overall: 62, rank: 6 },
        { label: "2025", mcq: 68, interview: 70, overall: 70, rank: 5 },
        { label: "2026", mcq: 70, interview: 72, overall: 72, rank: 5 }
      ]
    }
  },
  {
    rank: 6,
    previousRank: 5,
    name: "Ananya Iyer",
    track: "Backend & Systems",
    resume: 76,
    mcq: 72,
    interview: 68,
    overall: 71,
    status: "Eligible for Drives",
    history: {
      weekly: [
        { label: "Week 1", mcq: 70, interview: 66, overall: 69, rank: 5 },
        { label: "Week 2", mcq: 71, interview: 67, overall: 70, rank: 5 },
        { label: "Week 3", mcq: 72, interview: 68, overall: 71, rank: 6 },
        { label: "Week 4", mcq: 72, interview: 68, overall: 71, rank: 6 }
      ],
      monthly: [
        { label: "August", mcq: 64, interview: 60, overall: 63, rank: 7 },
        { label: "September", mcq: 68, interview: 64, overall: 67, rank: 6 },
        { label: "October", mcq: 70, interview: 66, overall: 69, rank: 5 },
        { label: "November", mcq: 72, interview: 68, overall: 71, rank: 6 }
      ],
      yearly: [
        { label: "2023", mcq: 48, interview: 44, overall: 48, rank: 10 },
        { label: "2024", mcq: 58, interview: 54, overall: 58, rank: 7 },
        { label: "2025", mcq: 66, interview: 62, overall: 66, rank: 6 },
        { label: "2026", mcq: 72, interview: 68, overall: 71, rank: 6 }
      ]
    }
  },
  {
    rank: 7,
    previousRank: 8,
    name: "Vikram Malhotra",
    track: "Software Engineering",
    resume: 72,
    mcq: 68,
    interview: 64,
    overall: 67,
    status: "Diagnostic Phase",
    history: {
      weekly: [
        { label: "Week 1", mcq: 62, interview: 58, overall: 61, rank: 8 },
        { label: "Week 2", mcq: 64, interview: 60, overall: 63, rank: 8 },
        { label: "Week 3", mcq: 66, interview: 62, overall: 65, rank: 7 },
        { label: "Week 4", mcq: 68, interview: 64, overall: 67, rank: 7 }
      ],
      monthly: [
        { label: "August", mcq: 55, interview: 50, overall: 54, rank: 9 },
        { label: "September", mcq: 60, interview: 56, overall: 59, rank: 8 },
        { label: "October", mcq: 64, interview: 60, overall: 63, rank: 8 },
        { label: "November", mcq: 68, interview: 64, overall: 67, rank: 7 }
      ],
      yearly: [
        { label: "2023", mcq: 40, interview: 36, overall: 40, rank: 15 },
        { label: "2024", mcq: 50, interview: 46, overall: 49, rank: 11 },
        { label: "2025", mcq: 60, interview: 55, overall: 59, rank: 8 },
        { label: "2026", mcq: 68, interview: 64, overall: 67, rank: 7 }
      ]
    }
  }
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all");
  // Default selected student is Abhay Raj Singh (You)
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardStudent>(
    mockLeaderboard.find(s => s.name.includes("You")) || mockLeaderboard[3]
  );
  // Timeframe horizon: weekly, monthly, yearly
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const abhayStudent = mockLeaderboard.find(s => s.name.includes("You")) || mockLeaderboard[3];
  const abhayRankDelta = abhayStudent.previousRank - abhayStudent.rank; // Positive means moved UP

  const filtered = filter === "all"
    ? mockLeaderboard
    : mockLeaderboard.filter(s => s.track.toLowerCase().includes(filter.toLowerCase()));

  // Active growth trajectory points
  const points = selectedStudent.history[timeframe];
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const growthDelta = lastPoint.overall - firstPoint.overall;
  const isGrowth = growthDelta >= 0;
  const rankDelta = firstPoint.rank - lastPoint.rank; // Positive means moved UP

  // SVG Chart Geometry Constants
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / (points.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - (val / 100) * chartH;

  // Build SVG path strings
  const overallPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.overall)}`).join(' ');
  const mcqPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.mcq)}`).join(' ');
  const interviewPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.interview)}`).join(' ');

  // Cutoff Y coordinate for 60%
  const cutoffY = getY(60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-amber" style={{ marginBottom: '8px' }}>
            <Trophy size={13} /> CAMPUS DIAGNOSTIC LEADERBOARD
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Campus Placement Readiness Ranking</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Real-time percentile rankings, candidate movement trends, and diagnostic growth trajectories.
          </p>
        </div>
        <Link href="/" className="button button-secondary" style={{ borderRadius: '12px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Abhay Raj Singh (You) Live Leaderboard Movement Spotlight */}
      <div
        className="card"
        style={{
          borderRadius: '24px',
          padding: '24px',
          border: '2px solid var(--scheme-deep)',
          background: 'var(--flat-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--scheme-deep)',
                color: '#FFFFFF',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 900,
                fontSize: '18px'
              }}
            >
              #4
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--flat-text)', margin: 0 }}>
                  Abhay Raj Singh (You)
                </h2>
                <span className="badge badge-blue font-mono" style={{ fontSize: '11px', fontWeight: 700 }}>
                  Active Candidate
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: abhayRankDelta > 0 ? 'var(--scheme-teal-subtle)' : abhayRankDelta < 0 ? 'var(--scheme-coral-subtle)' : 'var(--flat-surface-subtle)',
                    color: abhayRankDelta > 0 ? 'var(--scheme-deep)' : abhayRankDelta < 0 ? 'var(--scheme-coral-dark)' : 'var(--flat-muted)'
                  }}
                >
                  {abhayRankDelta > 0 ? (
                    <>
                      <ArrowUpRight size={14} /> Climbed +{abhayRankDelta} Ranks Up!
                    </>
                  ) : abhayRankDelta < 0 ? (
                    <>
                      <ArrowDownRight size={14} /> Dropped {Math.abs(abhayRankDelta)} Ranks
                    </>
                  ) : (
                    <>
                      <Minus size={14} /> Position Steady
                    </>
                  )}
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '3px' }}>
                Moved up from Rank #6 to <strong>Rank #4</strong> across campus drives this evaluation cycle.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedStudent(abhayStudent)}
            className="button button-sm"
            style={{
              background: selectedStudent.name === abhayStudent.name ? 'var(--scheme-deep)' : 'var(--flat-border)',
              color: selectedStudent.name === abhayStudent.name ? '#FFFFFF' : 'var(--flat-text)',
              borderRadius: '12px',
              fontWeight: 700
            }}
          >
            <Activity size={14} /> Focus Abhay&apos;s Trajectory
          </button>
        </div>

        {/* Abhay Position Breakdown Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>CURRENT RANK</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '2px' }}>
              #4 <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--flat-muted)' }}>/ 240 Cohort</span>
            </div>
          </div>

          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>PERCENTILE STANDING</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-teal-dark)', marginTop: '2px' }}>
              Top 1.6%
            </div>
          </div>

          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>DELTA TO #3 PODIUM</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-gold-dark)', marginTop: '2px' }}>
              -13% to #3
            </div>
          </div>

          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>PLACEMENT STATUS</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '5px' }}>
              Cutoff Cleared (72%)
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
          <div className="icon-tile" style={{ borderRadius: '16px', background: 'var(--scheme-gold)', color: '#1F2937' }}>
            <Trophy size={24} color="#1F2937" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #1</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{mockLeaderboard[0].name}</div>
            <div style={{ fontSize: '12px', color: 'var(--scheme-deep)', fontWeight: 800 }}>
              {mockLeaderboard[0].overall}% • {mockLeaderboard[0].status}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
          <div className="icon-tile" style={{ borderRadius: '16px', background: 'var(--scheme-teal)', color: '#FFFFFF' }}>
            <Medal size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #2</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{mockLeaderboard[1].name}</div>
            <div style={{ fontSize: '12px', color: 'var(--scheme-teal-dark)', fontWeight: 800 }}>
              {mockLeaderboard[1].overall}% • {mockLeaderboard[1].status}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
          <div className="icon-tile" style={{ borderRadius: '16px', background: 'var(--scheme-coral)', color: '#FFFFFF' }}>
            <Star size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #3</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{mockLeaderboard[2].name}</div>
            <div style={{ fontSize: '12px', color: 'var(--scheme-coral-dark)', fontWeight: 800 }}>
              {mockLeaderboard[2].overall}% • {mockLeaderboard[2].status}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Individual Student Growth & Fall Trajectory Section */}
      <div className="card" style={{ borderRadius: '24px', padding: '26px' }}>
        
        {/* Trajectory Header & Student Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>
                <LineChart size={12} /> STUDENT GROWTH TRAJECTORY
              </span>
              <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
                Click any candidate below to inspect their individual trend
              </span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--flat-text)' }}>
              {selectedStudent.name} Growth &amp; Fall Analytics
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
              Engineering Track: <strong>{selectedStudent.track}</strong> • Current Standing: <strong>Rank #{selectedStudent.rank}</strong>
            </p>
          </div>

          {/* Timeframe Controls: Weekly, Monthly, Yearly */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--flat-surface-subtle)', padding: '4px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <button
              type="button"
              onClick={() => setTimeframe('weekly')}
              className="button btn-sm"
              style={{
                borderRadius: '10px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: timeframe === 'weekly' ? 'var(--scheme-deep)' : 'transparent',
                color: timeframe === 'weekly' ? '#FFFFFF' : 'var(--flat-text)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('monthly')}
              className="button btn-sm"
              style={{
                borderRadius: '10px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: timeframe === 'monthly' ? 'var(--scheme-deep)' : 'transparent',
                color: timeframe === 'monthly' ? '#FFFFFF' : 'var(--flat-text)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('yearly')}
              className="button btn-sm"
              style={{
                borderRadius: '10px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                background: timeframe === 'yearly' ? 'var(--scheme-deep)' : 'transparent',
                color: timeframe === 'yearly' ? '#FFFFFF' : 'var(--flat-text)',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Trajectory Growth / Fall Summary Indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
          
          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>
              {timeframe} Trajectory
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 900,
                marginTop: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: isGrowth ? 'var(--scheme-teal-dark)' : 'var(--scheme-coral)'
              }}
            >
              {isGrowth ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {isGrowth ? `+${growthDelta}%` : `${growthDelta}%`}
              <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--flat-muted)' }}>
                {isGrowth ? 'Growth' : 'Fall'}
              </span>
            </div>
          </div>

          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>
              Leaderboard Shift
            </div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--flat-text)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {rankDelta > 0 ? (
                <span style={{ color: 'var(--scheme-deep)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ArrowUpRight size={16} /> Up +{rankDelta} Ranks
                </span>
              ) : rankDelta < 0 ? (
                <span style={{ color: 'var(--scheme-coral)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ArrowDownRight size={16} /> Down {Math.abs(rankDelta)} Ranks
                </span>
              ) : (
                <span style={{ color: 'var(--flat-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <Minus size={16} /> Steady Rank #{lastPoint.rank}
                </span>
              )}
            </div>
          </div>

          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>
              Current Readiness
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '3px' }}>
              {selectedStudent.overall}%
            </div>
          </div>

          <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase' }}>
              Diagnostic Cutoff
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '6px', color: selectedStudent.overall >= 60 ? 'var(--scheme-teal-dark)' : 'var(--scheme-coral)' }}>
              {selectedStudent.overall >= 60 ? 'Qualified (≥ 60%)' : 'Needs Practice (< 60%)'}
            </div>
          </div>

        </div>

        {/* SVG Diagnostic Trajectory Curve */}
        <div
          style={{
            background: 'var(--flat-surface-subtle)',
            borderRadius: '18px',
            border: '1px solid var(--flat-border)',
            padding: '20px 16px 12px',
            position: 'relative'
          }}
        >
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            
            {/* Horizontal Grid lines at 0%, 25%, 50%, 75%, 100% */}
            {[0, 25, 50, 75, 100].map(val => (
              <g key={val}>
                <line
                  x1={paddingLeft}
                  y1={getY(val)}
                  x2={svgWidth - paddingRight}
                  y2={getY(val)}
                  stroke="var(--flat-border)"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={getY(val) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--flat-muted)"
                  fontFamily="monospace"
                >
                  {val}%
                </text>
              </g>
            ))}

            {/* 60% Cutoff Line */}
            <line
              x1={paddingLeft}
              y1={cutoffY}
              x2={svgWidth - paddingRight}
              y2={cutoffY}
              stroke="var(--scheme-ice)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={svgWidth - paddingRight - 6}
              y={cutoffY - 6}
              textAnchor="end"
              fontSize="10"
              fontWeight="700"
              fill="var(--scheme-deep)"
            >
              Cutoff: 60%
            </text>

            {/* Vertical grid lines & X-axis labels */}
            {points.map((p, idx) => (
              <g key={idx}>
                <line
                  x1={getX(idx)}
                  y1={paddingTop}
                  x2={getX(idx)}
                  y2={svgHeight - paddingBottom}
                  stroke="var(--flat-border)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={getX(idx)}
                  y={svgHeight - paddingBottom + 18}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontWeight="700"
                  fill="var(--flat-text)"
                >
                  {p.label}
                </text>
              </g>
            ))}

            {/* Line 1: Overall Readiness (Vibrant Ocean Teal) */}
            <path
              d={overallPath}
              fill="none"
              stroke="var(--scheme-teal)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line 2: MCQ Test (Deep Petrol Teal) */}
            <path
              d={mcqPath}
              fill="none"
              stroke="var(--scheme-deep)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Line 3: AI Interview (Warm Coral) */}
            <path
              d={interviewPath}
              fill="none"
              stroke="var(--scheme-coral)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Point Dots */}
            {points.map((p, idx) => {
              const x = getX(idx);
              const yOverall = getY(p.overall);
              const yMcq = getY(p.mcq);
              const yIv = getY(p.interview);

              return (
                <g key={idx}>
                  {/* Overall Point */}
                  <circle cx={x} cy={yOverall} r="5.5" fill="var(--scheme-teal)" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={x} y={yOverall - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="var(--scheme-deep)">
                    {p.overall}%
                  </text>

                  {/* MCQ Point */}
                  <circle cx={x} cy={yMcq} r="4" fill="var(--scheme-deep)" stroke="#FFFFFF" strokeWidth="1.5" />

                  {/* Interview Point */}
                  <circle cx={x} cy={yIv} r="4" fill="var(--scheme-coral)" stroke="#FFFFFF" strokeWidth="1.5" />
                </g>
              );
            })}

          </svg>

          {/* Chart Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '12px', fontSize: '12px', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--scheme-teal)' }}></span>
              <span style={{ color: 'var(--flat-text)' }}>Overall Readiness %</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--scheme-deep)' }}></span>
              <span style={{ color: 'var(--flat-text)' }}>MCQ Test %</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--scheme-coral)' }}></span>
              <span style={{ color: 'var(--flat-text)' }}>AI Interview %</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '16px', height: '2px', borderTop: '2px dashed var(--scheme-ice)' }}></span>
              <span style={{ color: 'var(--flat-muted)' }}>60% Benchmark</span>
            </div>
          </div>
        </div>

      </div>

      {/* Cohort Leaderboard Table with Movement Indicators */}
      <div className="card" style={{ padding: 0, borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--flat-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilter("all")}
              className={`button btn-sm ${filter === "all" ? "" : "button-secondary"}`}
              style={{
                borderRadius: '12px',
                background: filter === "all" ? 'var(--scheme-deep)' : undefined,
                color: filter === "all" ? '#FFFFFF' : undefined
              }}
            >
              All Tracks
            </button>
            <button
              onClick={() => setFilter("software")}
              className={`button btn-sm ${filter === "software" ? "" : "button-secondary"}`}
              style={{
                borderRadius: '12px',
                background: filter === "software" ? 'var(--scheme-deep)' : undefined,
                color: filter === "software" ? '#FFFFFF' : undefined
              }}
            >
              Software Engineering
            </button>
            <button
              onClick={() => setFilter("backend")}
              className={`button btn-sm ${filter === "backend" ? "" : "button-secondary"}`}
              style={{
                borderRadius: '12px',
                background: filter === "backend" ? 'var(--scheme-deep)' : undefined,
                color: filter === "backend" ? '#FFFFFF' : undefined
              }}
            >
              Backend &amp; Systems
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
              Click any candidate to switch trajectory chart
            </span>
            <span className="badge badge-gray font-mono">
              Cutoff: 60% Overall
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="flat-table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Rank &amp; Shift</th>
                <th>Candidate Name</th>
                <th>Engineering Track</th>
                <th>Resume ATS (25%)</th>
                <th>MCQ Test (35%)</th>
                <th>AI Interview (40%)</th>
                <th>Overall Index</th>
                <th>Movement</th>
                <th>Recruiter Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(st => {
                const isYou = st.name.includes("You");
                const isSelected = selectedStudent.name === st.name;
                const delta = st.previousRank - st.rank;

                return (
                  <tr
                    key={st.rank}
                    onClick={() => setSelectedStudent(st)}
                    style={{
                      background: isSelected
                        ? 'var(--scheme-deep-subtle)'
                        : isYou
                        ? 'var(--flat-surface-subtle)'
                        : undefined,
                      cursor: 'pointer',
                      transition: 'background 150ms ease'
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${st.rank <= 3 ? 'badge-amber' : 'badge-gray'}`} style={{ fontWeight: 800 }}>
                          #{st.rank}
                        </span>
                        {delta > 0 && (
                          <span style={{ color: 'var(--scheme-teal-dark)', fontWeight: 800, fontSize: '11px', display: 'flex', alignItems: 'center' }} title={`Climbed +${delta} ranks`}>
                            <ArrowUpRight size={13} />+{delta}
                          </span>
                        )}
                        {delta < 0 && (
                          <span style={{ color: 'var(--scheme-coral)', fontWeight: 800, fontSize: '11px', display: 'flex', alignItems: 'center' }} title={`Fell ${Math.abs(delta)} ranks`}>
                            <ArrowDownRight size={13} />{delta}
                          </span>
                        )}
                        {delta === 0 && (
                          <span style={{ color: 'var(--flat-muted)', fontSize: '11px' }} title="No rank change">
                            <Minus size={12} />
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ color: isYou ? 'var(--scheme-deep)' : 'var(--flat-text)' }}>
                          {st.name}
                        </strong>
                        {isSelected && (
                          <span className="badge badge-green" style={{ fontSize: '10px', padding: '2px 6px' }}>
                            Viewing Chart
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-gray">{st.track}</span>
                    </td>

                    <td>{st.resume}%</td>
                    <td>{st.mcq}%</td>
                    <td>{st.interview}%</td>

                    <td>
                      <strong style={{ fontSize: '15px', color: st.overall >= 75 ? 'var(--scheme-teal-dark)' : 'var(--scheme-deep)' }}>
                        {st.overall}%
                      </strong>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: delta > 0 ? 'var(--scheme-teal-dark)' : delta < 0 ? 'var(--scheme-coral)' : 'var(--flat-muted)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        {delta > 0 ? (
                          <>
                            <TrendingUp size={13} /> Moving Up
                          </>
                        ) : delta < 0 ? (
                          <>
                            <TrendingDown size={13} /> Moving Down
                          </>
                        ) : (
                          <>
                            <Minus size={13} /> Steady
                          </>
                        )}
                      </span>
                    </td>

                    <td>
                      <span className={`badge ${st.status.includes('Offered') ? 'badge-green' : st.status.includes('Shortlisted') ? 'badge-blue' : 'badge-gray'}`}>
                        {st.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
