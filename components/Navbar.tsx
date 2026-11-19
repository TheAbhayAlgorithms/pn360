'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { GraduationCap, Sun, Moon, Trophy, User, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexus_theme');
      if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        setTheme('light');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('nexus_theme', nextTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="flat-navbar">
      <div className="flat-navbar-inner">
        {/* Left-most: PN360 and Placement Nexus 360 */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div className="icon-tile icon-tile-sm" style={{ background: 'var(--scheme-deep)', width: '38px', height: '38px', borderRadius: '12px' }}>
            <GraduationCap size={20} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--flat-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              PN360
            </span>
            <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--flat-muted)', letterSpacing: '0.01em', lineHeight: 1.1, marginTop: '2px' }}>
              Placement Nexus 360
            </span>
          </div>
        </Link>

        {/* Right-most: Leaderboard, User Auth Profile / Sign In, and Dark/Light mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/leaderboard"
            className={`flat-nav-link ${pathname === '/leaderboard' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 600 }}
          >
            <Trophy size={16} />
            <span>Leaderboard</span>
          </Link>

          {/* User Account / Auth Status */}
          {currentUser ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 6px 4px 10px',
                borderRadius: '12px',
                background: 'var(--flat-surface-subtle)',
                border: '1px solid var(--flat-border)'
              }}
            >
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'var(--flat-text)',
                  fontSize: '12.5px',
                  fontWeight: 700
                }}
                title="Account Settings & Profile Switcher"
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '8px',
                    background: 'var(--scheme-deep)',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '11px',
                    fontWeight: 900
                  }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <span>{currentUser.name.split(' ')[0]}</span>
                <span className="badge badge-amber" style={{ fontSize: '10px', padding: '1px 5px', fontWeight: 800 }}>
                  #{currentUser.rank}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--flat-muted)',
                  cursor: 'pointer',
                  padding: 0
                }}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="button button-sm button-secondary"
              style={{
                borderRadius: '12px',
                fontSize: '12.5px',
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="button button-secondary"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle dark / light mode"
            title="Toggle Flat Dark / Light mode"
          >
            {theme === 'dark' ? <Sun size={17} color="var(--scheme-gold)" /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
