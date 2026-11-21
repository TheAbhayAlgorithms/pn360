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
  Lock,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { GrowthPoint } from '@/lib/types';

export default function LeaderboardPage() {
  const { currentUser, allUsers } = useAuth();
  const [filter, setFilter] = useState("all");
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  // Sort cohort by overall score descending
  const sortedCohort = [...allUsers].sort((a, b) => b.overallScore - a.overallScore);

  const filteredCohort = filter === "all"
    ? sortedCohort
    : sortedCohort.filter(u => u.track.toLowerCase().includes(filter.toLowerCase()));

  // Top 3 Podium
  const rank1 = sortedCohort[0];
  const rank2 = sortedCohort[1];
  const rank3 = sortedCohort[2];

  // Current logged in user metrics
  const userRankDelta = currentUser ? currentUser.previousRank - currentUser.rank : 0;
  const userPoints: GrowthPoint[] = currentUser?.history?.[timeframe] || [
    { label: "W1", mcq: 60, interview: 55, overall: 58, rank: 6 },
    { label: "W2", mcq: 65, interview: 60, overall: 63, rank: 5 },
    { label: "W3", mcq: 70, interview: 62, overall: 67, rank: 5 },
    { label: "W4", mcq: 73, interview: 65, overall: 72, rank: 4 }
  ];

  const firstPoint = userPoints[0];
  const lastPoint = userPoints[userPoints.length - 1];
  const growthDelta = lastPoint.overall - firstPoint.overall;
  const isGrowth = growthDelta >= 0;

  // SVG Chart Geometry Constants
  const svgWidth = 640;
  const svgHeight = 240;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const getX = (idx: number) => paddingLeft + (idx / Math.max(1, userPoints.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - (val / 100) * chartH;

  // Build SVG path strings
  const overallPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.overall)}`).join(' ');
  const mcqPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.mcq)}`).join(' ');
  const interviewPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.interview)}`).join(' ');

  const cutoffY = getY(60);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Standardized Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="eyebrow-badge">
            <Trophy size={13} /> CAMPUS DIAGNOSTIC LEADERBOARD
          </div>
          <h1 className="page-title">Campus Placement Readiness Ranking</h1>
          <p className="page-subtitle">
            Real-time percentile rankings, recruiter status, and authenticated private growth trajectories.
          </p>
        </div>
        <Link href="/" className="button button-secondary page-header-back">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Authenticated User Live Rank Movement Spotlight */}
      {currentUser ? (
        <div
          className="card"
          style={{
            border: '1px solid var(--primary-border)',
            background: 'var(--surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                  flexShrink: 0
                }}
              >
                #{currentUser.rank}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                    {currentUser.name} (You)
                  </h2>
                  <span className="badge badge-primary font-mono" style={{ fontSize: '11px' }}>
                    {currentUser.track}
                  </span>
                  <span
                    className={`badge ${userRankDelta > 0 ? 'badge-success' : userRankDelta < 0 ? 'badge-danger' : 'badge-neutral'}`}
                    style={{ fontWeight: 700 }}
                  >
                    {userRankDelta > 0 ? (
                      <>
                        <ArrowUpRight size={13} /> Climbed +{userRankDelta} Ranks Up!
                      </>
                    ) : userRankDelta < 0 ? (
                      <>
                        <ArrowDownRight size={13} /> Dropped {Math.abs(userRankDelta)} Ranks
                      </>
                    ) : (
                      <>
                        <Minus size={13} /> Position Steady
                      </>
                    )}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Logged in as <strong>{currentUser.username}</strong> • Moved from Rank #{currentUser.previousRank} to <strong>Rank #{currentUser.rank}</strong> in this cycle.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-success" style={{ fontSize: '11.5px', gap: '5px' }}>
                <ShieldCheck size={13} /> Private Diagnostic Isolated
              </span>
              <Link href="/login" className="button button-sm button-secondary">
                Switch Profile
              </Link>
            </div>
          </div>

          {/* User Position Breakdown Cards */}
          <div className="grid-4">
            <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>YOUR COHORT RANK</div>
              <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                #{currentUser.rank} <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>/ {allUsers.length} active</span>
              </div>
            </div>

            <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>OVERALL READINESS</div>
              <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>
                {currentUser.overallScore}% Index
              </div>
            </div>

            <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BENCHMARK CLEARANCE</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: currentUser.overallScore >= 60 ? 'var(--primary)' : 'var(--danger)', marginTop: '2px' }}>
                {currentUser.overallScore >= 60 ? 'Cutoff Cleared' : 'Needs Review'}
              </div>
            </div>

            <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>RECRUITER STATUS</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginTop: '5px' }}>
                {currentUser.status}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sign-in prompt banner: highlighted callout */
        <div
          className="card"
          style={{
            border: '1px dashed var(--primary-border)',
            background: 'var(--primary-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                color: 'var(--primary)',
                display: 'grid',
                placeItems: 'center',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <Lock size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                Sign In to View Your Personal Diagnostic Growth Chart
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Each candidate&apos;s growth trajectory, weekly/monthly scores, and diagnostic records are strictly isolated and private.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/login" className="button button-sm button-primary">
              <LogIn size={14} /> Sign In
            </Link>
            <Link href="/login" className="button button-sm button-secondary">
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      <div className="grid-3">
        {rank1 && (
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1.5px solid var(--warning-border)',
              background: 'var(--surface)'
            }}
          >
            <div
              className="icon-tile"
              style={{
                borderRadius: 'var(--radius-sm)',
                background: 'var(--warning-subtle)',
                color: 'var(--warning-text)'
              }}
            >
              <Trophy size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--warning-hover)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>RANK #1</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rank1.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700, marginTop: '2px' }}>
                {rank1.overallScore}% • {rank1.status}
              </div>
            </div>
          </div>
        )}

        {rank2 && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              className="icon-tile"
              style={{
                borderRadius: 'var(--radius-sm)',
                background: 'var(--info-subtle)',
                color: 'var(--info-text)'
              }}
            >
              <Medal size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>RANK #2</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rank2.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--info)', fontWeight: 700, marginTop: '2px' }}>
                {rank2.overallScore}% • {rank2.status}
              </div>
            </div>
          </div>
        )}

        {rank3 && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              className="icon-tile"
              style={{
                borderRadius: 'var(--radius-sm)',
                background: 'var(--danger-subtle)',
                color: 'var(--danger-text)'
              }}
            >
              <Star size={22} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>RANK #3</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rank3.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 700, marginTop: '2px' }}>
                {rank3.overallScore}% • {rank3.status}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Private Growth & Fall Trajectory Section (Isolated Strictly to Current User) */}
      {currentUser ? (
        <div className="card">
          
          {/* Trajectory Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-success" style={{ fontSize: '11px' }}>
                  <LineChart size={12} /> PRIVATE DIAGNOSTIC TRAJECTORY
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  🔒 Scoped to your account ({currentUser.username})
                </span>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text)' }}>
                {currentUser.name}&apos;s Growth &amp; Fall Analytics
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Track: <strong>{currentUser.track}</strong> • Standing: <strong>Rank #{currentUser.rank}</strong> (Previous: #{currentUser.previousRank})
              </p>
            </div>

            {/* Timeframe Controls: Weekly, Monthly, Yearly */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--surface-subtle)',
                padding: '4px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)'
              }}
            >
              {(['weekly', 'monthly', 'yearly'] as const).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  style={{
                    borderRadius: 'var(--radius-xs)',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    background: timeframe === tf ? 'var(--surface)' : 'transparent',
                    color: timeframe === tf ? 'var(--primary)' : 'var(--text-muted)',
                    border: 'none',
                    boxShadow: timeframe === tf ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Trajectory Growth / Fall Summary Indicators */}
          <div className="grid-4" style={{ marginBottom: '20px' }}>
            <div style={{ background: 'var(--surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {timeframe} Trajectory
              </div>
              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  marginTop: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: isGrowth ? 'var(--success)' : 'var(--danger)'
                }}
              >
                {isGrowth ? <TrendingUp size={17} /> : <TrendingDown size={17} />}
                {isGrowth ? `+${growthDelta}%` : `${growthDelta}%`}
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {isGrowth ? 'Growth' : 'Fall'}
                </span>
              </div>
            </div>

            <div style={{ background: 'var(--surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BASELINE VS LATEST</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginTop: '3px' }}>
                {firstPoint.overall}% → <span style={{ color: 'var(--primary)' }}>{lastPoint.overall}%</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                {firstPoint.label} to {lastPoint.label}
              </div>
            </div>

            <div style={{ background: 'var(--surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>LATEST MCQ ACCURACY</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '3px' }}>
                {lastPoint.mcq}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, marginTop: '1px' }}>
                {lastPoint.mcq >= 60 ? 'Above Cutoff' : 'Under 60% Target'}
              </div>
            </div>

            <div style={{ background: 'var(--surface-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI INTERVIEW SCORE</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--info)', marginTop: '3px' }}>
                {lastPoint.interview}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                STAR rubric evaluated
              </div>
            </div>
          </div>

          {/* SVG Multi-Line Chart Canvas */}
          <div
            style={{
              background: 'var(--surface-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              overflowX: 'auto'
            }}
          >
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              {/* Horizontal Reference Grid Lines */}
              {[25, 50, 75, 100].map(val => (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={getY(val)}
                    x2={svgWidth - paddingRight}
                    y2={getY(val)}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={getY(val) + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--text-muted)"
                  >
                    {val}%
                  </text>
                </g>
              ))}

              {/* 60% Cutoff Benchmark Reference Line */}
              <line
                x1={paddingLeft}
                y1={cutoffY}
                x2={svgWidth - paddingRight}
                y2={cutoffY}
                stroke="var(--warning)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={svgWidth - paddingRight}
                y={cutoffY - 5}
                textAnchor="end"
                fontSize="10"
                fontWeight="700"
                fill="var(--warning)"
              >
                60% Placement Cutoff
              </text>

              {/* X Axis Timeframe Reference Lines & Labels */}
              {userPoints.map((p, idx) => (
                <g key={idx}>
                  <line
                    x1={getX(idx)}
                    y1={paddingTop}
                    x2={getX(idx)}
                    y2={svgHeight - paddingBottom}
                    stroke="var(--border)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={getX(idx)}
                    y={svgHeight - paddingBottom + 18}
                    textAnchor="middle"
                    fontSize="11.5"
                    fontWeight="600"
                    fill="var(--text-secondary)"
                  >
                    {p.label}
                  </text>
                </g>
              ))}

              {/* Line 1: Overall Readiness */}
              <path
                d={overallPath}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 2: MCQ Test */}
              <path
                d={mcqPath}
                fill="none"
                stroke="var(--info)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Line 3: AI Interview */}
              <path
                d={interviewPath}
                fill="none"
                stroke="var(--warning)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Point Dots */}
              {userPoints.map((p, idx) => {
                const x = getX(idx);
                const yOverall = getY(p.overall);
                const yMcq = getY(p.mcq);
                const yIv = getY(p.interview);

                return (
                  <g key={idx}>
                    {/* Overall Point */}
                    <circle cx={x} cy={yOverall} r="5" fill="var(--primary)" stroke="#FFFFFF" strokeWidth="2" />
                    <text x={x} y={yOverall - 8} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--primary)">
                      {p.overall}%
                    </text>

                    {/* MCQ Point */}
                    <circle cx={x} cy={yMcq} r="3.5" fill="var(--info)" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* Interview Point */}
                    <circle cx={x} cy={yIv} r="3.5" fill="var(--warning)" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                );
              })}
            </svg>

            {/* Chart Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '12px', fontSize: '12px', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)' }}></span>
                <span style={{ color: 'var(--text)' }}>Overall Readiness %</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--info)' }}></span>
                <span style={{ color: 'var(--text)' }}>MCQ Test %</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--warning)' }}></span>
                <span style={{ color: 'var(--text)' }}>AI Interview %</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '14px', height: '2px', borderTop: '2px dashed var(--warning)' }}></span>
                <span style={{ color: 'var(--text-muted)' }}>60% Benchmark</span>
              </div>
            </div>
          </div>

        </div>
      ) : null}

      {/* Cohort Placement Ranking Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Track Filter as styled dropdown or buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label htmlFor="track-filter" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Filter Track:
            </label>
            <select
              id="track-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flat-select"
              style={{
                width: 'auto',
                minWidth: '180px',
                height: '36px',
                padding: '0 10px',
                fontSize: '13px'
              }}
            >
              <option value="all">All Tracks</option>
              <option value="software">Software Engineering</option>
              <option value="backend">Backend &amp; Systems</option>
              <option value="cloud">Cloud &amp; DevOps</option>
              <option value="full stack">Full Stack Platform</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={13} /> Diagnostic charts are private to each user
            </span>
            <span className="badge badge-neutral font-mono">
              Cutoff: 60% Overall
            </span>
          </div>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="table-responsive">
          <table className="flat-table">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Rank &amp; Shift</th>
                <th>Candidate Name</th>
                <th>Engineering Track</th>
                <th className="num-col">Resume ATS (25%)</th>
                <th className="num-col">MCQ Test (35%)</th>
                <th className="num-col">AI Interview (40%)</th>
                <th className="num-col">Overall Index</th>
                <th className="center-col">Movement</th>
                <th>Recruiter Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCohort.map(st => {
                const isYou = currentUser && (st.id === currentUser.id || st.username === currentUser.username);
                const delta = st.previousRank - st.rank;
                const belowCutoff = st.overallScore < 60;

                return (
                  <tr
                    key={st.id}
                    style={{
                      backgroundColor: isYou ? 'var(--primary-subtle)' : undefined,
                      opacity: belowCutoff ? 0.75 : 1
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${st.rank <= 3 ? 'badge-amber' : 'badge-neutral'}`} style={{ fontWeight: 800 }}>
                          #{st.rank}
                        </span>
                        {delta > 0 && (
                          <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '11px', display: 'flex', alignItems: 'center' }} title={`Climbed +${delta} ranks`}>
                            <ArrowUpRight size={13} />+{delta}
                          </span>
                        )}
                        {delta < 0 && (
                          <span style={{ color: 'var(--danger)', fontWeight: 800, fontSize: '11px', display: 'flex', alignItems: 'center' }} title={`Fell ${Math.abs(delta)} ranks`}>
                            <ArrowDownRight size={13} />{delta}
                          </span>
                        )}
                        {delta === 0 && (
                          <span style={{ color: 'var(--text-light)', fontSize: '11px' }} title="No rank change">
                            <Minus size={12} />
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ color: isYou ? 'var(--primary)' : 'var(--text)', fontWeight: 700 }}>
                          {st.name}
                        </strong>
                        {isYou && (
                          <span className="badge badge-amber font-mono" style={{ fontSize: '10px', padding: '1px 6px', fontWeight: 800 }}>
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-neutral">{st.track}</span>
                    </td>

                    <td className="num-col">{st.resumeScore}%</td>
                    <td className="num-col">{st.mcqScore}%</td>
                    <td className="num-col">{st.interviewScore}%</td>

                    <td className="num-col">
                      <strong style={{ fontSize: '14.5px', color: st.overallScore >= 75 ? 'var(--success)' : st.overallScore >= 60 ? 'var(--primary)' : 'var(--danger)' }}>
                        {st.overallScore}%
                      </strong>
                    </td>

                    <td className="center-col">
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 700,
                          color: delta > 0 ? 'var(--success)' : delta < 0 ? 'var(--danger)' : 'var(--text-muted)',
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
                      <span className={`badge ${st.status.includes('Offered') ? 'badge-green' : st.status.includes('Shortlisted') ? 'badge-blue' : st.status.includes('Diagnostic') ? 'badge-amber' : 'badge-neutral'}`}>
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
