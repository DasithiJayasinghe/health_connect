import { ShieldCheck, Lock, KeyRound, Star, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

export function VerifiedBadge({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-success-50 text-success-700 font-semibold ${sz}`}>
      <ShieldCheck className={size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} />
      Verified Doctor
    </span>
  );
}

export function VerifiedByHealthConnect({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sz = size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 font-semibold ${sz}`}>
      <ShieldCheck className={size === 'md' ? 'w-4 h-4' : 'w-3 h-3'} />
      Verified by HealthConnect
    </span>
  );
}

export function TrustChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2.5">
      <div className="text-primary-300">{icon}</div>
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
  );
}

export function TrustIndicatorRow() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex items-center gap-2 rounded-full bg-success-50 text-success-700 px-4 py-2">
        <ShieldCheck className="w-4 h-4" />
        <span className="text-sm font-semibold">Verified Doctors</span>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-primary-50 text-primary-700 px-4 py-2">
        <Lock className="w-4 h-4" />
        <span className="text-sm font-semibold">Secure Consultations</span>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-secondary-50 text-secondary-700 px-4 py-2">
        <KeyRound className="w-4 h-4" />
        <span className="text-sm font-semibold">Private Health Data</span>
      </div>
    </div>
  );
}

export function SecurityBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-primary-50 border border-primary-100 px-4 py-3">
      <Lock className="w-4 h-4 text-primary-600 shrink-0" />
      <p className="text-sm text-primary-800 font-medium">{message}</p>
    </div>
  );
}

export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={
            i <= Math.round(rating)
              ? 'fill-warning-400 text-warning-400'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

export function VerificationCheck({ label, done = true }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {done ? (
        <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
      ) : (
        <Clock className="w-5 h-5 text-warning-500 shrink-0" />
      )}
      <span className={`text-sm font-medium ${done ? 'text-gray-800' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: ReactNode }> = {
    pending: { bg: 'bg-warning-50', text: 'text-warning-700', icon: <Clock className="w-3 h-3" /> },
    under_review: { bg: 'bg-warning-50', text: 'text-warning-700', icon: <Clock className="w-3 h-3" /> },
    confirmed: { bg: 'bg-success-50', text: 'text-success-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    approved: { bg: 'bg-success-50', text: 'text-success-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    completed: { bg: 'bg-primary-50', text: 'text-primary-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelled: { bg: 'bg-error-50', text: 'text-error-700', icon: <AlertCircle className="w-3 h-3" /> },
    rejected: { bg: 'bg-error-50', text: 'text-error-700', icon: <AlertCircle className="w-3 h-3" /> },
    resolved: { bg: 'bg-success-50', text: 'text-success-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    closed: { bg: 'bg-gray-100', text: 'text-gray-600', icon: <CheckCircle2 className="w-3 h-3" /> },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.icon}
      {status.replace('_', ' ').replace(/\b\w/g, (m) => m.toUpperCase())}
    </span>
  );
}

export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  const cleanName = name.replace(/^(Dr\.?|Prof\.)\s*/i, '').trim();
  const parts = cleanName.split(/\s+/);
  const init = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : cleanName.slice(0, 2).toUpperCase();
  const colors = [
    'bg-primary-500', 'bg-secondary-500', 'bg-accent-500', 'bg-success-600',
    'bg-primary-700', 'bg-secondary-700',
  ];
  const idx = cleanName.charCodeAt(0) % colors.length;
  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${colors[idx]}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {init}
    </div>
  );
}
