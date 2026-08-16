import { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldAlert, KeyRound, ChevronLeft } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { SecurityBanner, VerifiedBadge } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Patient, Doctor } from '@/lib/types';

function Field({
  icon: Icon,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: {
  icon: typeof Mail;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
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
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900"
        />
      </div>
    </div>
  );
}

function BackToLanding() {
  const { navigate } = useNav();
  return (
    <button
      onClick={() => navigate('landing')}
      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
    >
      <ChevronLeft className="w-4 h-4" />
      Back to Home
    </button>
  );
}

export function PatientLogin() {
  const { navigate, setRole, setPatient, showToast } = useNav();
  const [email, setEmail] = useState('nimali@example.lk');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = async () => {
    const { data } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (data) {
      setPatient(data as Patient);
      setRole('patient');
      showToast('Welcome back!');
      navigate('patient-dashboard');
    } else {
      // fallback for demo: create patient from email
      const newPatient = { name: 'Nimali Perera', email, phone: '+94771234567' } as Patient;
      setPatient(newPatient);
      setRole('patient');
      showToast('Welcome back!');
      navigate('patient-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <div className="px-6 py-5"><BackToLanding /></div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">Patient Login</h1>
            <p className="mt-2 text-gray-500">Welcome back. Your health, securely connected.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <Field icon={Mail} label="Email / Phone" placeholder="nimali@example.lk" value={email} onChange={setEmail} />
            <Field icon={Lock} label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
            <Button size="lg" fullWidth onClick={handleLogin}>
              Login <ArrowRight className="inline w-4 h-4 ml-1" />
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button onClick={() => navigate('patient-register')} className="text-primary-600 font-medium hover:text-primary-700">
                Create Patient Account
              </button>
              <button className="text-gray-500 hover:text-gray-700">Forgot Password?</button>
            </div>
            <div className="relative py-2">
              <div className="border-t border-gray-100" />
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-gray-400">or continue with</span>
            </div>
            <button className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Demo account pre-filled — just click Login
          </p>
        </div>
      </div>
    </div>
  );
}

export function DoctorLogin() {
  const { navigate, setRole, setDoctor, showToast } = useNav();
  const [email, setEmail] = useState('kasun@example.lk');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = async () => {
    const { data } = await supabase
      .from('doctors')
      .select('*')
      .eq('registration_id', 'SLMC-2015-04832')
      .maybeSingle();
    if (data) {
      setDoctor(data as Doctor);
      setRole('doctor');
      showToast('Welcome back, Doctor!');
      navigate('doctor-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-white flex flex-col">
      <div className="px-6 py-5"><BackToLanding /></div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">Doctor Login</h1>
            <p className="mt-2 text-gray-500">Access your professional dashboard.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <Field icon={Mail} label="Professional Email / Registration ID" placeholder="kasun@example.lk" value={email} onChange={setEmail} />
            <Field icon={Lock} label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
            <Button size="lg" fullWidth onClick={handleLogin}>
              Login <ArrowRight className="inline w-4 h-4 ml-1" />
            </Button>
            <div className="flex items-center justify-between text-sm">
              <button onClick={() => navigate('doctor-register')} className="text-secondary-600 font-medium hover:text-secondary-700">
                Register as Doctor
              </button>
              <button className="text-gray-500 hover:text-gray-700">Forgot Password?</button>
            </div>
          </div>
          <div className="mt-6">
            <SecurityBanner message="Only verified healthcare professionals can provide consultations through HealthConnect." />
          </div>
          <p className="mt-4 text-center text-xs text-gray-400">
            Demo account pre-filled — just click Login
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdminLogin() {
  const { navigate, setRole, showToast } = useNav();
  const [email, setEmail] = useState('admin@healthconnect.lk');
  const [password, setPassword] = useState('admin1234');

  const handleLogin = () => {
    setRole('admin');
    showToast('Admin authenticated');
    navigate('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="px-6 py-5">
        <button
          onClick={() => navigate('landing')}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600 mb-4">
              <ShieldAlert className="w-8 h-8 text-primary-400" />
            </div>
            <h1 className="font-display text-3xl font-bold text-white">HealthConnect</h1>
            <p className="text-lg text-primary-400 font-semibold mt-1">System Admin</p>
          </div>
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                />
              </div>
            </div>
            <Button size="lg" fullWidth onClick={handleLogin}>
              <KeyRound className="inline w-4 h-4 mr-1" />
              Secure Login
            </Button>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
            <KeyRound className="w-4 h-4" />
            <span className="text-sm font-semibold">Authorized Personnel Only</span>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            Demo credentials pre-filled — just click Secure Login
          </p>
        </div>
      </div>
    </div>
  );
}

export function PatientRegister() {
  const { navigate, setRole, setPatient, showToast } = useNav();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const patientName = name || 'New Patient';
    const patientEmail = email || 'newpatient@example.lk';
    const { data } = await supabase
      .from('patients')
      .insert({ name: patientName, email: patientEmail, phone })
      .select()
      .maybeSingle();
    const newPatient = (data || { id: '', name: patientName, email: patientEmail, phone, created_at: new Date().toISOString() }) as Patient;
    setPatient(newPatient);
    setRole('patient');
    showToast('Account created successfully!');
    navigate('patient-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
      <div className="px-6 py-5"><BackToLanding /></div>
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo size="lg" />
            <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">Create Patient Account</h1>
            <p className="mt-2 text-gray-500">Join HealthConnect for trusted online healthcare.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <Field icon={Mail} label="Full Name" placeholder="Nimali Perera" value={name} onChange={setName} />
            <Field icon={Mail} label="Email" type="email" placeholder="nimali@example.lk" value={email} onChange={setEmail} />
            <Field icon={Mail} label="Phone Number" placeholder="+94 77 123 4567" value={phone} onChange={setPhone} />
            <Field icon={Lock} label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} />
            <Button size="lg" fullWidth onClick={handleRegister}>
              Create Account <ArrowRight className="inline w-4 h-4 ml-1" />
            </Button>
            <button
              onClick={() => navigate('patient-login')}
              className="w-full text-center text-sm text-primary-600 font-medium hover:text-primary-700"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
