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
      colorClass: "icon-tile-blue",
      btnClass: "button",
      icon: <ListChecks size={28} color="#FFFFFF" />,
      tag: "Stage 02",
      tagClass: "badge-blue",
      btnText: "Start Assessment"
    },
    {
      title: "RESUME ATS",
      subtitle: "Gemini 2.5 • Keyword Gap Audit",
      href: "/resume-ats",
      colorClass: "icon-tile-orange",
      btnClass: "button button-danger",
      icon: <FileCheck size={28} color="#FFFFFF" />,
      tag: "Stage 01",
      tagClass: "badge-orange",
      btnText: "Audit Resume"
    },
    {
      title: "AI INTERVIEW",
      subtitle: "Speech AI • STAR Rubric Evaluation",
      href: "/ai-interview",
      colorClass: "icon-tile-purple",
      btnClass: "button",
      btnStyle: { background: 'var(--flat-purple)' },
      icon: <Mic size={28} color="#FFFFFF" />,
      tag: "Stage 03",
      tagClass: "badge-purple",
      btnText: "Enter Interview"
    },
    {
      title: "SCHEDULE",
      subtitle: "Practice Slots • Mock Testing",
      href: "/schedule",
      colorClass: "icon-tile-green",
      btnClass: "button button-success",
      icon: <CalendarCheck size={28} color="#FFFFFF" />,
      tag: "Booking",
      tagClass: "badge-green",
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
        padding: '20px 0'
      }}
    >
      {/* 4 Boxes Side by Side in the Center of the Screen */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          width: '100%',
          maxWidth: '1160px'
        }}
      >
        {options.map((opt) => (
          <Link
            key={opt.title}
            href={opt.href}
            className="card"
            style={{
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              padding: '36px 20px',
              minHeight: '320px',
              cursor: 'pointer',
              border: '2px solid var(--flat-border)',
              transition: 'border-color 150ms ease, background-color 150ms ease'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <span className={`badge ${opt.tagClass}`} style={{ marginBottom: '16px', fontSize: '11px', textTransform: 'uppercase' }}>
                {opt.tag}
              </span>

              {/* Solid 2D Flat Icon Tile */}
              <div className={`icon-tile ${opt.colorClass}`} style={{ width: '64px', height: '64px', marginBottom: '20px', borderRadius: '8px' }}>
                {opt.icon}
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: '15.5px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
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

            {/* Action Button */}
            <div
              className={opt.btnClass}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '10px 14px',
                fontSize: '13.5px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '6px',
                ...opt.btnStyle
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
