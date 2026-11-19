'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Medal, Star, ArrowLeft, Building2 } from 'lucide-react';

interface LeaderboardStudent {
  rank: number;
  name: string;
  track: string;
  resume: number;
  mcq: number;
  interview: number;
  overall: number;
  status: string;
}

const mockLeaderboard: LeaderboardStudent[] = [
  { rank: 1, name: "Priya Sharma", track: "Software Engineering", resume: 94, mcq: 90, interview: 92, overall: 92, status: "Offered • Google" },
  { rank: 2, name: "Rohan Verma", track: "Backend & Systems", resume: 88, mcq: 86, interview: 88, overall: 87, status: "Offered • Microsoft" },
  { rank: 3, name: "Sneha Patel", track: "Cloud & DevOps", resume: 86, mcq: 84, interview: 85, overall: 85, status: "Shortlisted • Amazon" },
  { rank: 4, name: "Abhay Raj Singh (You)", track: "Software Engineering", resume: 84, mcq: 73, interview: 65, overall: 72, status: "In Diagnostic Review" },
  { rank: 5, name: "Kunal Deshmukh", track: "Full Stack Platform", resume: 78, mcq: 70, interview: 72, overall: 72, status: "Eligible for Drives" },
  { rank: 6, name: "Ananya Iyer", track: "Backend & Systems", resume: 76, mcq: 72, interview: 68, overall: 71, status: "Eligible for Drives" },
  { rank: 7, name: "Vikram Malhotra", track: "Software Engineering", resume: 72, mcq: 68, interview: 64, overall: 67, status: "Diagnostic Phase" }
];

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all"
    ? mockLeaderboard
    : mockLeaderboard.filter(s => s.track.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-amber" style={{ marginBottom: '8px' }}>
            <Trophy size={13} /> CAMPUS DIAGNOSTIC LEADERBOARD
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Campus Placement Readiness Ranking</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Real-time percentile rankings and proctored diagnostic performance across campus recruitment drives.
          </p>
        </div>
        <Link href="/" className="button button-secondary" style={{ borderRadius: '12px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
          <div className="icon-tile icon-tile-amber" style={{ borderRadius: '16px' }}>
            <Trophy size={24} color="#1F2937" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #1</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{mockLeaderboard[0].name}</div>
            <div style={{ fontSize: '12px', color: 'var(--flat-green-dark)', fontWeight: 700 }}>
              {mockLeaderboard[0].overall}% • {mockLeaderboard[0].status}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
          <div className="icon-tile icon-tile-blue" style={{ borderRadius: '16px' }}>
            <Medal size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #2</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{mockLeaderboard[1].name}</div>
            <div style={{ fontSize: '12px', color: 'var(--flat-blue-dark)', fontWeight: 700 }}>
              {mockLeaderboard[1].overall}% • {mockLeaderboard[1].status}
            </div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '14px', borderRadius: '20px' }}>
          <div className="icon-tile icon-tile-orange" style={{ borderRadius: '16px' }}>
            <Star size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)' }}>RANK #3</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--flat-text)' }}>{mockLeaderboard[2].name}</div>
            <div style={{ fontSize: '12px', color: 'var(--flat-orange-dark)', fontWeight: 700 }}>
              {mockLeaderboard[2].overall}% • {mockLeaderboard[2].status}
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--flat-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setFilter("all")}
              className={`button btn-sm ${filter === "all" ? "" : "button-secondary"}`}
              style={{ borderRadius: '12px' }}
            >
              All Tracks
            </button>
            <button
              onClick={() => setFilter("software")}
              className={`button btn-sm ${filter === "software" ? "" : "button-secondary"}`}
              style={{ borderRadius: '12px' }}
            >
              Software Engineering
            </button>
            <button
              onClick={() => setFilter("backend")}
              className={`button btn-sm ${filter === "backend" ? "" : "button-secondary"}`}
              style={{ borderRadius: '12px' }}
            >
              Backend & Systems
            </button>
          </div>

          <span className="badge badge-gray font-mono">
            Cutoff: 60% Overall
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="flat-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Candidate Name</th>
                <th>Engineering Track</th>
                <th>Resume ATS (25%)</th>
                <th>30 MCQs (35%)</th>
                <th>AI Interview (40%)</th>
                <th>Overall Index</th>
                <th>Recruiter Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(st => {
                const isYou = st.name.includes("You");
                return (
                  <tr key={st.rank} style={{ background: isYou ? 'var(--flat-surface-subtle)' : undefined }}>
                    <td>
                      <span className={`badge ${st.rank <= 3 ? 'badge-amber' : 'badge-gray'}`} style={{ fontWeight: 800 }}>
                        #{st.rank}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: isYou ? 'var(--flat-blue-dark)' : 'var(--flat-text)' }}>
                        {st.name}
                      </strong>
                    </td>
                    <td>
                      <span className="badge badge-gray">{st.track}</span>
                    </td>
                    <td>{st.resume}%</td>
                    <td>{st.mcq}%</td>
                    <td>{st.interview}%</td>
                    <td>
                      <strong style={{ fontSize: '15px', color: st.overall >= 75 ? 'var(--flat-green-dark)' : 'var(--flat-blue-dark)' }}>
                        {st.overall}%
                      </strong>
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
