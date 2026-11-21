'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  X,
  ListChecks,
  Camera,
  Info
} from 'lucide-react';
import { defaultQuestionsBank } from '@/lib/mockData';
import { MCQQuestion } from '@/lib/types';
import { useAuth } from '@/lib/authContext';

export default function MCQTestPage() {
  const { updateUserScore } = useAuth();
  const [stage, setStage] = useState<'config' | 'test' | 'result'>('config');

  // Configuration State
  const availableTracks = [
    { name: "Data Structures & Algorithms", category: "core", count: 10 },
    { name: "Operating Systems", category: "core", count: 6 },
    { name: "Database & SQL (DBMS)", category: "data", count: 6 },
    { name: "System Design & Architecture", category: "core", count: 4 },
    { name: "Python Core", category: "languages", count: 8 },
    { name: "Java & OOP", category: "languages", count: 6 },
    { name: "C++ & Memory Management", category: "languages", count: 6 },
    { name: "JavaScript & Async", category: "languages", count: 6 }
  ];

  const [selectedTracks, setSelectedTracks] = useState<string[]>([
    "Data Structures & Algorithms",
    "Operating Systems",
    "Database & SQL (DBMS)",
    "Python Core"
  ]);

  // Test State
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [violations, setViolations] = useState(0);
  const [lastWarning, setLastWarning] = useState<string | null>(null);

  // Score State
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Anti-Cheat & Tab Switch Proctoring Detection
  useEffect(() => {
    if (stage !== 'test') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(v => {
          const next = v + 1;
          setLastWarning(`Tab switch / window unfocused detected (Warning ${next}/3)`);
          return next;
        });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [stage]);

  // Timer countdown
  useEffect(() => {
    if (stage !== 'test') return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [stage, questions, userAnswers]);

  const toggleTrack = (trackName: string) => {
    if (selectedTracks.includes(trackName)) {
      if (selectedTracks.length > 1) {
        setSelectedTracks(selectedTracks.filter(t => t !== trackName));
      }
    } else {
      setSelectedTracks([...selectedTracks, trackName]);
    }
  };

  const handleStartTest = () => {
    // Exactly 30 questions
    const shuffled = [...defaultQuestionsBank].sort(() => 0.5 - Math.random()).slice(0, 30);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlagged({});
    setTimeLeft(45 * 60);
    setViolations(0);
    setLastWarning(null);
    setStage('test');
  };

  const handleSelectOption = (optIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [currentIndex]: optIndex
    });
  };

  const handleToggleFlag = () => {
    setFlagged({
      ...flagged,
      [currentIndex]: !flagged[currentIndex]
    });
  };

  const handleSubmitTest = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correct++;
      }
    });
    const finalScore = Math.round((correct / questions.length) * 100);
    setCorrectCount(correct);
    setScore(finalScore);
    updateUserScore('mcq', finalScore);
    setStage('result');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // 1. CONFIGURATION VIEW
  if (stage === 'config') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Standardized Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <div className="eyebrow-badge">
              <ListChecks size={13} /> STAGE 02: TECHNICAL ASSESSMENT
            </div>
            <h1 className="page-title">Configure Your MCQ Placement Test</h1>
            <p className="page-subtitle">
              Select target programming languages and computer science domains to generate your proctored MCQ diagnostic.
            </p>
          </div>
          <Link href="/" className="button button-secondary page-header-back">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                Select Technology &amp; Core CS Tracks
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Toggle tracks to adjust curriculum balance. Standard MCQ questions are rendered for placement benchmark.
              </p>
            </div>
            <span className="badge badge-primary">
              {selectedTracks.length} Tracks Active • MCQ Test
            </span>
          </div>

          {/* 8 Toggle Tiles in a Responsive Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '12px',
              margin: '20px 0'
            }}
          >
            {availableTracks.map(track => {
              const active = selectedTracks.includes(track.name);
              return (
                <div
                  key={track.name}
                  onClick={() => toggleTrack(track.name)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={active}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleTrack(track.name);
                    }
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: active ? 'var(--primary-subtle)' : 'var(--surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: active ? 'var(--shadow-sm)' : 'none',
                    transition: 'border-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>
                      {track.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      Category: <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{track.category}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: 'var(--radius-xs)',
                      border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border-hover)'}`,
                      backgroundColor: active ? 'var(--primary)' : 'transparent',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0,
                      transition: 'all 120ms ease'
                    }}
                  >
                    {active && <Check size={14} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="card-footer"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <Info size={16} color="var(--primary)" />
              <span>Proctored exam standard: 45 minutes • Cutoff: 60%</span>
            </div>

            <button
              type="button"
              onClick={handleStartTest}
              className="button button-lg button-primary"
            >
              <span>Launch MCQ Proctored Test</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE TEST ROOM VIEW
  if (stage === 'test' && questions.length > 0) {
    const currentQ = questions[currentIndex];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Proctoring Header Bar */}
        <div
          className="card"
          style={{
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="badge badge-success">
              <Camera size={13} /> AI Proctoring Active
            </span>
            {violations > 0 && (
              <span className="badge badge-danger">
                <AlertTriangle size={13} /> {violations} Tab Violation{violations > 1 ? 's' : ''}
              </span>
            )}
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '15px',
                color: timeLeft < 300 ? 'var(--danger)' : 'var(--text)'
              }}
            >
              <Clock size={16} />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmitTest}
              className="button button-sm button-danger"
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Warning Toast */}
        {lastWarning && (
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--danger-subtle)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger-text)',
              fontSize: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> {lastWarning}
            </div>
            <button
              onClick={() => setLastWarning(null)}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--danger-text)',
                fontWeight: 700,
                fontSize: '12px'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Question Area & Navigator Grid */}
        <div className="mcq-test-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '20px' }}>
          
          {/* Question Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge badge-primary font-mono" style={{ fontSize: '11px' }}>
                {currentQ.category}
              </span>
              <button
                type="button"
                onClick={handleToggleFlag}
                className="button button-secondary button-sm"
              >
                {flagged[currentIndex] ? '★ Flagged' : '☆ Flag for Review'}
              </button>
            </div>

            <h3 style={{ fontSize: '16.5px', fontWeight: 700, lineHeight: 1.5, marginBottom: '22px', color: 'var(--text)' }}>
              {currentQ.question}
            </h3>

            {/* Option Choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentQ.options.map((opt, optIdx) => {
                const selected = userAnswers[currentIndex] === optIdx;
                const letter = String.fromCharCode(65 + optIdx);
                return (
                  <div
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: selected ? 'var(--primary-subtle)' : 'var(--surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      boxShadow: selected ? 'var(--shadow-xs)' : 'none',
                      transition: 'border-color 150ms ease, background-color 150ms ease'
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: selected ? 'var(--primary)' : 'var(--surface-subtle)',
                        color: selected ? '#FFFFFF' : 'var(--text)',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0
                      }}
                    >
                      {letter}
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--text)' }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => i - 1)}
                className="button button-secondary"
                style={{ visibility: currentIndex === 0 ? 'hidden' : 'visible' }}
              >
                <ArrowLeft size={16} /> Previous
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(i => i + 1)}
                  className="button button-primary"
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="button button-success"
                >
                  <CheckCircle2 size={16} /> Submit Assessment
                </button>
              )}
            </div>
          </div>

          {/* Navigator Sidebar */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--text)' }}>
              Question Palette ({questions.length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {questions.map((_, idx) => {
                const isCur = currentIndex === idx;
                const isAns = userAnswers[idx] !== undefined;
                const isFlg = flagged[idx];

                let bg = 'var(--surface)';
                let color = 'var(--text)';
                let border = '1px solid var(--border)';

                if (isAns) {
                  bg = 'var(--primary)';
                  color = '#FFFFFF';
                  border = '1px solid var(--primary)';
                } else if (isFlg) {
                  bg = 'var(--warning-subtle)';
                  color = 'var(--warning-text)';
                  border = '1px solid var(--warning-border)';
                }

                if (isCur) {
                  border = '2px solid var(--info)';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '34px',
                      borderRadius: 'var(--radius-xs)',
                      background: bg,
                      color: color,
                      border: border,
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center',
                      transition: 'all 120ms ease'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '2px' }}></span>
                <span>Answered ({Object.keys(userAnswers).length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--warning-subtle)', border: '1px solid var(--warning-border)', borderRadius: '2px' }}></span>
                <span>Flagged ({Object.keys(flagged).filter(k => flagged[Number(k)]).length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2px' }}></span>
                <span>Unvisited ({questions.length - Object.keys(userAnswers).length})</span>
              </div>
            </div>
          </div>

        </div>

        <style jsx>{`
          @media (max-width: 900px) {
            .mcq-test-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    );
  }

  // 3. RESULT SCORECARD VIEW
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-neutral font-mono" style={{ marginBottom: '8px' }}>
              DIAGNOSTIC SCORECARD
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Assessment Completed: {score}%
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
              You answered <strong>{correctCount}</strong> out of <strong>{questions.length}</strong> questions correctly.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className={`badge ${score >= 60 ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
              {score >= 60 ? 'PASSED (≥ 60% Cutoff)' : 'CUTOFF MISSED'}
            </span>
            <button
              type="button"
              onClick={handleStartTest}
              className="button button-secondary"
            >
              <RotateCcw size={15} /> Retake Test
            </button>
            <Link href="/ai-interview" className="button button-primary">
              <span>Proceed to AI Interview</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            background: 'var(--surface-subtle)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px',
            margin: '22px 0',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>ACCURACY</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{score}%</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>PROCTORING AUDIT</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: violations === 0 ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
              {violations === 0 ? 'Clean' : `${violations} Warnings`}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>STATUS</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: score >= 60 ? 'var(--success)' : 'var(--danger)', marginTop: '2px' }}>
              {score >= 60 ? 'Qualified' : 'Needs Practice'}
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '24px 0 14px', color: 'var(--text)' }}>
          Answer Review &amp; Technical Explanations
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, idx) => {
            const userChoice = userAnswers[idx];
            const isCorrect = userChoice === q.correct;
            return (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`,
                  backgroundColor: isCorrect ? 'var(--success-subtle)' : 'var(--danger-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text)' }}>
                    Q{idx + 1}. {q.question}
                  </span>
                  <span className={`badge ${isCorrect ? 'badge-green' : 'badge-orange'}`} style={{ flexShrink: 0 }}>
                    {isCorrect ? <Check size={12} /> : <X size={12} />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text)', marginBottom: '8px' }}>
                  Your Answer: <strong>{userChoice !== undefined ? q.options[userChoice] : 'Not Answered'}</strong>
                  {!isCorrect && (
                    <span style={{ marginLeft: '12px', color: 'var(--success-text)', fontWeight: 700 }}>
                      • Correct Answer: <strong>{q.options[q.correct]}</strong>
                    </span>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--surface)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border)'
                  }}
                >
                  <strong>Explanation:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
