'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Sun, Moon, LayoutDashboard, ListChecks, Mic, Trophy } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
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

  return (
    <header className="flat-navbar">
      <div className="flat-navbar-inner">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div className="icon-tile icon-tile-sm" style={{ background: 'var(--flat-blue-dark)' }}>
            <GraduationCap size={18} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--flat-text)', letterSpacing: '-0.02em' }}>
              nexus<span style={{ color: 'var(--flat-blue)' }}>360</span>
            </span>
            <span className="badge badge-blue" style={{ fontSize: '10px', padding: '2px 6px' }}>
              PROCTORED
            </span>
          </div>
        </Link>

        <nav className="flat-nav-links">
          <Link href="/" className={`flat-nav-link ${pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={16} />
            Dashboard
          </Link>
          <Link href="/mcq-test" className={`flat-nav-link ${pathname === '/mcq-test' ? 'active' : ''}`}>
            <ListChecks size={16} />
            30 MCQs
          </Link>
          <Link href="/ai-interview" className={`flat-nav-link ${pathname === '/ai-interview' ? 'active' : ''}`}>
            <Mic size={16} />
            AI Interview
          </Link>
          <Link href="/leaderboard" className={`flat-nav-link ${pathname === '/leaderboard' ? 'active' : ''}`}>
            <Trophy size={16} />
            Leaderboard
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="badge badge-gray" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--flat-green)' }}></span>
            <span>Engineering Track</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="button button-secondary"
            style={{ width: '36px', height: '36px', padding: 0, borderRadius: '6px' }}
            aria-label="Toggle dark / light mode"
            title="Toggle Flat Dark / Light mode"
          >
            {theme === 'dark' ? <Sun size={17} color="#FFC107" /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
