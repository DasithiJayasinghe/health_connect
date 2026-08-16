import { useEffect, useState } from 'react';
import { FileText, Download, Save, Pill, Calendar, Clock, Stethoscope, ChevronRight, Star } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR, formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { AppointmentWithDoctor, PrescriptionWithDoctor } from '@/lib/types';

export function ConsultationSummary() {
  const { selectedAppointmentId, navigate, showToast } = useNav();
  const [appts, setAppts] = useState<AppointmentWithDoctor[]>([]);
  const [selected, setSelected] = useState<AppointmentWithDoctor | null>(null);
  const [prescription, setPrescription] = useState<PrescriptionWithDoctor | null>(null);

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*, doctor:doctors(*)')
      .order('appointment_date', { ascending: false })
      .then(({ data }) => {
        const list = (data as AppointmentWithDoctor[]) || [];
        setAppts(list);
        if (selectedAppointmentId) {
          const found = list.find((a) => a.id === selectedAppointmentId);
          if (found) setSelected(found);
        } else {
          const completed = list.find((a) => a.status === 'completed');
          if (completed) setSelected(completed);
        }
      });
  }, [selectedAppointmentId]);

  useEffect(() => {
    if (selected) {
      supabase
        .from('prescriptions')
        .select('*, doctor:doctors(*)')
        .eq('appointment_id', selected.id)
        .maybeSingle()
        .then(({ data }) => setPrescription(data as PrescriptionWithDoctor | null));
    }
  }, [selected]);

  if (selected) {
    return (
      <MobilePage>
        <MobileHeader title="Consultation Summary" back={false} right={<button onClick={() => setSelected(null)} className="text-sm text-primary-600 font-medium">Back</button>} />
        <MobileContent className="space-y-4">
          {/* Doctor info */}
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Avatar name={selected.doctor?.name || 'Dr'} size={56} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900">{selected.doctor?.name}</p>
                  {selected.doctor?.is_verified && <VerifiedBadge />}
                </div>
                <p className="text-sm text-gray-500">{selected.doctor?.specialization}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Date</span>
              <span className="text-sm font-semibold text-gray-800">{formatDate(selected.appointment_date)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Time</span>
              <span className="text-sm font-semibold text-gray-800">{selected.appointment_time}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 flex items-center gap-1.5"><Stethoscope className="w-4 h-4" /> Type</span>
              <span className="text-sm font-semibold text-gray-800">{selected.consultation_type}</span>
            </div>
          </div>

          {/* Summary */}
          {selected.summary && (
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Consultation Summary</h3>
              <p className="text-sm text-gray-600">{selected.summary}</p>
            </div>
          )}

          {/* Prescription */}
          {prescription ? (
            <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Pill className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-gray-900">Prescription</h3>
              </div>
              <div className="space-y-2">
                {prescription.medications.map((m, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.dosage} • {m.frequency} • {m.duration}</p>
                    {m.instructions && <p className="text-xs text-gray-500 mt-0.5">{m.instructions}</p>}
                  </div>
                ))}
              </div>
              {prescription.notes && (
                <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">Notes: {prescription.notes}</p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
              <Pill className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No prescription for this consultation yet.</p>
            </div>
          )}

          {/* Follow-up */}
          {selected.follow_up && (
            <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4">
              <h3 className="font-bold text-primary-800 mb-1">Follow-up</h3>
              <p className="text-sm text-primary-700">{selected.follow_up}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            <Button size="lg" fullWidth onClick={() => showToast('Prescription downloaded')}>
              <Download className="inline w-4 h-4 mr-1" /> Download Prescription
            </Button>
            <Button size="lg" variant="outline" fullWidth onClick={() => showToast('Saved to medical records')}>
              <Save className="inline w-4 h-4 mr-1" /> Save to Medical Records
            </Button>
            <Button size="lg" variant="ghost" fullWidth onClick={() => navigate('patient-feedback')}>
              Leave Feedback <ChevronRight className="inline w-4 h-4 ml-1" />
            </Button>
          </div>
        </MobileContent>
      </MobilePage>
    );
  }

  // List view
  return (
    <MobilePage>
      <MobileHeader title="Consultation History" />
      <MobileContent className="space-y-3">
        {appts.length === 0 ? (
          <div className="text-center py-12">
            <Stethoscope className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No consultations yet.</p>
          </div>
        ) : (
          appts.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelected(a)}
              className="w-full text-left rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Avatar name={a.doctor?.name || 'Dr'} size={48} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{a.doctor?.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(a.appointment_date)} • {a.appointment_time}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      a.status === 'completed' ? 'bg-success-50 text-success-700' :
                      a.status === 'confirmed' ? 'bg-primary-50 text-primary-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {a.status}
                    </span>
                    <span className="text-xs text-gray-500">{formatLKR(a.fee)}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
          ))
        )}
      </MobileContent>
    </MobilePage>
  );
}
