'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { getDocuments, getCitizen } from '@/lib/storage';
import { formatDate, formatDateShort, formatDateICAO, generateMRZ } from '@/lib/documents';
import { CITIZEN_TYPE_LABELS } from '@/lib/types';
import type { Citizen, Document } from '@/lib/types';
import Link from 'next/link';

// Color themes by citizen type
function getTheme(citizenType: string) {
  if (citizenType === 'regent') return {
    primary: '#7B1A2C',      // Deep maroon/burgundy
    primaryLight: '#9B3A4C',
    accent: '#c9a84c',        // Gold
    gradient: 'from-[#3a0d15] to-[#1a0a0e]',
    passportCover: 'from-[#4a1020] to-[#2a0810]',
    label: 'text-[#c9a84c]/60',
    border: 'border-[#7B1A2C]/40',
  };
  if (citizenType === 'royal_direct') return {
    primary: '#1a2a5e',       // Navy
    primaryLight: '#2a3a7e',
    accent: '#c9a84c',
    gradient: 'from-[#0d1530] to-[#0a1020]',
    passportCover: 'from-[#101a40] to-[#0a1030]',
    label: 'text-[#c9a84c]/60',
    border: 'border-[#1a2a5e]/40',
  };
  if (citizenType === 'royal_extended') return {
    primary: '#4a3520',       // Brown
    primaryLight: '#6a5540',
    accent: '#c9a84c',
    gradient: 'from-[#2a1a10] to-[#1a1008]',
    passportCover: 'from-[#302010] to-[#201008]',
    label: 'text-[#c9a84c]/60',
    border: 'border-[#4a3520]/40',
  };
  return {
    primary: '#12121a',
    primaryLight: '#1a1a2e',
    accent: '#c9a84c',
    gradient: 'from-[#12121a] to-[#1a1a2e]',
    passportCover: 'from-[#1a0f0a] to-[#2a1a10]',
    label: 'text-[#c9a84c]/60',
    border: 'border-[#c9a84c]/30',
  };
}

export default function DocumentViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [doc, setDoc] = useState<Document | null>(null);
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const docId = params.id as string;
    const citizenId = searchParams.get('citizenId');
    const docs = getDocuments();
    const found = docs.find(d => d.id === docId);
    if (found) {
      setDoc(found);
      if (citizenId) setCitizen(getCitizen(citizenId) || null);
    }
    setLoading(false);
  }, [params.id, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-royal-cream/40">Loading...</div></div>;
  if (!doc || !citizen) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <p className="text-royal-cream/40 mb-4">Document not found</p>
      <Link href="/documents" className="text-royal-gold text-sm hover:underline">← Back to Documents</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="no-print flex items-center justify-between mb-6">
        <Link href={`/citizen/${citizen.id}`} className="text-royal-gold text-sm hover:underline flex items-center gap-1">
          ← Back to {citizen.fullName}
        </Link>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-royal-gold text-royal-dark text-sm font-medium rounded-lg hover:bg-royal-gold/90 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print Document
        </button>
      </div>

      {/* Document Render */}
      <div ref={printRef}>
        {doc.type === 'birth_certificate' && <BirthCertificate citizen={citizen} doc={doc} />}
        {doc.type === 'id_card' && <IDCard citizen={citizen} doc={doc} />}
        {doc.type === 'passport' && <Passport citizen={citizen} doc={doc} />}
        {doc.type === 'dual_citizenship' && <DualCitizenshipCert citizen={citizen} doc={doc} />}
        {doc.type === 'laissez_passer' && <LaissezPasser citizen={citizen} doc={doc} />}
      </div>
    </div>
  );
}

/* ========================================================================
   BIRTH CERTIFICATE
   ======================================================================== */
function BirthCertificate({ citizen, doc }: { citizen: Citizen; doc: Document }) {
  return (
    <div className="bg-[#faf8f0] text-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '8.5/11' }}>
      <div className="h-3 bg-gradient-to-r from-[#a08030] via-[#c9a84c] to-[#a08030]" />

      <div className="px-12 py-8 flex flex-col items-center text-center">
        <img src="/images/royal-seal.png" alt="Royal Seal" className="w-20 h-20 mb-4 opacity-90" />
        <h1 className="text-lg font-display tracking-[0.3em] text-[#8b7340] uppercase">The Royal Kissi Kingdom</h1>
        <p className="text-xs text-[#8b7340]/60 italic mt-1">Omnividens, Omnipotens, Omniaeternus</p>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent my-5" />
        <h2 className="text-2xl font-serif font-bold text-[#2a2a2a] tracking-wider">CERTIFICATE OF BIRTH</h2>
        <p className="text-[10px] text-[#666] mt-1 tracking-wider uppercase">Civil Registry of the Kissi Kingdom</p>
        <div className="mt-4 px-3 py-1 border border-[#c9a84c]/30 rounded text-[10px] font-mono text-[#8b7340]">
          Certificate No. {doc.documentNumber}
        </div>
        <div className="mt-8 text-sm text-[#333] leading-relaxed max-w-md">
          <p>This is to certify that the following person was born and is hereby registered in the Civil Registry of the Kissi Kingdom.</p>
        </div>
        <div className="mt-6 w-full max-w-md text-left">
          <table className="w-full text-sm">
            <tbody>
              {[
                ['Full Legal Name', citizen.fullName],
                ['Date of Birth', formatDate(citizen.dateOfBirth)],
                ['Place of Birth', citizen.placeOfBirth],
                ['Gender', citizen.gender],
                ['Nationality', citizen.nationality],
                ['Citizen Type', CITIZEN_TYPE_LABELS[citizen.citizenType]],
                ['Registration No.', citizen.kkNumber],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-[#e8e0d0]">
                  <td className="py-2 text-[#8b7340] font-medium text-xs w-40">{label}</td>
                  <td className="py-2 text-[#2a2a2a]">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-xs text-[#666] leading-relaxed max-w-md">
          <p>Registered by authority of the Royal House of Kamanda. This certificate is issued under the sovereign authority of the Kissi Kingdom and constitutes an official record of birth within the Civil Registry.</p>
        </div>
        <div className="mt-8 w-full max-w-md flex justify-between items-end">
          <div className="text-left">
            <p className="text-[10px] text-[#999]">Date of Issuance</p>
            <p className="text-sm text-[#333] font-medium">{formatDate(doc.issuedAt.slice(0, 10))}</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-[#c9a84c]/40 mb-1" />
            <p className="text-[10px] text-[#999]">Registrar, Civil Registry</p>
            <p className="text-[10px] text-[#999]">Kissi Kingdom</p>
          </div>
        </div>
      </div>
      <div className="h-3 bg-gradient-to-r from-[#a08030] via-[#c9a84c] to-[#a08030] mt-auto" />
    </div>
  );
}

/* ========================================================================
   NATIONAL ID CARD — color-coded by citizen type
   ======================================================================== */
function IDCard({ citizen, doc }: { citizen: Citizen; doc: Document }) {
  const theme = getTheme(citizen.citizenType);

  return (
    <div className="max-w-md mx-auto">
      {/* Front */}
      <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl overflow-hidden shadow-2xl ${theme.border} border mb-6`} style={{ aspectRatio: '1.586/1' }}>
        <div className="h-full p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <img src="/images/royal-seal.png" alt="Seal" className="w-8 h-8 opacity-80" />
            <div>
              <p className="text-[9px] text-[#c9a84c]/80 tracking-[0.2em] uppercase">The Royal Kissi Kingdom</p>
              <p className="text-[7px] text-[#c9a84c]/40 tracking-wider">NATIONAL IDENTIFICATION CARD</p>
            </div>
          </div>
          <div className="flex gap-4 flex-1">
            <div className={`w-24 h-28 rounded-lg overflow-hidden ${theme.border} border flex-shrink-0`} style={{ background: theme.primary }}>
              {citizen.photo ? (
                <img src={citizen.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl text-[#c9a84c]/30">{citizen.fullName[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-[10px] space-y-1.5">
              <div>
                <span className="text-[#c9a84c]/50 block text-[8px]">FULL NAME</span>
                <span className="text-white font-medium text-xs">{citizen.fullName.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div>
                  <span className="text-[#c9a84c]/50 block text-[8px]">DATE OF BIRTH</span>
                  <span className="text-white/80">{formatDateShort(citizen.dateOfBirth)}</span>
                </div>
                <div>
                  <span className="text-[#c9a84c]/50 block text-[8px]">GENDER</span>
                  <span className="text-white/80">{citizen.gender[0]}</span>
                </div>
                <div>
                  <span className="text-[#c9a84c]/50 block text-[8px]">NATIONALITY</span>
                  <span className="text-white/80">{citizen.nationality}</span>
                </div>
                <div>
                  <span className="text-[#c9a84c]/50 block text-[8px]">EYE COLOR</span>
                  <span className="text-white/80">{citizen.eyeColor || '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-[#c9a84c]/50 block text-[8px]">ID NUMBER</span>
                <span className="text-[#c9a84c] font-mono text-[11px]">{doc.documentNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end mt-2 pt-2 border-t border-[#c9a84c]/10">
            <div className="text-[8px] text-white/30">
              <span>ISSUED: {formatDateShort(doc.issuedAt.slice(0, 10))}</span>
              {doc.expiresAt && <span className="ml-3">EXPIRES: {formatDateShort(doc.expiresAt.slice(0, 10))}</span>}
            </div>
            <div className="text-[8px] text-[#c9a84c]/40 font-mono">{citizen.kkNumber}</div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className={`bg-gradient-to-br ${theme.gradient} rounded-2xl overflow-hidden shadow-2xl ${theme.border} border`} style={{ aspectRatio: '1.586/1' }}>
        <div className="h-full p-5 flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-[9px] text-white/30 mb-3 text-center uppercase tracking-widest">Additional Information</p>
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <div>
                <span className="text-[#c9a84c]/50 block text-[8px]">PLACE OF BIRTH</span>
                <span className="text-white/80">{citizen.placeOfBirth}</span>
              </div>
              <div>
                <span className="text-[#c9a84c]/50 block text-[8px]">CITIZEN TYPE</span>
                <span className="text-white/80">{CITIZEN_TYPE_LABELS[citizen.citizenType]}</span>
              </div>
              <div>
                <span className="text-[#c9a84c]/50 block text-[8px]">CITIZENSHIP ACTIVE</span>
                <span className="text-white/80">{formatDateShort(citizen.citizenshipActiveDate || citizen.registeredAt.slice(0, 10))}</span>
              </div>
              <div>
                <span className="text-[#c9a84c]/50 block text-[8px]">REGISTRATION NO.</span>
                <span className="text-white/80 font-mono">{citizen.kkNumber}</span>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-3 border-t border-[#c9a84c]/10">
            <p className="text-[7px] text-white/20 text-center leading-relaxed">
              The bearer of this credential is a duly recognized citizen of the Kissi Kingdom. All courtesies and immunities afforded under international law are respectfully requested.
            </p>
            <p className="text-[7px] text-[#c9a84c]/30 text-center mt-1">
              Registered by authority of the Royal House of Kamanda
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   SOVEREIGN PASSPORT — color-coded by citizen type
   ======================================================================== */
function Passport({ citizen, doc }: { citizen: Citizen; doc: Document }) {
  const theme = getTheme(citizen.citizenType);
  const expiryDate = doc.expiresAt?.slice(0, 10) || '';
  const mrz = generateMRZ(citizen, doc.documentNumber, expiryDate);
  const isRoyal = ['regent', 'royal_direct', 'royal_extended'].includes(citizen.citizenType);

  return (
    <div className="max-w-lg mx-auto">
      {/* Passport cover */}
      <div className={`bg-gradient-to-b ${theme.passportCover} rounded-xl overflow-hidden shadow-2xl border border-[#c9a84c]/40 mb-6`} style={{ aspectRatio: '3/4' }}>
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <p className="text-[10px] text-[#c9a84c]/60 tracking-[0.4em] uppercase mb-6">
            {isRoyal ? 'Sovereign Diplomatic Passport' : 'Sovereign Travel Document'}
          </p>
          <img src="/images/royal-seal.png" alt="Royal Seal" className="w-28 h-28 mb-6 opacity-90" />
          <h1 className="text-lg font-display tracking-[0.3em] text-[#c9a84c] uppercase">Kissi Kingdom</h1>
          <p className="text-[9px] text-[#c9a84c]/40 mt-1 italic">Omnividens, Omnipotens, Omniaeternus</p>
          {isRoyal && (
            <p className="text-[9px] text-[#c9a84c]/50 mt-3 tracking-wider uppercase">{CITIZEN_TYPE_LABELS[citizen.citizenType]}</p>
          )}
          <div className="mt-8 w-24 h-px bg-[#c9a84c]/30" />
          <p className="text-[10px] text-[#c9a84c]/50 tracking-[0.3em] uppercase mt-4">Passport</p>
        </div>
      </div>

      {/* Bio data page */}
      <div className="bg-[#faf8f0] rounded-xl overflow-hidden shadow-2xl text-[#1a1a1a]" style={{ aspectRatio: '3/4' }}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#c9a84c]/20">
            <img src="/images/royal-seal.png" alt="Seal" className="w-10 h-10 opacity-80" />
            <div>
              <p className="text-[10px] text-[#8b7340] tracking-[0.2em] uppercase font-medium">Kissi Kingdom</p>
              <p className="text-[8px] text-[#8b7340]/50 tracking-wider">SOVEREIGN PASSPORT — ICAO COMPLIANT</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-28 h-36 rounded border-2 border-[#c9a84c]/30 overflow-hidden flex-shrink-0 bg-gray-100">
              {citizen.photo ? (
                <img src={citizen.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <span className="text-4xl text-[#c9a84c]/30">{citizen.fullName[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2 text-[10px]">
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Type / Type</span>
                <span className="font-medium">{isRoyal ? 'PD' : 'P'}</span>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Country Code / Code du pays</span>
                <span className="font-medium">KSI</span>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Surname / Nom</span>
                <span className="font-bold text-xs">{citizen.fullName.split(' ').slice(-1).join(' ').toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Given Names / Prénoms</span>
                <span className="font-bold text-xs">{citizen.fullName.split(' ').slice(0, -1).join(' ').toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Nationality / Nationalité</span>
                  <span className="font-medium">KISSI KINGDOM</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Date of Birth / Date de naissance</span>
                  <span className="font-medium">{formatDateICAO(citizen.dateOfBirth)}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Sex / Sexe</span>
                  <span className="font-medium">{citizen.gender[0]}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Place of Birth / Lieu de naissance</span>
                  <span className="font-medium">{citizen.placeOfBirth.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Date of Issue / Date de délivrance</span>
                  <span className="font-medium">{formatDateICAO(doc.issuedAt.slice(0, 10))}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Date of Expiry / Date d&apos;expiration</span>
                  <span className="font-medium">{doc.expiresAt ? formatDateICAO(doc.expiresAt.slice(0, 10)) : '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Passport No. / No. de passeport</span>
                <span className="font-mono font-bold text-xs text-[#8b7340]">{doc.documentNumber}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#c9a84c]/20">
            <div className="flex justify-between items-end">
              <div>
                <div className="w-32 border-b border-[#333]/30 mb-1" />
                <p className="text-[8px] text-[#999]">Holder&apos;s signature / Signature du titulaire</p>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-[#333]/30 mb-1" />
                <p className="text-[8px] text-[#999]">Authority / Autorité</p>
              </div>
            </div>
          </div>
          <div className="mt-auto pt-3 border-t-2 border-[#333]">
            <div className="bg-white py-2 px-1 font-mono text-[11px] leading-relaxed tracking-wider text-[#333]">
              <div className="mrz-font">{mrz[0]}</div>
              <div className="mrz-font">{mrz[1]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   DUAL CITIZENSHIP CERTIFICATE
   ======================================================================== */
function DualCitizenshipCert({ citizen, doc }: { citizen: Citizen; doc: Document }) {
  return (
    <div className="bg-[#faf8f0] text-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '8.5/11' }}>
      <div className="h-3 bg-gradient-to-r from-[#a08030] via-[#c9a84c] to-[#a08030]" />
      <div className="px-12 py-8 flex flex-col items-center text-center">
        <img src="/images/royal-seal.png" alt="Royal Seal" className="w-20 h-20 mb-4 opacity-90" />
        <h1 className="text-lg font-display tracking-[0.3em] text-[#8b7340] uppercase">The Royal Kissi Kingdom</h1>
        <p className="text-xs text-[#8b7340]/60 italic mt-1">Omnividens, Omnipotens, Omniaeternus</p>
        <div className="w-48 h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent my-5" />
        <h2 className="text-2xl font-serif font-bold text-[#2a2a2a] tracking-wider">CERTIFICATE OF DUAL CITIZENSHIP</h2>
        <p className="text-[10px] text-[#666] mt-1 tracking-wider uppercase">Kissi Kingdom / United States of America</p>
        <div className="mt-4 px-3 py-1 border border-[#c9a84c]/30 rounded text-[10px] font-mono text-[#8b7340]">
          Certificate No. {doc.documentNumber}
        </div>
        <div className="mt-8 text-sm text-[#333] leading-relaxed max-w-md">
          <p>This certifies that the person named herein is a recognized citizen of both the Kissi Kingdom and the United States of America, entitled to all rights and protections under sovereign authority.</p>
        </div>
        <div className="mt-6 flex gap-6 w-full max-w-md">
          <div className="w-24 h-28 rounded border-2 border-[#c9a84c]/30 overflow-hidden flex-shrink-0">
            {citizen.photo ? (
              <img src={citizen.photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-3xl text-[#c9a84c]/30">{citizen.fullName[0]}</span>
              </div>
            )}
          </div>
          <table className="flex-1 text-sm text-left">
            <tbody>
              {[
                ['Full Legal Name', citizen.fullName],
                ['Date of Birth', formatDate(citizen.dateOfBirth)],
                ['Place of Birth', citizen.placeOfBirth],
                ['Citizenship 1', 'Kissi Kingdom'],
                ['Citizenship 2', 'United States of America'],
                ['Registration No.', citizen.kkNumber],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-[#e8e0d0]">
                  <td className="py-1.5 text-[#8b7340] font-medium text-xs w-32">{label}</td>
                  <td className="py-1.5 text-[#2a2a2a] text-xs">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-xs text-[#666] leading-relaxed max-w-md">
          <p>All citizenship dates from Kingdom founding. No expiration. This certificate is issued under the sovereign authority of the Kissi Kingdom and attests to the dual citizenship status of the named individual. The holder is entitled to all rights, privileges, and protections afforded to citizens of both jurisdictions.</p>
        </div>
        <div className="mt-8 w-full max-w-md flex justify-between items-end">
          <div className="text-left">
            <p className="text-[10px] text-[#999]">Date of Issuance</p>
            <p className="text-sm text-[#333] font-medium">{formatDate(doc.issuedAt.slice(0, 10))}</p>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-[#c9a84c]/40 mb-1" />
            <p className="text-[10px] text-[#999]">Registrar, Civil Registry</p>
            <p className="text-[10px] text-[#999]">Kissi Kingdom</p>
          </div>
        </div>
      </div>
      <div className="h-3 bg-gradient-to-r from-[#a08030] via-[#c9a84c] to-[#a08030] mt-auto" />
    </div>
  );
}

/* ========================================================================
   LAISSEZ-PASSER — Sovereign Emergency Travel Document
   ======================================================================== */
function LaissezPasser({ citizen, doc }: { citizen: Citizen; doc: Document }) {
  const theme = getTheme(citizen.citizenType);
  const isRoyal = ['regent', 'royal_direct', 'royal_extended'].includes(citizen.citizenType);
  const expiryDate = doc.expiresAt?.slice(0, 10) || '';
  const mrz = generateMRZ(citizen, doc.documentNumber, expiryDate);

  return (
    <div className="max-w-lg mx-auto">
      {/* Cover */}
      <div className={`bg-gradient-to-b ${theme.passportCover} rounded-xl overflow-hidden shadow-2xl border border-[#c9a84c]/40 mb-6`} style={{ aspectRatio: '3/4' }}>
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <p className="text-[10px] text-[#c9a84c]/60 tracking-[0.4em] uppercase mb-3">Sovereign Travel Document</p>

          {/* Gold double border frame */}
          <div className="border-2 border-[#c9a84c]/40 rounded-lg p-6 mb-4">
            <div className="border border-[#c9a84c]/20 rounded-lg p-6">
              <img src="/images/royal-seal.png" alt="Royal Seal" className="w-24 h-24 mx-auto mb-4 opacity-90" />
              <h1 className="text-xl font-display tracking-[0.2em] text-[#c9a84c] uppercase">Laissez-Passer</h1>
            </div>
          </div>

          <h2 className="text-sm font-display tracking-[0.3em] text-[#c9a84c]/80 uppercase">Kissi Kingdom</h2>
          <p className="text-[9px] text-[#c9a84c]/40 mt-1 italic">Omnividens, Omnipotens, Omniaeternus</p>

          {isRoyal && (
            <p className="text-[9px] text-[#c9a84c]/50 mt-3 tracking-wider uppercase">{CITIZEN_TYPE_LABELS[citizen.citizenType]}</p>
          )}

          <div className="mt-6 text-[8px] text-[#c9a84c]/30 max-w-[250px] leading-relaxed">
            The bearer of this document is under the protection of the Kissi Kingdom. All authorities are requested to permit the bearer to pass freely and to afford such assistance and protection as may be necessary.
          </div>
        </div>
      </div>

      {/* Inner pages */}
      <div className="bg-[#faf8f0] rounded-xl overflow-hidden shadow-2xl text-[#1a1a1a]" style={{ aspectRatio: '3/4' }}>
        <div className="h-full flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#c9a84c]/20">
            <img src="/images/royal-seal.png" alt="Seal" className="w-10 h-10 opacity-80" />
            <div>
              <p className="text-[10px] text-[#8b7340] tracking-[0.2em] uppercase font-medium">Kissi Kingdom</p>
              <p className="text-[8px] text-[#8b7340]/50 tracking-wider">LAISSEZ-PASSER — SOVEREIGN TRAVEL DOCUMENT</p>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Photo */}
            <div className="w-28 h-36 rounded border-2 border-[#c9a84c]/30 overflow-hidden flex-shrink-0 bg-gray-100">
              {citizen.photo ? (
                <img src={citizen.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <span className="text-4xl text-[#c9a84c]/30">{citizen.fullName[0]}</span>
                </div>
              )}
            </div>

            {/* Bio data */}
            <div className="flex-1 space-y-2 text-[10px]">
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Document Type</span>
                <span className="font-medium">LAISSEZ-PASSER</span>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Issuing Authority</span>
                <span className="font-medium">KISSI KINGDOM (KSI)</span>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Full Name / Nom complet</span>
                <span className="font-bold text-xs">{citizen.fullName.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Nationality</span>
                  <span className="font-medium">KISSI KINGDOM</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Date of Birth</span>
                  <span className="font-medium">{formatDateICAO(citizen.dateOfBirth)}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Sex</span>
                  <span className="font-medium">{citizen.gender[0]}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Place of Birth</span>
                  <span className="font-medium">{citizen.placeOfBirth.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Date of Issue</span>
                  <span className="font-medium">{formatDateICAO(doc.issuedAt.slice(0, 10))}</span>
                </div>
                <div>
                  <span className="text-[#8b7340]/60 block text-[8px] uppercase">Valid Until</span>
                  <span className="font-medium">{doc.expiresAt ? formatDateICAO(doc.expiresAt.slice(0, 10)) : '—'}</span>
                </div>
              </div>
              <div>
                <span className="text-[#8b7340]/60 block text-[8px] uppercase">Document No.</span>
                <span className="font-mono font-bold text-xs text-[#8b7340]">{doc.documentNumber}</span>
              </div>
            </div>
          </div>

          {/* Travel authorization */}
          <div className="mt-4 p-3 border border-[#c9a84c]/20 rounded-lg bg-[#f5f0e0]">
            <p className="text-[9px] text-[#8b7340] font-medium mb-1 uppercase tracking-wider">Travel Authorization</p>
            <p className="text-[8px] text-[#666] leading-relaxed">
              The Government of the Kissi Kingdom requests all whom it may concern to permit the bearer to pass freely without let or hindrance and to afford the bearer such assistance and protection as may be necessary. This document is valid for all modes of international travel including private aviation.
            </p>
          </div>

          {/* Signatures */}
          <div className="mt-3 pt-2 border-t border-[#c9a84c]/20">
            <div className="flex justify-between items-end">
              <div>
                <div className="w-32 border-b border-[#333]/30 mb-1" />
                <p className="text-[8px] text-[#999]">Bearer&apos;s Signature</p>
              </div>
              <div className="text-right">
                <div className="w-32 border-b border-[#333]/30 mb-1" />
                <p className="text-[8px] text-[#999]">Issuing Authority</p>
              </div>
            </div>
          </div>

          {/* MRZ Zone */}
          <div className="mt-auto pt-3 border-t-2 border-[#333]">
            <div className="bg-white py-2 px-1 font-mono text-[11px] leading-relaxed tracking-wider text-[#333]">
              <div className="mrz-font">{mrz[0]}</div>
              <div className="mrz-font">{mrz[1]}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
