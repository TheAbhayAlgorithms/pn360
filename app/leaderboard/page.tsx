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
  CheckCircle2,
  LogIn,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { UserAccount, GrowthPoint } from '@/lib/types';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-amber" style={{ marginBottom: '8px' }}>
            <Trophy size={13} /> CAMPUS DIAGNOSTIC LEADERBOARD
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Campus Placement Readiness Ranking</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Real-time percentile rankings, recruiter status, and authenticated private growth trajectories.
          </p>
        </div>
        <Link href="/" className="button button-secondary" style={{ borderRadius: '12px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Authenticated User Live Rank Movement Spotlight */}
      {currentUser ? (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  background: 'var(--scheme-deep)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 900,
                  fontSize: '20px'
                }}
              >
                #{currentUser.rank}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--flat-text)', margin: 0 }}>
                    {currentUser.name} (You)
                  </h2>
                  <span className="badge badge-blue font-mono" style={{ fontSize: '11px', fontWeight: 700 }}>
                    {currentUser.track}
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
                      background: userRankDelta > 0 ? 'var(--scheme-teal-subtle)' : userRankDelta < 0 ? 'var(--scheme-coral-subtle)' : 'var(--flat-surface-subtle)',
                      color: userRankDelta > 0 ? 'var(--scheme-deep)' : userRankDelta < 0 ? 'var(--scheme-coral-dark)' : 'var(--flat-muted)'
                    }}
                  >
                    {userRankDelta > 0 ? (
                      <>
                        <ArrowUpRight size={14} /> Climbed +{userRankDelta} Ranks Up!
                      </>
                    ) : userRankDelta < 0 ? (
                      <>
                        <ArrowDownRight size={14} /> Dropped {Math.abs(userRankDelta)} Ranks
                      </>
                    ) : (
                      <>
                        <Minus size={14} /> Position Steady
                      </>
                    )}
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '3px' }}>
                  Logged in as <strong>{currentUser.username}</strong> • Moved from Rank #{currentUser.previousRank} to <strong>Rank #{currentUser.rank}</strong> in this cycle.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-green" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} /> Private Diagnostic Isolated
              </span>
              <Link href="/login" className="button button-sm button-secondary" style={{ borderRadius: '12px' }}>
                Switch Account
              </Link>
            </div>
          </div>

          {/* User Position Breakdown Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>YOUR COHORT RANK</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '2px' }}>
                #{currentUser.rank} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--flat-muted)' }}>/ {allUsers.length} active</span>
              </div>
            </div>

            <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>OVERALL READINESS</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-teal-dark)', marginTop: '2px' }}>
                {currentUser.overallScore}% Index
              </div>
            </div>

            <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>BENCHMARK CLEARANCE</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: currentUser.overallScore >= 60 ? 'var(--scheme-deep)' : 'var(--scheme-coral)', marginTop: '2px' }}>
                {currentUser.overallScore >= 60 ? 'Cutoff Cleared' : 'Needs Review'}
              </div>
            </div>

            <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>RECRUITER STATUS</div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '5px' }}>
                {currentUser.status}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Logged Out / Anonymous Guard Banner */
        <div
          className="card"
          style={{
            borderRadius: '24px',
            padding: '24px',
            border: '2px dashed var(--flat-border)',
            background: 'var(--flat-surface-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'var(--scheme-coral-subtle)',
                color: 'var(--scheme-coral-dark)',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <Lock size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--flat-text)', margin: 0 }}>
                Sign In to View Your Personal Diagnostic Growth Chart
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '3px' }}>
                Each candidate&apos;s growth trajectory, weekly/monthly scores, and diagnostic records are strictly isolated and private.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link href="/login" className="button button-sm button-primary" style={{ borderRadius: '12px' }}>
              <LogIn size={15} /> Sign In
            </Link>
            <Link href="/login" className="button button-sm button-secondary" style={{ borderRadius: '12px' }}>
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      <div className="grid-3">
        {rank1 && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
            <div className="icon-tile" style={{ borderRadius: '16px', background: 'var(--scheme-gold)', color: '#1F2937' }}>
              <Trophy size={24} color="#1F2937" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #1</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{rank1.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--scheme-deep)', fontWeight: 800 }}>
                {rank1.overallScore}% • {rank1.status}
              </div>
            </div>
          </div>
        )}

        {rank2 && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
            <div className="icon-tile" style={{ borderRadius: '16px', background: 'var(--scheme-teal)', color: '#FFFFFF' }}>
              <Medal size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #2</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{rank2.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--scheme-teal-dark)', fontWeight: 800 }}>
                {rank2.overallScore}% • {rank2.status}
              </div>
            </div>
          </div>
        )}

        {rank3 && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
            <div className="icon-tile" style={{ borderRadius: '16px', background: 'var(--scheme-coral)', color: '#FFFFFF' }}>
              <Star size={24} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #3</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{rank3.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--scheme-coral-dark)', fontWeight: 800 }}>
                {rank3.overallScore}% • {rank3.status}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Private Growth & Fall Trajectory Section (Isolated Strictly to Current User) */}
      {currentUser ? (
        <div className="card" style={{ borderRadius: '24px', padding: '26px' }}>
          
          {/* Trajectory Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-green" style={{ fontSize: '11px' }}>
                  <LineChart size={12} /> PRIVATE DIAGNOSTIC TRAJECTORY
                </span>
                <span style={{ fontSize: '12px', color: 'var(--scheme-deep)', fontWeight: 700 }}>
                  🔒 Scoped to your account only ({currentUser.username})
                </span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--flat-text)' }}>
                {currentUser.name}&apos;s Growth &amp; Fall Analytics
              </h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Engineering Track: <strong>{currentUser.track}</strong> • Current Standing: <strong>Rank #{currentUser.rank}</strong> (Previous: #{currentUser.previousRank})
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
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>BASELINE VS LATEST</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--flat-text)', marginTop: '3px' }}>
                {firstPoint.overall}% → <span style={{ color: 'var(--scheme-deep)' }}>{lastPoint.overall}%</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--flat-muted)', marginTop: '1px' }}>
                {firstPoint.label} to {lastPoint.label}
              </div>
            </div>

            <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>LATEST MCQ ACCURACY</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '3px' }}>
                {lastPoint.mcq}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--scheme-teal-dark)', fontWeight: 700, marginTop: '1px' }}>
                {lastPoint.mcq >= 60 ? 'Above Cutoff' : 'Under 60% Target'}
              </div>
            </div>

            <div style={{ background: 'var(--flat-surface-subtle)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--flat-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>AI INTERVIEW SCORE</div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: 'var(--scheme-coral)', marginTop: '3px' }}>
                {lastPoint.interview}%
              </div>
              <div style={{ fontSize: '11px', color: 'var(--flat-muted)', marginTop: '1px' }}>
                STAR rubric evaluated
              </div>
            </div>
          </div>

          {/* Pure Flat SVG Multi-Line Chart Canvas */}
          <div
            style={{
              background: 'var(--flat-surface-subtle)',
              border: '1px solid var(--flat-border)',
              borderRadius: '16px',
              padding: '16px',
              overflowX: 'auto'
            }}
          >
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              {/* Horizontal Reference Grid Lines (0%, 25%, 50%, 60% Benchmark, 75%, 100%) */}
              {[25, 50, 75, 100].map(val => (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={getY(val)}
                    x2={svgWidth - paddingRight}
                    y2={getY(val)}
                    stroke="var(--flat-border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={getY(val) + 4}
                    textAnchor="end"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--flat-muted)"
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
                stroke="var(--scheme-ice)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={svgWidth - paddingRight}
                y={cutoffY - 5}
                textAnchor="end"
                fontSize="10"
                fontWeight="700"
                fill="var(--scheme-deep)"
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
              {userPoints.map((p, idx) => {
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
      ) : null}

      {/* Cohort Placement Ranking Table */}
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
            <span style={{ fontSize: '12px', color: 'var(--flat-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Lock size={13} /> Diagnostic charts are private to each user
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
              {filteredCohort.map(st => {
                const isYou = currentUser && (st.id === currentUser.id || st.username === currentUser.username);
                const delta = st.previousRank - st.rank;

                return (
                  <tr
                    key={st.id}
                    style={{
                      background: isYou ? 'var(--scheme-deep-subtle)' : undefined,
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
                        {isYou && (
                          <span className="badge badge-amber font-mono" style={{ fontSize: '10px', padding: '1px 6px', fontWeight: 800 }}>
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-gray">{st.track}</span>
                    </td>

                    <td>{st.resumeScore}%</td>
                    <td>{st.mcqScore}%</td>
                    <td>{st.interviewScore}%</td>

                    <td>
                      <strong style={{ fontSize: '15px', color: st.overallScore >= 75 ? 'var(--scheme-teal-dark)' : 'var(--scheme-deep)' }}>
                        {st.overallScore}%
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