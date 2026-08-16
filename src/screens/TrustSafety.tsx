import { ShieldCheck, Lock, KeyRound, CreditCard, Users, AlertTriangle, LifeBuoy, ChevronLeft, Heart } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';

export function TrustSafety() {
  const { navigate, goBack } = useNav();

  const sections = [
    { icon: ShieldCheck, title: 'Doctor Verification', desc: 'Every doctor on HealthConnect goes through an administrative verification process before receiving a Verified Doctor badge. We verify identity, medical credentials, professional registration, and hospital affiliation.', color: 'bg-success-50 text-success-600' },
    { icon: Lock, title: 'Data Privacy', desc: 'Your health data is encrypted and protected. We comply with Sri Lankan privacy regulations and never share your information without consent.', color: 'bg-primary-50 text-primary-600' },
    { icon: KeyRound, title: 'Secure Consultations', desc: 'All video and voice consultations are end-to-end encrypted. Only you and your doctor can access the consultation.', color: 'bg-secondary-50 text-secondary-600' },
    { icon: CreditCard, title: 'Secure Payments', desc: 'Payments are processed through secure, encrypted payment gateways. Your financial information is never stored on our servers.', color: 'bg-accent-50 text-accent-600' },
    { icon: Users, title: 'Patient Rights', desc: 'You have the right to access your medical records, request data deletion, and choose your healthcare provider freely.', color: 'bg-primary-50 text-primary-600' },
    { icon: AlertTriangle, title: 'Report a Problem', desc: 'Encounter an issue? Report it directly to our administration. Every report is reviewed and acted upon promptly.', color: 'bg-error-50 text-error-600' },
    { icon: LifeBuoy, title: 'Customer Support', desc: 'Our support team is available to help with any questions or concerns. Contact us via live chat, phone, or email.', color: 'bg-secondary-50 text-secondary-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto">
        <Logo size="md" />
        <button onClick={() => navigate('landing')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft className="w-4 h-4" /> Home
        </button>
      </header>

      {/* Hero */}
      <section className="px-6 pt-8 pb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 mb-4">
          <Heart className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-semibold text-primary-700">Trust & Safety Center</span>
        </div>
        <h1 className="font-display text-4xl font-extrabold text-gray-900">Your trust is our priority.</h1>
        <p className="mt-4 text-lg text-gray-600">
          Every doctor on HealthConnect goes through an administrative verification process before receiving a Verified Doctor badge.
        </p>
      </section>

      {/* Sections */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Verification flow */}
        <div className="mt-8 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-white shadow-lg shadow-primary-200">
          <h2 className="font-display text-xl font-bold mb-4">Our Verification Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Doctor Registers', desc: 'Submits credentials & documents' },
              { step: '2', title: 'Admin Reviews', desc: 'Verifies all documents' },
              { step: '3', title: 'Approval', desc: 'Verified Doctor badge awarded' },
              { step: '4', title: 'Patient Confidence', desc: 'Patient books with trust' },
            ].map((s) => (
              <div key={s.step} className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-2 text-sm font-bold">{s.step}</div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs text-primary-100 mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Button size="lg" onClick={() => navigate('landing')}>Back to Home</Button>
        </div>
      </section>
    </div>
  );
}
