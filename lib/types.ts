export interface Citizen {
  id: string;
  kkNumber: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  eyeColor: string;
  nationality: string;
  citizenType: 'born' | 'naturalized' | 'honorary' | 'dual' | 'humanitarian';
  citizenshipActiveDate: string;
  address?: string;
  email?: string;
  phone?: string;
  photo?: string; // base64 data URL
  registeredAt: string;
}

export interface Document {
  id: string;
  citizenId: string;
  type: 'birth_certificate' | 'id_card' | 'passport' | 'dual_citizenship';
  documentNumber: string;
  issuedAt: string;
  expiresAt?: string;
}

export type DocumentType = Document['type'];

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  birth_certificate: 'Birth Certificate',
  id_card: 'National ID Card',
  passport: 'Sovereign Passport',
  dual_citizenship: 'Dual Citizenship Certificate',
};

export const CITIZEN_TYPE_LABELS: Record<Citizen['citizenType'], string> = {
  born: 'Born Citizen',
  naturalized: 'Naturalized Citizen',
  honorary: 'Honorary Citizen',
  dual: 'Dual Citizen',
  humanitarian: 'Humanitarian Citizen',
};

export const CITIZEN_TYPE_CODES: Record<Citizen['citizenType'], string> = {
  born: 'B',
  naturalized: 'N',
  honorary: 'H',
  dual: 'D',
  humanitarian: 'HM',
};
