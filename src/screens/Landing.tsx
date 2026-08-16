import { ShieldCheck, Lock, KeyRound, ArrowRight, Stethoscope, Video, FileCheck, Users, Star, HeartPulse, ChevronDown } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { TrustIndicatorRow } from '@/components/ui';

export function Landing() {
  const { navigate } = useNav();

  return (
    <div className="phone-frame bg-gradient-to-b from-primary-50 via-white to-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between">
        <Logo size="sm" />
        <button
          onClick={() => navigate('trust-safety')}
          className="text-xs font-medium text-gray-600 hover:text-primary-700 transition-colors"
        >
          Trust & Safety
        </button>
      </header>

      {/* Hero */}
      <section className="px-5 pt-8 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 mb-5 animate-fade-in">
          <HeartPulse className="w-3.5 h-3.5 text-primary-600" />
          <span className="text-xs font-semibold text-primary-700">Sri Lanka's Trust-First Telemedicine Platform</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-gray-900 leading-tight animate-slide-up">
          Trusted Healthcare,
          <br />
          <span className="text-primary-600">From Anywhere.</span>
        </h1>
        <p className="mt-4 text-base text-gray-600 animate-slide-up">
          Connect with verified doctors and receive healthcare consultations securely online.
        </p>

        <div className="mt-6 animate-fade-in">
          <TrustIndicatorRow />
        </div>

        {/* Entry buttons */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button size="md" fullWidth onClick={() => navigate('patient-login')}>
              Patient Login
            </Button>
            <Button size="md" variant="outline" fullWidth onClick={() => navigate('doctor-login')}>
              Doctor Login
            </Button>
          </div>
          <Button
            size="md"
            variant="ghost"
            fullWidth
            onClick={() => navigate('admin-login')}
            className="border border-gray-200"
          >
            <Lock className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
          <div className="flex flex-col gap-3 w-full mt-1">
            <Button size="sm" variant="outline" fullWidth onClick={() => navigate('patient-register')}>
              Create Patient Account
            </Button>
            <Button size="sm" variant="outline" fullWidth onClick={() => navigate('doctor-register')}>
              Register as Doctor
            </Button>
          </div>
        </div>
      </section>

      {/* Trust flow diagram */}
      <section className="px-5 py-10 bg-white">
        <h2 className="font-display text-xl font-bold text-center text-gray-900 mb-2">
          How HealthConnect Builds Trust
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Every doctor goes through a rigorous administrative verification process before receiving the Verified Doctor badge.
        </p>
        <div className="flex flex-col gap-4">
          {[
            { icon: FileCheck, title: 'Doctor Registers', desc: 'Uploads credentials & documents' },
            { icon: ShieldCheck, title: 'Admin Reviews', desc: 'Verifies identity & qualifications' },
            { icon: KeyRound, title: 'Doctor Approved', desc: 'Receives Verified Doctor badge' },
            { icon: Users, title: 'Patient Sees Badge', desc: 'Confidence in the doctor' },
            { icon: Video, title: 'Secure Consultation', desc: 'Private online appointment' },
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-bold text-gray-900">{step.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                </div>
                {i < 4 && (
                  <ChevronDown className="w-4 h-4 text-primary-300 absolute left-1/2 -translate-x-1/2" style={{ display: 'none' }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="px-5 py-10 bg-gray-50">
        <div className="flex flex-col gap-4">
          {[
            { icon: ShieldCheck, title: 'Verified Doctors', desc: 'Every doctor is credential-checked by HealthConnect administration before joining.' },
            { icon: Lock, title: 'Secure Consultations', desc: 'End-to-end encrypted video consultations protect your privacy.' },
            { icon: Star, title: 'Transparent Reviews', desc: 'Real patient feedback and ratings on every doctor profile.' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-8 bg-gray-900 text-center">
        <Logo size="sm" light />
        <p className="mt-3 text-sm text-gray-400">Trusted Healthcare, From Anywhere.</p>
        <p className="mt-1 text-xs text-gray-500">Concept prototype for demonstration purposes only.</p>
      </footer>
    </div>
  );
}
