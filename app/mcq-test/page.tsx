'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
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
  Layers,
  Sparkles
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

    const handleBlur = () => {
      setViolations(v => {
        const next = v + 1;
        setLastWarning(`Focus lost from assessment window (Warning ${next}/3)`);
        return next;
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
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
  }, [stage]);

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="badge badge-green" style={{ marginBottom: '8px' }}>
              <ListChecks size={13} /> STAGE 02: TECHNICAL ASSESSMENT
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Configure Your MCQ Placement Test</h1>
            <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
              Select target programming languages and computer science domains to generate your proctored MCQ diagnostic.
            </p>
          </div>
          <Link href="/" className="button button-secondary">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Select Technology & Core CS Tracks</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                Toggle tracks to adjust curriculum balance. Standard MCQ questions are rendered for placement benchmark.
              </p>
            </div>
            <span className="badge badge-blue">
              {selectedTracks.length} Tracks Active • MCQ Test
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px', margin: '16px 0' }}>
            {availableTracks.map(track => {
              const active = selectedTracks.includes(track.name);
              return (
                <div
                  key={track.name}
                  onClick={() => toggleTrack(track.name)}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: `2px solid ${active ? 'var(--scheme-deep)' : 'var(--flat-border)'}`,
                    background: active ? 'var(--scheme-deep-subtle)' : 'var(--flat-surface)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'border-color 150ms ease, background-color 150ms ease'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--flat-text)' }}>
                      {track.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--flat-muted)', marginTop: '2px' }}>
                      Category: <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{track.category}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '8px',
                      border: `2px solid ${active ? 'var(--scheme-deep)' : 'var(--flat-muted)'}`,
                      background: active ? 'var(--scheme-deep)' : 'transparent',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#FFFFFF'
                    }}
                  >
                    {active && <Check size={14} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--flat-muted)' }}>
              Proctored exam standard: 45 minutes • Cutoff: 60%
            </span>
            <button
              type="button"
              onClick={handleStartTest}
              className="button button-lg"
              style={{ background: 'var(--scheme-deep)' }}
            >
              <span>Launch MCQ Proctored Test</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE TEST ROOM VIEW
  if (stage === 'test' && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const isAnswered = userAnswers[currentIndex] !== undefined;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Proctoring Header Bar */}
        <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '16px', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-green">
              <Camera size={13} /> AI Proctoring Active
            </span>
            {violations > 0 && (
              <span className="badge badge-orange">
                <AlertTriangle size={13} /> {violations} Tab Violation{violations > 1 ? 's' : ''}
              </span>
            )}
            <span style={{ fontSize: '13px', color: 'var(--flat-muted)' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '16px', color: timeLeft < 300 ? 'var(--flat-orange)' : 'var(--flat-text)' }}>
              <Clock size={18} />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>

            <button
              type="button"
              onClick={handleSubmitTest}
              className="button button-sm button-danger"
              style={{ borderRadius: '12px' }}
            >
              Submit Test
            </button>
          </div>
        </div>

        {/* Warning Toast */}
        {lastWarning && (
          <div style={{ padding: '10px 14px', background: 'var(--scheme-coral-subtle)', border: '1px solid rgba(252, 127, 115, 0.4)', borderRadius: '14px', color: 'var(--scheme-coral-dark)', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} /> {lastWarning}
            </div>
            <button
              onClick={() => setLastWarning(null)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--scheme-coral-dark)', fontWeight: 700 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Question Area & Navigator Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
          
          {/* Question Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge badge-blue">
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

            <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.5, marginBottom: '20px' }}>
              {currentQ.question}
            </h3>

            {/* Flat Option Choices */}
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
                      borderRadius: '14px',
                      border: `2px solid ${selected ? 'var(--scheme-deep)' : 'var(--flat-border)'}`,
                      background: selected ? 'var(--scheme-deep-subtle)' : 'var(--flat-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'border-color 150ms ease, background-color 150ms ease'
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background: selected ? 'var(--scheme-deep)' : 'var(--flat-border)',
                        color: selected ? '#FFFFFF' : 'var(--flat-text)',
                        fontWeight: 700,
                        fontSize: '13px',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0
                      }}
                    >
                      {letter}
                    </div>
                    <span style={{ fontSize: '14px', color: 'var(--flat-text)' }}>
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
                  className="button"
                  style={{ background: 'var(--scheme-deep)' }}
                >
                  <span>Next Question</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  className="button button-success"
                  style={{ background: 'var(--scheme-teal)' }}
                >
                  <CheckCircle2 size={16} /> Submit Assessment
                </button>
              )}
            </div>
          </div>

          {/* Navigator Sidebar */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
              Question Palette ({questions.length})
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
              {questions.map((_, idx) => {
                const isCur = currentIndex === idx;
                const isAns = userAnswers[idx] !== undefined;
                const isFlg = flagged[idx];

                let bg = 'var(--flat-surface)';
                let color = 'var(--flat-text)';
                let border = '1px solid var(--flat-border)';

                if (isAns) {
                  bg = 'var(--scheme-deep)';
                  color = '#FFFFFF';
                  border = '1px solid var(--scheme-deep)';
                } else if (isFlg) {
                  bg = 'var(--scheme-gold)';
                  color = '#1F2937';
                  border = '1px solid var(--scheme-gold)';
                }

                if (isCur) {
                  border = '2px solid var(--scheme-teal)';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      height: '36px',
                      borderRadius: '8px',
                      background: bg,
                      color: color,
                      border: border,
                      fontWeight: 700,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid var(--flat-border)', paddingTop: '12px', fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: 'var(--scheme-deep)', borderRadius: '4px' }}></span>
                <span>Answered ({Object.keys(userAnswers).length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: 'var(--scheme-gold)', borderRadius: '4px' }}></span>
                <span>Flagged ({Object.keys(flagged).filter(k => flagged[Number(k)]).length})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '12px', height: '12px', background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '4px' }}></span>
                <span>Unvisited ({questions.length - Object.keys(userAnswers).length})</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // 3. RESULT SCORECARD VIEW
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge badge-gray font-mono" style={{ marginBottom: '8px' }}>
              DIAGNOSTIC SCORECARD
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 900 }}>
              Assessment Completed: {score}%
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--flat-muted)', marginTop: '4px' }}>
              You answered <strong>{correctCount}</strong> out of <strong>{questions.length}</strong> questions correctly.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className={`badge ${score >= 60 ? 'badge-green' : 'badge-orange'}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
              {score >= 60 ? 'PASSED (≥ 60% Cutoff)' : 'CUTOFF MISSED'}
            </span>
            <button
              type="button"
              onClick={handleStartTest}
              className="button button-secondary"
            >
              <RotateCcw size={16} /> Retake Test
            </button>
            <Link href="/ai-interview" className="button button-success" style={{ background: 'var(--scheme-teal)' }}>
              <span>Proceed to AI Interview</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: 'var(--flat-surface-subtle)', border: '1px solid var(--flat-border)', borderRadius: '16px', padding: '16px', margin: '20px 0', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--flat-muted)', fontWeight: 700 }}>ACCURACY</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--scheme-deep)' }}>{score}%</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--flat-border)', borderRight: '1px solid var(--flat-border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--flat-muted)', fontWeight: 700 }}>PROCTORING AUDIT</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: violations === 0 ? 'var(--scheme-teal-dark)' : 'var(--scheme-coral)' }}>
              {violations === 0 ? 'Clean' : `${violations} Warnings`}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--flat-muted)', fontWeight: 700 }}>STATUS</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: score >= 60 ? 'var(--scheme-teal-dark)' : 'var(--scheme-coral)' }}>
              {score >= 60 ? 'Qualified' : 'Needs Practice'}
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '24px 0 14px' }}>
          Answer Review & Technical Explanations
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {questions.map((q, idx) => {
            const userChoice = userAnswers[idx];
            const isCorrect = userChoice === q.correct;
            return (
              <div
                key={idx}
                style={{
                  padding: '14px 16px',
                  borderRadius: '16px',
                  border: `1px solid ${isCorrect ? 'rgba(0, 180, 179, 0.4)' : 'rgba(252, 127, 115, 0.4)'}`,
                  background: isCorrect ? 'rgba(0, 180, 179, 0.06)' : 'rgba(252, 127, 115, 0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--flat-text)' }}>
                    Q{idx + 1}. {q.question}
                  </span>
                  <span className={`badge ${isCorrect ? 'badge-green' : 'badge-orange'}`}>
                    {isCorrect ? <Check size={12} /> : <X size={12} />}
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--flat-text)', marginBottom: '6px' }}>
                  Your Answer: <strong>{userChoice !== undefined ? q.options[userChoice] : 'Not Answered'}</strong>
                  {!isCorrect && (
                    <span style={{ marginLeft: '12px', color: 'var(--scheme-teal-dark)', fontWeight: 700 }}>
                      • Correct Answer: <strong>{q.options[q.correct]}</strong>
                    </span>
                  )}
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--flat-muted)', background: 'var(--flat-surface)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--flat-border)' }}>
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
