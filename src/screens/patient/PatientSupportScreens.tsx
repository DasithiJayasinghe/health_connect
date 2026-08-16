import { useEffect, useState } from 'react';
import { FileText, Pill, CreditCard, Download, ChevronRight, LifeBuoy, Mail, Phone, MessageSquare, AlertTriangle, ShieldCheck, Lock, KeyRound, FileCheck, User, Star, LogOut } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR, formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { AppointmentWithDoctor, PrescriptionWithDoctor } from '@/lib/types';

export function MedicalRecords() {
  const { patient } = useNav();
  const [appts, setAppts] = useState<AppointmentWithDoctor[]>([]);

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*, doctor:doctors(*)')
      .eq('patient_id', patient?.id || 'a0000000-0000-0000-0000-000000000001')
      .order('appointment_date', { ascending: false })
      .then(({ data }) => setAppts((data as AppointmentWithDoctor[]) || []));
  }, [patient]);

  return (
    <MobilePage>
      <MobileHeader title="Medical Records" />
      <MobileContent className="space-y-3">
        <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-primary-600" />
            <h3 className="font-bold text-primary-800">Your Health History</h3>
          </div>
          <p className="text-sm text-primary-700">All your consultations and medical records in one place.</p>
        </div>
        {appts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No medical records yet.</p>
          </div>
        ) : (
          appts.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar name={a.doctor?.name || 'Dr'} size={44} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{a.doctor?.name}</p>
                    {a.doctor?.is_verified && <VerifiedBadge />}
                  </div>
                  <p className="text-xs text-gray-500">{a.doctor?.specialization}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.appointment_date)}</p>
                </div>
              </div>
              {a.summary && <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100">{a.summary}</p>}
            </div>
          ))
        )}
      </MobileContent>
      <BottomNav active="medical-records" />
    </MobilePage>
  );
}

export function Prescriptions() {
  const { patient } = useNav();
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithDoctor[]>([]);

  useEffect(() => {
    supabase
      .from('prescriptions')
      .select('*, doctor:doctors(*)')
      .eq('patient_id', patient?.id || 'a0000000-0000-0000-0000-000000000001')
      .order('created_at', { ascending: false })
      .then(({ data }) => setPrescriptions((data as PrescriptionWithDoctor[]) || []));
  }, [patient]);

  return (
    <MobilePage>
      <MobileHeader title="Prescriptions" />
      <MobileContent className="space-y-3">
        {prescriptions.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No prescriptions yet.</p>
          </div>
        ) : (
          prescriptions.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{p.doctor?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.created_at)}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100">
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {p.medications.map((m, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 p-3">
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.dosage} • {m.frequency} • {m.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </MobileContent>
      <BottomNav active="medical-records" />
    </MobilePage>
  );
}

export function Payments() {
  const { patient } = useNav();
  const [appts, setAppts] = useState<AppointmentWithDoctor[]>([]);

  useEffect(() => {
    supabase
      .from('appointments')
      .select('*, doctor:doctors(*)')
      .eq('patient_id', patient?.id || 'a0000000-0000-0000-0000-000000000001')
      .order('appointment_date', { ascending: false })
      .then(({ data }) => setAppts((data as AppointmentWithDoctor[]) || []));
  }, [patient]);

  const total = appts.reduce((sum, a) => sum + Number(a.fee), 0);

  return (
    <MobilePage>
      <MobileHeader title="Payments" />
      <MobileContent className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white shadow-lg shadow-primary-200">
          <p className="text-sm text-primary-100">Total Spent</p>
          <p className="font-display text-3xl font-bold">{formatLKR(total)}</p>
          <p className="text-xs text-primary-200 mt-1">{appts.length} consultations</p>
        </div>
        <div className="space-y-2">
          {appts.map((a) => (
            <div key={a.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={a.doctor?.name || 'Dr'} size={40} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{a.doctor?.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(a.appointment_date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{formatLKR(a.fee)}</p>
                <span className="text-xs text-success-600 font-medium">Paid</span>
              </div>
            </div>
          ))}
        </div>
      </MobileContent>
      <BottomNav active="medical-records" />
    </MobilePage>
  );
}

export function PatientProfile() {
  const { patient, navigate, setRole, setPatient, showToast } = useNav();
  const name = patient?.name || 'Nimali Perera';
  const email = patient?.email || 'nimali@example.lk';

  return (
    <MobilePage>
      <MobileHeader title="My Profile" />
      <MobileContent className="space-y-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm text-center">
          <Avatar name={name} size={80} />
          <h2 className="mt-3 font-display text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-xs text-gray-400 mt-1">Patient since 2026</p>
        </div>

        <div className="space-y-2">
          {[
            { icon: User, label: 'Account Details', screen: 'patient-profile' as const },
            { icon: FileText, label: 'Medical Records', screen: 'medical-records' as const },
            { icon: ShieldCheck, label: 'Trust & Safety', screen: 'trust-safety' as const },
            { icon: LifeBuoy, label: 'Help & Support', screen: 'help-support' as const },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.screen)}
                className="w-full flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-gray-700">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          fullWidth
          onClick={() => {
            setRole(null);
            setPatient(null);
            showToast('Logged out');
            navigate('landing');
          }}
        >
          <LogOut className="inline w-4 h-4 mr-1" /> Logout
        </Button>
      </MobileContent>
      <BottomNav active="patient-profile" />
    </MobilePage>
  );
}

export function HelpSupport() {
  const { navigate } = useNav();
  return (
    <MobilePage>
      <MobileHeader title="Help & Support" />
      <MobileContent className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-5 text-white shadow-lg shadow-primary-200">
          <LifeBuoy className="w-8 h-8 mb-2" />
          <h2 className="font-display text-xl font-bold">We're here to help</h2>
          <p className="text-sm text-primary-100 mt-1">Get support with any HealthConnect issue.</p>
        </div>

        <div className="space-y-2">
          {[
            { icon: MessageSquare, label: 'Live Chat', desc: 'Chat with our support team' },
            { icon: Phone, label: 'Call Us', desc: '+94 11 234 5678' },
            { icon: Mail, label: 'Email Support', desc: 'support@healthconnect.lk' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => navigate('trust-safety')}
          className="w-full flex items-center gap-3 rounded-2xl bg-error-50 border border-error-100 p-4 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-error-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-error-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-error-700">Report a Problem</p>
            <p className="text-xs text-error-600">Report an issue with a doctor or consultation</p>
          </div>
        </button>

        <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              { q: 'How are doctors verified?', a: 'Every doctor goes through an administrative verification process including identity, credentials, and registration checks.' },
              { q: 'Is my health data private?', a: 'Yes. All consultations are encrypted and your health data is protected under Sri Lankan privacy regulations.' },
              { q: 'How do I pay for consultations?', a: 'Payments are processed securely online after booking your appointment.' },
            ].map((faq, i) => (
              <details key={i} className="group">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 flex items-center justify-between">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="text-xs text-gray-500 mt-2 pl-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </MobileContent>
    </MobilePage>
  );
}
