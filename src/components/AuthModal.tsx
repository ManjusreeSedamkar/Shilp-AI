import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, ShoppingBag, Phone, Lock, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import { UserRole } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  phoneOrEmail: string;
  beneficiaryId?: string;
  companyName?: string;
  avatarUrl: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  currentRole: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentRole,
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>(currentRole);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Buyer inputs
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
  };

  const handleArtisanLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AuthUser = {
      id: CURRENT_ARTISAN.id,
      name: CURRENT_ARTISAN.name,
      role: 'artisan',
      phoneOrEmail: phone || CURRENT_ARTISAN.phone,
      beneficiaryId: CURRENT_ARTISAN.beneficiaryId,
      avatarUrl: CURRENT_ARTISAN.avatarUrl,
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleBuyerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AuthUser = {
      id: 'buyer-201',
      name: 'Vikram Mehta',
      role: 'buyer',
      phoneOrEmail: buyerEmail || 'procurement@fabindia-sample.com',
      companyName: buyerCompany || 'FabIndia Crafts Procurement Ltd',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoArtisan = () => {
    onLoginSuccess({
      id: CURRENT_ARTISAN.id,
      name: CURRENT_ARTISAN.name,
      role: 'artisan',
      phoneOrEmail: CURRENT_ARTISAN.phone,
      beneficiaryId: CURRENT_ARTISAN.beneficiaryId,
      avatarUrl: CURRENT_ARTISAN.avatarUrl,
    });
    onClose();
  };

  const handleQuickDemoBuyer = () => {
    onLoginSuccess({
      id: 'buyer-201',
      name: 'Vikram Mehta',
      role: 'buyer',
      phoneOrEmail: 'procurement@fabindia-sample.com',
      companyName: 'FabIndia Procurement',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-stone-200 relative animate-scaleIn space-y-4 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1 pt-1">
          <div className="inline-flex p-2 rounded-2xl bg-saffron-50 text-saffron-600 mb-1">
            <ShieldCheck className="w-7 h-7 text-saffron-600" />
          </div>
          <h3 className="font-extrabold text-lg text-stone-900">
            {activeTab === 'artisan' ? 'MoSJE Artisan Sign In' : 'B2B Buyer & GeM Login'}
          </h3>
          <p className="text-xs text-stone-500">
            {activeTab === 'artisan'
              ? 'Sign in with your MoSJE Beneficiary Card or Mobile Number'
              : 'Sign in to place bulk wholesale orders & RFQs'}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('artisan')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'artisan'
                ? 'bg-white text-saffron-700 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Artisan (कारीगर)</span>
          </button>

          <button
            onClick={() => setActiveTab('buyer')}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'buyer'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>B2B Buyer (खरीदार)</span>
          </button>
        </div>

        {/* 1-Click Quick Demo Login Pill */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
              1-Click Demo Login
            </span>
            <span className="text-xs font-semibold text-stone-800">
              {activeTab === 'artisan' ? 'Rameshwaram Koli (Weaver)' : 'Vikram Mehta (FabIndia Buyer)'}
            </span>
          </div>
          <button
            onClick={activeTab === 'artisan' ? handleQuickDemoArtisan : handleQuickDemoBuyer}
            className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
          >
            <span>Demo In</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Artisan OTP Form */}
        {activeTab === 'artisan' ? (
          <form onSubmit={otpSent ? handleArtisanLogin : handleSendOtp} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mobile Number or MoSJE Card No
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98480 23145"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-saffron-500"
                  required
                />
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Enter 4-Digit OTP
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono font-bold tracking-widest text-stone-900 focus:ring-2 focus:ring-saffron-500"
                    required
                  />
                </div>
                <span className="text-[10.5px] text-emerald-600 block mt-1">
                  ✓ Demo OTP is: 1234 (Auto-verified)
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{otpSent ? 'Verify & Sign In' : 'Send One-Time Password (OTP)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          /* Buyer Form */
          <form onSubmit={handleBuyerLogin} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Company / Organization Name
              </label>
              <input
                type="text"
                value={buyerCompany}
                onChange={(e) => setBuyerCompany(e.target.value)}
                placeholder="FabIndia Crafts / TRIFED / GeM Department"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-navy-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Work Email or Mobile
              </label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="procurement@fabindia.com"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-navy-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Sign In as Wholesale Buyer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-stone-100">
          <p className="text-[10.5px] text-stone-500">
            Protected by MoSJE & Department of Social Justice and Empowerment
          </p>
        </div>
      </div>
    </div>
  );
};
