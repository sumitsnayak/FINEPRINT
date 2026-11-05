import React, { useState } from 'react';
import { api } from '../services/api';
import {
  AlertTriangle,
  Upload,
  CheckCircle,
  Shield,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';

interface ComplaintSubmissionPageProps {
  onNavigate: (tab: string) => void;
  onComplaintSubmitted: (refNumber: string) => void;
}

export const ComplaintSubmissionPage: React.FC<ComplaintSubmissionPageProps> = ({
  onNavigate,
  onComplaintSubmitted,
}) => {
  const [category, setCategory] = useState('expired_product');
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [evidenceUrl, setEvidenceUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const categories = [
    { id: 'expired_product', label: 'Expired Product Being Sold' },
    { id: 'missing_label', label: 'Missing or Incomplete Ingredient Label' },
    { id: 'missing_expiry', label: 'Missing Manufacturing or Expiry Date' },
    { id: 'tampered_packaging', label: 'Damaged or Compromised Packaging' },
    { id: 'misleading_claims', label: 'Misleading Health / Nutrition Claims' },
    { id: 'counterfeit_suspected', label: 'Suspected Counterfeit / Fake Brand' },
    { id: 'unhygienic_conditions', label: 'Unhygienic Food Storage Conditions' },
    { id: 'other', label: 'Other Food Safety Concern' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.uploadComplaintEvidence(formData);
      setEvidenceUrl(res.image_url);
    } catch {
      alert('Failed to upload evidence image. You can still submit the text description.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !description.trim()) {
      alert('Please fill in product name and incident description.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitComplaint({
        category,
        product_name: productName,
        brand_name: brandName,
        batch_number: batchNumber,
        seller_name: sellerName,
        seller_location: '',
        city,
        state,
        incident_date: incidentDate,
        description,
        evidence_image_url: evidenceUrl,
        contact_name: isAnonymous ? undefined : contactName,
        contact_phone: isAnonymous ? undefined : contactPhone,
        contact_email: isAnonymous ? undefined : contactEmail,
        is_anonymous: isAnonymous,
      });

      setSubmittedRef(res.reference_number);
      onComplaintSubmitted(res.reference_number);
    } catch {
      alert('Error submitting report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-800">
            Report Registered
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            Grievance Submitted Successfully
          </h1>
          <p className="text-sm text-slate-500">
            Your report has been securely registered in the FINEPRINT consumer audit system.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl max-w-md mx-auto space-y-3 text-slate-900">
          <span className="text-xs uppercase tracking-wider font-bold text-slate-400 block">
            Unique Tracking Reference ID
          </span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 block select-all">
            {submittedRef}
          </span>
          <p className="text-xs text-slate-500">
            Keep this number to track review updates or attach additional evidence.
          </p>
        </div>

        {/* FSSAI Statutory Guidance Notice */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-2 text-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 font-bold text-amber-800">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Official Government FSSAI Reporting Guidance</span>
          </div>
          <p className="leading-relaxed">
            Reports on FINEPRINT are consumer grievance records maintained within our database.
            For direct statutory inspection by government food safety officers,
            you may also submit this complaint directly on the{' '}
            <strong className="text-amber-900">FSSAI Food Safety Connect (FOSCOS)</strong> portal.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-amber-800">
            <a
              href="https://foscos.fssai.gov.in/consumergrievance/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 hover:underline text-amber-900"
            >
              <span>FSSAI Portal (foscos.fssai.gov.in)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="flex items-center space-x-1">
              <PhoneCall className="w-3 h-3" />
              <span>National Consumer Helpline: 1915</span>
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => onNavigate('complaints-history')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Track Report Status
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Consumer Protection & Whistleblower</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Report a Food Safety Concern
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Help protect fellow consumers from adulteration, unhygienic storage, misleading claims, and expired products.
        </p>
      </div>

      {/* Legal disclaimer banner */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1 shadow-xs">
        <p className="font-bold text-slate-900">Legal Notice on Grievance Allegations:</p>
        <p>
          A user-generated report is an allegation for investigation, not judicial proof of wrongdoing.
          Brands and sellers are not publicly branded as unsafe solely on an unverified report.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Concern Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:border-emerald-600"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="bg-white text-slate-900">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Packaged Paneer or Milk"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Brand Name (if visible)
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Brand Name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Batch / Lot Number (if printed)
            </label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g. BATCH-2026-X"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Date of Incident / Purchase *
            </label>
            <input
              type="date"
              required
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Shop / Vendor / Seller
            </label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="Shop or Supermarket"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Mumbai, Delhi, Bengaluru"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              State
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State / Union Territory"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Incident Description & Hazard Details *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what was wrong: e.g. Pack had an expiry date of last month covered by a fresh sticker, or product smelled rancid upon unsealing..."
            className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 leading-relaxed"
          />
        </div>

        {/* Evidence Photo Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Photo / Video Evidence
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>{isUploading ? 'Uploading...' : 'Attach Photo Evidence'}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            {evidenceUrl && (
              <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Evidence Attached</span>
              </span>
            )}
          </div>
        </div>

        {/* Contact details */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Contact Information (Optional)
            </span>
            <label className="flex items-center space-x-2 text-xs text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span>Submit Anonymously</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Your Name"
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
              />
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone (for status updates)"
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
              />
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="Email Address"
                className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
              />
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-2xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 text-sm disabled:opacity-50"
          >
            {submitting ? 'Registering Report...' : 'Submit Food Safety Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
