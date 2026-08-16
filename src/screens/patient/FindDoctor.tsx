import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Star, ChevronRight, MapPin, Languages } from 'lucide-react';
import { useNav } from '@/lib/nav';
import { MobilePage, MobileContent, MobileHeader } from '@/components/MobileLayout';
import { BottomNav } from '@/components/BottomNav';
import { Avatar, VerifiedBadge, StarRating } from '@/components/ui';
import { formatLKR } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/lib/types';

const specializations = ['All', 'General Physician', 'Dermatologist', 'Cardiologist', 'Pediatrician', 'Psychiatrist', 'Gynecologist', 'Orthopedic Surgeon'];
const languages = ['All', 'English', 'Sinhala', 'Tamil'];

export function FindDoctor() {
  const { navigate, selectDoctor } = useNav();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [spec, setSpec] = useState('All');
  const [lang, setLang] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('doctors')
      .select('*')
      .order('rating', { ascending: false })
      .then(({ data }) => {
        setDoctors((data as Doctor[]) || []);
        setLoading(false);
      });
  }, []);

  const filtered = doctors.filter((d) => {
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.specialization.toLowerCase().includes(search.toLowerCase())) return false;
    if (spec !== 'All' && d.specialization !== spec) return false;
    if (lang !== 'All' && !d.languages.includes(lang)) return false;
    if (d.rating < minRating) return false;
    return true;
  });

  return (
    <MobilePage>
      <MobileHeader title="Find a Doctor" subtitle={`${filtered.length} doctors available`} />
      <MobileContent className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${showFilters ? 'bg-primary-50 text-primary-600' : 'text-gray-400'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 rounded-2xl bg-white border border-gray-100 p-4 animate-slide-up">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Specialization</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {specializations.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpec(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      spec === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Language</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      lang === l ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Minimum Rating</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[0, 4, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                      minRating === r ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {r === 0 ? 'Any' : <><Star className="w-3 h-3 fill-current" /> {r}+</>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Doctor cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  selectDoctor(doc.id);
                  navigate('doctor-profile');
                }}
                className="w-full text-left rounded-2xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-primary-100 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={doc.name} size={56} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-gray-900">{doc.name}</p>
                      {doc.is_verified && <VerifiedBadge />}
                    </div>
                    <p className="text-sm text-gray-500">{doc.specialization}</p>
                    <div className="mt-1.5">
                      <StarRating rating={doc.rating} size={14} />
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{doc.experience_years} Years Experience</span>
                      <span className="flex items-center gap-0.5"><Languages className="w-3 h-3" />{doc.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary-700">{formatLKR(doc.consultation_fee)}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" /> {doc.hospital}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 shrink-0 mt-2" />
                </div>
              </button>
            ))}
          </div>
        )}
      </MobileContent>
      <BottomNav active="find-doctor" />
    </MobilePage>
  );
}
