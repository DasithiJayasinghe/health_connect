import { CheckCircle2 } from 'lucide-react';
import { useNav } from '@/lib/nav';

export function Toast() {
  const { toast } = useNav();
  if (!toast) return null;
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-3 shadow-lg">
        <CheckCircle2 className="w-5 h-5 text-success-400" />
        <span className="text-sm font-medium">{toast}</span>
      </div>
    </div>
  );
}
