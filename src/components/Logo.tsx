import { Activity } from 'lucide-react';

export function Logo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const sz = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const txt = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-xl';
  const iconSz = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-2">
      <div className={`${sz} rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm`}>
        <Activity className={`${iconSz} text-white`} strokeWidth={2.5} />
      </div>
      <span className={`font-display font-bold ${txt} ${light ? 'text-white' : 'text-gray-900'}`}>
        Health<span className="text-primary-600">Connect</span>
      </span>
    </div>
  );
}
