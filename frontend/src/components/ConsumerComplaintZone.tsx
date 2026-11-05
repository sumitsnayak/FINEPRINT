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
  BadgeAlert,
  Scale
} from 'lucide-react';
import { UniversalModal } from './UniversalModal';
import { sounds } from '../utils/soundEffects';

interface ConsumerComplaintZoneProps {
  onNavigate: (tab: string) => void;
}

export const ConsumerComplaintZone: React.FC<ConsumerComplaintZoneProps> = ({ onNavigate }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedViolation, setSelectedViolation] = useState<string>('expired');

  const violations = [
    {
      id: 'expired',
      title: 'Expired Food Being Sold',
      icon: Clock,
      law: 'Section 23, FSS Act 2006',
      penalty: 'Up to ₹2,00,000 fine & product seizure',
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
    setIsModalOpen(false);
    onNavigate('report');
  };

  const handleOpenModal = () => {
    sounds.playClick();
    setIsModalOpen(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-4 relative z-10">
      {/* COMPACT & ATTRACTIVE GRIEVANCE BANNER ON LANDING PAGE */}
      <div className="glass-card hover:glass-card-glow rounded-[28px] p-5 sm:p-6 border border-white/90 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Specular Sheen */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left Title & Summary */}
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full mac-secondary-btn text-rose-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>CONSUMER GRIEVANCE REDRESSAL · FSS ACT 2006</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Found Something Wrong? How to Complain & Legal Rights
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              If an Indian food brand or retailer sells expired goods, misleads with fake claims, or lacks an FSSAI license, you have strong legal protections. File a formal grievance docket directly from this app.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenModal}
              className="py-3 px-5 rounded-2xl mac-secondary-btn text-slate-800 hover:text-emerald-800 text-xs font-bold flex items-center justify-center space-x-2 shadow-xs hover:border-emerald-300 transition-all whitespace-nowrap"
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>How to Complain & Legal Rights (View Details)</span>
            </button>

            <button
              type="button"
              onClick={handleStartComplaint}
              className="py-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-rose-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>File a Complaint Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE COMPLAINT & LEGAL RIGHTS POP-UP MODAL */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Consumer Food Safety Grievance & Legal Rights Guide"
        subtitle="Sections 23, 24, 31 & 51 of the Food Safety & Standards Act 2006 (Govt. of India)"
        badge="LEGAL REDRESSAL DOSSIER"
        badgeColor="bg-rose-50 text-rose-800 border-rose-200"
        icon={<ShieldAlert className="w-5 h-5 text-rose-600" />}
        maxWidth="max-w-4xl"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              FinePrint generates structured grievance dockets with unique Reference IDs.
            </span>
            <button
              type="button"
              onClick={handleStartComplaint}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-rose-600/20"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Launch In-App Complaint Filing</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* 3 Step Procedure Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                1
              </div>
              <h5 className="font-bold text-slate-900 text-xs">Snap the Physical Label & Bill</h5>
              <p className="text-[11px] text-slate-500">
                Capture the batch number, manufacturer license, date stamp, and purchase invoice.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                2
              </div>
              <h5 className="font-bold text-slate-900 text-xs">Submit Through FinePrint</h5>
              <p className="text-[11px] text-slate-500">
                Our engine automatically tags the violated Section of the FSS Act 2006.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                3
              </div>
              <h5 className="font-bold text-slate-900 text-xs">Auto-Dossier Escalation</h5>
              <p className="text-[11px] text-slate-500">
                Download your formal evidence dossier formatted for National Consumer Helpline (1915).
              </p>
            </div>
          </div>

          {/* Select Violation Category */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Select Specific Violation Type:
            </span>
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
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border transition-all ${
                      isSelected
                        ? 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{v.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Violation Details Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                  Governing Law
                </span>
                <h4 className="text-base font-black text-slate-900">{currentViolation.law}</h4>
              </div>
              <div className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-mono font-bold self-start sm:self-auto">
                Legal Penalty: {currentViolation.penalty}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-extrabold text-slate-900 block">What Constitutes a Violation:</span>
                <p className="text-slate-600 leading-relaxed">{currentViolation.desc}</p>
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-extrabold text-emerald-800 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Evidence Required For Prosecution:</span>
                </span>
                <p className="text-slate-600 leading-relaxed">{currentViolation.evidenceNeeded}</p>
              </div>
            </div>
          </div>

          {/* Official Govt Escalation Portals & Helplines */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Official Government Portals & Helplines (Govt. of India)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="tel:1915"
                className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-between group transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    National Consumer Helpline
                  </span>
                  <span className="text-base font-black font-mono text-slate-900 group-hover:text-emerald-700">
                    1915
                  </span>
                  <span className="text-[10px] text-slate-500 block">Toll-Free Grievance</span>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>

              <a
                href="tel:1800112100"
                className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-between group transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    FSSAI FoSCoS Portal
                  </span>
                  <span className="text-base font-black font-mono text-slate-900 group-hover:text-emerald-700">
                    1800 112 100
                  </span>
                  <span className="text-[10px] text-slate-500 block">Food Safety Authority</span>
                </div>
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </a>

              <a
                href="https://wa.me/918800001915?text=Hello%20NCH%20I%20want%20to%20file%20a%20food%20safety%20complaint"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-between group transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    NCH WhatsApp Helpline
                  </span>
                  <span className="text-sm font-black font-mono text-slate-900 group-hover:text-emerald-700">
                    +91 88000 01915
                  </span>
                  <span className="text-[10px] text-slate-500 block">Chat-Based Redressal</span>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600" />
              </a>
            </div>
          </div>
        </div>
      </UniversalModal>
    </section>
  );
};
