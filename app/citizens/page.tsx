'use client';

import { useEffect, useState } from 'react';
import { getCitizens, deleteCitizen } from '@/lib/storage';
import { formatDate, calculateAge } from '@/lib/documents';
import { CITIZEN_TYPE_LABELS } from '@/lib/types';
import type { Citizen } from '@/lib/types';
import Link from 'next/link';

export default function CitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCitizens(getCitizens());
    setLoading(false);
  }, []);

  const filtered = citizens.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.kkNumber.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete citizen "${name}" and all their documents? This cannot be undone.`)) return;
    deleteCitizen(id);
    setCitizens(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-royal-cream/40">Loading...</div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif gold-text">Citizen Directory</h1>
          <p className="text-royal-cream/40 text-sm mt-1">{citizens.length} registered citizen{citizens.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/register" className="px-4 py-2 bg-royal-gold text-royal-dark text-sm font-medium rounded-lg hover:bg-royal-gold/90 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Register New
        </Link>
      </div>

      {citizens.length > 0 && (
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or KK number..."
            className="w-full"
          />
        </div>
      )}

      {citizens.length === 0 ? (
        <div className="doc-card rounded-xl p-12 bg-white/[0.02] text-center">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-royal-cream/50 mb-2">No citizens registered yet</p>
          <Link href="/register" className="text-royal-gold text-sm hover:underline">Register the first citizen →</Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-royal-cream/40">
          No citizens match &quot;{search}&quot;
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((citizen) => (
            <div key={citizen.id} className="doc-card rounded-xl p-4 bg-white/[0.02] flex items-center gap-4 group">
              <Link href={`/citizen/${citizen.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                {citizen.photo ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-royal-gold/20 flex-shrink-0">
                    <img src={citizen.photo} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg border border-royal-gold/20 flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
                    <span className="text-lg text-royal-gold/40">{citizen.fullName[0]}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-royal-cream/80 truncate">{citizen.fullName}</div>
                  <div className="text-[10px] text-royal-cream/30 font-mono">{citizen.kkNumber}</div>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-4 text-xs text-royal-cream/40 flex-shrink-0">
                <span>{CITIZEN_TYPE_LABELS[citizen.citizenType]}</span>
                <span>{calculateAge(citizen.dateOfBirth)} yrs</span>
              </div>
              <button
                onClick={() => handleDelete(citizen.id, citizen.fullName)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/60 hover:text-red-400 p-1"
                title="Delete citizen"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
