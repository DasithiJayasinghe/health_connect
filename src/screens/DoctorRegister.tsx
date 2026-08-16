import { useState } from 'react';
import { Mail, Lock, Phone, FileText, Stethoscope, Award, Building2, DollarSign, Clock, Upload, ChevronLeft, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/lib/types';

function Field({
  icon: Icon,
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  icon: typeof Mail;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary-400 focus:ring-2 focus:ring-secondary-100 outline-none transition-all text-gray-900"
        />
      </div>
    </div>
  );
}

function UploadBox({ label }: { label: string }) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <button
      onClick={() => setUploaded(true)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all text-left ${
        uploaded ? 'border-success-300 bg-success-50' : 'border-gray-200 hover:border-secondary-300 bg-gray-50'
      }`}
    >
      {uploaded ? (
        <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
      ) : (
        <Upload className="w-5 h-5 text-gray-400 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${uploaded ? 'text-success-700' : 'text-gray-600'}`}>
          {uploaded ? 'Uploaded' : label}
        </p>
        {uploaded && <p className="text-xs text-gray-500">{label}</p>}
      </div>
    </button>
  );
}

export function DoctorRegister() {
  const { navigate, setRole, setDoctor, showToast } = useNav();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', regNumber: '', specialization: '',
    qualifications: '', experience: '', hospital: '', fee: '', times: '',
  });

  const upd = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const name = form.name || 'Dr. Ishara Gunawardena';
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('name', name)
      .maybeSingle();
    if (data) {
      setDoctor(data as Doctor);
    } else {
      // Use the seeded pending doctor as the demo
      const { data: pendingDoc } = await supabase
        .from('doctors')
        .select('*')
        .eq('verification_status', 'pending')
        .maybeSingle();
      setDoctor((pendingDoc || null) as Doctor | null);
    }
    setRole('doctor');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex flex-col">
        <div className="px-6 py-5">
          <button onClick={() => navigate('landing')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-warning-50 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-warning-500" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Verification Pending</h1>
            <p className="mt-4 text-gray-600">
              Thank you for registering. Your application has been submitted for review by HealthConnect Administration.
            </p>
            <div className="mt-8 rounded-2xl bg-white border border-gray-100 p-6 text-left">
              <h2 className="font-bold text-gray-900 mb-4">Verification Steps</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5"><CheckCircle2 className="w-5 h-5 text-success-500" /><span className="text-sm font-medium text-gray-800">Application Submitted</span></div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="w-5 h-5 text-success-500" /><span className="text-sm font-medium text-gray-800">Identity Document Uploaded</span></div>
                <div className="flex items-center gap-2.5"><Clock className="w-5 h-5 text-warning-500" /><span className="text-sm font-medium text-warning-700">Credential Verification</span></div>
                <div className="flex items-center gap-2.5"><div className="w-5 h-5 rounded-full border-2 border-gray-200" /><span className="text-sm font-medium text-gray-400">Admin Approval</span></div>
                <div className="flex items-center gap-2.5"><div className="w-5 h-5 rounded-full border-2 border-gray-200" /><span className="text-sm font-medium text-gray-400">Verified Doctor Badge</span></div>
              </div>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Your profile will receive the Verified Doctor badge after HealthConnect Administration approves your credentials.
            </p>
            <Button size="lg" fullWidth className="mt-6" onClick={() => navigate('doctor-verification-status')}>
              View Verification Status <ArrowRight className="inline w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex flex-col">
      <div className="px-6 py-5">
        <button onClick={() => navigate('landing')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <Logo size="lg" />
            <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">Register as Doctor</h1>
            <p className="mt-2 text-gray-500">Step {step} of 3 — {step === 1 ? 'Personal & Professional Details' : step === 2 ? 'Practice Information' : 'Document Upload'}</p>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? 'bg-secondary-500' : 'bg-gray-200'}`} />
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            {step === 1 && (
              <>
                <Field icon={Mail} label="Full Name" placeholder="Dr. Ishara Gunawardena" value={form.name} onChange={upd('name')} />
                <Field icon={Mail} label="Email" type="email" placeholder="ishara@example.lk" value={form.email} onChange={upd('email')} />
                <Field icon={Phone} label="Phone Number" placeholder="+94 77 123 4567" value={form.phone} onChange={upd('phone')} />
                <Field icon={FileText} label="Medical Registration Number" placeholder="SLMC-XXXXX" value={form.regNumber} onChange={upd('regNumber')} />
                <Field icon={Stethoscope} label="Specialization" placeholder="General Physician" value={form.specialization} onChange={upd('specialization')} />
                <Field icon={Award} label="Qualifications" placeholder="MBBS, MD" value={form.qualifications} onChange={upd('qualifications')} />
                <Button size="lg" fullWidth onClick={() => setStep(2)}>
                  Continue <ArrowRight className="inline w-4 h-4 ml-1" />
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <Field icon={Clock} label="Years of Experience" placeholder="5" value={form.experience} onChange={upd('experience')} />
                <Field icon={Building2} label="Hospital/Clinic" placeholder="Community Hospital Kandy" value={form.hospital} onChange={upd('hospital')} />
                <Field icon={DollarSign} label="Consultation Fee (LKR)" placeholder="2000" value={form.fee} onChange={upd('fee')} />
                <Field icon={Clock} label="Available Times" placeholder="Mon 8-12, Wed 8-12" value={form.times} onChange={upd('times')} />
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" fullWidth onClick={() => setStep(1)}>
                    <ArrowLeft className="inline w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button size="lg" fullWidth onClick={() => setStep(3)}>
                    Continue <ArrowRight className="inline w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <div className="space-y-3">
                  <UploadBox label="Identity Document" />
                  <UploadBox label="Medical Qualification" />
                  <UploadBox label="Professional Registration" />
                  <UploadBox label="Hospital Affiliation Proof" />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" fullWidth onClick={() => setStep(2)}>
                    <ArrowLeft className="inline w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button size="lg" fullWidth onClick={handleSubmit}>
                    Submit for Verification
                  </Button>
                </div>
              </>
            )}
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Fields are optional for the demo — just click through.
          </p>
        </div>
      </div>
    </div>
  );
}
