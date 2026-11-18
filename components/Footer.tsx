'use client';

import React from 'react';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="flat-footer">
      <div className="flat-footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--flat-text)' }}>
            <GraduationCap size={16} color="var(--flat-blue)" />
            Placement Nexus 360
          </div>
          <span>•</span>
          <span>Proctored Diagnostic Placement Platform</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span className="badge badge-green">
            <ShieldCheck size={14} /> Proctoring Engine Active
          </span>
          <span style={{ fontSize: '12px', color: 'var(--flat-muted)' }}>
            Gemini 2.5 • STAR Rubric Evaluation
          </span>
        </div>
      </div>
    </footer>
  );
}
