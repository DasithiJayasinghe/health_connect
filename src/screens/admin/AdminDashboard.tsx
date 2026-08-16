import { useEffect, useState } from 'react';
import { Users, Stethoscope, ShieldCheck, Clock, Video, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { supabase } from '@/lib/supabase';
import type { Doctor, Patient, Appointment, Report } from '@/lib/types';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    verifiedDoctors: 0,
    pendingApps: 0,
    todayConsultations: 0,
    reportedIssues: 0,
    revenue: 0,
  });

  useEffect(() => {
    Promise.all([
      supabase.from('patients').select('*').then(({ data }) => data as Patient[]),
      supabase.from('doctors').select('*').then(({ data }) => data as Doctor[]),
      supabase.from('appointments').select('*').then(({ data }) => data as Appointment[]),
      supabase.from('reports').select('*').then(({ data }) => data as Report[]),
    ]).then(([pats, docs, appts, reps]) => {
      setStats({
        patients: pats?.length || 0,
        doctors: docs?.length || 0,
        verifiedDoctors: docs?.filter((d) => d.is_verified).length || 0,
        pendingApps: docs?.filter((d) => !d.is_verified).length || 0,
        todayConsultations: appts?.filter((a) => a.status === 'confirmed').length || 0,
        reportedIssues: reps?.length || 0,
        revenue: appts?.filter((a) => a.status === 'completed').reduce((s, a) => s + Number(a.fee), 0) || 0,
      });
    });
  }, []);

  const cards = [
    { icon: Users, label: 'Total Patients', value: stats.patients, color: 'bg-primary-500' },
    { icon: Stethoscope, label: 'Registered Doctors', value: stats.doctors, color: 'bg-secondary-500' },
    { icon: ShieldCheck, label: 'Verified Doctors', value: stats.verifiedDoctors, color: 'bg-success-500' },
    { icon: Clock, label: 'Pending Applications', value: stats.pendingApps, color: 'bg-warning-500' },
    { icon: Video, label: "Today's Consultations", value: stats.todayConsultations, color: 'bg-primary-600' },
    { icon: AlertTriangle, label: 'Reported Issues', value: stats.reportedIssues, color: 'bg-error-500' },
    { icon: DollarSign, label: 'Platform Revenue', value: `Rs. ${stats.revenue.toLocaleString()}`, color: 'bg-success-600' },
  ];

  return (
    <AdminLayout active="admin-dashboard">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-gray-900">HealthConnect Administration</h1>
        <p className="text-sm text-gray-500">Platform overview and safety monitoring.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-2`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Trust indicator */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white shadow-lg shadow-primary-200">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5" />
          <h2 className="font-display text-base font-bold">Platform Trust Score</h2>
        </div>
        <div className="flex items-end gap-3">
          <p className="font-display text-3xl font-bold">94%</p>
          <div className="flex items-center gap-1 text-primary-100 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">+2% this month</span>
          </div>
        </div>
        <div className="mt-3 w-full bg-primary-800 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{ width: '94%' }} />
        </div>
        <p className="text-xs text-primary-100 mt-2">Based on verified doctors, patient feedback, and safety reports.</p>
      </div>
    </AdminLayout>
  );
}
