import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { MobileFrame } from './components/MobileFrame';
import { ArtisanDashboard } from './components/ArtisanDashboard';
import { ArtisanStudio } from './components/ArtisanStudio';
import { VoiceCatalogerModal } from './components/VoiceCatalogerModal';
import { ArtisanCopilot } from './components/ArtisanCopilot';
import { DynamicPricingCard } from './components/DynamicPricingCard';
import { BuyerPortal } from './components/BuyerPortal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { INITIAL_PRODUCTS, CURRENT_ARTISAN } from './data/craftPresets';
import { ProductListing, UserRole, Language } from './types';
import { Home, Camera, Mic, Bot, IndianRupee, Sparkles, CheckCircle2, ShoppingBag } from 'lucide-react';

export function App() {
  const [role, setRole] = useState<UserRole>('artisan');
  const [language, setLanguage] = useState<Language>('en');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [artisanTab, setArtisanTab] = useState<'dashboard' | 'studio' | 'voice' | 'copilot' | 'pricing'>('dashboard');
  const [products, setProducts] = useState<ProductListing[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<ProductListing | null>(null);
  const [stagedPhotoUrl, setStagedPhotoUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isHindi = language === 'hi';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleListingCreated = (newProduct: ProductListing) => {
    setProducts((prev) => [newProduct, ...prev]);
    setArtisanTab('dashboard');
    showToast(isHindi ? '🎉 नया उत्पाद सफलता से कैटलॉग में प्रकाशित हुआ!' : '🎉 Smart Catalog listing published successfully!');
  };

  const handlePhotoSelectedFromStudio = (photoUrl: string) => {
    setStagedPhotoUrl(photoUrl);
    setArtisanTab('voice');
    showToast(isHindi ? '✨ स्टूडियो फोटो तैयार! अब बोलकर विवरण जोड़ें।' : '✨ Studio photo ready! Now speak to add description.');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col">
      {/* Universal Government & Application Navbar */}
      <Navbar
        role={role}
        setRole={setRole}
        language={language}
        setLanguage={setLanguage}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center space-x-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area wrapped in optional Mobile Smartphone Simulator Frame */}
      <main className="flex-1 w-full flex flex-col justify-start">
        <MobileFrame isMobileFrame={isMobileFrame}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 w-full flex-1 flex flex-col">
            {role === 'buyer' ? (
              /* Buyer / Government Portal View */
              <BuyerPortal
                products={products}
                onSelectProduct={(prod) => setSelectedProduct(prod)}
                language={language}
              />
            ) : (
              /* Artisan App View with Sub-Navigation */
              <div className="space-y-5 flex-1 flex flex-col">
                {/* Mobile / Low-Literacy Quick Switcher Bar */}
                <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setArtisanTab('dashboard')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      artisanTab === 'dashboard'
                        ? 'bg-saffron-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>{isHindi ? 'होम' : 'Home'}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('studio')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      artisanTab === 'studio'
                        ? 'bg-saffron-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{isHindi ? 'फोटो स्टूडियो' : 'AI Studio'}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('voice')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      artisanTab === 'voice'
                        ? 'bg-saffron-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isHindi ? 'बोलकर कैटलॉग' : 'Voice Catalog'}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('copilot')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      artisanTab === 'copilot'
                        ? 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>{isHindi ? '⭐ कोपायलट' : '⭐ Copilot'}</span>
                  </button>

                  <button
                    onClick={() => setArtisanTab('pricing')}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      artisanTab === 'pricing'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                    }`}
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>{isHindi ? 'मूल्य निर्धारण' : 'Fair Pricing'}</span>
                  </button>
                </div>

                {/* Sub-Views */}
                <div className="flex-1">
                  {artisanTab === 'dashboard' && (
                    <ArtisanDashboard
                      products={products}
                      onOpenStudio={() => setArtisanTab('studio')}
                      onOpenVoice={() => setArtisanTab('voice')}
                      onOpenCopilot={() => setArtisanTab('copilot')}
                      onOpenPricing={() => setArtisanTab('pricing')}
                      onSelectProduct={(prod) => setSelectedProduct(prod)}
                      language={language}
                    />
                  )}

                  {artisanTab === 'studio' && (
                    <ArtisanStudio
                      onPhotoSelected={handlePhotoSelectedFromStudio}
                      language={language}
                    />
                  )}

                  {artisanTab === 'voice' && (
                    <VoiceCatalogerModal
                      language={language}
                      selectedPhotoUrl={stagedPhotoUrl || undefined}
                      onListingCreated={handleListingCreated}
                    />
                  )}

                  {artisanTab === 'copilot' && (
                    <ArtisanCopilot
                      language={language}
                      onPublishListing={handleListingCreated}
                    />
                  )}

                  {artisanTab === 'pricing' && (
                    <div className="max-w-2xl mx-auto">
                      <DynamicPricingCard language={language} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </MobileFrame>
      </main>

      {/* Product Detail & Inspection Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onRequestQuote={() => {
            setSelectedProduct(null);
            setRole('buyer');
          }}
          language={language}
        />
      )}

      {/* Bottom Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white">SHILP-AI</span>
            <span>•</span>
            <span>Ministry of Social Justice and Empowerment (MoSJE), Government of India</span>
          </div>
          <div className="text-[11px] text-stone-500">
            Theme: Heritage & Culture • From Craft to Commerce, Powered by AI
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
