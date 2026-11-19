'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Briefcase,
  FileText
} from 'lucide-react';
import { defaultJobs } from '@/lib/mockData';
import { auditResumeATS } from '@/lib/gemini';
import { ATSResult } from '@/lib/types';

export default function ResumeATSPage() {
  const [selectedRole, setSelectedRole] = useState("Software Development Engineer");
  const [resumeText, setResumeText] = useState(
    "Abhay Raj Singh • B.Tech Computer Science (GPA 8.8)\nSkills: Python, Django, SQL, Data Structures, Algorithms, Docker, REST APIs, Git, Linux.\nProjects: Built scalable microservice for e-commerce catalog with Redis caching, reducing query latency by 35%.\nExperience: Engineering Intern working on distributed data pipelines."
  );
  const [isAuditing, setIsAuditing] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);

  const handleBenchmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setIsAuditing(true);
    try {
      const result = await auditResumeATS(resumeText, selectedRole);
      setAtsResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setResumeText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-orange" style={{ marginBottom: '8px' }}>
            <FileCheck size={13} /> STAGE 01: RESUME ATS BENCHMARK
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Gemini ATS Resume Audit & Keyword Gap</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Evaluate your technical resume against live tech company specifications to maximize ATS scanner pass rates.
          </p>
        </div>
        <Link href="/" className="button button-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleBenchmark}>
          <div className="form-group">
            <label className="form-label">Target Recruiter Role Specification</label>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Resume Document Content / Portfolio</label>
              <label style={{ fontSize: '12px', color: 'var(--scheme-deep)', cursor: 'pointer', fontWeight: 700 }}>
                Upload (.txt, .md)
                <input
                  type="file"
                  accept=".txt,.md,.doc"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <textarea
              className="flat-textarea"
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume content, experience, skills, and projects here..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--flat-muted)' }}>
              Evaluated in-memory using Gemini 2.5 ATS scoring engine
            </span>
            <button
              type="submit"
              disabled={isAuditing}
              className="button button-lg"
              style={{ background: 'var(--scheme-coral)' }}
            >
              <UploadCloud size={18} />
              {isAuditing ? 'Auditing Resume...' : 'Benchmark Resume with Gemini ATS'}
            </button>
          </div>
        </form>

        {/* Audit Results */}
        {atsResult && (
          <div style={{ marginTop: '24px', padding: '20px', background: 'var(--flat-surface-subtle)', border: '1px solid var(--flat-border)', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="badge badge-green" style={{ fontSize: '12px' }}>
                  AUDIT COMPLETE
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 900, marginTop: '6px' }}>
                  ATS Score: {atsResult.score}% Fit for {atsResult.role}
                </h2>
              </div>
              <span className={`badge ${atsResult.score >= 75 ? 'badge-green' : atsResult.score >= 60 ? 'badge-blue' : 'badge-orange'}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                {atsResult.score >= 75 ? 'High Interview Probability' : atsResult.score >= 60 ? 'Moderate ATS Fit' : 'Optimization Required'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', display: 'block', marginBottom: '8px' }}>
                  EXTRACTED TECHNICAL COMPETENCIES:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {atsResult.extractedSkills.map((sk, idx) => (
                    <span key={idx} className="badge badge-blue">{sk}</span>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', display: 'block', marginBottom: '8px' }}>
                  MISSING HIGH-IMPACT KEYWORDS:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {atsResult.missingKeywords.map((kw, idx) => (
                    <span key={idx} className="badge badge-orange">{kw}</span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'var(--scheme-teal-subtle)', border: '1px solid rgba(0, 180, 179, 0.4)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--scheme-deep)', marginBottom: '6px' }}>
                  IDENTIFIED RESUME STRENGTHS:
                </div>
                {atsResult.strengths.map((str, i) => (
                  <div key={i} style={{ fontSize: '12.5px', color: '#0E2A30', marginBottom: '4px' }}>
                    • {str}
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--scheme-gold-subtle)', border: '1px solid rgba(254, 205, 0, 0.5)', borderRadius: '14px', padding: '14px' }}>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#7A6000', marginBottom: '6px' }}>
                  RECOMMENDED ADDITIONS:
                </div>
                {atsResult.whatToAdd.map((add, i) => (
                  <div key={i} style={{ fontSize: '12.5px', color: '#3A2E00', marginBottom: '4px' }}>
                    • {add}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
