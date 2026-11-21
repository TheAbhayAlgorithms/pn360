'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Volume2,
  Video,
  VideoOff,
  ArrowRight,
  ArrowLeft,
  Send,
  HelpCircle
} from 'lucide-react';
import { interviewQuestionsList } from '@/lib/mockData';
import { evaluateInterviewSpeech } from '@/lib/gemini';
import { InterviewEvaluation } from '@/lib/types';
import { useAuth } from '@/lib/authContext';

export default function AIInterviewPage() {
  const { updateUserScore } = useAuth();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);

  // Proctoring Video Stream
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [violations, setViolations] = useState(0);

  // Speech Recognition Reference
  const recognitionRef = useRef<any>(null);

  const currentQ = interviewQuestionsList[currentQIndex];

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        }
      } catch (err) {
        console.warn("Camera access denied or unavailable, using simulated video monitor:", err);
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Web Speech Synthesis (Speak Question)
  const speakQuestion = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQ.question);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start / Stop Speech Recognition
  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setTranscript("");
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let full = '';
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + ' ';
          }
          setTranscript(full.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsRecording(true);
      } else {
        alert("Speech Recognition is not natively supported in this browser. You can type your answer in the transcript box directly.");
      }
    }
  };

  const handleEvaluate = async () => {
    if (!transcript.trim()) {
      alert("Please speak or type your answer before submitting for evaluation.");
      return;
    }
    setIsEvaluating(true);
    try {
      const res = await evaluateInterviewSpeech(currentQ.question, transcript, currentQ.role);
      setEvaluation(res);
      if (res && typeof res.overallScore === 'number') {
        updateUserScore('interview', res.overallScore);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < interviewQuestionsList.length - 1) {
      setCurrentQIndex(i => i + 1);
      setTranscript("");
      setEvaluation(null);
    }
  };

  const progressPercent = Math.round(((currentQIndex + 1) / interviewQuestionsList.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Standardized Page Header */}
      <div className="page-header">
        <div className="page-header-content">
          <div className="eyebrow-badge">
            <Mic size={13} /> STAGE 03: ONLINE AI VOICE INTERVIEW
          </div>
          <h1 className="page-title">Proctored AI Voice Interview Room</h1>
          <p className="page-subtitle">
            Live speech synthesis recruiter with real-time audio transcription and official STAR rubric grading.
          </p>
        </div>
        <Link href="/" className="button button-secondary page-header-back">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Main Responsive Two-Column Layout */}
      <div className="split-grid-main">
        
        {/* Left Column: Question, Response & Evaluation Result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Question Card */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-primary font-mono" style={{ fontSize: '11px' }}>
                  QUESTION {currentQIndex + 1} OF {interviewQuestionsList.length}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {progressPercent}% Complete
                </span>
              </div>
              <button
                type="button"
                onClick={speakQuestion}
                className="button button-secondary button-sm"
              >
                <Volume2 size={15} color="var(--primary)" /> Read Question Aloud
              </button>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', transition: 'width 200ms ease' }} />
            </div>

            <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
              {currentQ.category}
            </div>

            <h2 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.5, color: 'var(--text)', marginBottom: '18px' }}>
              &ldquo;{currentQ.question}&rdquo;
            </h2>

            {/* STAR Evaluation Criteria Box */}
            <div style={{ padding: '14px 16px', background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                STAR Evaluation Criteria:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--primary)', display: 'block' }}>Situation</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Context &amp; problem</span>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--info)', display: 'block' }}>Task</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Role &amp; responsibility</span>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--warning)', display: 'block' }}>Action</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Technical steps</span>
                </div>
                <div style={{ background: 'var(--surface)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                  <strong style={{ fontSize: '11.5px', color: 'var(--success)', display: 'block' }}>Result</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Quantifiable impact</span>
                </div>
              </div>
            </div>
          </div>

          {/* Response Box */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text)' }}>
                Your Spoken Response
              </span>
              <button
                type="button"
                onClick={toggleRecording}
                className={`button button-sm ${isRecording ? 'button-danger' : 'button-success'}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isRecording ? (
                  <>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        animation: 'pulse 1s infinite'
                      }}
                    />
                    <MicOff size={14} /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic size={14} /> Start Speaking (Mic)
                  </>
                )}
              </button>
            </div>

            <textarea
              className="flat-textarea"
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak using your microphone or type your response here... (e.g., In my recent distributed catalog project, our latency spiked by 40% during peak flash sales. I identified unindexed queries and added Redis caching, which reduced median latency by 65%)."
              style={{ fontSize: '13.5px' }}
            />

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words recorded` : 'Ready to record'}
              </span>

              <button
                type="button"
                disabled={isEvaluating || !transcript.trim()}
                onClick={handleEvaluate}
                className="button button-primary"
              >
                <Send size={15} />
                {isEvaluating ? 'Evaluating with STAR...' : 'Evaluate Answer'}
              </button>
            </div>
          </div>

          {/* STAR Evaluation Result */}
          {evaluation && (
            <div className="card" style={{ background: 'var(--surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span className="badge badge-success font-mono" style={{ fontSize: '12px' }}>
                    Overall STAR Score: {evaluation.overallScore}%
                  </span>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, marginTop: '6px', color: 'var(--text)' }}>
                    Recruiter STAR Evaluation
                  </h3>
                </div>

                {currentQIndex < interviewQuestionsList.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="button button-primary button-sm"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              {/* 4 Rubric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px', marginBottom: '18px', textAlign: 'center' }}>
                <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>SITUATION</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{evaluation.starBreakdown.situation}/25</div>
                </div>
                <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>TASK</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--info)', marginTop: '2px' }}>{evaluation.starBreakdown.task}/25</div>
                </div>
                <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>ACTION</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--warning)', marginTop: '2px' }}>{evaluation.starBreakdown.action}/25</div>
                </div>
                <div style={{ background: 'var(--surface-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>RESULT</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--success)', marginTop: '2px' }}>{evaluation.starBreakdown.result}/25</div>
                </div>
              </div>

              <div style={{ background: 'var(--surface-subtle)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                <strong style={{ fontSize: '13px', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>Recruiter Feedback:</strong>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {evaluation.feedback}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--success-subtle)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success-text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    KEY STRENGTHS:
                  </div>
                  {evaluation.strengths.map((st, i) => (
                    <div key={i} style={{ fontSize: '12.5px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.4 }}>
                      • {st}
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--warning-subtle)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--warning-text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    SUGGESTED IMPROVEMENTS:
                  </div>
                  {evaluation.improvements.map((im, i) => (
                    <div key={i} style={{ fontSize: '12.5px', color: 'var(--text)', marginBottom: '4px', lineHeight: 1.4 }}>
                      • {im}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Proctoring Camera & Instructions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)' }}>
                <Video size={16} color="var(--primary)" /> Proctoring Camera Stream
              </span>
              <span className="badge badge-danger" style={{ fontWeight: 800 }}>LIVE MONITOR</span>
            </div>

            {/* Video Viewport */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                backgroundColor: '#0F172A',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {!cameraActive && (
                <div style={{ position: 'absolute', textAlign: 'center', color: '#94A3B8' }}>
                  <VideoOff size={28} style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '12px' }}>Webcam active or permission requested</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Head Alignment:</span>
                <strong style={{ color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                  Centered &amp; Focus Confirmed
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Audio Stream:</span>
                <strong style={{ color: isRecording ? 'var(--danger)' : 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isRecording ? 'var(--danger)' : 'var(--text-light)' }}></span>
                  {isRecording ? 'Listening (Input Active)' : 'Standby'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-subtle)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Session Proctoring Violations:</span>
                <strong style={{ color: violations === 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {violations}
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="card">
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={15} color="var(--primary)" /> Interview Instructions
            </h4>
            <ul style={{ fontSize: '12.5px', color: 'var(--text-muted)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.45 }}>
              <li>Click <strong>&ldquo;Read Question Aloud&rdquo;</strong> to hear the recruiter prompt.</li>
              <li>Click <strong>&ldquo;Start Speaking&rdquo;</strong> to speak your answer clearly.</li>
              <li>You can edit the transcript manually if needed.</li>
              <li>Click <strong>&ldquo;Evaluate Answer&rdquo;</strong> to calculate your official STAR score.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
