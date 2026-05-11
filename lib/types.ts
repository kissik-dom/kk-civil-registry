export type CitizenType =
  | 'born'
  | 'naturalized'
  | 'honorary'
  | 'dual'
  | 'humanitarian'
  | 'regent'
  | 'royal_direct'
  | 'royal_extended';

export type DocumentType =
  | 'birth_certificate'
  | 'id_card'
  | 'passport'
  | 'dual_citizenship'
  | 'laissez_passer';

export interface Citizen {
  id: string;
  fullName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  eyeColor: string;
  nationality: string;
  citizenType: CitizenType;
  citizenshipActiveDate: string;
  address: string;
  email: string;
  phone: string;
  photo?: string;
  kkNumber: string;
  registeredAt: string;
}

export interface Document {
  id: string;
  citizenId: string;
  type: DocumentType;
  documentNumber: string;
  issuedAt: string;
  expiresAt?: string;
}

export const CITIZEN_TYPE_LABELS: Record<CitizenType, string> = {
  born: 'Born Citizen',
  naturalized: 'Naturalized Citizen',
  honorary: 'Honorary Citizen',
  dual: 'Dual Citizen',
  humanitarian: 'Humanitarian Citizen',
  regent: 'Regent',
  royal_direct: 'Royal Family — Direct Lineage',
  royal_extended: 'Royal Family — Extended Lineage',
};

export const CITIZEN_TYPE_CODES: Record<CitizenType, string> = {
  born: 'B',
  naturalized: 'N',
  honorary: 'H',
  dual: 'D',
  humanitarian: 'HM',
  regent: 'RG',
  royal_direct: 'RD',
  royal_extended: 'RE',
};

export const CITIZEN_TYPE_DEFINITIONS: Record<CitizenType, string> = {
  born: 'A person born within the sovereign territory of the Kissi Kingdom or to Kissi Kingdom citizens.',
  naturalized: 'A person who has been granted citizenship through the formal naturalization process by sovereign decree.',
  honorary: 'A distinguished individual granted honorary citizenship by royal proclamation for exceptional service or merit.',
  dual: 'A person holding citizenship of both the Kissi Kingdom and another recognized nation-state.',
  humanitarian: 'A person granted citizenship under the Humanitarian Civilian Registration Program (KK-CRN-H).',
  regent: 'A member of the sovereign authority serving as Regent of the Kissi Kingdom, exercising royal governance.',
  royal_direct: 'A member of the Royal House of Kamanda by direct bloodline descent — immediate royal family.',
  royal_extended: 'A recognized member of the extended Royal House of Kamanda through verified ancestral connection.',
};

export const DOCUMENT_LABELS: Record<DocumentType, string> = {
  birth_certificate: 'Birth Certificate',
  id_card: 'National ID Card',
  passport: 'Sovereign Passport',
  dual_citizenship: 'Dual Citizenship Certificate',
  laissez_passer: 'Laissez-Passer',
};
