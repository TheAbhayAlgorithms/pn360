'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileCheck,
  ArrowLeft,
  Sparkles,
  FileUp,
  AlertTriangle,
  Lightbulb,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { auditResumeATS } from '@/lib/gemini';
import { ATSResult } from '@/lib/types';
import { useAuth } from '@/lib/authContext';

export default function ResumeATSPage() {
  const { currentUser, updateUserScore } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [resumeText, setResumeText] = useState(
    currentUser
      ? `${currentUser.name} • B.Tech Computer Science (GPA 8.8)\nSkills: Python, Django, SQL, Data Structures, Algorithms, Docker, REST APIs, Git, Linux.\nProjects: Built scalable microservice for e-commerce catalog with Redis caching, reducing query latency by 35%.\nExperience: Engineering Intern working on distributed data pipelines. Responsible for developing backend APIs and working with team members.`
      : "Abhay Raj Singh • B.Tech Computer Science (GPA 8.8)\nSkills: Python, Django, SQL, Data Structures, Algorithms, Docker, REST APIs, Git, Linux.\nProjects: Built scalable microservice for e-commerce catalog with Redis caching, reducing query latency by 35%.\nExperience: Engineering Intern working on distributed data pipelines. Responsible for developing backend APIs and working with team members."
  );
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = (file: File) => {
    const sizeKB = Math.round(file.size / 1024);
    setUploadedFile({
      name: file.name,
      size: `${sizeKB > 1024 ? (sizeKB / 1024).toFixed(1) + ' MB' : sizeKB + ' KB'}`
    });

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.trim()) {
        setResumeText(content);
      } else {
        setResumeText(`Candidate Resume: ${file.name}\nSize: ${file.size} bytes\nTechnical Profile: Computer Science Engineering & Software Development.`);
      }
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleBenchmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;
    setIsAuditing(true);
    try {
      const result = await auditResumeATS(resumeText, "Software Development Engineer");
      setAtsResult(result);
      if (result && typeof result.score === 'number') {
        updateUserScore('resume', result.score);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleResetUpload = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Standardized Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="eyebrow-badge">
            <FileCheck size={13} /> STAGE 01: RESUME ATS BENCHMARK
          </div>
          <h1 className="page-title">Gemini ATS Resume Audit &amp; Keyword Gap</h1>
          <p className="page-subtitle">
            Upload your technical resume to receive an automated Gemini ATS evaluation, buzzword analysis, and actionable replacements.
          </p>
        </div>
        <Link href="/" className="button button-secondary page-header-back">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Upload Your Resume Card */}
      <div className="card">
        <form onSubmit={handleBenchmark}>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {/* Drag & Drop Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              padding: '40px 24px',
              border: `2px dashed ${isDragging ? 'var(--primary)' : uploadedFile ? 'var(--success)' : 'var(--border-hover)'}`,
              borderRadius: 'var(--radius-md)',
              backgroundColor: isDragging
                ? 'var(--primary-subtle)'
                : uploadedFile
                ? 'var(--success-subtle)'
                : 'var(--surface-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'all 180ms ease'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: uploadedFile ? 'var(--success)' : 'var(--primary)',
                display: 'grid',
                placeItems: 'center',
                color: '#FFFFFF',
                marginBottom: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              {uploadedFile ? <FileCheck size={28} /> : <FileUp size={28} />}
            </div>

            {uploadedFile ? (
              <div style={{ maxWidth: '480px' }}>
                <span className="badge badge-success" style={{ marginBottom: '8px' }}>
                  <Check size={12} /> File Selected
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', marginBottom: '4px' }}>
                  {uploadedFile.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {uploadedFile.size} • Ready for Gemini ATS parsing and keyword extraction
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetUpload();
                  }}
                  style={{
                    marginTop: '12px',
                    fontSize: '12.5px',
                    color: 'var(--danger)',
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div style={{ maxWidth: '440px' }}>
                <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>
                  Upload Your Resume
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: '14px' }}>
                  Drag and drop your resume file here, or click to browse from your device.
                </p>
                <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span className="badge badge-neutral font-mono">PDF</span>
                  <span className="badge badge-neutral font-mono">DOCX</span>
                  <span className="badge badge-neutral font-mono">TXT</span>
                  <span className="badge badge-neutral font-mono">MD</span>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Disclosure for Direct Text Inspection */}
          <div style={{ marginTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowPasteBox(!showPasteBox)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0
                }}
              >
                {showPasteBox ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                <span>{showPasteBox ? 'Hide raw resume text' : 'Or paste / inspect resume text directly'}</span>
              </button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {resumeText.trim().split(/\s+/).length} words ready for ATS audit
              </span>
            </div>

            {showPasteBox && (
              <textarea
                className="flat-textarea font-mono"
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here if you prefer not uploading a file..."
                style={{ marginTop: '10px', fontSize: '13px' }}
              />
            )}
          </div>

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '22px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--warning)" /> Evaluated with Gemini 2.5 ATS scoring engine
            </span>
            <button
              type="submit"
              disabled={isAuditing}
              className="button button-lg button-primary"
            >
              <UploadCloud size={17} />
              {isAuditing ? 'Auditing Resume with Gemini...' : 'Analyze Resume with Gemini ATS'}
            </button>
          </div>
        </form>
      </div>

      {/* Detailed Gemini Audit Results */}
      {atsResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Result Card 1: ATS Score & Benchmark Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge badge-success font-mono" style={{ fontSize: '11px' }}>
                    AUDIT COMPLETE
                  </span>
                  <span
                    className={`badge ${atsResult.score >= 75 ? 'badge-success' : atsResult.score >= 60 ? 'badge-primary' : 'badge-danger'}`}
                    style={{ fontSize: '12px', fontWeight: 700 }}
                  >
                    {atsResult.matchTier || (atsResult.score >= 75 ? 'High Placement Fit' : atsResult.score >= 60 ? 'Competitive Match' : 'Optimization Needed')}
                  </span>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)' }}>
                  Applicant Tracking System (ATS) Scorecard
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '680px', lineHeight: 1.5 }}>
                  {atsResult.summary || "Your resume has been audited against standard campus recruitment filters, technical keyword indices, and recruiter parsing rubrics."}
                </p>
              </div>

              {/* Score Display Card */}
              <div
                style={{
                  background: 'var(--surface-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 24px',
                  textAlign: 'center',
                  minWidth: '140px'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ATS SCORE
                </div>
                <div
                  style={{
                    fontSize: '40px',
                    fontWeight: 800,
                    lineHeight: 1.05,
                    marginTop: '4px',
                    color: atsResult.score >= 75 ? 'var(--success)' : atsResult.score >= 60 ? 'var(--primary)' : 'var(--danger)'
                  }}
                >
                  {atsResult.score}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>
                  Passing Cutoff: ≥ 60%
                </div>
              </div>
            </div>

            {/* Quick Metrics Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>EXTRACTED SKILLS</div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>
                  {atsResult.extractedSkills.length} Detected
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>KEYWORD GAPS</div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--danger)', marginTop: '2px' }}>
                  {atsResult.missingKeywords.length} Missing
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>BUZZWORDS FLAGGED</div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: 'var(--warning)', marginTop: '2px' }}>
                  {atsResult.buzzwordsToAvoid?.length || 3} To Replace
                </div>
              </div>
            </div>
          </div>

          {/* Result Card 2: Improvements Needed */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--warning-subtle)',
                  color: 'var(--warning-text)',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <Lightbulb size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  Improvements Needed
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  High-priority recommendations to elevate this resume into the top percentile of campus recruiters.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(atsResult.improvementsNeeded && atsResult.improvementsNeeded.length > 0 ? atsResult.improvementsNeeded : atsResult.whatToAdd).map((imp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text)', lineHeight: 1.5 }}>
                    {imp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Card 3: Buzzwords to Avoid & What to Use Instead */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--danger-subtle)',
                  color: 'var(--danger)',
                  display: 'grid',
                  placeItems: 'center'
                }}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  Buzzwords to Avoid &amp; What to Use Instead
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  Vague buzzwords dilute technical impact. Replace passive statements with active, verifiable power verbs.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(atsResult.buzzwordsToAvoid || []).map((bw, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '12px',
                      alignItems: 'center'
                    }}
                  >
                    {/* Buzzword Column */}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--danger-subtle)',
                        border: '1px solid var(--danger-border)'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--danger-text)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '3px' }}>
                        AVOID BUZZWORD
                      </span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--danger-text)' }}>
                        &ldquo;{bw.buzzword}&rdquo;
                      </strong>
                    </div>

                    {/* Replacement Column */}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--success-subtle)',
                        border: '1px solid var(--success-border)'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--success-text)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '3px' }}>
                        USE INSTEAD (POWER VERB)
                      </span>
                      <strong style={{ fontSize: '13.5px', color: 'var(--success-text)' }}>
                        {bw.replacement}
                      </strong>
                    </div>
                  </div>

                  {/* Recruiter Rationale */}
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      background: 'var(--surface-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <strong style={{ color: 'var(--text)' }}>Recruiter Rationale:</strong>
                    <span>{bw.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Card 4: Technical Competencies & Keyword Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>
                EXTRACTED TECHNICAL COMPETENCIES ({atsResult.extractedSkills.length}):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {atsResult.extractedSkills.map((sk, idx) => (
                  <span key={idx} className="badge badge-primary">{sk}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>
                MISSING HIGH-IMPACT KEYWORDS ({atsResult.missingKeywords.length}):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {atsResult.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="badge badge-danger">{kw}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Coordinated Next Step */}
          <div
            className="card"
            style={{
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              background: 'var(--surface-subtle)'
            }}
          >
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                Stage 02: Validate Your Technical Proficiency
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Now that your resume benchmark is complete, take the timed proctored MCQ test to clear campus cutoffs.
              </p>
            </div>
            <Link
              href="/mcq-test"
              className="button button-primary"
            >
              <span>Proceed to MCQ Test</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      )}

    </div>
  );
}
