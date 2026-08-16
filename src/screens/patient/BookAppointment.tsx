import { useEffect, useState } from 'react';
import { Calendar, Clock, Video, Phone, ShieldCheck, Lock, KeyRound, CheckCircle2 } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Doctor, Patient } from '@/lib/types';

export function BookAppointment() {
  const { selectedDoctorId, patient, navigate, selectAppointment, showToast } = useNav();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Video Consultation');
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (selectedDoctorId) {
      supabase.from('doctors').select('*').eq('id', selectedDoctorId).maybeSingle().then(({ data }) => setDoctor(data as Doctor | null));
    } else {
      supabase.from('doctors').select('*').eq('name', 'Dr. Kasun Perera').maybeSingle().then(({ data }) => setDoctor(data as Doctor | null));
    }
  }, [selectedDoctorId]);

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const times = ['09:00 AM', '10:30 AM', '12:00 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

  const handleConfirm = async () => {
    if (!doctor) return;
    setBooking(true);
    const aptDate = date || '2026-08-18';
    const aptTime = time || '10:30 AM';
    const { data } = await supabase
      .from('appointments')
      .insert({
        doctor_id: doctor.id,
        patient_id: patient?.id || 'a0000000-0000-0000-0000-000000000001',
        appointment_date: aptDate,
        appointment_time: aptTime,
        consultation_type: type,
        fee: doctor.consultation_fee,
        status: 'confirmed',
      })
      .select()
      .maybeSingle();
    if (data) selectAppointment(data.id);
    showToast('Appointment confirmed!');
    navigate('appointment-confirmation');
    setBooking(false);
  };

  if (!doctor) {
    return (
      <MobilePage>
        <MobileHeader title="Book Appointment" />
        <MobileContent><div className="h-64 rounded-2xl bg-gray-100 animate-pulse" /></MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileHeader title="Book Appointment" subtitle={doctor.name} />
      <MobileContent className="space-y-5">
        {/* Doctor summary */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar name={doctor.name} size={56} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900">{doctor.name}</p>
                <VerifiedBadge />
              </div>
              <p className="text-sm text-gray-500">{doctor.specialization}</p>
            </div>
          </div>
        </div>

        {/* Date selection */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary-500" /> Select Date
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {dates.map((d, i) => {
              const dStr = d.toISOString().split('T')[0];
              const isSelected = date === dStr;
              return (
                <button
                  key={i}
                  onClick={() => setDate(dStr)}
                  className={`shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border-2 transition-all ${
                    isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <span className="text-xs text-gray-500">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                  <span className={`text-lg font-bold ${isSelected ? 'text-primary-700' : 'text-gray-800'}`}>{d.getDate()}</span>
                  <span className="text-xs text-gray-500">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time selection */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary-500" /> Select Time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {times.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                  time === t ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Consultation type */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Consultation Type</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setType('Video Consultation')}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                type === 'Video Consultation' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <Video className={`w-5 h-5 ${type === 'Video Consultation' ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700">Video</span>
            </button>
            <button
              onClick={() => setType('Voice Consultation')}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                type === 'Voice Consultation' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              }`}
            >
              <Phone className={`w-5 h-5 ${type === 'Voice Consultation' ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700">Voice</span>
            </button>
          </div>
        </div>

        {/* Fee summary */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Doctor</span>
            <span className="text-sm font-semibold text-gray-800">{doctor.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Consultation</span>
            <span className="text-sm font-semibold text-gray-800">{type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Fee</span>
            <span className="text-lg font-bold text-primary-700">{formatLKR(doctor.consultation_fee)}</span>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, label: 'Verified Doctor' },
            { icon: Lock, label: 'Secure Consultation' },
            { icon: KeyRound, label: 'Private Information' },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-primary-50 p-3 text-center">
                <Icon className="w-5 h-5 text-primary-600" />
                <span className="text-xs font-medium text-primary-700">{t.label}</span>
              </div>
            );
          })}
        </div>

        <Button size="lg" fullWidth onClick={handleConfirm} disabled={booking}>
          <CheckCircle2 className="inline w-4 h-4 mr-1" /> Confirm Appointment
        </Button>
      </MobileContent>
    </MobilePage>
  );
}
