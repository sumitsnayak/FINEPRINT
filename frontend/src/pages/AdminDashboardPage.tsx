import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ExternalLink
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [statusInput, setStatusInput] = useState('under_review');
  const [adminNotes, setAdminNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminComplaints(),
      ]);
      setStats(statsRes);
      setComplaints(complaintsRes);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    setSavingStatus(true);
    try {
      await api.updateComplaintStatus(selectedComplaint.id, {
        status: statusInput,
        admin_notes: adminNotes,
      });
      setSelectedComplaint(null);
      fetchAdminData();
    } catch {
      alert('Could not update complaint status.');
    } finally {
      setSavingStatus(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-500">
          This administration console is restricted to authenticated food safety officers and platform moderators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-2 shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Food Safety Compliance & Audit Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Logged in as {user.full_name} ({user.email})
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Users</span>
          <p className="text-2xl font-black font-mono text-slate-900">
            {stats?.total_users ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Verified Products</span>
          <p className="text-2xl font-black font-mono text-emerald-700">
            {stats?.total_products ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Label Scans Conducted</span>
          <p className="text-2xl font-black font-mono text-teal-700">
            {stats?.total_scans ?? 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400">Consumer Grievances</span>
          <p className="text-2xl font-black font-mono text-rose-600">
            {stats?.total_complaints ?? 0}
          </p>
        </div>
      </div>

      {/* Complaints Review Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Submitted Food Safety Reports ({complaints.length})
          </h2>
          <span className="text-xs text-slate-500">Review allegations & manage regulatory referral</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
                <th className="py-3.5 px-4">Ref ID</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Product & Brand</th>
                <th className="py-3.5 px-4">Seller & City</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{c.reference_number}</td>
                  <td className="py-3 px-4 font-medium capitalize text-slate-700">
                    {c.category.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{c.product_name}</span>
                    <span className="text-slate-500">{c.brand_name || 'Brand unstated'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="block text-slate-800">{c.seller_name || 'N/A'}</span>
                    <span className="text-slate-500">{c.city || ''}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize px-3 py-1 rounded-full font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {c.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                        setStatusInput(c.status);
                        setAdminNotes(c.admin_notes || '');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in text-slate-900">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Reviewing Report
                </span>
                <h3 className="text-xl font-black font-mono text-emerald-700">
                  {selectedComplaint.reference_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-slate-700 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Product:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedComplaint.product_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Date:</span>
                  <span className="font-mono text-slate-900">{selectedComplaint.incident_date}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block mb-1">Consumer Allegation:</span>
                <p className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-700 leading-relaxed shadow-inner">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.evidence_image_url && (
                <div>
                  <span className="text-slate-500 block mb-1">Attached Evidence:</span>
                  <a
                    href={selectedComplaint.evidence_image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline font-bold flex items-center space-x-1"
                  >
                    <span>View Full Evidence Image</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-500 mb-1">Update Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Investigation</option>
                  <option value="referred_to_authority">Referred to FSSAI Authority</option>
                  <option value="resolved">Resolved / Action Taken</option>
                  <option value="closed">Closed / Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">
                  Official Administrative Notes (Visible to Reporter)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record verification findings or official actions..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={savingStatus}
                  onClick={handleUpdateStatus}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {savingStatus ? 'Updating...' : 'Save Audit Decision'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
