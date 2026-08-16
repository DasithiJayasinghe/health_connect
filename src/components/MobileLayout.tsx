import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNav } from '@/lib/nav';

export function MobileHeader({
  title,
  subtitle,
  back = true,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}) {
  const { goBack } = useNav();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="px-4 py-3 flex items-center gap-3">
        {back && (
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold font-display text-gray-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function MobilePage({ children }: { children: ReactNode }) {
  return (
    <div className="phone-frame bg-gray-50 min-h-screen flex flex-col">
      {children}
    </div>
  );
}

export function MobileContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex-1 px-4 py-4 ${className}`}>{children}</div>;
}
