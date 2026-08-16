import { useEffect, useState } from 'react';
import { Stethoscope, Award, Building2, DollarSign, Clock, Languages, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/lib/types';

export function DoctorProfileSettings() {
  const { doctor, navigate, setRole, setDoctor, showToast } = useNav();
  const [doc, setDoc] = useState<Doctor | null>(doctor);

  useEffect(() => {
    supabase.from('doctors').select('*').eq('name', 'Dr. Kasun Perera').maybeSingle().then(({ data }) => setDoc(data as Doctor | null));
  }, []);

  return (
    <MobilePage>
      <MobileHeader title="Profile & Settings" />
      <MobileContent className="space-y-4">
        {/* Profile header */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm text-center">
          <Avatar name={doc?.name || 'Dr. Kasun Perera'} size={80} />
          <h2 className="mt-3 font-display text-xl font-bold text-gray-900">{doc?.name}</h2>
          <p className="text-sm text-gray-500">{doc?.specialization}</p>
          <div className="mt-2 flex justify-center">
            {doc?.is_verified ? <VerifiedBadge size="md" /> : <span className="text-sm text-warning-600 font-medium">Pending Verification</span>}
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-3">
          {[
            { icon: Award, label: 'Qualifications', value: doc?.qualifications },
            { icon: Stethoscope, label: 'Specialization', value: doc?.specialization },
            { icon: Building2, label: 'Hospital', value: doc?.hospital },
            { icon: DollarSign, label: 'Consultation Fee', value: formatLKR(doc?.consultation_fee || 2500) },
            { icon: Clock, label: 'Experience', value: `${doc?.experience_years} Years` },
            { icon: Languages, label: 'Languages', value: doc?.languages.join(', ') },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="text-sm font-medium text-gray-800">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Availability */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Available Times</h3>
          <div className="flex flex-wrap gap-2">
            {doc?.available_times.map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* Verification link */}
        <button
          onClick={() => navigate('doctor-verification-status')}
          className="w-full flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
        >
          <ShieldCheck className="w-5 h-5 text-success-600" />
          <span className="flex-1 text-left text-sm font-medium text-gray-700">Verification Status</span>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>

        <Button
          variant="outline"
          fullWidth
          onClick={() => {
            setRole(null);
            setDoctor(null);
            showToast('Logged out');
            navigate('landing');
          }}
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </MobileContent>
    </MobilePage>
  );
}
