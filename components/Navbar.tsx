'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, Sun, Moon, Trophy } from 'lucide-react';

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
        {/* Left-most: PN360 and in sub Placement Nexus 360 */}
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

        {/* Right-most: Leaderboard option and Dark/Light mode button, thats it, nothing else */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            href="/leaderboard"
            className={`flat-nav-link ${pathname === '/leaderboard' ? 'active' : ''}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 600 }}
          >
            <Trophy size={16} />
            <span>Leaderboard</span>
          </Link>

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
