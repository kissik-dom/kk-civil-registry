import { Citizen } from './types';

// Format date for display: "June 27, 2022"
export function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Format date short: "27 JUN 2022"
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

// Format date ICAO: "01 JAN 96"
export function formatDateICAO(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = d.getFullYear().toString().slice(-2);
  return `${day} ${month} ${year}`;
}

// MRZ check digit (ICAO 9303 standard)
function mrzCheckDigit(input: string): string {
  const weights = [7, 3, 1];
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    let val = 0;
    if (char >= '0' && char <= '9') val = parseInt(char);
    else if (char >= 'A' && char <= 'Z') val = char.charCodeAt(0) - 55;
    else val = 0; // < is 0
    sum += val * weights[i % 3];
  }
  return (sum % 10).toString();
}

// Generate ICAO MRZ for passport (2 lines, 44 chars each)
export function generateMRZ(citizen: Citizen, passportNumber: string, expiryDate: string): string[] {
  const surnames = citizen.fullName.split(' ').slice(-1).join('<').toUpperCase().replace(/[^A-Z<]/g, '');
  const givenNames = citizen.fullName.split(' ').slice(0, -1).join('<').toUpperCase().replace(/[^A-Z<]/g, '');
  const namePart = `${surnames}<<${givenNames}`;

  // Line 1: P<ISSUING_COUNTRY<SURNAME<<GIVEN_NAMES
  let line1 = `P<KSI${namePart}`;
  line1 = line1.padEnd(44, '<').slice(0, 44);

  // Line 2: PASSPORT_NO + CHECK + NATIONALITY + DOB + CHECK + SEX + EXPIRY + CHECK + PERSONAL_NO + CHECK + OVERALL_CHECK
  const passNum = passportNumber.replace(/-/g, '').slice(0, 9).padEnd(9, '<');
  const passCheck = mrzCheckDigit(passNum);
  const nat = 'KSI';
  const dob = citizen.dateOfBirth.replace(/-/g, '').slice(2); // YYMMDD
  const dobCheck = mrzCheckDigit(dob);
  const sex = citizen.gender === 'Male' ? 'M' : citizen.gender === 'Female' ? 'F' : 'X';
  const exp = expiryDate.replace(/-/g, '').slice(2); // YYMMDD
  const expCheck = mrzCheckDigit(exp);
  const personalNum = ''.padEnd(14, '<');
  const personalCheck = mrzCheckDigit(personalNum);

  const composite = `${passNum}${passCheck}${dob}${dobCheck}${exp}${expCheck}${personalNum}${personalCheck}`;
  const overallCheck = mrzCheckDigit(composite);

  let line2 = `${passNum}${passCheck}${nat}${dob}${dobCheck}${sex}${exp}${expCheck}${personalNum}${personalCheck}${overallCheck}`;
  line2 = line2.padEnd(44, '<').slice(0, 44);

  return [line1, line2];
}

// Calculate age
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}
