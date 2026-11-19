'use client';

import React from 'react';
import Link from 'next/link';
import {
  ListChecks,
  FileCheck,
  Mic,
  CalendarCheck,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const options = [
    {
      title: "START TECHNICAL ASSESSMENT",
      subtitle: "30 MCQs • Proctored Assessment",
      href: "/mcq-test",
      themeColor: "var(--edu-blue)", // Academic Oxford Blue / Cobalt
      badgeBg: "var(--edu-blue-badge-bg)",
      badgeColor: "var(--edu-blue)",
      icon: <ListChecks size={28} color="#FFFFFF" />,
      tag: "Stage 02",
      btnText: "Start Assessment"
    },
    {
      title: "RESUME ATS",
      subtitle: "Gemini 2.5 • Keyword Gap Audit",
      href: "/resume-ats",
      themeColor: "var(--edu-terracotta)", // Scholarly Warm Sienna / Terracotta
      badgeBg: "var(--edu-terracotta-badge-bg)",
      badgeColor: "var(--edu-terracotta)",
      icon: <FileCheck size={28} color="#FFFFFF" />,
      tag: "Stage 01",
      btnText: "Audit Resume"
    },
    {
      title: "AI INTERVIEW",
      subtitle: "Speech AI • STAR Rubric Evaluation",
      href: "/ai-interview",
      themeColor: "var(--edu-indigo)", // Intellectual Deep Indigo / Royal Slate
      badgeBg: "var(--edu-indigo-badge-bg)",
      badgeColor: "var(--edu-indigo)",
      icon: <Mic size={28} color="#FFFFFF" />,
      tag: "Stage 03",
      btnText: "Enter Interview"
    },
    {
      title: "SCHEDULE",
      subtitle: "Practice Slots • Mock Testing",
      href: "/schedule",
      themeColor: "var(--edu-teal)", // Cambridge Spruce / Deep Academic Teal
      badgeBg: "var(--edu-teal-badge-bg)",
      badgeColor: "var(--edu-teal)",
      icon: <CalendarCheck size={28} color="#FFFFFF" />,
      tag: "Booking",
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
        minHeight: 'calc(100vh - 180px)',
        width: '100%',
        padding: '24px 0'
      }}
    >
      {/* 4 Professional & Educational Curved Boxes Side by Side */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          width: '100%',
          maxWidth: '1200px'
        }}
      >
        {options.map((opt) => (
          <Link
            key={opt.title}
            href={opt.href}
            className="smooth-box-card"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              padding: '38px 22px 28px',
              minHeight: '340px',
              cursor: 'pointer',
              background: 'var(--flat-surface)',
              borderRadius: '24px',
              border: '1.5px solid var(--flat-border)',
              boxShadow: 'none',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              {/* Refined Academic Pill Badge */}
              <span
                style={{
                  marginBottom: '18px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: opt.badgeBg,
                  color: opt.badgeColor
                }}
              >
                {opt.tag}
              </span>

              {/* Dignified Academic Icon Tile */}
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  marginBottom: '22px',
                  borderRadius: '20px',
                  background: opt.themeColor,
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFFFFF'
                }}
              >
                {opt.icon}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: '15px',
                  fontWeight: 900,
                  letterSpacing: '0.03em',
                  color: 'var(--flat-text)',
                  marginBottom: '8px',
                  lineHeight: 1.35
                }}
              >
                {opt.title}
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: '12.5px',
                  color: 'var(--flat-muted)',
                  lineHeight: 1.45,
                  margin: 0
                }}
              >
                {opt.subtitle}
              </p>
            </div>

            {/* Professional Curved Action Button */}
            <div
              className="edu-btn"
              style={{
                width: '100%',
                marginTop: '26px',
                padding: '12px 16px',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '14px',
                background: opt.themeColor,
                color: '#FFFFFF',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <span>{opt.btnText}</span>
              <ArrowRight size={15} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
