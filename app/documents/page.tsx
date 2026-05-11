'use client';

import { useEffect, useState } from 'react';
import { getDocuments, getCitizen } from '@/lib/storage';
import { formatDate } from '@/lib/documents';
import { DOCUMENT_LABELS } from '@/lib/types';
import type { Document, Citizen } from '@/lib/types';
import Link from 'next/link';

export default function DocumentsPage() {
  const [docs, setDocs] = useState<(Document & { citizen?: Citizen })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allDocs = getDocuments();
    const enriched = allDocs.map(d => ({
      ...d,
      citizen: getCitizen(d.citizenId),
    }));
    setDocs(enriched);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-royal-cream/40">Loading...</div></div>;

  const typeIcons: Record<string, string> = {
    birth_certificate: '📜',
    id_card: '🪪',
    passport: '📕',
    dual_citizenship: '🌍',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-serif gold-text">Issued Documents</h1>
        <p className="text-royal-cream/40 text-sm mt-1">{docs.length} document{docs.length !== 1 ? 's' : ''} issued</p>
      </div>

      {docs.length === 0 ? (
        <div className="doc-card rounded-xl p-12 bg-white/[0.02] text-center">
          <div className="text-4xl mb-4">📄</div>
          <p className="text-royal-cream/50 mb-2">No documents issued yet</p>
          <Link href="/citizens" className="text-royal-gold text-sm hover:underline">Go to Citizens to issue documents →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documents/${doc.id}?citizenId=${doc.citizenId}`}
              className="doc-card rounded-xl p-4 bg-white/[0.02] flex items-center gap-4 hover:bg-royal-gold/5 transition-all"
            >
              <span className="text-2xl">{typeIcons[doc.type] || '📄'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-royal-cream/80">{DOCUMENT_LABELS[doc.type]}</div>
                <div className="text-[10px] text-royal-cream/30 font-mono">{doc.documentNumber}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-royal-cream/60">{doc.citizen?.fullName || 'Unknown'}</div>
                <div className="text-[10px] text-royal-cream/30">Issued {formatDate(doc.issuedAt.slice(0, 10))}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
