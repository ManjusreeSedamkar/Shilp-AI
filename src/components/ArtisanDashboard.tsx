import React, { useState } from 'react';
import { Sparkles, Camera, Mic, Bot, IndianRupee, TrendingUp, Volume2, ShieldCheck, QrCode, ArrowUpRight, Package, Users, CheckCircle, Clock, Award } from 'lucide-react';
import { ProductListing, ArtisanProfile, Language, BulkRFQInquiry } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';

interface ArtisanDashboardProps {
  products: ProductListing[];
  onOpenStudio: () => void;
  onOpenVoice: () => void;
  onOpenCopilot: () => void;
  onOpenPricing: () => void;
  onSelectProduct: (product: ProductListing) => void;
  language?: Language;
}

export const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({
  products,
  onOpenStudio,
  onOpenVoice,
  onOpenCopilot,
  onOpenPricing,
  onSelectProduct,
  language = 'en'
}) => {
  const [isSpeakingAnalytics, setIsSpeakingAnalytics] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);
  const isHindi = language === 'hi';

  const handleSpeakAnalytics = async () => {
    setIsSpeakingAnalytics(true);
    const speechText = isHindi
      ? `नमस्ते ${CURRENT_ARTISAN.regionalName} जी। आपके कैटलॉग में ${products.length} उत्पाद सक्रिय हैं। इस सप्ताह आपको 2 नए थोक ऑर्डर मिले हैं। आगामी त्योहारी सीजन के कारण पोचमपल्ली साड़ियों की मांग 35% अधिक है। अपनी इन्वेंट्री में 5 और साड़ियां जोड़ने की सिफारिश की जाती है।`
      : `Namaste ${CURRENT_ARTISAN.name} ji. You have ${products.length} active listings on the MoSJE marketplace. You received 2 bulk B2B inquiry requests this week. Demand for Pochampally silk sarees is 35% higher ahead of the festive wedding season. Stocking 5 additional units is recommended.`;
    
    await VoiceCatalogerEngine.speak(speechText, isHindi ? 'hi-IN' : 'en-IN');
    setIsSpeakingAnalytics(false);
  };

  return (
    <div className="space-y-6">
      {/* MoSJE Artisan Beneficiary Banner */}
      <div className="bg-gradient-to-r from-saffron-700 via-stone-900 to-navy-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl select-none pointer-events-none">
          🏺
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={CURRENT_ARTISAN.avatarUrl}
                alt={CURRENT_ARTISAN.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-saffron-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]" title="MoSJE Verified">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black">
                  {isHindi ? CURRENT_ARTISAN.regionalName : CURRENT_ARTISAN.name}
                </h1>
                <span className="text-[10px] bg-saffron-500/30 text-saffron-200 border border-saffron-400/40 px-2 py-0.5 rounded-full font-bold">
                  {CURRENT_ARTISAN.giTagCraft.split('(')[0]}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                {CURRENT_ARTISAN.craftCluster}, {CURRENT_ARTISAN.state}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-amber-300 font-mono mt-1">
                <span>{CURRENT_ARTISAN.beneficiaryId}</span>
                <span>•</span>
                <button
                  onClick={() => setShowIdCard(!showIdCard)}
                  className="underline hover:text-white flex items-center gap-1 font-sans"
                >
                  <QrCode className="w-3 h-3" />
                  {isHindi ? 'डिजिटल आईडी कार्ड' : 'Digital ID Card'}
                </button>
              </div>
            </div>
          </div>

          {/* Audio Greeting Pill for Low-Literacy Artisans */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
            <button
              onClick={handleSpeakAnalytics}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
                isSpeakingAnalytics
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur border border-white/20'
              }`}
            >
              <Volume2 className="w-4 h-4 text-saffron-300" />
              <span>{isSpeakingAnalytics ? (isHindi ? 'बोल रहा है...' : 'Speaking...') : (isHindi ? 'आज का समाचार सुनें' : "Listen to Today's Summary")}</span>
            </button>
            <span className="text-[10px] text-stone-400 font-medium">
              MoSJE / GeM Connected
            </span>
          </div>
        </div>

        {/* Digital ID Card Preview Drawer */}
        {showIdCard && (
          <div className="mt-4 pt-4 border-t border-stone-700/80 bg-stone-900/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="text-xs space-y-1 text-stone-300">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-saffron-400" />
                <span>Ministry of Social Justice & Empowerment - Artisan Pass</span>
              </div>
              <p>Card No: <span className="font-mono text-saffron-200">{CURRENT_ARTISAN.shilpCardNumber}</span></p>
              <p>Exhibitions: {CURRENT_ARTISAN.exhibitions.join(' • ')}</p>
              <p className="text-[10px] text-emerald-400">✓ Bank Account Linked (DBT Direct Benefit Transfer Ready)</p>
            </div>
            <div className="p-2 bg-white rounded-xl text-stone-900 text-center shadow-md">
              <div className="w-20 h-20 bg-stone-900 text-white flex items-center justify-center rounded font-mono text-[9px] p-1">
                [QR: {CURRENT_ARTISAN.beneficiaryId}]
              </div>
              <span className="text-[9px] font-bold text-stone-600 block mt-1">Scan at Shilp Fairs</span>
            </div>
          </div>
        )}
      </div>

      {/* 4 Core Action Tiles: High-Contrast, Big-Icon, Low-Literacy Friendly */}
      <div>
        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          {isHindi ? 'त्वरित एआई कार्य (Quick Actions):' : 'AI Virtual Business Manager Tools:'}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tile 1: AI Image Studio */}
          <button
            onClick={onOpenStudio}
            className="p-4 rounded-2xl bg-white hover:bg-saffron-50 border-2 border-stone-200 hover:border-saffron-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-saffron-700 uppercase block">1. Photo AI</span>
              <h4 className="font-black text-stone-900 text-sm">
                {isHindi ? '📸 फोटो स्टूडियो' : '📸 Image Studio'}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                {isHindi ? 'पृष्ठभूमि हटाएं व साफ करें' : 'Remove BG & Clean Lighting'}
              </p>
            </div>
          </button>

          {/* Tile 2: Voice Cataloger */}
          <button
            onClick={onOpenVoice}
            className="p-4 rounded-2xl bg-white hover:bg-blue-50 border-2 border-stone-200 hover:border-blue-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-700 uppercase block">2. Voice NLP</span>
              <h4 className="font-black text-stone-900 text-sm">
                {isHindi ? '🎙️ बोलकर कैटलॉग' : '🎙️ Voice Catalog'}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                {isHindi ? 'अपनी भाषा में बोलें' : 'Speak in Regional Languages'}
              </p>
            </div>
          </button>

          {/* Tile 3: AI Artisan Copilot */}
          <button
            onClick={onOpenCopilot}
            className="p-4 rounded-2xl bg-gradient-to-br from-saffron-50 to-amber-100 border-2 border-saffron-400 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-saffron-600 text-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-saffron-800 uppercase block">⭐ Copilot</span>
              <h4 className="font-black text-stone-900 text-sm">
                {isHindi ? '🤖 बिजनेस कोपायलट' : '🤖 AI Copilot'}
              </h4>
              <p className="text-[11px] text-saffron-900/80 mt-0.5 leading-tight font-medium">
                {isHindi ? 'पूरा काम एक बातचीत में' : 'Tell me what you want to sell'}
              </p>
            </div>
          </button>

          {/* Tile 4: Dynamic Pricing Assistant */}
          <button
            onClick={onOpenPricing}
            className="p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">4. Fair Pricing</span>
              <h4 className="font-black text-stone-900 text-sm">
                {isHindi ? '💰 मूल्य निर्धारक' : '💰 Pricing Assistant'}
              </h4>
              <p className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                {isHindi ? 'उचित मजदूरी व थोक दरें' : 'Fair Wage & Wholesale Rates'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Plain-Language Sales & Market Demand Analytics */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                {isHindi ? 'साधारण भाषा में बिक्री विश्लेषण' : 'Plain-Language Sales Analytics'}
              </h3>
              <p className="text-[11px] text-stone-500">
                {isHindi ? 'कम पढ़े-लिखे कारीगरों के लिए समझने में आसान' : 'AI explains market trends in simple audio sentences'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSpeakAnalytics}
            className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
            title="Read aloud"
          >
            <Volume2 className="w-4 h-4 text-saffron-600" />
          </button>
        </div>

        {/* Analytics Highlights Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span className="text-[10px] font-bold text-stone-500 uppercase">{isHindi ? 'कुल कमाई' : 'Total Revenue'}</span>
            <p className="text-lg font-black text-stone-900 mt-0.5">₹{CURRENT_ARTISAN.totalEarnings.toLocaleString('en-IN')}</p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +24% vs physical fair
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span className="text-[10px] font-bold text-stone-500 uppercase">{isHindi ? 'सक्रिय उत्पाद' : 'Active Listings'}</span>
            <p className="text-lg font-black text-stone-900 mt-0.5">{products.length} Items</p>
            <span className="text-[10px] text-blue-600 font-medium">All GI Certified</span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span className="text-[10px] font-bold text-stone-500 uppercase">{isHindi ? 'थोक पूछताछ' : 'Bulk Inquiries'}</span>
            <p className="text-lg font-black text-saffron-700 mt-0.5">2 Pending RFQs</p>
            <span className="text-[10px] text-saffron-600 font-bold">GeM / TRIFED buyers</span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">
            <span className="text-[10px] font-bold text-stone-500 uppercase">{isHindi ? 'कारीगर रेटिंग' : 'Artisan Rating'}</span>
            <p className="text-lg font-black text-stone-900 mt-0.5">★ {CURRENT_ARTISAN.rating} / 5.0</p>
            <span className="text-[10px] text-emerald-600 font-medium">{CURRENT_ARTISAN.totalSalesCount} verified orders</span>
          </div>
        </div>

        {/* AI Market Insight Tip Box */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-saffron-50/50 rounded-2xl border border-amber-200 text-xs flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div>
            <span className="font-bold text-amber-900">
              {isHindi ? 'एआई बाज़ार सलाह (Market Trend Insight):' : 'AI Market Trend Insight:'}
            </span>
            <p className="text-stone-700 mt-0.5 leading-relaxed">
              {isHindi
                ? 'शादियों के सीजन के कारण हथकरघा साड़ियों की मांग 35% बढ़ गई है। यदि आप 5 अतिरिक्त साड़ियां तैयार करके कैटलॉग में जोड़ते हैं, तो अगले 15 दिनों में ₹35,000 की अतिरिक्त कमाई संभव है।'
                : 'Handloom Pochampally sarees are experiencing 35% surge in B2B buyer search inquiries ahead of the wedding season. Crafting 5 additional units could generate ₹35,000+ incremental revenue.'}
            </p>
          </div>
        </div>
      </div>

      {/* Active Catalog Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-stone-700" />
            <h3 className="font-bold text-base text-stone-900">
              {isHindi ? 'मेरा सक्रिय कैटलॉग (My Live Catalog)' : 'My Smart Catalog'}
            </h3>
            <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-bold">
              {products.length}
            </span>
          </div>

          <button
            onClick={onOpenCopilot}
            className="text-xs font-bold text-saffron-700 hover:text-saffron-800 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? '+ नया उत्पाद जोड़ें' : '+ Add New Product'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >
              {/* Image with AI Studio badge */}
              <div className="relative aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={product.enhancedImage}
                  alt={product.titleEn}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  ✨ Studio Enhanced
                </span>
                {product.giCertified && (
                  <span className="absolute top-2.5 left-2.5 bg-navy-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur">
                    GI Tagged
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-saffron-700 transition-colors">
                    {isHindi ? product.titleHi : product.titleEn}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {product.craftTechnique} • {product.productionDays} {isHindi ? 'दिन' : 'days'}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">{isHindi ? 'बिक्री मूल्य' : 'Price'}</span>
                    <span className="text-sm font-black text-stone-900">
                      ₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      {product.stockQuantity} in stock
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Wholesale ₹{product.pricing.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
