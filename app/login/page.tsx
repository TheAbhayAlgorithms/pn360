'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, switchUser, currentUser } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');

  // Sign in form state
  const [loginIdentifier, setLoginIdentifier] = useState('abhay');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regTrack, setRegTrack] = useState('Software Engineering');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Status state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = login(loginIdentifier, loginPassword);
    if (!result.success) {
      setErrorMsg(result.error || "Login failed.");
      return;
    }

    setSuccessMsg("Signed in successfully! Redirecting...");
    setTimeout(() => {
      router.push('/leaderboard');
    }, 700);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (regPassword && regConfirmPassword && regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter.");
      return;
    }

    const result = register({
      name: regName,
      username: regUsername,
      email: regEmail,
      track: regTrack,
      password: regPassword || 'password123'
    });

    if (!result.success) {
      setErrorMsg(result.error || "Registration failed.");
      return;
    }

    setSuccessMsg("Account created successfully! Welcome to Placement Nexus 360.");
    setTimeout(() => {
      router.push('/leaderboard');
    }, 800);
  };

  const handleQuickDemoLogin = (username: string) => {
    switchUser(username);
    setSuccessMsg(`Signed in as demo student! Redirecting...`);
    setTimeout(() => {
      router.push('/leaderboard');
    }, 500);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '32px auto 60px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="eyebrow-badge" style={{ marginBottom: '12px' }}>
          <ShieldCheck size={13} /> PLACEMENT STUDENT AUTHENTICATION
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.025em' }}>
          Placement Nexus 360 Portal
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
          Individual student authentication. Every student accesses their own private growth chart and diagnostics.
        </p>
      </div>

      {/* Auth Card */}
      <div className="card" style={{ padding: '30px 28px' }}>
        
        {/* Segmented Toggle: Sign In vs Create Account */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            background: 'var(--surface-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            marginBottom: '22px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: mode === 'signin' ? 'var(--surface)' : 'transparent',
              color: mode === 'signin' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: mode === 'signin' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 150ms ease'
            }}
          >
            <LogIn size={14} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-xs)',
              border: 'none',
              fontWeight: 700,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: mode === 'register' ? 'var(--surface)' : 'transparent',
              color: mode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'all 150ms ease'
            }}
          >
            <UserPlus size={14} /> Create Account
          </button>
        </div>

        {/* Error and Success Banners */}
        {errorMsg && (
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--danger-subtle)',
              border: '1px solid var(--danger-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--danger-text)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '12px 14px',
              background: 'var(--success-subtle)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--success-text)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit}>
            <div className="form-group">
              <label className="form-label">Username or Campus Email</label>
              <input
                type="text"
                className="flat-input"
                placeholder="e.g. abhay or abhay@nexus.edu"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="flat-input"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="button button-lg button-primary"
              style={{
                width: '100%',
                marginTop: '8px',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              <span>Sign In to Dashboard &amp; Leaderboard</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Student Switcher */}
            <div style={{ marginTop: '26px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '10px'
                }}
              >
                Quick 1-Click Demo Login:
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '8px'
                }}
              >
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('abhay')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    background: currentUser?.username === 'abhay' ? 'var(--primary-subtle)' : 'var(--surface)',
                    borderColor: currentUser?.username === 'abhay' ? 'var(--primary-border)' : 'var(--border)'
                  }}
                >
                  <User size={14} color="var(--primary)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--text)' }}>Abhay Raj Singh</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rank #4 • Software Eng</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('priya')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    background: currentUser?.username === 'priya' ? 'var(--primary-subtle)' : 'var(--surface)',
                    borderColor: currentUser?.username === 'priya' ? 'var(--primary-border)' : 'var(--border)'
                  }}
                >
                  <User size={14} color="var(--warning)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--text)' }}>Priya Sharma</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rank #1 • Google Offer</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('rohan')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    background: currentUser?.username === 'rohan' ? 'var(--primary-subtle)' : 'var(--surface)',
                    borderColor: currentUser?.username === 'rohan' ? 'var(--primary-border)' : 'var(--border)'
                  }}
                >
                  <User size={14} color="var(--info)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--text)' }}>Rohan Verma</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rank #2 • Microsoft</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('sneha')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '8px 12px',
                    background: currentUser?.username === 'sneha' ? 'var(--primary-subtle)' : 'var(--surface)',
                    borderColor: currentUser?.username === 'sneha' ? 'var(--primary-border)' : 'var(--border)'
                  }}
                >
                  <User size={14} color="var(--danger)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--text)' }}>Sneha Patel</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rank #3 • Amazon</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Candidate Name</label>
              <input
                type="text"
                className="flat-input"
                placeholder="e.g. Rahul Mehta"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="flat-input"
                  placeholder="e.g. rahul"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campus Email</label>
                <input
                  type="email"
                  className="flat-input"
                  placeholder="e.g. rahul@nexus.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Engineering Placement Track</label>
              <select
                className="flat-select"
                value={regTrack}
                onChange={(e) => setRegTrack(e.target.value)}
              >
                <option value="Software Engineering">Software Engineering Track</option>
                <option value="Backend & Systems">Backend &amp; Systems Architecture</option>
                <option value="Cloud & DevOps">Cloud &amp; DevOps Engineering</option>
                <option value="Full Stack Platform">Full Stack Platform Engineering</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="flat-input"
                  placeholder="Choose password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="flat-input"
                  placeholder="Confirm password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="button button-lg button-primary"
              style={{
                width: '100%',
                marginTop: '10px',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              <span>Create Placement Account &amp; Generate Profile</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
