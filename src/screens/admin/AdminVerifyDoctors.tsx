import { useEffect, useState } from 'react';
import { ShieldCheck, Check, X, Info, FileText, Award, Building2, User } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Avatar, VerifiedBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabase';
import type { Doctor } from '@/lib/types';

export function AdminVerifyDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<Doctor | null>(null);

  useEffect(() => {
    supabase.from('doctors').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setDoctors((data as Doctor[]) || []);
    });
  }, []);

  const pending = doctors.filter((d) => !d.is_verified);
  const verified = doctors.filter((d) => d.is_verified);

  const handleApprove = async (doc: Doctor) => {
    await supabase.from('doctors').update({ is_verified: true, verification_status: 'approved' }).eq('id', doc.id);
    setDoctors((prev) => prev.map((d) => (d.id === doc.id ? { ...d, is_verified: true, verification_status: 'approved' } : d)));
    setSelected(null);
  };

  const handleReject = async (doc: Doctor) => {
    await supabase.from('doctors').update({ verification_status: 'rejected' }).eq('id', doc.id);
    setDoctors((prev) => prev.map((d) => (d.id === doc.id ? { ...d, verification_status: 'rejected' } : d)));
    setSelected(null);
  };

  return (
    <AdminLayout active="admin-verify-doctors">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-gray-900">Doctor Verification Management</h1>
        <p className="text-sm text-gray-500">Review and approve doctor applications.</p>
      </div>

      {/* Pending applications */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-warning-500"></span>
          Pending Doctor Applications ({pending.length})
        </h2>
        <div className="space-y-3">
          {pending.length === 0 ? (
            <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center">
              <ShieldCheck className="w-12 h-12 text-success-200 mx-auto mb-2" />
              <p className="text-gray-400">No pending applications.</p>
            </div>
          ) : (
            pending.map((doc) => (
              <div key={doc.id} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <Avatar name={doc.name} size={56} />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.specialization}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Registration ID: {doc.registration_id}</p>
                  </div>
                  <Button size="sm" onClick={() => setSelected(doc)}>Review</Button>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    { icon: User, label: 'Identity' },
                    { icon: Award, label: 'Qualification' },
                    { icon: FileText, label: 'Registration' },
                    { icon: Building2, label: 'Affiliation' },
                  ].map((d) => {
                    const Icon = d.icon;
                    return (
                      <div key={d.label} className="flex items-center gap-1.5 text-xs text-success-600">
                        <Check className="w-3.5 h-3.5" /> {d.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Verified doctors */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success-500"></span>
          Verified Doctors ({verified.length})
        </h2>
        <div className="space-y-3">
          {verified.map((doc) => (
            <div key={doc.id} className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar name={doc.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.specialization}</p>
                </div>
                <VerifiedBadge />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full p-5 shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <Avatar name={selected.name} size={64} />
              <div>
                <h3 className="font-display text-xl font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.specialization}</p>
                <p className="text-xs text-gray-400 mt-0.5">Registration ID: {selected.registration_id}</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-sm"><Award className="w-4 h-4 text-gray-400" /> <span className="text-gray-600">{selected.qualifications}</span></div>
              <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-gray-400" /> <span className="text-gray-600">{selected.hospital}</span></div>
              <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-400" /> <span className="text-gray-600">{selected.experience_years} years experience</span></div>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 mb-5">
              <h4 className="text-sm font-bold text-gray-700 mb-2">Documents Submitted</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Identity Document', 'Medical Qualification', 'Professional Registration', 'Hospital Affiliation'].map((d) => (
                  <div key={d} className="flex items-center gap-1.5 text-xs text-success-600">
                    <Check className="w-3.5 h-3.5" /> {d}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="md" variant="success" fullWidth onClick={() => handleApprove(selected)}>
                <Check className="w-4 h-4" /> Approve Doctor
              </Button>
              <Button size="md" variant="danger" fullWidth onClick={() => handleReject(selected)}>
                <X className="w-4 h-4" /> Reject
              </Button>
            </div>
            <Button size="md" variant="outline" fullWidth className="mt-2" onClick={() => setSelected(null)}>
              <Info className="w-4 h-4" /> Request More Information
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
