import { useEffect, useState } from 'react';
import { Search, Calendar, Clock, FileText, Pill, CreditCard, ShieldCheck, LifeBuoy, ChevronRight, Stethoscope, Star } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { getGreeting, formatLKR, formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { AppointmentWithDoctor } from '@/lib/types';

export function PatientDashboard() {
  const { patient, navigate, selectAppointment } = useNav();
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([]);

  useEffect(() => {
    if (patient?.id) {
      supabase
        .from('appointments')
        .select('*, doctor:doctors(*)')
        .eq('patient_id', patient.id)
        .order('appointment_date', { ascending: false })
        .then(({ data }) => setAppointments((data as AppointmentWithDoctor[]) || []));
    } else {
      // fallback: load all appointments for demo
      supabase
        .from('appointments')
        .select('*, doctor:doctors(*)')
        .order('appointment_date', { ascending: false })
        .then(({ data }) => setAppointments((data as AppointmentWithDoctor[]) || []));
    }
  }, [patient]);

  const upcoming = appointments.find((a) => a.status === 'confirmed');
  const name = patient?.name || 'Nimali';

  const cards = [
    { icon: Search, label: 'Find a Doctor', screen: 'find-doctor' as const, color: 'bg-primary-50 text-primary-600' },
    { icon: Calendar, label: 'Upcoming Appointment', screen: 'consultation-summary' as const, color: 'bg-secondary-50 text-secondary-600' },
    { icon: Clock, label: 'Consultation History', screen: 'consultation-summary' as const, color: 'bg-accent-50 text-accent-600' },
    { icon: FileText, label: 'Medical Records', screen: 'medical-records' as const, color: 'bg-success-50 text-success-600' },
    { icon: Pill, label: 'Prescriptions', screen: 'prescriptions' as const, color: 'bg-primary-50 text-primary-600' },
    { icon: CreditCard, label: 'Payments', screen: 'payments' as const, color: 'bg-secondary-50 text-secondary-600' },
    { icon: ShieldCheck, label: 'Trust & Safety', screen: 'trust-safety' as const, color: 'bg-success-50 text-success-600' },
    { icon: LifeBuoy, label: 'Help & Support', screen: 'help-support' as const, color: 'bg-accent-50 text-accent-600' },
  ];

  return (
    <MobilePage>
      <MobileContent className="space-y-5">
        {/* Greeting */}
        <div className="pt-2">
          <p className="text-sm text-gray-500">{getGreeting()},</p>
          <h1 className="font-display text-2xl font-bold text-gray-900">{name}</h1>
        </div>

        {/* Upcoming appointment banner */}
        {upcoming && (
          <button
            onClick={() => {
              selectAppointment(upcoming.id);
              navigate('appointment-confirmation');
            }}
            className="w-full text-left rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-4 text-white shadow-lg shadow-primary-200 animate-slide-up"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary-100">Upcoming Appointment</span>
              <ChevronRight className="w-4 h-4 text-primary-200" />
            </div>
            <div className="flex items-center gap-3">
              <Avatar name={upcoming.doctor?.name || 'Dr'} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{upcoming.doctor?.name}</p>
                <p className="text-sm text-primary-100">{upcoming.appointment_time} • {formatDate(upcoming.appointment_date)}</p>
              </div>
            </div>
          </button>
        )}

        {/* Quick actions grid */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.label}
                onClick={() => navigate(card.screen)}
                className="flex flex-col items-start gap-3 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary-100 transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-gray-700">{card.label}</span>
              </button>
            );
          })}
        </div>

        {/* Featured doctor */}
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900 mb-3">Recommended Doctor</h2>
          <button
            onClick={() => {
              navigate('doctor-profile');
            }}
            className="w-full text-left rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Avatar name="Dr. Kasun Perera" size={56} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">Dr. Kasun Perera</p>
                  <VerifiedBadge />
                </div>
                <p className="text-sm text-gray-500">General Physician</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-3.5 h-3.5 fill-warning-400 text-warning-400" /> 4.9
                  </span>
                  <span className="text-sm text-gray-600">{formatLKR(2500)}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </div>
          </button>
        </div>
      </MobileContent>
      <BottomNav active="patient-dashboard" />
    </MobilePage>
  );
}
