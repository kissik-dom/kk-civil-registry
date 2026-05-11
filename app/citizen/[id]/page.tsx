'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCitizen, getDocumentsByCitizen, issueDocument } from '@/lib/storage';
import { formatDate, calculateAge } from '@/lib/documents';
import { CITIZEN_TYPE_LABELS, DOCUMENT_LABELS } from '@/lib/types';
import type { Citizen, Document, DocumentType } from '@/lib/types';
import Link from 'next/link';

export default function CitizenDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const c = getCitizen(id);
    if (!c) { setLoading(false); return; }
    setCitizen(c);
    setDocs(getDocumentsByCitizen(id));
    setLoading(false);
  }, [params.id]);

  const handleIssueDoc = (type: DocumentType) => {
    if (!citizen) return;
    const doc = issueDocument(citizen.id, type);
    setDocs(prev => [...prev, doc]);
    // Navigate to document view
    router.push(`/documents/${doc.id}?citizenId=${citizen.id}`);
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-royal-cream/40">Loading...</div></div>;
  if (!citizen) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-royal-cream/40 mb-4">Citizen not found</p>
      <Link href="/citizens" className="text-royal-gold text-sm hover:underline">← Back to Citizens</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10">
        {citizen.photo ? (
          <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-royal-gold/30 flex-shrink-0">
            <img src={citizen.photo} alt={citizen.fullName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-32 h-32 rounded-xl border-2 border-royal-gold/20 flex items-center justify-center flex-shrink-0 bg-white/[0.02]">
            <span className="text-4xl text-royal-gold/40">{citizen.fullName[0]}</span>
          </div>
        )}
        <div>
          <h1 className="text-2xl font-serif gold-text">{citizen.fullName}</h1>
          <p className="text-royal-gold/60 font-mono text-sm mt-1">{citizen.kkNumber}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-royal-gold/30 text-royal-gold/70">
              {CITIZEN_TYPE_LABELS[citizen.citizenType]}
            </span>
            <span className="text-xs text-royal-cream/40">Registered {formatDate(citizen.registeredAt.slice(0, 10))}</span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="doc-card rounded-xl p-5 bg-white/[0.02]">
          <h3 className="text-xs text-royal-gold/60 uppercase tracking-widest mb-4">Personal Information</h3>
          <dl className="space-y-3">
            {[
              ['Full Name', citizen.fullName],
              ['Date of Birth', `${formatDate(citizen.dateOfBirth)} (Age ${calculateAge(citizen.dateOfBirth)})`],
              ['Place of Birth', citizen.placeOfBirth],
              ['Gender', citizen.gender],
              ['Eye Color', citizen.eyeColor || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-xs text-royal-cream/40">{label}</dt>
                <dd className="text-sm text-royal-cream/80">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="doc-card rounded-xl p-5 bg-white/[0.02]">
          <h3 className="text-xs text-royal-gold/60 uppercase tracking-widest mb-4">Citizenship Details</h3>
          <dl className="space-y-3">
            {[
              ['KK Number', citizen.kkNumber],
              ['Nationality', citizen.nationality],
              ['Citizen Type', CITIZEN_TYPE_LABELS[citizen.citizenType]],
              ['Active Since', citizen.citizenshipActiveDate ? formatDate(citizen.citizenshipActiveDate) : formatDate(citizen.registeredAt.slice(0, 10))],
              ['Address', citizen.address || '—'],
              ['Email', citizen.email || '—'],
              ['Phone', citizen.phone || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-xs text-royal-cream/40">{label}</dt>
                <dd className="text-sm text-royal-cream/80 text-right max-w-[200px] truncate">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Issue Documents */}
      <div className="mb-10">
        <h3 className="text-xs text-royal-gold/60 uppercase tracking-widest mb-4">Issue New Document</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            { type: 'birth_certificate' as DocumentType, icon: '📜', desc: 'Sovereign birth registration' },
            { type: 'id_card' as DocumentType, icon: '🪪', desc: 'Official KK identification' },
            { type: 'passport' as DocumentType, icon: '📕', desc: 'ICAO travel document' },
            { type: 'dual_citizenship' as DocumentType, icon: '🌍', desc: 'KK / United States' },
          ]).map((item) => (
            <button
              key={item.type}
              onClick={() => handleIssueDoc(item.type)}
              className="doc-card rounded-xl p-4 bg-white/[0.02] text-center hover:bg-royal-gold/5 transition-all group"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-xs font-medium text-royal-cream/80 group-hover:text-royal-gold transition-colors">
                {DOCUMENT_LABELS[item.type]}
              </div>
              <div className="text-[10px] text-royal-cream/30 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Issued Documents */}
      {docs.length > 0 && (
        <div>
          <h3 className="text-xs text-royal-gold/60 uppercase tracking-widest mb-4">Issued Documents ({docs.length})</h3>
          <div className="space-y-2">
            {docs.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}?citizenId=${citizen.id}`}
                className="doc-card rounded-lg p-3 bg-white/[0.02] flex items-center justify-between hover:bg-royal-gold/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{doc.type === 'birth_certificate' ? '📜' : doc.type === 'id_card' ? '🪪' : doc.type === 'passport' ? '📕' : '🌍'}</span>
                  <div>
                    <div className="text-sm text-royal-cream/80">{DOCUMENT_LABELS[doc.type]}</div>
                    <div className="text-[10px] text-royal-cream/30 font-mono">{doc.documentNumber}</div>
                  </div>
                </div>
                <div className="text-[10px] text-royal-cream/30">
                  Issued {formatDate(doc.issuedAt.slice(0, 10))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
