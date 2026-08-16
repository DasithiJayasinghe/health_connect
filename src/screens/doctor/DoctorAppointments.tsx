import { useEffect, useState } from 'react';
import { Check, X, Clock, Video, Calendar, Stethoscope, ChevronRight } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Avatar, StatusBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR, formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { AppointmentWithPatient } from '@/lib/types';

type Tab = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export function DoctorAppointments() {
  const { navigate, selectAppointment, showToast } = useNav();
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>([]);
  const [tab, setTab] = useState<Tab>('pending');

  useEffect(() => {
    supabase.from('appointments').select('*, patient:patients(*)').order('appointment_date', { ascending: false }).then(({ data }) => {
      setAppointments((data as AppointmentWithPatient[]) || []);
    });
  }, []);

  const filtered = appointments.filter((a) => a.status === tab);

  const handleAction = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } as AppointmentWithPatient : a)));
    showToast(`Appointment ${status}`);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <MobilePage>
      <MobileHeader title="Appointments" />
      <MobileContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? 'bg-white text-secondary-700 shadow-sm' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No {tab} appointments.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={a.patient?.name || 'Patient'} size={44} />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{a.patient?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(a.appointment_date)} • {a.appointment_time}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> {a.consultation_type}</span>
                  <span>{formatLKR(a.fee)}</span>
                </div>

                {/* Actions */}
                {tab === 'pending' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="success" fullWidth onClick={() => handleAction(a.id, 'confirmed')}>
                      <Check className="w-4 h-4" /> Accept
                    </Button>
                    <Button size="sm" variant="danger" fullWidth onClick={() => handleAction(a.id, 'cancelled')}>
                      <X className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                )}
                {tab === 'confirmed' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => {
                        selectAppointment(a.id);
                        navigate('doctor-consultation');
                      }}
                    >
                      <Video className="w-4 h-4" /> Start Consultation
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAction(a.id, 'cancelled')}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                {tab === 'completed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      selectAppointment(a.id);
                      navigate('doctor-prescription');
                    }}
                  >
                    <Stethoscope className="w-4 h-4" /> Create Prescription
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </MobileContent>
    </MobilePage>
  );
}
