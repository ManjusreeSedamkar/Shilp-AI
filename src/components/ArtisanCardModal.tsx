import React, { useRef } from 'react';
import { X, Download, Printer, ShieldCheck, QrCode, Award, CheckCircle2, User, Phone, MapPin } from 'lucide-react';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { Language } from '../types';
import { translate } from '../services/translations';

interface ArtisanCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: Language;
  artisan?: typeof CURRENT_ARTISAN;
}

export const ArtisanCardModal: React.FC<ArtisanCardModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
  artisan = CURRENT_ARTISAN,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const t = (key: string) => translate(language, key);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92dvh] overflow-y-auto shadow-2xl border border-stone-200 animate-scaleIn space-y-0">
        {/* Modal Top Bar */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-saffron-400" />
            <h3 className="font-bold text-sm">
              {language === 'hi' ? 'कारीगर डिजिटल पहचान पत्र (MoSJE)' : 'Artisan Digital Smart ID Card'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Digital Smart Card */}
        <div className="p-6 bg-stone-100 flex flex-col items-center">
          <div
            ref={cardRef}
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl border-2 border-amber-300/80 overflow-hidden relative"
          >
            {/* Government Tricolor Top Bar */}
            <div className="h-2 w-full flex">
              <div className="h-full w-1/3 bg-[#FF9933]"></div>
              <div className="h-full w-1/3 bg-white"></div>
              <div className="h-full w-1/3 bg-[#138808]"></div>
            </div>

            {/* Card Header */}
            <div className="bg-gradient-to-r from-stone-900 via-saffron-950 to-stone-900 text-white p-3.5 flex items-center justify-between border-b border-amber-400/30">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur border border-amber-400/40 flex items-center justify-center text-lg">
                  🏛️
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                    Government of India
                  </h4>
                  <p className="text-[9px] text-stone-200 font-medium">
                    Ministry of Social Justice & Empowerment
                  </p>
                  <p className="text-[8px] text-stone-400">
                    National Artisan Digital Registry (NBCFDC / NSFDC)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-[8px] border border-amber-400/40">
                  SMART ID
                </span>
              </div>
            </div>

            {/* Card Body with Artisan Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3.5">
                {/* Artisan Photograph with Verified Seal */}
                <div className="relative shrink-0">
                  <img
                    src={artisan.avatarUrl}
                    alt={artisan.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-saffron-500 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Name & Primary Attributes */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h5 className="font-extrabold text-sm text-stone-900 truncate">
                      {artisan.name}
                    </h5>
                  </div>
                  <p className="text-[11px] font-semibold text-saffron-700 truncate">
                    {artisan.state} • Master Artisan
                  </p>

                  <div className="text-[10px] text-stone-600 space-y-0.5 pt-0.5">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-stone-500">Beneficiary ID:</span>
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-1 py-0.2 rounded">
                        {artisan.beneficiaryId}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-stone-500">Contact:</span>
                      <span className="font-mono text-stone-800">{artisan.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Craft Specialization & GI Details */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Craft Specialization:</span>
                  <span className="font-bold text-stone-900">Pochampally Ikat Handloom</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Geographical Indication (GI):</span>
                  <span className="font-bold text-emerald-700">GI Reg. No. 4 (Telangana)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">DBT Bank Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Aadhaar Linked
                  </span>
                </div>
              </div>

              {/* Dynamic QR Code Section */}
              <div className="pt-2 border-t border-dashed border-stone-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-stone-400 font-bold block">
                    Official Verification QR
                  </span>
                  <p className="text-[9px] text-stone-600 max-w-[170px] leading-tight">
                    Scan with any smartphone or GeM portal to verify artisan legitimacy & bank DBT records.
                  </p>
                </div>

                {/* Vector QR Code SVG */}
                <div className="p-1.5 bg-white rounded-lg border border-stone-300 shadow-2xs">
                  <svg
                    className="w-14 h-14"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="5" y="5" width="30" height="30" rx="4" stroke="#1c1917" strokeWidth="6" />
                    <rect x="13" y="13" width="14" height="14" fill="#ea580c" />
                    <rect x="65" y="5" width="30" height="30" rx="4" stroke="#1c1917" strokeWidth="6" />
                    <rect x="73" y="13" width="14" height="14" fill="#ea580c" />
                    <rect x="5" y="65" width="30" height="30" rx="4" stroke="#1c1917" strokeWidth="6" />
                    <rect x="13" y="73" width="14" height="14" fill="#ea580c" />
                    <rect x="42" y="10" width="8" height="8" fill="#1c1917" />
                    <rect x="50" y="22" width="8" height="8" fill="#1c1917" />
                    <rect x="42" y="34" width="8" height="8" fill="#1c1917" />
                    <rect x="10" y="45" width="8" height="8" fill="#1c1917" />
                    <rect x="25" y="45" width="8" height="8" fill="#1c1917" />
                    <rect x="42" y="48" width="16" height="16" rx="2" fill="#047857" />
                    <rect x="65" y="45" width="8" height="8" fill="#1c1917" />
                    <rect x="80" y="45" width="8" height="8" fill="#1c1917" />
                    <rect x="42" y="70" width="8" height="8" fill="#1c1917" />
                    <rect x="55" y="78" width="8" height="8" fill="#1c1917" />
                    <rect x="70" y="70" width="12" height="12" fill="#1c1917" />
                    <rect x="85" y="85" width="8" height="8" fill="#1c1917" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="bg-stone-900 text-stone-400 px-3.5 py-2 text-[8px] flex items-center justify-between border-t border-stone-800">
              <span>Valid Throughout India • GeM Registered</span>
              <span className="text-amber-400 font-mono font-semibold">
                MoSJE Verified
              </span>
            </div>
          </div>
        </div>

        {/* Educational Info: How Digital Card Works & Stores Data */}
        <div className="p-4 bg-white border-t border-stone-200 text-xs text-stone-600 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-base">💡</span>
            <div>
              <span className="font-bold text-stone-900 block">
                {language === 'hi' ? 'यह डिजिटल कार्ड कैसे काम करता है?' : 'How is this Digital Card Generated & Verified?'}
              </span>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                {language === 'hi'
                  ? 'यह स्मार्ट पहचान पत्र MoSJE के राष्ट्रीय कारीगर डेटाबेस से स्वतः उत्पन्न होता है। इसके डायनामिक क्यूआर कोड को स्कैन करके खरीदार, प्रदर्शनी अधिकारी और बैंक कारीगर की प्रामाणिकता और डीबीटी खाते की जांच कर सकते हैं।'
                  : 'This smart card is generated with a unique National Beneficiary ID linked to Direct Benefit Transfer (DBT). The dynamic QR code allows wholesale buyers, GeM officials, and exhibition managers to verify artisan legitimacy instantly.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'प्रिंट करें' : 'Print Card'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'डाउनलोड करें' : 'Download ID'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
