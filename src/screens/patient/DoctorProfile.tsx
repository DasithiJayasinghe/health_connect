import { useEffect, useState } from 'react';
import { ShieldCheck, FileText, MessageSquare, Calendar, Award, Building2, Clock, Users, Star, Languages, CheckCircle2, Lock, KeyRound } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge, VerifiedByHealthConnect, VerificationCheck, StarRating } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/lib/types';

export function DoctorProfile() {
  const { selectedDoctorId, navigate } = useNav();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [tab, setTab] = useState<'overview' | 'credentials' | 'reviews'>('overview');

  useEffect(() => {
    if (selectedDoctorId) {
      supabase.from('doctors').select('*').eq('id', selectedDoctorId).maybeSingle().then(({ data }) => setDoctor(data as Doctor | null));
    } else {
      supabase.from('doctors').select('*').eq('name', 'Dr. Kasun Perera').maybeSingle().then(({ data }) => setDoctor(data as Doctor | null));
    }
  }, [selectedDoctorId]);

  if (!doctor) {
    return (
      <MobilePage>
        <MobileHeader title="Doctor Profile" />
        <MobileContent><div className="h-64 rounded-2xl bg-gray-100 animate-pulse" /></MobileContent>
      </MobilePage>
    );
  }

  const reviews = [
    { name: 'Nimali P.', rating: 5, text: 'Excellent consultation. The verification badge gave me confidence to book online.', date: '2 weeks ago' },
    { name: 'Samantha R.', rating: 5, text: 'Very professional and thorough. Highly recommend Dr. Perera.', date: '1 month ago' },
    { name: 'Thilini K.', rating: 4, text: 'Good experience, the video call was clear and the prescription was helpful.', date: '1 month ago' },
  ];

  return (
    <MobilePage>
      <MobileHeader title="Doctor Profile" subtitle={doctor.specialization} />
      <MobileContent className="space-y-4">
        {/* Profile header */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <Avatar name={doctor.name} size={72} />
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-bold text-gray-900">{doctor.name}</h2>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
              <div className="mt-2">
                {doctor.is_verified ? (
                  <VerifiedBadge size="md" />
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 text-warning-700 text-sm font-semibold px-3 py-1">
                    <Clock className="w-4 h-4" /> Pending Verification
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Verification checks */}
          {doctor.is_verified && (
            <div className="mt-4 rounded-xl bg-success-50 border border-success-100 p-4 space-y-2.5">
              <VerificationCheck label="Identity Verified" />
              <VerificationCheck label="Medical Credentials Verified" />
              <VerificationCheck label="Professional Registration Verified" />
              <VerificationCheck label="Hospital Affiliation Verified" />
              <div className="pt-2 border-t border-success-100">
                <VerifiedByHealthConnect size="md" />
                <p className="text-xs text-success-700 mt-1.5">Verified by HealthConnect Administration.</p>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {[
            { key: 'overview' as const, label: 'Overview', icon: FileText },
            { key: 'credentials' as const, label: 'Credentials', icon: Award },
            { key: 'reviews' as const, label: 'Reviews', icon: MessageSquare },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t.key ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {tab === 'overview' && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600">{doctor.bio}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Award, label: 'Qualifications', value: doctor.qualifications },
                { icon: Clock, label: 'Experience', value: `${doctor.experience_years} Years` },
                { icon: Building2, label: 'Hospital', value: doctor.hospital },
                { icon: Users, label: 'Consultations', value: `${doctor.total_consultations}+` },
                { icon: Star, label: 'Rating', value: `${doctor.rating}/5` },
                { icon: Languages, label: 'Languages', value: doctor.languages.join(', ') },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl bg-white border border-gray-100 p-3 shadow-sm">
                    <Icon className="w-5 h-5 text-primary-500 mb-1.5" />
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                  </div>
                );
              })}
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">Availability</h3>
              <div className="flex flex-wrap gap-2">
                {doctor.available_times.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 text-sm font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'credentials' && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Professional Credentials</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success-600" /></div>
                  <div><p className="text-sm font-semibold text-gray-800">{doctor.qualifications}</p><p className="text-xs text-gray-500">Medical Qualification</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-success-600" /></div>
                  <div><p className="text-sm font-semibold text-gray-800">{doctor.registration_id}</p><p className="text-xs text-gray-500">Professional Registration</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center"><Building2 className="w-5 h-5 text-success-600" /></div>
                  <div><p className="text-sm font-semibold text-gray-800">{doctor.hospital}</p><p className="text-xs text-gray-500">Hospital Affiliation</p></div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-primary-800">Verification Status</h3>
              </div>
              <p className="text-sm text-primary-700">
                All credentials have been verified by HealthConnect Administration. This doctor has been approved to provide online consultations.
              </p>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-display text-3xl font-bold text-gray-900">{doctor.rating}</p>
                  <StarRating rating={doctor.rating} size={14} />
                  <p className="text-xs text-gray-500 mt-1">{doctor.total_consultations}+ reviews</p>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full bg-warning-400 ${star === 5 ? 'w-[90%]' : star === 4 ? 'w-[8%]' : 'w-[2%]'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {reviews.map((r, i) => (
              <div key={i} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={r.name} size={32} />
                    <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                  </div>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <StarRating rating={r.rating} size={14} />
                <p className="text-sm text-gray-600 mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Booking section */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white shadow-lg shadow-primary-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-primary-100">Consultation Fee</p>
              <p className="font-display text-2xl font-bold">{formatLKR(doctor.consultation_fee)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sm"><ShieldCheck className="w-4 h-4" /> Verified Doctor</div>
              <div className="flex items-center gap-1.5 text-sm"><Lock className="w-4 h-4" /> Secure Consultation</div>
              <div className="flex items-center gap-1.5 text-sm"><KeyRound className="w-4 h-4" /> Private Information</div>
            </div>
          </div>
          <Button
            size="lg"
            fullWidth
            variant="secondary"
            onClick={() => navigate('book-appointment')}
          >
            <Calendar className="inline w-4 h-4 mr-1" /> Book Consultation
          </Button>
        </div>
      </MobileContent>
    </MobilePage>
  );
}
