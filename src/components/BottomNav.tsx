import { Home, Stethoscope, Calendar, FileText, User } from 'lucide-react';
import { useNav, type Screen } from '@/lib/nav';

const items = [
  { icon: Home, label: 'Home', screen: 'patient-dashboard' as Screen },
  { icon: Stethoscope, label: 'Doctors', screen: 'find-doctor' as Screen },
  { icon: Calendar, label: 'Appointments', screen: 'consultation-summary' as Screen },
  { icon: FileText, label: 'Records', screen: 'medical-records' as Screen },
  { icon: User, label: 'Profile', screen: 'patient-profile' as Screen },
];

export function BottomNav({ active }: { active: Screen }) {
  const { navigate } = useNav();
  return (
    <nav className="sticky bottom-0 z-30 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        {items.map((item) => {
          const isActive = active === item.screen;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.screen)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
