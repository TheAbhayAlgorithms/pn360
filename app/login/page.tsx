'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  LogIn,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Lock,
  Mail,
  Layers
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
    <div style={{ maxWidth: '640px', margin: '30px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div className="badge badge-blue font-mono" style={{ marginBottom: '10px' }}>
          <ShieldCheck size={13} /> PLACEMENT STUDENT AUTHENTICATION
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--flat-text)' }}>
          Placement Nexus 360 Portal
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--flat-muted)', marginTop: '4px' }}>
          Individual student authentication. Every student accesses their own private growth chart and diagnostics.
        </p>
      </div>

      {/* Auth Card */}
      <div className="card" style={{ borderRadius: '24px', padding: '28px' }}>
        
        {/* Sign In vs Register Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'var(--flat-surface-subtle)', padding: '6px', borderRadius: '16px', border: '1px solid var(--flat-border)', marginBottom: '22px' }}>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: mode === 'signin' ? 'var(--scheme-deep)' : 'transparent',
              color: mode === 'signin' ? '#FFFFFF' : 'var(--flat-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            <LogIn size={15} /> Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 800,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: mode === 'register' ? 'var(--scheme-teal)' : 'transparent',
              color: mode === 'register' ? '#FFFFFF' : 'var(--flat-muted)',
              transition: 'all 0.15s ease'
            }}
          >
            <UserPlus size={15} /> Create Account
          </button>
        </div>

        {/* Error and Success Banners */}
        {errorMsg && (
          <div style={{ padding: '12px 16px', background: 'var(--scheme-coral-subtle)', border: '1px solid rgba(252, 127, 115, 0.4)', borderRadius: '14px', color: 'var(--scheme-coral-dark)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '12px 16px', background: 'var(--scheme-teal-subtle)', border: '1px solid rgba(0, 180, 179, 0.4)', borderRadius: '14px', color: 'var(--scheme-deep)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignInSubmit}>
            <div className="form-group">
              <label className="form-label">Username or Campus Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="flat-input"
                  placeholder="e.g. abhay or abhay@nexus.edu"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                />
              </div>
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
              className="button button-lg"
              style={{
                width: '100%',
                marginTop: '10px',
                borderRadius: '14px',
                background: 'var(--scheme-deep)',
                fontWeight: 800,
                fontSize: '14px'
              }}
            >
              <span>Sign In to Dashboard &amp; Leaderboard</span>
              <ArrowRight size={16} />
            </button>

            {/* Quick Demo Student Switcher */}
            <div style={{ marginTop: '26px', borderTop: '1px solid var(--flat-border)', paddingTop: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--flat-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '10px' }}>
                Quick 1-Click Demo Login:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('abhay')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: '12px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '10px 12px',
                    background: currentUser?.username === 'abhay' ? 'var(--scheme-deep-subtle)' : undefined,
                    border: currentUser?.username === 'abhay' ? '1.5px solid var(--scheme-deep)' : undefined
                  }}
                >
                  <User size={14} color="var(--scheme-deep)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--flat-text)' }}>Abhay Raj Singh</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--flat-muted)' }}>Rank #4 • Software Eng</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('priya')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: '12px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '10px 12px',
                    background: currentUser?.username === 'priya' ? 'var(--scheme-deep-subtle)' : undefined,
                    border: currentUser?.username === 'priya' ? '1.5px solid var(--scheme-deep)' : undefined
                  }}
                >
                  <User size={14} color="var(--scheme-gold-dark)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--flat-text)' }}>Priya Sharma</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--flat-muted)' }}>Rank #1 • Google Offer</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('rohan')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: '12px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '10px 12px',
                    background: currentUser?.username === 'rohan' ? 'var(--scheme-deep-subtle)' : undefined,
                    border: currentUser?.username === 'rohan' ? '1.5px solid var(--scheme-deep)' : undefined
                  }}
                >
                  <User size={14} color="var(--scheme-teal-dark)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--flat-text)' }}>Rohan Verma</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--flat-muted)' }}>Rank #2 • Microsoft</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('sneha')}
                  className="button button-secondary button-sm"
                  style={{
                    borderRadius: '12px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '10px 12px',
                    background: currentUser?.username === 'sneha' ? 'var(--scheme-deep-subtle)' : undefined,
                    border: currentUser?.username === 'sneha' ? '1.5px solid var(--scheme-deep)' : undefined
                  }}
                >
                  <User size={14} color="var(--scheme-coral)" />
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: 'var(--flat-text)' }}>Sneha Patel</strong>
                    <span style={{ fontSize: '10.5px', color: 'var(--flat-muted)' }}>Rank #3 • Amazon</span>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              className="button button-lg"
              style={{
                width: '100%',
                marginTop: '10px',
                borderRadius: '14px',
                background: 'var(--scheme-teal)',
                fontWeight: 800,
                fontSize: '14px'
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
