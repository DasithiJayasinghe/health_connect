import { useState } from 'react';
import { Pill, Plus, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import type { Medication } from '@/lib/types';

export function DoctorPrescription() {
  const { selectedAppointmentId, doctor, patient, navigate, showToast } = useNav();
  const [meds, setMeds] = useState<Medication[]>([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [notes, setNotes] = useState('');
  const [created, setCreated] = useState(false);

  const updateMed = (i: number, field: keyof Medication, value: string) => {
    setMeds((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
  };

  const addMed = () => setMeds([...meds, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMed = (i: number) => setMeds(meds.filter((_, idx) => idx !== i));

  const handleGenerate = async () => {
    const cleanMeds = meds.filter((m) => m.name);
    await supabase.from('prescriptions').insert({
      appointment_id: selectedAppointmentId,
      doctor_id: doctor?.id || 'b0000000-0000-0000-0000-000000000001',
      patient_id: patient?.id || 'a0000000-0000-0000-0000-000000000001',
      medications: cleanMeds,
      notes,
    });
    setCreated(true);
    showToast('Prescription created!');
  };

  if (created) {
    return (
      <MobilePage>
        <MobileHeader title="Prescription" />
        <MobileContent className="flex flex-col items-center justify-center text-center py-12 space-y-4">
          <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center animate-pulse-slow">
            <CheckCircle2 className="w-12 h-12 text-success-500" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Prescription Created</h1>
          <p className="text-gray-500">The prescription has been saved to the patient's medical records.</p>
          <div className="w-full rounded-2xl bg-white border border-gray-100 p-4 shadow-sm text-left">
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-gray-900">Prescribed Medications</h3>
            </div>
            <div className="space-y-2">
              {meds.filter((m) => m.name).map((m, i) => (
                <div key={i} className="rounded-xl bg-gray-50 p-3">
                  <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.dosage} • {m.frequency} • {m.duration}</p>
                </div>
              ))}
            </div>
          </div>
          <Button size="lg" fullWidth onClick={() => navigate('doctor-dashboard')}>Back to Dashboard</Button>
        </MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileHeader title="Digital Prescription" />
      <MobileContent className="space-y-4">
        <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-600" />
          <p className="text-sm text-primary-800 font-medium">Create a digital prescription for Nimali Perera</p>
        </div>

        {/* Medications */}
        <div className="space-y-3">
          {meds.map((med, i) => (
            <div key={i} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">Medication {i + 1}</span>
                {meds.length > 1 && (
                  <button onClick={() => removeMed(i)} className="p-1.5 rounded-lg text-error-500 hover:bg-error-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Medication name (e.g. Paracetamol 500mg)"
                value={med.name}
                onChange={(e) => updateMed(i, 'name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
              />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Dosage (1 tablet)" value={med.dosage} onChange={(e) => updateMed(i, 'dosage', e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
                <input type="text" placeholder="Frequency (3x daily)" value={med.frequency} onChange={(e) => updateMed(i, 'frequency', e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
              </div>
              <input type="text" placeholder="Duration (7 days)" value={med.duration} onChange={(e) => updateMed(i, 'duration', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
              <input type="text" placeholder="Instructions (after meals)" value={med.instructions} onChange={(e) => updateMed(i, 'instructions', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary-400 outline-none text-sm" />
            </div>
          ))}
          <button onClick={addMed} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Medication
          </button>
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Follow-up instructions, dietary advice, etc."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm resize-none"
          />
        </div>

        <Button size="lg" fullWidth onClick={handleGenerate}>
          <FileText className="w-4 h-4" /> Generate Prescription
        </Button>
      </MobileContent>
    </MobilePage>
  );
}
