import { useEffect, useState } from 'react';
import { AlertTriangle, Mail, Ban, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { Avatar, StatusBadge } from '@/components/ui';
import { Button } from '@/components/Button';
import { formatDate } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import type { Report } from '@/lib/types';

export function AdminReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selected, setSelected] = useState<Report | null>(null);

  useEffect(() => {
    supabase.from('reports').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setReports((data as Report[]) || []);
    });
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('reports').update({ status }).eq('id', id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } as Report : r)));
    setSelected(null);
  };

  return (
    <AdminLayout active="admin-reports">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-gray-900">Reports & Complaints</h1>
        <p className="text-sm text-gray-500">Review and resolve patient-reported issues.</p>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-success-200 mx-auto mb-2" />
            <p className="text-gray-400">No reported issues.</p>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-error-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-error-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900">Patient: {r.patient_name}</p>
                    <StatusBadge status={r.status} />
                  </div>
                  <p className="text-sm text-gray-600">Reported: <span className="font-medium">{r.doctor_name}</span></p>
                  <p className="text-sm text-gray-500 mt-1">"{r.reason}"</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(r.created_at)}</p>
                </div>
                <Button size="sm" onClick={() => setSelected(r)}>Review</Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-full p-5 shadow-xl animate-slide-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-gray-900">Review Report</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 mb-5">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Patient</p>
                <p className="text-sm font-semibold text-gray-800">{selected.patient_name}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Reported Doctor</p>
                <p className="text-sm font-semibold text-gray-800">{selected.doctor_name}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Reason</p>
                <p className="text-sm text-gray-700">{selected.reason}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs text-gray-400">Status</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <div className="space-y-2">
              <Button size="md" variant="outline" fullWidth onClick={() => updateStatus(selected.id, 'under_review')}>
                <Mail className="w-4 h-4" /> Contact User
              </Button>
              <Button size="md" variant="outline" fullWidth onClick={() => updateStatus(selected.id, 'under_review')}>
                <ShieldAlert className="w-4 h-4" /> Warn Doctor
              </Button>
              <Button size="md" variant="danger" fullWidth onClick={() => updateStatus(selected.id, 'resolved')}>
                <Ban className="w-4 h-4" /> Suspend Account
              </Button>
              <Button size="md" variant="success" fullWidth onClick={() => updateStatus(selected.id, 'closed')}>
                <CheckCircle2 className="w-4 h-4" /> Close Case
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
