'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveCitizen } from '@/lib/storage';
import PhotoUpload from '@/components/PhotoUpload';
import { CITIZEN_TYPE_LABELS, CITIZEN_TYPE_DEFINITIONS } from '@/lib/types';
import type { Citizen, CitizenType } from '@/lib/types';

const INITIAL: Omit<Citizen, 'id' | 'kkNumber' | 'registeredAt'> = {
  fullName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  gender: 'Male',
  eyeColor: '',
  nationality: 'Kissi Kingdom',
  citizenType: 'born',
  citizenshipActiveDate: '',
  address: '',
  email: '',
  phone: '',
  photo: undefined,
};

const TYPE_ORDER: CitizenType[] = [
  'regent', 'royal_direct', 'royal_extended',
  'born', 'naturalized', 'honorary', 'dual', 'humanitarian',
];

const TYPE_ICONS: Record<CitizenType, string> = {
  regent: '👑',
  royal_direct: '⚜️',
  royal_extended: '🛡️',
  born: '👶',
  naturalized: '📜',
  honorary: '🏅',
  dual: '🌍',
  humanitarian: '🕊️',
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName || !form.dateOfBirth || !form.placeOfBirth || !form.gender || !form.citizenType) {
      setError('Please fill in all required fields (marked with *)');
      return;
    }

    setSaving(true);
    try {
      const citizen = saveCitizen(form);
      router.push(`/citizen/${citizen.id}`);
    } catch {
      setError('Failed to register citizen. Please try again.');
      setSaving(false);
    }
  };

  const isRoyal = ['regent', 'royal_direct', 'royal_extended'].includes(form.citizenType);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-serif gold-text mb-2">Register New Citizen</h1>
        <p className="text-royal-cream/40 text-sm">Register a citizen and generate their unique KK identification number</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-xs text-royal-gold/80 uppercase tracking-widest mb-4">Citizen Photo</h3>
          <PhotoUpload
            value={form.photo}
            onChange={(photo) => setForm(prev => ({ ...prev, photo }))}
            size="lg"
          />
          <p className="text-[10px] text-royal-cream/30 mt-2">Passport-quality photo. Will appear on all official documents.</p>
        </div>

        {/* Citizen Type Selection — with definitions */}
        <fieldset className={`border rounded-xl p-6 ${isRoyal ? 'border-[#7B1A2C]/40 bg-[#7B1A2C]/5' : 'border-royal-gold/10'}`}>
          <legend className="text-xs text-royal-gold/60 uppercase tracking-widest px-2">Citizen Classification</legend>

          <label className="block mb-2">Citizen Type *</label>
          <div className="grid gap-2">
            {TYPE_ORDER.map((type) => {
              const selected = form.citizenType === type;
              const isRoyalType = ['regent', 'royal_direct', 'royal_extended'].includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => set('citizenType', type)}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selected
                      ? isRoyalType
                        ? 'border-[#7B1A2C] bg-[#7B1A2C]/15 ring-1 ring-[#7B1A2C]/30'
                        : 'border-royal-gold/50 bg-royal-gold/10 ring-1 ring-royal-gold/20'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{TYPE_ICONS[type]}</span>
                    <span className={`text-sm font-medium ${
                      selected
                        ? isRoyalType ? 'text-[#e8a0b0]' : 'text-royal-gold'
                        : 'text-royal-cream/70'
                    }`}>
                      {CITIZEN_TYPE_LABELS[type]}
                    </span>
                    {selected && <span className="ml-auto text-xs">✓</span>}
                  </div>
                  <p className={`text-[11px] mt-1 ml-7 leading-relaxed ${
                    selected ? 'text-royal-cream/50' : 'text-royal-cream/25'
                  }`}>
                    {CITIZEN_TYPE_DEFINITIONS[type]}
                  </p>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Personal Information */}
        <fieldset className="border border-royal-gold/10 rounded-xl p-6">
          <legend className="text-xs text-royal-gold/60 uppercase tracking-widest px-2">Personal Information</legend>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label>Full Legal Name *</label>
              <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="First Middle Last" required />
            </div>
            <div>
              <label>Date of Birth *</label>
              <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} required />
            </div>
            <div>
              <label>Place of Birth *</label>
              <input type="text" value={form.placeOfBirth} onChange={e => set('placeOfBirth', e.target.value)} placeholder="City, Country" required />
            </div>
            <div>
              <label>Gender *</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Eye Color</label>
              <input type="text" value={form.eyeColor} onChange={e => set('eyeColor', e.target.value)} placeholder="Brown, Blue, Green..." />
            </div>
          </div>
        </fieldset>

        {/* Citizenship Information */}
        <fieldset className="border border-royal-gold/10 rounded-xl p-6">
          <legend className="text-xs text-royal-gold/60 uppercase tracking-widest px-2">Citizenship Information</legend>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Nationality</label>
              <input type="text" value={form.nationality} onChange={e => set('nationality', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label>Citizenship Active Since</label>
              <input
                type="date"
                value={form.citizenshipActiveDate}
                onChange={e => set('citizenshipActiveDate', e.target.value)}
              />
              <p className="text-[10px] text-royal-cream/30 mt-1">Date citizenship became effective. Leave blank to default to registration date.</p>
            </div>
          </div>
        </fieldset>

        {/* Contact Information */}
        <fieldset className="border border-royal-gold/10 rounded-xl p-6">
          <legend className="text-xs text-royal-gold/60 uppercase tracking-widest px-2">Contact Information</legend>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label>Address</label>
              <input type="text" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street, City, State, Country" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="citizen@example.com" />
            </div>
            <div>
              <label>Phone</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
            </div>
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={saving}
            className={`px-10 py-3 font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 ${
              isRoyal
                ? 'bg-[#7B1A2C] text-white hover:bg-[#8B2A3C]'
                : 'bg-royal-gold text-royal-dark hover:bg-royal-gold/90'
            }`}
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                Registering...
              </>
            ) : (
              <>Register Citizen &amp; Generate KK Number</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
