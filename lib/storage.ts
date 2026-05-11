'use client';

import { Citizen, Document, CITIZEN_TYPE_CODES } from './types';
import type { DocumentType } from './types';

const CITIZENS_KEY = 'kk_civil_registry_citizens';
const DOCUMENTS_KEY = 'kk_civil_registry_documents';
const COUNTER_KEY = 'kk_civil_registry_counter';

function getStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function getCounter(): number {
  if (typeof window === 'undefined') return 1;
  const raw = localStorage.getItem(COUNTER_KEY);
  return raw ? parseInt(raw) : 1;
}

function incrementCounter(): number {
  const current = getCounter();
  localStorage.setItem(COUNTER_KEY, String(current + 1));
  return current;
}

// Generate KK-CRN number: KK-CRN-{TYPE_CODE}-{YEAR}-{SEQ:5}
export function generateKKNumber(citizenType: Citizen['citizenType']): string {
  const seq = incrementCounter();
  const year = new Date().getFullYear();
  const typeCode = CITIZEN_TYPE_CODES[citizenType];
  return `KK-CRN-${typeCode}-${year}-${String(seq).padStart(5, '0')}`;
}

// Generate document number: KK-{TYPE}-{YEAR}-{SEQ:6}
export function generateDocNumber(type: DocumentType): string {
  const seq = incrementCounter();
  const year = new Date().getFullYear();
  const typeMap: Record<DocumentType, string> = {
    birth_certificate: 'BC',
    id_card: 'ID',
    passport: 'PP',
    dual_citizenship: 'DC',
    laissez_passer: 'LP',
  };
  return `KK-${typeMap[type]}-${year}-${String(seq).padStart(6, '0')}`;
}

// Citizens CRUD
export function getCitizens(): Citizen[] {
  return getStorage<Citizen>(CITIZENS_KEY);
}

export function getCitizen(id: string): Citizen | undefined {
  return getCitizens().find(c => c.id === id);
}

export function saveCitizen(citizen: Omit<Citizen, 'id' | 'kkNumber' | 'registeredAt'>): Citizen {
  const citizens = getCitizens();
  const newCitizen: Citizen = {
    ...citizen,
    id: crypto.randomUUID(),
    kkNumber: generateKKNumber(citizen.citizenType),
    registeredAt: new Date().toISOString(),
  };
  citizens.push(newCitizen);
  setStorage(CITIZENS_KEY, citizens);
  return newCitizen;
}

export function updateCitizen(id: string, updates: Partial<Citizen>): Citizen | undefined {
  const citizens = getCitizens();
  const index = citizens.findIndex(c => c.id === id);
  if (index === -1) return undefined;
  citizens[index] = { ...citizens[index], ...updates };
  setStorage(CITIZENS_KEY, citizens);
  return citizens[index];
}

export function deleteCitizen(id: string): boolean {
  const citizens = getCitizens();
  const filtered = citizens.filter(c => c.id !== id);
  if (filtered.length === citizens.length) return false;
  setStorage(CITIZENS_KEY, filtered);
  // Also delete citizen's documents
  const docs = getDocuments().filter(d => d.citizenId !== id);
  setStorage(DOCUMENTS_KEY, docs);
  return true;
}

// Documents CRUD
export function getDocuments(): Document[] {
  return getStorage<Document>(DOCUMENTS_KEY);
}

export function getDocumentsByCitizen(citizenId: string): Document[] {
  return getDocuments().filter(d => d.citizenId === citizenId);
}

export function issueDocument(citizenId: string, type: DocumentType): Document {
  const docs = getDocuments();
  const now = new Date();
  const newDoc: Document = {
    id: crypto.randomUUID(),
    citizenId,
    type,
    documentNumber: generateDocNumber(type),
    issuedAt: now.toISOString(),
    expiresAt: type === 'passport' ? new Date(now.getFullYear() + 10, now.getMonth(), now.getDate()).toISOString() :
               type === 'id_card' ? new Date(now.getFullYear() + 10, now.getMonth(), now.getDate()).toISOString() :
               type === 'laissez_passer' ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString() :
               undefined,
  };
  docs.push(newDoc);
  setStorage(DOCUMENTS_KEY, docs);
  return newDoc;
}

export function getStats() {
  const citizens = getCitizens();
  const docs = getDocuments();
  return {
    totalCitizens: citizens.length,
    totalDocuments: docs.length,
    byType: {
      born: citizens.filter(c => c.citizenType === 'born').length,
      naturalized: citizens.filter(c => c.citizenType === 'naturalized').length,
      honorary: citizens.filter(c => c.citizenType === 'honorary').length,
      dual: citizens.filter(c => c.citizenType === 'dual').length,
      humanitarian: citizens.filter(c => c.citizenType === 'humanitarian').length,
      regent: citizens.filter(c => c.citizenType === 'regent').length,
      royal_direct: citizens.filter(c => c.citizenType === 'royal_direct').length,
      royal_extended: citizens.filter(c => c.citizenType === 'royal_extended').length,
    },
  };
}
