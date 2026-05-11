'use client';

import { useEffect, useState } from 'react';
import { getStats } from '@/lib/storage';
import Link from 'next/link';

export default function Home() {
  const [stats, setStats] = useState({ totalCitizens: 0, totalDocuments: 0, byType: { born: 0, naturalized: 0, honorary: 0, dual: 0, humanitarian: 0, regent: 0, royal_direct: 0, royal_extended: 0 } });

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div className="relative">
      {/* Hero */}
      <div className="relative flex flex-col items-center justify-center py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-royal-gold/5 via-transparent to-transparent pointer-events-none" />

        <img src="/images/royal-seal.png" alt="Royal Seal" className="w-24 h-24 mb-6 opacity-90" />

        <h1 className="text-4xl md:text-5xl font-serif gold-text mb-3">Kissi Kingdom</h1>
        <p className="text-royal-cream/40 italic text-sm mb-6">Omnividens, Omnipotens, Omniaeternus</p>

        <h2 className="text-xl md:text-2xl font-medium text-royal-cream mb-3">Civil Registry System</h2>
        <p className="text-royal-cream/50 max-w-lg text-sm leading-relaxed">
          Sovereign citizen enrollment, identification, and document issuance platform for the Kingdom of the Kissi people.
        </p>

        <div className="flex gap-4 mt-8">
          <Link href="/register" className="px-6 py-2.5 bg-royal-gold text-royal-dark font-medium rounded-lg hover:bg-royal-gold/90 transition-all text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            Register Citizen
          </Link>
          <Link href="/citizens" className="px-6 py-2.5 border border-royal-gold/30 text-royal-gold rounded-lg hover:border-royal-gold/60 hover:bg-royal-gold/5 transition-all text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            View Citizens
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Citizens', value: stats.totalCitizens, icon: '👥' },
          { label: 'Documents Issued', value: stats.totalDocuments, icon: '📄' },
          { label: 'Born Citizens', value: stats.byType.born, icon: '👶' },
          { label: 'Dual Citizens', value: stats.byType.dual, icon: '🌍' },
        ].map((stat) => (
          <div key={stat.label} className="doc-card rounded-xl p-4 bg-white/[0.02] text-center">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold gold-text">{stat.value}</div>
            <div className="text-[10px] text-royal-cream/40 mt-1 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-4 pb-16 grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Citizen Registration',
            desc: 'Enroll citizens with unique KK identification numbers and photo upload',
            href: '/register',
            icon: (
              <svg className="w-8 h-8 text-royal-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            ),
          },
          {
            title: 'Digital ID Cards',
            desc: 'Official Kissi Kingdom identification with photo and QR verification',
            href: '/citizens',
            icon: (
              <svg className="w-8 h-8 text-royal-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            ),
          },
          {
            title: 'Document Issuance',
            desc: 'Birth certificates, passports (ICAO format), and dual citizenship certificates',
            href: '/documents',
            icon: (
              <svg className="w-8 h-8 text-royal-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
          },
        ].map((card) => (
          <Link key={card.title} href={card.href} className="doc-card rounded-xl p-6 bg-white/[0.02] flex flex-col items-center text-center group">
            <div className="mb-3 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h3 className="font-medium text-royal-cream mb-2">{card.title}</h3>
            <p className="text-xs text-royal-cream/40 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
