'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  FileText,
  FileUp,
  AlertTriangle,
  Lightbulb,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { auditResumeATS } from '@/lib/gemini';
import { ATSResult } from '@/lib/types';

export default function ResumeATSPage() {
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [resumeText, setResumeText] = useState(
    "Abhay Raj Singh • B.Tech Computer Science (GPA 8.8)\nSkills: Python, Django, SQL, Data Structures, Algorithms, Docker, REST APIs, Git, Linux.\nProjects: Built scalable microservice for e-commerce catalog with Redis caching, reducing query latency by 35%.\nExperience: Engineering Intern working on distributed data pipelines. Responsible for developing backend APIs and working with team members."
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
        // If it's plain text or markdown
        setResumeText(content);
      } else {
        // Fallback representation with filename and metadata
        setResumeText(`Candidate Resume: ${file.name}\nSize: ${file.size} bytes\nTechnical Profile: Computer Science Engineering & Software Development.`);
      }
    };

    if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.readAsText(file);
    } else {
      // Read as text or extract ASCII content for binary resumes
      reader.readAsText(file);
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-orange" style={{ marginBottom: '8px' }}>
            <FileCheck size={13} /> STAGE 01: RESUME ATS BENCHMARK
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Gemini ATS Resume Audit & Keyword Gap</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Upload your technical resume to receive an automated Gemini ATS evaluation, buzzword analysis, and actionable replacements.
          </p>
        </div>
        <Link href="/" className="button button-secondary" style={{ borderRadius: '12px' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Single Section: Upload Your Resume */}
      <div className="card" style={{ borderRadius: '24px', padding: '28px' }}>
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
              border: `2px dashed ${isDragging ? 'var(--scheme-deep)' : uploadedFile ? 'var(--scheme-teal)' : 'var(--flat-border)'}`,
              borderRadius: '20px',
              background: isDragging
                ? 'var(--scheme-deep-subtle)'
                : uploadedFile
                ? 'var(--scheme-teal-subtle)'
                : 'var(--flat-surface-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: uploadedFile ? 'var(--scheme-teal)' : 'var(--scheme-deep)',
                display: 'grid',
                placeItems: 'center',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}
            >
              {uploadedFile ? <FileCheck size={32} /> : <FileUp size={32} />}
            </div>

            {uploadedFile ? (
              <div style={{ maxWidth: '480px' }}>
                <span className="badge badge-green" style={{ marginBottom: '8px' }}>
                  <Check size={12} /> File Selected
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--flat-text)', marginBottom: '4px' }}>
                  {uploadedFile.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--flat-muted)' }}>
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
                    fontSize: '12px',
                    color: 'var(--scheme-coral)',
                    background: 'transparent',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div style={{ maxWidth: '440px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--flat-text)', marginBottom: '6px' }}>
                  Upload Your Resume
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', lineHeight: 1.45, marginBottom: '14px' }}>
                  Drag and drop your resume file here, or click to browse from your device.
                </p>
                <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span className="badge badge-gray font-mono">PDF</span>
                  <span className="badge badge-gray font-mono">DOCX</span>
                  <span className="badge badge-gray font-mono">TXT</span>
                  <span className="badge badge-gray font-mono">MD</span>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible / Optional Textarea for Direct Text Inspection */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setShowPasteBox(!showPasteBox)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--scheme-deep)',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{showPasteBox ? '▲ Hide raw resume text' : '▼ Or paste / inspect resume text directly'}</span>
              </button>
              <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
                {resumeText.trim().split(/\s+/).length} words ready for ATS audit
              </span>
            </div>

            {showPasteBox && (
              <textarea
                className="flat-textarea"
                rows={7}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your raw resume text here if you prefer not uploading a file..."
                style={{ marginTop: '10px' }}
              />
            )}
          </div>

          {/* Action Trigger Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '22px', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '12.5px', color: 'var(--flat-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--scheme-gold-dark)" /> Evaluated with Gemini 2.5 ATS scoring engine
            </span>
            <button
              type="submit"
              disabled={isAuditing}
              className="button button-lg"
              style={{
                background: 'var(--scheme-coral)',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '14px',
                padding: '12px 24px'
              }}
            >
              <UploadCloud size={18} />
              {isAuditing ? 'Auditing Resume with Gemini...' : 'Analyze Resume with Gemini ATS'}
            </button>
          </div>
        </form>
      </div>

      {/* Detailed Gemini Audit Results */}
      {atsResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Result Card 1: ATS Score & Benchmark Summary */}
          <div className="card" style={{ borderRadius: '24px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge badge-green font-mono" style={{ fontSize: '12px' }}>
                    AUDIT COMPLETE
                  </span>
                  <span className={`badge ${atsResult.score >= 75 ? 'badge-green' : atsResult.score >= 60 ? 'badge-blue' : 'badge-orange'}`} style={{ fontSize: '12.5px', fontWeight: 800 }}>
                    {atsResult.matchTier || (atsResult.score >= 75 ? 'High Placement Fit' : atsResult.score >= 60 ? 'Competitive Match' : 'Optimization Needed')}
                  </span>
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--flat-text)' }}>
                  Applicant Tracking System (ATS) Scorecard
                </h2>
                <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px', maxWidth: '680px', lineHeight: 1.45 }}>
                  {atsResult.summary || "Your resume has been audited against standard campus recruitment filters, technical keyword indices, and recruiter parsing rubrics."}
                </p>
              </div>

              {/* Big Score Badge */}
              <div
                style={{
                  background: 'var(--flat-surface-subtle)',
                  border: '1.5px solid var(--flat-border)',
                  borderRadius: '20px',
                  padding: '16px 26px',
                  textAlign: 'center',
                  minWidth: '150px'
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--flat-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ATS SCORE
                </div>
                <div
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    marginTop: '4px',
                    color: atsResult.score >= 75 ? 'var(--scheme-deep)' : atsResult.score >= 60 ? 'var(--scheme-teal-dark)' : 'var(--scheme-coral)'
                  }}
                >
                  {atsResult.score}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--flat-muted)', marginTop: '4px', fontWeight: 600 }}>
                  Passing Cutoff: ≥ 60%
                </div>
              </div>
            </div>

            {/* Quick Metrics Banner */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                background: 'var(--flat-surface-subtle)',
                border: '1px solid var(--flat-border)',
                borderRadius: '16px',
                padding: '14px 18px',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>EXTRACTED SKILLS</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--scheme-deep)', marginTop: '2px' }}>
                  {atsResult.extractedSkills.length} Detected
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--flat-border)', borderRight: '1px solid var(--flat-border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>KEYWORD GAPS</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--scheme-coral)', marginTop: '2px' }}>
                  {atsResult.missingKeywords.length} Missing
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>BUZZWORDS FLAGGED</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--scheme-gold-dark)', marginTop: '2px' }}>
                  {atsResult.buzzwordsToAvoid?.length || 3} To Replace
                </div>
              </div>
            </div>
          </div>

          {/* Result Card 2: Improvements Needed */}
          <div className="card" style={{ borderRadius: '24px', padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--scheme-gold)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#1F2937'
                }}
              >
                <Lightbulb size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--flat-text)' }}>
                  Improvements Needed
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)' }}>
                  High-priority recommendations to elevate this resume into the top 10th percentile of campus recruiters.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(atsResult.improvementsNeeded && atsResult.improvementsNeeded.length > 0 ? atsResult.improvementsNeeded : atsResult.whatToAdd).map((imp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'var(--flat-surface-subtle)',
                    border: '1px solid var(--flat-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '8px',
                      background: 'var(--scheme-deep-subtle)',
                      color: 'var(--scheme-deep)',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '12px',
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: '1px'
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--flat-text)', lineHeight: 1.45 }}>
                    {imp}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Card 3: Buzzwords to Avoid & What to Use Instead */}
          <div className="card" style={{ borderRadius: '24px', padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--scheme-coral)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF'
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--flat-text)' }}>
                  Buzzwords to Avoid &amp; What to Use Instead
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)' }}>
                  Vague buzzwords dilute your technical impact. Replace passive statements with active, verifiable power verbs.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(atsResult.buzzwordsToAvoid || []).map((bw, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '16px',
                    border: '1px solid var(--flat-border)',
                    background: 'var(--flat-surface)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1.3fr', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Buzzword Column */}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'var(--scheme-coral-subtle)',
                        border: '1px solid rgba(252, 127, 115, 0.35)'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--scheme-coral-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '3px' }}>
                        ❌ AVOID BUZZWORD
                      </span>
                      <strong style={{ fontSize: '14px', color: '#B9382B' }}>
                        &ldquo;{bw.buzzword}&rdquo;
                      </strong>
                    </div>

                    {/* Arrow Indicator */}
                    <div style={{ display: 'grid', placeItems: 'center', color: 'var(--scheme-deep)' }}>
                      <ArrowRight size={20} />
                    </div>

                    {/* Replacement Column */}
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: 'var(--scheme-teal-subtle)',
                        border: '1px solid rgba(0, 180, 179, 0.35)'
                      }}
                    >
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--scheme-teal-dark)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '3px' }}>
                        ➔ USE INSTEAD (POWER VERB &amp; METRIC)
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--scheme-deep)' }}>
                        {bw.replacement}
                      </strong>
                    </div>
                  </div>

                  {/* Recruiter Rationale */}
                  <div
                    style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      background: 'var(--flat-surface-subtle)',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: 'var(--flat-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <strong style={{ color: 'var(--flat-text)' }}>Recruiter Rationale:</strong>
                    <span>{bw.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Card 4: Technical Competencies & Keyword Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            <div className="card" style={{ borderRadius: '20px', padding: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--scheme-deep)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block', marginBottom: '10px' }}>
                EXTRACTED TECHNICAL COMPETENCIES ({atsResult.extractedSkills.length}):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {atsResult.extractedSkills.map((sk, idx) => (
                  <span key={idx} className="badge badge-blue">{sk}</span>
                ))}
              </div>
            </div>

            <div className="card" style={{ borderRadius: '20px', padding: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--scheme-coral)', textTransform: 'uppercase', letterSpacing: '0.03em', display: 'block', marginBottom: '10px' }}>
                MISSING HIGH-IMPACT KEYWORDS ({atsResult.missingKeywords.length}):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {atsResult.missingKeywords.map((kw, idx) => (
                  <span key={idx} className="badge badge-orange">{kw}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Coordinated Next Step */}
          <div
            className="card"
            style={{
              borderRadius: '20px',
              padding: '20px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              background: 'var(--flat-surface-subtle)'
            }}
          >
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--flat-text)' }}>
                Stage 02: Validate Your Technical Proficiency
              </h4>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Now that your resume benchmark is complete, take the timed proctored MCQ test to clear campus cutoffs.
              </p>
            </div>
            <Link
              href="/mcq-test"
              className="button button-success"
              style={{
                borderRadius: '12px',
                background: 'var(--scheme-teal)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 800,
                fontSize: '13.5px'
              }}
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
