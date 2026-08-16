import { useEffect, useState } from 'react';
import { Search, Ban, Eye, AlertTriangle, ShieldCheck, Star } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Avatar, VerifiedBadge, StatusBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatLKR, formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Patient, Doctor } from '@/lib/types';

export function AdminPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('patients').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setPatients((data as Patient[]) || []);
    });
  }, []);

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout active="admin-patients">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-sm text-gray-500">View and manage patient accounts.</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search patients by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={p.name} size={40} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-500 truncate">{p.email}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                <button className="p-2 rounded-lg text-error-400 hover:bg-error-50"><Ban className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{p.phone || 'No phone'}</span>
              <span>Joined {formatDate(p.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export function AdminDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase.from('doctors').select('*').order('rating', { ascending: false }).then(({ data }) => {
      setDoctors((data as Doctor[]) || []);
    });
  }, []);

  const filtered = doctors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialization.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout active="admin-doctors">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Doctor Management</h1>
        <p className="text-sm text-gray-500">View and manage all doctors on the platform.</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search doctors by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((doc) => (
          <div key={doc.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <Avatar name={doc.name} size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 truncate">{doc.name}</p>
                  {doc.is_verified && <VerifiedBadge />}
                </div>
                <p className="text-xs text-gray-500">{doc.specialization}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5 text-xs text-gray-500"><Star className="w-3 h-3 fill-warning-400 text-warning-400" /> {doc.rating}</span>
                  <span className="text-xs text-gray-500">{formatLKR(doc.consultation_fee)}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <StatusBadge status={doc.verification_status} />
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                {!doc.is_verified && <button className="p-2 rounded-lg text-error-400 hover:bg-error-50"><Ban className="w-4 h-4" /></button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
