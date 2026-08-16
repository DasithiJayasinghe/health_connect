import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, Clock, Video, Lock, Video as VideoIcon } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR, formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { AppointmentWithDoctor } from '@/lib/types';

export function AppointmentConfirmation() {
  const { selectedAppointmentId, navigate } = useNav();
  const [appt, setAppt] = useState<AppointmentWithDoctor | null>(null);

  useEffect(() => {
    if (selectedAppointmentId) {
      supabase
        .from('appointments')
        .select('*, doctor:doctors(*)')
        .eq('id', selectedAppointmentId)
        .maybeSingle()
        .then(({ data }) => setAppt(data as AppointmentWithDoctor | null));
    } else {
      // fallback to the seeded confirmed appointment
      supabase
        .from('appointments')
        .select('*, doctor:doctors(*)')
        .eq('status', 'confirmed')
        .maybeSingle()
        .then(({ data }) => setAppt(data as AppointmentWithDoctor | null));
    }
  }, [selectedAppointmentId]);

  if (!appt) {
    return (
      <MobilePage>
        <MobileHeader title="Appointment" />
        <MobileContent><div className="h-64 rounded-2xl bg-gray-100 animate-pulse" /></MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileHeader title="Appointment Confirmed" />
      <MobileContent className="space-y-5">
        {/* Success banner */}
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
            <CheckCircle2 className="w-12 h-12 text-success-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Appointment Confirmed</h1>
          <p className="mt-2 text-sm text-gray-500">Your consultation has been successfully booked.</p>
        </div>

        {/* Appointment details */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <Avatar name={appt.doctor?.name || 'Dr'} size={56} />
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900">{appt.doctor?.name}</p>
                {appt.doctor?.is_verified && <VerifiedBadge />}
              </div>
              <p className="text-sm text-gray-500">{appt.doctor?.specialization}</p>
            </div>
          </div>

          {[
            { icon: Calendar, label: 'Date', value: formatDate(appt.appointment_date) },
            { icon: Clock, label: 'Time', value: appt.appointment_time },
            { icon: Video, label: 'Type', value: appt.consultation_type },
            { icon: CheckCircle2, label: 'Fee', value: formatLKR(appt.fee) },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{row.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">{row.value}</span>
              </div>
            );
          })}
        </div>

        {/* Privacy message */}
        <div className="flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
          <Lock className="w-4 h-4 text-primary-600 shrink-0" />
          <p className="text-sm text-primary-800 font-medium">Your consultation is private and protected.</p>
        </div>

        <Button size="lg" fullWidth onClick={() => navigate('video-consultation')}>
          <VideoIcon className="inline w-4 h-4 mr-1" /> Join Consultation
        </Button>
      </MobileContent>
    </MobilePage>
  );
}
