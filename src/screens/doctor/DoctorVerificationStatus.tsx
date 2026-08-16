import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, ShieldCheck, FileText, Award, Building2, Upload } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { VerifiedBadge, VerificationCheck } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/lib/types';

export function DoctorVerificationStatus() {
  const { doctor } = useNav();
  const [doc, setDoc] = useState<Doctor | null>(doctor);

  useEffect(() => {
    if (doctor?.id) {
      supabase.from('doctors').select('*').eq('id', doctor.id).maybeSingle().then(({ data }) => setDoc(data as Doctor | null));
    } else {
      supabase.from('doctors').select('*').eq('name', 'Dr. Kasun Perera').maybeSingle().then(({ data }) => setDoc(data as Doctor | null));
    }
  }, [doctor]);

  const isVerified = doc?.is_verified;
  const status = doc?.verification_status || 'pending';

  const steps = [
    { label: 'Application Submitted', done: true, icon: FileText },
    { label: 'Identity Document Uploaded', done: true, icon: Upload },
    { label: 'Credential Verification', done: status === 'approved' || status === 'under_review', pending: status === 'pending', icon: Award },
    { label: 'Admin Approval', done: status === 'approved', pending: status !== 'approved', icon: ShieldCheck },
    { label: 'Verified Doctor Badge', done: status === 'approved', pending: status !== 'approved', icon: ShieldCheck },
  ];

  return (
    <MobilePage>
      <MobileHeader title="Verification Status" />
      <MobileContent className="space-y-4">
        {/* Status banner */}
        <div className={`rounded-2xl p-5 text-center ${isVerified ? 'bg-success-50 border border-success-100' : 'bg-warning-50 border border-warning-100'}`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isVerified ? 'bg-success-100' : 'bg-warning-100'}`}>
            {isVerified ? <ShieldCheck className="w-8 h-8 text-success-600" /> : <Clock className="w-8 h-8 text-warning-600" />}
          </div>
          <h1 className="font-display text-xl font-bold text-gray-900">
            {isVerified ? 'Verified Doctor' : 'Pending Verification'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {isVerified ? 'Your credentials have been approved.' : 'Your application is under review.'}
          </p>
          {isVerified && (
            <div className="mt-3 flex justify-center">
              <VerifiedBadge size="md" />
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Verification Steps</h2>
          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    step.done ? 'bg-success-100' : step.pending ? 'bg-warning-100' : 'bg-gray-100'
                  }`}>
                    {step.done ? (
                      <CheckCircle2 className="w-5 h-5 text-success-600" />
                    ) : step.pending ? (
                      <Clock className="w-5 h-5 text-warning-600" />
                    ) : (
                      <Icon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${step.done ? 'text-gray-800' : step.pending ? 'text-warning-700' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credentials */}
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-3">Your Credentials</h2>
          <div className="space-y-2.5">
            <VerificationCheck label="Identity Document" done />
            <VerificationCheck label="Medical Qualification" done />
            <VerificationCheck label="Professional Registration" done />
            <VerificationCheck label="Hospital Affiliation" done />
          </div>
        </div>

        {/* Message */}
        <div className="rounded-2xl bg-primary-50 border border-primary-100 p-4">
          <p className="text-sm text-primary-800 font-medium">
            {isVerified
              ? 'Congratulations! You have been verified by HealthConnect Administration. Patients will see your Verified Doctor badge.'
              : 'Your profile will receive the Verified Doctor badge after HealthConnect Administration approves your credentials.'}
          </p>
        </div>
      </MobileContent>
    </MobilePage>
  );
}
