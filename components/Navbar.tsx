'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sun,
  Moon,
  Trophy,
  LogIn,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
        {/* Left: Brand "PN360 / Placement Nexus 360" */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0
          }}
        >
          <div
            className="icon-tile icon-tile-sm"
            style={{
              background: 'var(--primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <GraduationCap size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--text)',
                letterSpacing: '-0.025em',
                lineHeight: 1.1
              }}
            >
              PN360
            </span>
            <span
              className="navbar-brand-subtitle"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.01em',
                lineHeight: 1.1,
                marginTop: '2px'
              }}
            >
              Placement Nexus 360
            </span>
          </div>
        </Link>

        {/* Right Desktop Nav */}
        <div className="navbar-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link
            href="/leaderboard"
            className={`flat-nav-link ${pathname === '/leaderboard' ? 'active' : ''}`}
          >
            <Trophy size={15} />
            <span>Leaderboard</span>
          </Link>

          {/* User Account / Sign In Status */}
          {currentUser ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '3px 6px 3px 10px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface-subtle)',
                border: '1px solid var(--border)'
              }}
            >
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontSize: '12.5px',
                  fontWeight: 600
                }}
                title="Account Settings & Profile Switcher"
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '11px',
                    fontWeight: 800
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
                  borderRadius: 'var(--radius-xs)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 150ms ease, background-color 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--danger)';
                  e.currentTarget.style.backgroundColor = 'var(--danger-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="button button-sm button-primary"
              style={{
                fontSize: '12.5px',
                padding: '6px 14px'
              }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="button button-secondary"
            style={{
              width: '36px',
              height: '36px',
              padding: 0,
              borderRadius: 'var(--radius-sm)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Toggle dark / light mode"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} color="var(--warning)" /> : <Moon size={16} />}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="navbar-mobile-toggle" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={toggleTheme}
            className="button button-secondary"
            style={{ width: '34px', height: '34px', padding: 0, borderRadius: 'var(--radius-sm)' }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} color="var(--warning)" /> : <Moon size={15} />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="button button-secondary"
            style={{ width: '34px', height: '34px', padding: 0, borderRadius: 'var(--radius-sm)' }}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="navbar-mobile-drawer"
          style={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link
            href="/leaderboard"
            className={`flat-nav-link ${pathname === '/leaderboard' ? 'active' : ''}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Trophy size={16} />
            <span>Leaderboard</span>
          </Link>

          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--primary)',
                      color: '#FFFFFF',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '12px',
                      fontWeight: 800
                    }}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text)', display: 'block' }}>
                      {currentUser.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {currentUser.track}
                    </span>
                  </div>
                </div>
                <span className="badge badge-amber font-mono" style={{ fontSize: '11px' }}>
                  Rank #{currentUser.rank}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <Link
                  href="/login"
                  className="button button-sm button-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Switch Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="button button-sm button-danger"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="button button-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}

      {/* Style block for responsive navbar breakpoints */}
      <style jsx>{`
        @media (max-width: 640px) {
          .navbar-desktop-actions {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
          .navbar-brand-subtitle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
