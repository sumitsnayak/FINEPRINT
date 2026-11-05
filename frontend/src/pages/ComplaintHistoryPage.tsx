import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Complaint } from '../types';
import { Search, AlertTriangle, ArrowRight } from 'lucide-react';

interface ComplaintHistoryPageProps {
  onNavigate: (tab: string) => void;
  initialRef?: string;
}

export const ComplaintHistoryPage: React.FC<ComplaintHistoryPageProps> = ({
  onNavigate,
  initialRef,
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchRef, setSearchRef] = useState(initialRef || '');
  const [searchedRecord, setSearchedRecord] = useState<any | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        const list = await api.getUserComplaints();
        setComplaints(list);
      } catch (err) {
        console.error('Failed to load user complaints:', err);
      }
    };
    fetchUserComplaints();
  }, []);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchRef.trim()) return;
    setSearchError(null);
    setSearchedRecord(null);

    try {
      const data = await api.trackComplaint(searchRef.trim());
      setSearchedRecord(data);
    } catch (err: any) {
      setSearchError(
        err.response?.data?.detail || `No grievance record found for reference ${searchRef}.`
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-bold border border-blue-200">
            Submitted
          </span>
        );
      case 'under_review':
        return (
          <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-bold border border-amber-200">
            Under Investigation
          </span>
        );
      case 'referred_to_authority':
        return (
          <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-bold border border-purple-200">
            Referred to FSSAI
          </span>
        );
      case 'resolved':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold border border-emerald-200">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-bold border border-slate-200">
            Closed
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
            <span>🌿</span>
            <span>Grievance Audit</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Food Safety Grievance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track submitted reports or lookup a reference code.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 self-start sm:self-auto"
        >
          File New Report
        </button>
      </div>

      {/* Reference Lookup Form */}
      <form
        onSubmit={handleTrack}
        className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2"
      >
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchRef}
          onChange={(e) => setSearchRef(e.target.value)}
          placeholder="Enter Report Reference ID (e.g. LL-2026-XXXX)..."
          className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-mono"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
        >
          Track
        </button>
      </form>

      {searchError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs shadow-xs">
          {searchError}
        </div>
      )}

      {/* Searched Record Detail Card */}
      {searchedRecord && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-4 animate-in fade-in text-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Grievance Reference
              </span>
              <h3 className="text-2xl font-black font-mono text-emerald-700">
                {searchedRecord.reference_number}
              </h3>
            </div>
            {getStatusBadge(searchedRecord.status)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase block mb-1">Product & Brand</span>
              <p className="font-bold text-slate-900 text-sm">{searchedRecord.product_name}</p>
              <p className="text-slate-500">{searchedRecord.brand_name || 'Brand not specified'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase block mb-1">Seller & Location</span>
              <p className="font-bold text-slate-900">{searchedRecord.seller_name || 'N/A'}</p>
              <p className="text-slate-500">
                {searchedRecord.city ? `${searchedRecord.city}, ${searchedRecord.state}` : 'Location unstated'}
              </p>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-xs block mb-1">
              Description of Concern
            </span>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed shadow-inner">
              {searchedRecord.description}
            </p>
          </div>

          {searchedRecord.admin_notes && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-800 space-y-1">
              <span className="font-bold block uppercase tracking-wider text-[10px] text-emerald-800">
                Official Reviewer Notes
              </span>
              <p>{searchedRecord.admin_notes}</p>
            </div>
          )}
        </div>
      )}

      {/* User's Submitted Complaints List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Your Submitted Grievance Reports</h2>

        {complaints.length > 0 ? (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSearchRef(c.reference_number);
                  setSearchedRecord(c);
                }}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      {c.reference_number}
                    </span>
                    {getStatusBadge(c.status)}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{c.product_name}</h3>
                  <p className="text-xs text-slate-500">
                    Category: {c.category.replace(/_/g, ' ')} · Date: {c.incident_date}
                  </p>
                </div>

                <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                  <span>Track Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
            <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              You haven't submitted any food safety reports yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
