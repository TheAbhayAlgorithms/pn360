'use client';

import React from 'react';
import Link from 'next/link';
import {
  ListChecks,
  FileCheck,
  Mic,
  CalendarCheck,
  ArrowRight,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const options = [
    {
      title: "START TECHNICAL ASSESSMENT",
      subtitle: "MCQ Test • Proctored Assessment",
      href: "/mcq-test",
      iconBg: "var(--primary-subtle)",
      iconColor: "var(--primary)",
      icon: <ListChecks size={26} />,
      btnText: "Start Assessment"
    },
    {
      title: "RESUME ATS",
      subtitle: "Gemini 2.5 • Keyword Gap Audit",
      href: "/resume-ats",
      iconBg: "var(--danger-subtle)",
      iconColor: "var(--danger)",
      icon: <FileCheck size={26} />,
      btnText: "Audit Resume"
    },
    {
      title: "AI INTERVIEW",
      subtitle: "Speech AI • STAR Rubric Evaluation",
      href: "/ai-interview",
      iconBg: "var(--info-subtle)",
      iconColor: "var(--info)",
      icon: <Mic size={26} />,
      btnText: "Enter Interview"
    },
    {
      title: "SCHEDULE",
      subtitle: "Practice Slots • Mock Testing",
      href: "/schedule",
      iconBg: "var(--warning-subtle)",
      iconColor: "var(--warning-hover)",
      icon: <CalendarCheck size={26} />,
      btnText: "Book Slot"
    }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 160px)',
        width: '100%',
        padding: '24px 0 40px'
      }}
    >
      {/* Simple Hero / Welcome Area with Existing Context */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '36px',
          maxWidth: '700px',
          width: '100%',
          padding: '0 12px'
        }}
      >
        <div className="eyebrow-badge" style={{ marginBottom: '14px' }}>
          <GraduationCap size={13} /> CAMPUS READINESS PLATFORM
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.35rem)',
            fontWeight: 800,
            color: 'var(--text)',
            letterSpacing: '-0.03em',
            lineHeight: 1.2
          }}
        >
          Placement Nexus 360
        </h1>
        <p
          style={{
            fontSize: '14.5px',
            color: 'var(--text-muted)',
            marginTop: '8px',
            lineHeight: 1.55
          }}
        >
          Proctored diagnostic placement platform powered by Gemini and STAR rubrics. Select an evaluation module below to begin your placement audit.
        </p>
      </div>

      {/* 4 Action Cards in Responsive Grid (4 Desktop / 2 Tablet / 1 Mobile) */}
      <div className="home-grid">
        {options.map((opt) => (
          <Link
            key={opt.title}
            href={opt.href}
            className="home-action-card"
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {/* Refined Icon Tile */}
              <div
                className="home-icon-tile"
                style={{
                  background: opt.iconBg,
                  color: opt.iconColor
                }}
              >
                {opt.icon}
              </div>

              {/* Title in Caps */}
              <h2 className="home-card-title">
                {opt.title}
              </h2>

              {/* Subtitle */}
              <p className="home-card-subtitle">
                {opt.subtitle}
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="home-card-button">
              <span>{opt.btnText}</span>
              <ArrowRight size={15} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
