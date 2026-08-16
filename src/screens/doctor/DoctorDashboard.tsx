import { useEffect, useState } from 'react';
import { Calendar, Clock, Users, ShieldCheck, DollarSign, Star, ChevronRight, LayoutDashboard, Stethoscope, User as UserIcon, Settings } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge, StatusBadge } from '@/components/ui';
import { formatLKR } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Doctor, AppointmentWithPatient } from '@/lib/types';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', screen: 'doctor-dashboard' as const },
  { icon: Calendar, label: 'Appointments', screen: 'doctor-appointments' as const },
  { icon: UserIcon, label: 'Patients', screen: 'doctor-appointments' as const },
  { icon: Stethoscope, label: 'Profile', screen: 'doctor-profile-settings' as const },
  { icon: Settings, label: 'Settings', screen: 'doctor-profile-settings' as const },
];

export function DoctorDashboard() {
  const { doctor, navigate } = useNav();
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [doc, setDoc] = useState<Doctor | null>(doctor);

  useEffect(() => {
    supabase.from('doctors').select('*').eq('name', 'Dr. Kasun Perera').maybeSingle().then(({ data }) => {
      if (data) setDoc(data as Doctor);
    });
    supabase.from('appointments').select('*, patient:patients(*)').order('appointment_date', { ascending: false }).then(({ data }) => {
      setAppointments((data as AppointmentWithPatient[]) || []);
    });
  }, []);

  const todayCount = appointments.filter((a) => a.status === 'confirmed').length;
  const pendingCount = appointments.filter((a) => a.status === 'pending').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const earnings = appointments.filter((a) => a.status === 'completed').reduce((s, a) => s + Number(a.fee), 0);

  const firstName = (doc?.name || 'Dr. Kasun').replace(/^(Dr\.?|Prof\.)\s*/, '').split(' ')[0];

  const cards = [
    { icon: Calendar, label: "Today's Appointments", value: String(todayCount), color: 'bg-primary-50 text-primary-600', screen: 'doctor-appointments' as const },
    { icon: Clock, label: 'Upcoming Consultations', value: String(todayCount), color: 'bg-secondary-50 text-secondary-600', screen: 'doctor-appointments' as const },
    { icon: Users, label: 'Patient Requests', value: String(pendingCount), color: 'bg-accent-50 text-accent-600', screen: 'doctor-appointments' as const },
    { icon: ShieldCheck, label: 'Verification Status', value: doc?.is_verified ? 'Verified' : 'Pending', color: 'bg-success-50 text-success-600', screen: 'doctor-verification-status' as const },
    { icon: DollarSign, label: 'Earnings', value: formatLKR(earnings), color: 'bg-success-50 text-success-600', screen: 'doctor-appointments' as const },
    { icon: Star, label: 'Patient Feedback', value: String(doc?.rating?.toFixed(1) || '4.9'), color: 'bg-warning-50 text-warning-600', screen: 'doctor-appointments' as const },
  ];

  return (
    <MobilePage>
      <MobileContent className="space-y-5">
        {/* Header */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="font-display text-2xl font-bold text-gray-900">Dr. {firstName}</h1>
          </div>
          <Avatar name={doc?.name || 'Dr. Kasun Perera'} size={48} />
        </div>

        {/* Verification status banner */}
        <button
          onClick={() => navigate('doctor-verification-status')}
          className={`w-full text-left rounded-2xl p-4 shadow-sm transition-all ${doc?.is_verified ? 'bg-success-50 border border-success-100' : 'bg-warning-50 border border-warning-100'}`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-6 h-6 ${doc?.is_verified ? 'text-success-600' : 'text-warning-600'}`} />
            <div className="flex-1">
              <p className={`font-bold ${doc?.is_verified ? 'text-success-800' : 'text-warning-800'}`}>
                {doc?.is_verified ? 'Verified Doctor' : 'Verification Pending'}
              </p>
              <p className={`text-xs ${doc?.is_verified ? 'text-success-700' : 'text-warning-700'}`}>
                {doc?.is_verified ? 'Your credentials are verified by HealthConnect.' : 'Tap to view verification status'}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300" />
          </div>
        </button>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.label}
                onClick={() => navigate(card.screen)}
                className="flex flex-col items-start gap-2 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs text-gray-500">{card.label}</span>
                <span className="text-lg font-bold text-gray-900">{card.value}</span>
              </button>
            );
          })}
        </div>

        {/* Recent appointments */}
        <div>
          <h2 className="font-display text-lg font-bold text-gray-900 mb-3">Recent Appointments</h2>
          <div className="space-y-2">
            {appointments.slice(0, 3).map((a) => (
              <button
                key={a.id}
                onClick={() => navigate('doctor-appointments')}
                className="w-full text-left rounded-2xl bg-white border border-gray-100 p-3 shadow-sm flex items-center gap-3"
              >
                <Avatar name={a.patient?.name || 'Patient'} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{a.patient?.name}</p>
                  <p className="text-xs text-gray-500">{a.appointment_time} • {a.consultation_type}</p>
                </div>
                <StatusBadge status={a.status} />
              </button>
            ))}
          </div>
        </div>
      </MobileContent>

      {/* Doctor bottom nav */}
      <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.screen === 'doctor-dashboard';
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.screen)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg"
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-secondary-600' : 'text-gray-400'}`} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-secondary-600' : 'text-gray-400'}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </MobilePage>
  );
}
