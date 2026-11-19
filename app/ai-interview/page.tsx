'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Volume2,
  Video,
  VideoOff,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  Layers,
  Send
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
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: '8px' }}>
            <Mic size={13} /> STAGE 03: ONLINE AI VOICE INTERVIEW
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Proctored AI Voice Interview Room</h1>
          <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
            Live speech synthesis recruiter with real-time audio transcription and official STAR rubric grading.
          </p>
        </div>
        <Link href="/" className="button button-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      {/* Main Interview Stage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
        
        {/* Left: Recruiter Prompts & Candidate Response */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Question Box */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="badge badge-blue font-mono">
                QUESTION {currentQIndex + 1} OF {interviewQuestionsList.length}
              </span>
              <button
                type="button"
                onClick={speakQuestion}
                className="button button-secondary button-sm"
              >
                <Volume2 size={15} color="var(--scheme-deep)" /> Read Question Aloud
              </button>
            </div>

            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--flat-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              {currentQ.category}
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.5, color: 'var(--flat-text)', marginBottom: '16px' }}>
              &ldquo;{currentQ.question}&rdquo;
            </h2>

            <div style={{ padding: '10px 14px', background: 'var(--flat-surface-subtle)', border: '1px solid var(--flat-border)', borderRadius: '14px', fontSize: '12.5px', color: 'var(--flat-muted)' }}>
              <strong>STAR Evaluation Criteria:</strong> Structure your answer clearly with <em>Situation</em> (context), <em>Task</em> (responsibility), <em>Action</em> (technical decisions executed), and <em>Result</em> (quantifiable outcomes).
            </div>
          </div>

          {/* Response Box */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>
                Your Spoken Response
              </span>
              <button
                type="button"
                onClick={toggleRecording}
                className={`button button-sm ${isRecording ? 'button-danger' : 'button-success'}`}
              >
                {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                {isRecording ? 'Stop Recording' : 'Start Speaking (Mic)'}
              </button>
            </div>

            <textarea
              className="flat-textarea"
              rows={6}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Speak using your microphone or type your response here... (e.g., In my recent distributed catalog project, our latency spiked by 40% during peak flash sales. I identified unindexed queries and added Redis caching, which reduced median latency by 65%)."
            />

            <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', color: 'var(--flat-muted)' }}>
                {transcript.trim() ? `${transcript.trim().split(/\s+/).length} words recorded` : 'Ready to record'}
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  disabled={isEvaluating || !transcript.trim()}
                  onClick={handleEvaluate}
                  className="button"
                  style={{ background: 'var(--scheme-deep)' }}
                >
                  <Send size={15} />
                  {isEvaluating ? 'Evaluating with STAR...' : 'Evaluate Answer'}
                </button>
              </div>
            </div>
          </div>

          {/* STAR Evaluation Result */}
          {evaluation && (
            <div className="card" style={{ background: 'var(--flat-surface-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span className="badge badge-green" style={{ fontSize: '13px' }}>
                    Overall Score: {evaluation.overallScore}%
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '6px' }}>
                    Recruiter STAR Evaluation
                  </h3>
                </div>

                {currentQIndex < interviewQuestionsList.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="button button-success"
                  >
                    <span>Next Question</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>

              {/* 4 Rubric Bars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '14px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>SITUATION</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-deep)' }}>{evaluation.starBreakdown.situation}/25</div>
                </div>
                <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '14px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>TASK</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-teal-dark)' }}>{evaluation.starBreakdown.task}/25</div>
                </div>
                <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '14px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>ACTION</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-gold-dark)' }}>{evaluation.starBreakdown.action}/25</div>
                </div>
                <div style={{ background: 'var(--flat-surface)', border: '1px solid var(--flat-border)', borderRadius: '14px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--flat-muted)' }}>RESULT</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--scheme-coral)' }}>{evaluation.starBreakdown.result}/25</div>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--flat-text)', lineHeight: 1.5, marginBottom: '14px' }}>
                <strong>Recruiter Feedback:</strong> {evaluation.feedback}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'var(--scheme-teal-subtle)', border: '1px solid rgba(0, 180, 179, 0.4)', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--scheme-deep)', marginBottom: '6px' }}>
                    KEY STRENGTHS:
                  </div>
                  {evaluation.strengths.map((st, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#0E2A30', marginBottom: '4px' }}>
                      • {st}
                    </div>
                  ))}
                </div>

                <div style={{ background: 'var(--scheme-gold-subtle)', border: '1px solid rgba(254, 205, 0, 0.5)', borderRadius: '14px', padding: '12px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#7A6000', marginBottom: '6px' }}>
                    SUGGESTED IMPROVEMENTS:
                  </div>
                  {evaluation.improvements.map((im, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#3A2E00', marginBottom: '4px' }}>
                      • {im}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right: Proctoring Camera & Live Monitor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={16} color="var(--scheme-deep)" /> Proctoring Camera Stream
              </span>
              <span className="badge badge-green">LIVE MONITOR</span>
            </div>

            {/* Video Viewport */}
            <div style={{ position: 'relative', width: '100%', height: '200px', background: '#000000', borderRadius: '16px', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {!cameraActive && (
                <div style={{ position: 'absolute', textAlign: 'center', color: '#9CA3AF' }}>
                  <VideoOff size={32} style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '12px' }}>Webcam active or permission requested</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--flat-surface-subtle)', borderRadius: '10px' }}>
                <span>Head Alignment:</span>
                <strong style={{ color: 'var(--scheme-teal-dark)' }}>Centered & Focus Confirmed</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--flat-surface-subtle)', borderRadius: '10px' }}>
                <span>Audio Stream:</span>
                <strong style={{ color: isRecording ? 'var(--scheme-coral)' : 'var(--flat-muted)' }}>
                  {isRecording ? 'Listening (Input Active)' : 'Standby'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--flat-surface-subtle)', borderRadius: '10px' }}>
                <span>Session Proctoring Violations:</span>
                <strong style={{ color: violations === 0 ? 'var(--scheme-teal-dark)' : 'var(--scheme-coral)' }}>
                  {violations}
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="card">
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>
              Interview Instructions
            </h4>
            <ul style={{ fontSize: '12.5px', color: 'var(--flat-muted)', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
