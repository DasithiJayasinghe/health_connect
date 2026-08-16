import { Users, Stethoscope, Video, Star, Repeat, ShieldCheck, TrendingUp } from 'lucide-react';
import { AdminLayout } from './AdminLayout';

export function AdminAnalytics() {
  // Simple bar chart data
  const monthlyUsers = [120, 180, 240, 320, 410, 520, 680];
  const doctorRegs = [5, 8, 12, 15, 20, 25, 32];
  const consultations = [45, 78, 120, 165, 210, 280, 350];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  const maxVal = (arr: number[]) => Math.max(...arr);

  const stats = [
    { icon: Users, label: 'Monthly Users', value: '680', trend: '+15%', color: 'bg-primary-500' },
    { icon: Stethoscope, label: 'Doctor Registrations', value: '32', trend: '+8%', color: 'bg-secondary-500' },
    { icon: Video, label: 'Consultation Growth', value: '350', trend: '+25%', color: 'bg-success-500' },
    { icon: Star, label: 'Average Rating', value: '4.8', trend: '+0.2', color: 'bg-warning-500' },
    { icon: Repeat, label: 'Repeat Users', value: '72%', trend: '+5%', color: 'bg-accent-500' },
    { icon: ShieldCheck, label: 'Trust Score', value: '94%', trend: '+2%', color: 'bg-success-600' },
  ];

  return (
    <AdminLayout active="admin-analytics">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-gray-900">Platform Analytics</h1>
        <p className="text-sm text-gray-500">Growth and trust metrics across HealthConnect.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs text-success-600 font-medium">
                  <TrendingUp className="w-3 h-3" /> {s.trend}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="space-y-4">
        {/* Monthly users chart */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Monthly Active Users</h3>
          <div className="flex items-end justify-between gap-1.5 h-40">
            {monthlyUsers.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary-100 rounded-t-lg relative group" style={{ height: `${(v / maxVal(monthlyUsers)) * 100}%` }}>
                  <div className="absolute inset-0 bg-primary-500 rounded-t-lg transition-all group-hover:bg-primary-600" style={{ height: '100%' }} />
                </div>
                <span className="text-xs text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation growth chart */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Consultation Growth</h3>
          <div className="flex items-end justify-between gap-1.5 h-40">
            {consultations.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-success-100 rounded-t-lg relative group" style={{ height: `${(v / maxVal(consultations)) * 100}%` }}>
                  <div className="absolute inset-0 bg-success-500 rounded-t-lg transition-all group-hover:bg-success-600" style={{ height: '100%' }} />
                </div>
                <span className="text-xs text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor registrations */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Doctor Registrations</h3>
          <div className="flex items-end justify-between gap-1.5 h-40">
            {doctorRegs.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-secondary-100 rounded-t-lg relative group" style={{ height: `${(v / maxVal(doctorRegs)) * 100}%` }}>
                  <div className="absolute inset-0 bg-secondary-500 rounded-t-lg transition-all group-hover:bg-secondary-600" style={{ height: '100%' }} />
                </div>
                <span className="text-xs text-gray-400">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust/feedback score */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Trust & Feedback Score</h3>
          <div className="space-y-4">
            {[
              { label: 'Doctor Verification', score: 96, color: 'bg-success-500' },
              { label: 'Data Privacy', score: 92, color: 'bg-primary-500' },
              { label: 'Consultation Quality', score: 89, color: 'bg-secondary-500' },
              { label: 'Patient Satisfaction', score: 94, color: 'bg-accent-500' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{m.label}</span>
                  <span className="text-sm font-bold text-gray-900">{m.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`${m.color} h-2.5 rounded-full transition-all`} style={{ width: `${m.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
