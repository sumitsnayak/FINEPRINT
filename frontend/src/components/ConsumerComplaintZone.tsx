import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Camera,
  FileCheck2,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Building2,
  Ban,
  Tag,
  Bug,
  BadgeAlert
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ConsumerComplaintZoneProps {
  onNavigate: (tab: string) => void;
}

export const ConsumerComplaintZone: React.FC<ConsumerComplaintZoneProps> = ({ onNavigate }) => {
  const [selectedViolation, setSelectedViolation] = useState<string>('expired');

  const violations = [
    {
      id: 'expired',
      title: 'Expired Food Being Sold',
      icon: Clock,
      law: 'Section 23, FSS Act 2006',
      penalty: 'Up to ₹2,00,000 fine & seizure',
      desc: 'Retailers or supermarkets selling items past the "Best Before" or "Expiry" date, or wiping out printed dates.',
      evidenceNeeded: 'Clear photo of the expiry date stamp, batch number, and store purchase bill / shelf tag.'
    },
    {
      id: 'misleading',
      title: 'Misleading Health Claims',
      icon: BadgeAlert,
      law: 'Section 24, FSS Act 2006 & CCPA Norms',
      penalty: 'Up to ₹10,00,000 penalty on manufacturer',
      desc: 'Brands advertising "100% Real Fruit", "Zero Sugar", or "100% Whole Wheat" while hiding invert sugar and maida.',
      evidenceNeeded: 'Photo of the front marketing claim side-by-side with the actual ingredient list on the back.'
    },
    {
      id: 'license',
      title: 'Missing / Fake FSSAI License',
      icon: ShieldAlert,
      law: 'Section 31, FSS Act 2006',
      penalty: 'Up to 6 months imprisonment & ₹5,00,000 fine',
      desc: 'Packaged foods lacking the mandatory 14-digit FSSAI license number or using a fake registration number.',
      evidenceNeeded: 'Photo of the back-of-pack information panel where manufacturer license must be displayed.'
    },
    {
      id: 'adulteration',
      title: 'Foreign Objects & Adulteration',
      icon: Bug,
      law: 'Section 51 & 59, FSS Act 2006',
      penalty: 'Up to 7 years imprisonment (severe cases)',
      desc: 'Fungal growth in sealed packs, insects, chemical smells, synthetic colors, or contaminated liquids.',
      evidenceNeeded: 'Uncut video or high-res photo of the unsealed product, container seal, and batch number.'
    },
    {
      id: 'mrp',
      title: 'Overcharging Above MRP',
      icon: Tag,
      law: 'Legal Metrology (Packaged Commodities) 2011',
      penalty: 'Up to ₹50,000 fine per violation',
      desc: 'Stores pasting stickers over the original MRP or charging cooling fees above the printed retail price.',
      evidenceNeeded: 'Photo of the original printed MRP alongside the retailer cash receipt showing extra charge.'
    }
  ];

  const currentViolation = violations.find((v) => v.id === selectedViolation) || violations[0];

  const handleStartComplaint = () => {
    sounds.playScanBeep();
    onNavigate('report');
  };

  const handleViewHistory = () => {
    sounds.playClick();
    onNavigate('complaints-history');
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      {/* Container with Glass Aesthetics */}
      <div className="glass-card rounded-[36px] p-6 sm:p-10 border border-white/90 shadow-xl relative overflow-hidden space-y-8">
        {/* Ambient Top Specular Light */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-rose-500/10 via-emerald-500/5 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span className="tracking-wide">CONSUMER GRIEVANCE & LEGAL PROTECTIONS</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Spotted Something Wrong? <br className="hidden sm:inline" />
              <span className="text-rose-600">How to File a Food Complaint from FINEPRINT.</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              If any brand, supermarket, or dark store is selling expired items, deceptive labels, adulterated food, or charging above MRP, you have the legal right to redressal. Report it here with photographic proof.
            </p>
          </div>

          {/* Quick Action CTA Pill Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 self-start md:self-end">
            <button
              type="button"
              onClick={handleStartComplaint}
              className="py-3 px-5 rounded-2xl apple-pill-btn text-white text-xs sm:text-sm font-black flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>File a Complaint Now</span>
            </button>

            <button
              type="button"
              onClick={handleViewHistory}
              className="py-3 px-4 rounded-2xl mac-secondary-btn text-slate-700 hover:text-emerald-800 text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs hover:shadow-sm transition-all"
            >
              <span>Track Grievances</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3-Step Simple Flow on How to Complain */}
        <div className="relative z-10 space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            How In-App Grievance Filing Works (3 Simple Steps)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center font-mono">
                    01
                  </span>
                  <Camera className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900">1. Capture Photographic Evidence</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Take a clear photo showing the violation: the expired date, missing ingredient table, torn seal, adulterated food, or store receipt.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
                Accepted: JPEG, PNG, Camera
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center font-mono">
                    02
                  </span>
                  <FileCheck2 className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900">2. Submit In-App Grievance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Fill in the brand name, batch number, seller/store name, and city. Upload the evidence photo and click submit. You receive a unique Tracking Reference ID.
                </p>
              </div>
              <div className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-xl w-fit">
                Instant Tracking Reference ID
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-3xl bg-white/90 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center font-mono">
                    03
                  </span>
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900">3. Regulatory Escalation</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  FINEPRINT structures your case under the FSS Act 2006. You can track updates in the app and forward the dossier directly to the National Consumer Helpline (1915).
                </p>
              </div>
              <div className="text-[11px] font-mono text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-xl w-fit">
                FSSAI & NCH Compatible
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Violations Selector & Legal Rights Explorer */}
        <div className="relative z-10 space-y-4 pt-2 border-t border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Common Offenses You Can Report Right Now
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Select an issue to view legal rights</span>
          </div>

          {/* Issue Pills */}
          <div className="flex flex-wrap gap-2">
            {violations.map((v) => {
              const Icon = v.icon;
              const isSelected = selectedViolation === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setSelectedViolation(v.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span>{v.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Offense Dossier Card */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-slate-50/90 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
                  Applicable Indian Law
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {currentViolation.law}
                </h4>
              </div>

              <div className="px-3 py-1 rounded-xl bg-rose-100 text-rose-900 text-xs font-mono font-bold self-start sm:self-center">
                Legal Penalty: {currentViolation.penalty}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-extrabold text-slate-900 text-[11px] block">
                  What Constitutes a Violation:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {currentViolation.desc}
                </p>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-2xl border border-slate-200/60">
                <span className="font-extrabold text-emerald-800 text-[11px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Evidence Required For Successful Prosecution:</span>
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {currentViolation.evidenceNeeded}
                </p>
              </div>
            </div>

            {/* Quick action for this offense */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleStartComplaint}
                className="py-2 px-4 rounded-xl apple-pill-btn text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
              >
                <span>Report This Violation in App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Direct Escalation Hotlines & Helplines (Govt. of India) */}
        <div className="relative z-10 pt-4 border-t border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Official Government Portals & Emergency Helplines
            </span>
            <span className="text-[11px] text-slate-400">Toll-free consumer grievance lines</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* NCH */}
            <a
              href="tel:1915"
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between group transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  National Consumer Helpline
                </span>
                <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 font-mono">
                  1915
                </span>
                <span className="text-[10px] text-slate-500 block">Ministry of Consumer Affairs</span>
              </div>
              <PhoneCall className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </a>

            {/* FSSAI FoSCoS */}
            <a
              href="tel:1800112100"
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between group transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  FSSAI Food Safety Toll-Free
                </span>
                <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 font-mono">
                  1800 112 100
                </span>
                <span className="text-[10px] text-slate-500 block">Food Safety & Standards Authority</span>
              </div>
              <PhoneCall className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </a>

            {/* WhatsApp NCH */}
            <a
              href="https://wa.me/918800001915?text=Hello%20NCH%20I%20want%20to%20file%20a%20food%20safety%20complaint"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/80 flex items-center justify-between group transition-all"
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  NCH WhatsApp Helpline
                </span>
                <span className="text-sm font-black text-slate-900 group-hover:text-emerald-700 font-mono">
                  +91 88000 01915
                </span>
                <span className="text-[10px] text-slate-500 block">Chat-based grievance lodging</span>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

