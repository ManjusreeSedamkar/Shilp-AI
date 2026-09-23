import React, { useState } from 'react';
import { X, Award, ShieldCheck, Phone, MessageSquare, Building2, MapPin, Volume2, ShoppingBag, Palette, Star, Sparkles, Square, FileText, Copy, Check, Scissors, SunMedium, Crop, Columns } from 'lucide-react';
import { ProductListing, Language, ProductReview } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';
import { ReviewsSection } from './ReviewsSection';

interface ProductDetailModalProps {
  product: ProductListing | null;
  onClose: () => void;
  onRequestQuote: (product: ProductListing) => void;
  onBuyNow?: (product: ProductListing) => void;
  onStartConversation?: (artisanId: string, artisanName: string, productId?: string, productTitle?: string) => void;
  language?: Language;
  reviews?: ProductReview[];
  onAddReview?: (review: ProductReview) => void;
  currentBuyerName?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestQuote,
  onBuyNow,
  onStartConversation,
  language = 'en',
  reviews = [],
  onAddReview,
  currentBuyerName = 'Vikram Mehta'
}) => {
  const [activeLang, setActiveLang] = useState<'hi' | 'en'>(language === 'hi' ? 'hi' : 'en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [isCopiedTranscript, setIsCopiedTranscript] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const [imageTab, setImageTab] = useState<'enhanced' | 'original' | 'before_after'>('enhanced');

  if (!product) return null;

  const isHindi = activeLang === 'hi';

  const enhancedImg = product.enhancedImageUrl || product.enhancedImage || product.originalImageUrl || product.originalImage;
  const originalImg = product.originalImageUrl || product.originalImage || product.enhancedImageUrl || product.enhancedImage;
  const displayImage = imageTab === 'original' ? originalImg : enhancedImg;

  const handleToggleSpeak = async () => {
    if (isSpeaking) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = isHindi ? product.descriptionHi : product.descriptionEn;
    setSpokenTranscript(textToSpeak);
    setIsSpeaking(true);

    try {
      await VoiceCatalogerEngine.speak(textToSpeak, isHindi ? 'hi-IN' : 'en-IN');
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopiedTranscript(true);
    setTimeout(() => setIsCopiedTranscript(false), 2000);
  };

  const productReviews = reviews.filter((r) => r.productId === product.id);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92dvh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col no-scrollbar my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Header - Studio Photo or Before/After Showcase */}
        {imageTab === 'before_after' ? (
          <div className="bg-[#FAF7F2] border-b border-stone-200">
            {/* Split Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-b border-stone-200">
              {/* Before */}
              <div className="relative aspect-[4/3] sm:aspect-[3/4] max-h-72 bg-stone-100 overflow-hidden sm:border-r border-stone-200 flex items-center justify-center">
                <img
                  src={originalImg}
                  alt="Original Raw Craft"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#2D3338]/90 backdrop-blur text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                  {isHindi ? 'पहले (मूल फोटो)' : 'Before (Original)'}
                </div>
              </div>

              {/* After */}
              <div className="relative aspect-[4/3] sm:aspect-[3/4] max-h-72 bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
                <img
                  src={enhancedImg}
                  alt="Enhanced Studio Photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#2D5A43]/90 backdrop-blur text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{isHindi ? 'बाद में (एआई संवर्धित)' : 'After (Enhanced)'}</span>
                </div>
              </div>
            </div>

            {/* 5 Feature Badges Row */}
            <div className="bg-[#FAF7F2] px-3 sm:px-6 py-3 grid grid-cols-5 gap-1 sm:gap-2 items-center justify-between text-center border-b border-stone-200">
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                  <Scissors className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <span className="text-[9px] font-medium text-stone-700 leading-tight">
                  {isHindi ? <>बैकग्राउंड<br />हटाना</> : <>Background<br />Removal</>}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                  <SunMedium className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <span className="text-[9px] font-medium text-stone-700 leading-tight">
                  {isHindi ? <>बेहतर<br />लाइटिंग</> : <>Better<br />Lighting</>}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                  <Palette className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <span className="text-[9px] font-medium text-stone-700 leading-tight">
                  {isHindi ? <>प्राकृतिक रंग<br />सुधार</> : <>Natural Color<br />Correction</>}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                  <Crop className="w-3.5 h-3.5 text-stone-700" />
                </div>
                <span className="text-[9px] font-medium text-stone-700 leading-tight">
                  {isHindi ? <>उचित स्थिति<br />व क्रॉपिंग</> : <>Proper Positioning<br />& Cropping</>}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-0.5">
                <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[9px] font-medium text-stone-700 leading-tight">
                  {isHindi ? <>संवर्धित<br />गुणवत्ता</> : <>Enhanced<br />Quality</>}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video sm:aspect-[16/10] bg-stone-100 overflow-hidden">
            <img
              src={displayImage}
              alt={product.titleEn}
              className="w-full h-full object-contain"
            />

            {/* Verification Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.giCertified && (
                <span className="bg-emerald-600/90 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  GI Tag Certified Craft
                </span>
              )}
              <span className="bg-stone-900/90 backdrop-blur text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                MoSJE Beneficiary Verified
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              {imageTab === 'enhanced'
                ? (language === 'hi' ? 'कैटलॉग में प्रदर्शित फोटो' : 'Catalog Display Image')
                : (language === 'hi' ? 'मूल कार्यशाला फोटो' : 'Original Workshop Photo')}
            </div>
          </div>
        )}

        {/* Image Mode Toggle Pill Row */}
        <div className="bg-stone-100/90 border-b border-stone-200 px-4 py-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-stone-500 hidden sm:inline">
            {isHindi ? 'फोटो प्रदर्शन मोड:' : 'Photo Display Mode:'}
          </span>
          <div className="flex items-center bg-white rounded-xl p-1 shadow-2xs border border-stone-200/80 ml-auto">
            <button
              onClick={() => setImageTab('enhanced')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                imageTab === 'enhanced'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>{language === 'hi' ? 'एआई संवर्धित' : 'AI Enhanced'}</span>
            </button>
            <button
              onClick={() => setImageTab('before_after')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                imageTab === 'before_after'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Columns className="w-2.5 h-2.5 text-amber-400" />
              <span>{language === 'hi' ? 'पहले / बाद (Showcase)' : 'Before / After'}</span>
            </button>
            <button
              onClick={() => setImageTab('original')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                imageTab === 'original'
                  ? 'bg-stone-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>{language === 'hi' ? 'मूल फोटो' : 'Original'}</span>
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs (Overview vs Reviews) */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-saffron-600 text-saffron-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Product Overview & Pricing
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-saffron-600 text-saffron-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Buyer Reviews ({productReviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' ? (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Title & Price Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-saffron-700 uppercase tracking-wider">
                  {product.category} • {product.state}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-stone-900 leading-tight">
                  {isHindi ? product.titleHi : product.titleEn}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {product.artisanName} ({product.state})
                  </span>
                  <span>•</span>
                  <span>{product.productionDays > 0 ? `${product.productionDays} ${isHindi ? 'दिन की कारीगरी' : 'days crafting time'}` : (isHindi ? 'निर्माण समय: उल्लेख नहीं' : 'Crafting time: not stated')}</span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-stone-500 font-medium">Direct Artisan Price</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  ₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-stone-400">Zero Middleman Markup</span>
              </div>
            </div>

            {/* Description & Cultural Story (Bilingual Switcher) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveLang('hi')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeLang === 'hi' ? 'bg-white text-saffron-700 shadow-sm' : 'text-stone-600'
                    }`}
                  >
                    🇮🇳 हिन्दी विवरण
                  </button>
                  <button
                    onClick={() => setActiveLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      activeLang === 'en' ? 'bg-white text-saffron-700 shadow-sm' : 'text-stone-600'
                    }`}
                  >
                    🇬🇧 English SEO
                  </button>
                </div>

                <button
                  onClick={handleToggleSpeak}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSpeaking
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                  title={isSpeaking ? (isHindi ? 'रोकें (Stop)' : 'Stop Speech') : (isHindi ? 'विवरण सुनें' : 'Listen to description')}
                >
                  {isSpeaking ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-white text-white" />
                      <span>{isHindi ? 'रोकें (Stop)' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-saffron-600" />
                      <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Spoken Transcript Box */}
              {spokenTranscript && (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-amber-700" />
                      {isHindi ? 'एआई विवरण वाणी प्रतिलेख (AI Spoken Transcript):' : 'AI Speech Transcription:'}
                      {isSpeaking ? (
                        <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full animate-pulse flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          {isHindi ? 'बोल रहा है...' : 'Speaking...'}
                        </span>
                      ) : (
                        <span className="bg-stone-200 text-stone-700 text-[9px] px-1.5 py-0.2 rounded-full font-mono">
                          {isHindi ? 'रोका गया (Stopped)' : 'Stopped'}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyTranscript(spokenTranscript)}
                        className="text-stone-600 hover:text-stone-900 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {isCopiedTranscript ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}
                      </button>
                      <button
                        onClick={() => setSpokenTranscript(null)}
                        className="text-stone-400 hover:text-stone-700 p-0.5"
                        title="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-stone-800 bg-white p-2.5 rounded-xl border border-amber-200/60 leading-relaxed whitespace-pre-line text-xs">
                    "{spokenTranscript}"
                  </p>
                </div>
              )}

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                {isHindi ? product.descriptionHi : product.descriptionEn}
              </div>
            </div>

            {/* Key Specifications Grid */}
            {(() => {
              const specs = [
                { label: 'Product Type', value: product.productType },
                { label: 'Style', value: product.style },
                { label: 'Subject', value: product.subject },
                { label: 'Craft Technique', value: product.craftTechnique },
                { label: 'Primary Material', value: product.fabricType || product.primaryMaterial },
                { label: 'Weaving Method', value: product.weavingMethod },
                { label: 'Construction', value: product.constructionMethod },
                { label: 'Color', value: product.color !== 'Natural Finish' ? product.color : null },
                { label: 'Pattern', value: product.pattern },
                { label: 'Motif', value: product.motif },
                { label: 'Border', value: product.borderColor },
                { label: 'Dye Type', value: product.dyeType },
                { label: 'Zari Type', value: product.zariType },
                { label: 'Fair Artisan Wage', value: `₹${product.pricing.totalLaborWage.toLocaleString('en-IN')}` },
                { label: 'In Stock / Capacity', value: `${product.stockQuantity} units available` },
              ].filter((s): s is { label: string; value: string } => Boolean(s.value));

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  {specs.map((item, idx) => (
                    <div key={idx} className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 flex flex-col justify-between">
                      <span className="text-stone-500 text-[10px] font-semibold">{item.label}</span>
                      <p className="font-bold text-stone-900 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* B2B Wholesale Tiers Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <div className="bg-stone-100 px-4 py-2 flex justify-between items-center text-xs font-bold text-stone-800">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-stone-600" />
                  B2B Bulk Volume Pricing
                </span>
                <span className="text-[10px] text-stone-500 font-normal">GeM & Wholesale Linked</span>
              </div>
              <div className="divide-y divide-stone-100 text-xs">
                {product.pricing.wholesaleTiers.map((tier, idx) => (
                  <div key={idx} className="px-4 py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-800">{tier.tier}</span>
                      {tier.discountPercent > 0 && (
                        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {tier.discountPercent}% Wholesale Discount
                        </span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-stone-900">
                      ₹{tier.unitPrice.toLocaleString('en-IN')} <span className="text-[10px] text-stone-500">/ pc</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Artisan Verification Card */}
            <div className="p-3.5 bg-saffron-50/50 rounded-2xl border border-saffron-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <img
                  src={CURRENT_ARTISAN.avatarUrl}
                  alt={CURRENT_ARTISAN.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-saffron-500 shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-stone-900">{CURRENT_ARTISAN.name}</h4>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {CURRENT_ARTISAN.craftCluster}, {CURRENT_ARTISAN.state}
                  </p>
                  <span className="text-[10px] font-mono text-saffron-800">
                    ID: {CURRENT_ARTISAN.beneficiaryId}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onStartConversation?.(product.artisanId, product.artisanName, product.id, product.titleEn)}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chat & Discuss</span>
                </button>
                <button
                  onClick={() => onStartConversation?.(product.artisanId, product.artisanName, product.id, product.titleEn)}
                  className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Palette className="w-3.5 h-3.5 text-amber-700" />
                  <span>Customization</span>
                </button>
              </div>
            </div>

            {/* Primary Action Buttons: Buy Now & Bulk RFQ */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => onRequestQuote(product)}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Building2 className="w-4 h-4 text-saffron-400" />
                <span>Bulk RFQ</span>
              </button>
              <button
                onClick={() => onBuyNow?.(product)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-xs font-black shadow-md shadow-saffron-600/25 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy Now (₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')})</span>
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Reviews */
          <div className="p-6">
            <ReviewsSection
              productId={product.id}
              productTitle={product.titleEn}
              reviews={reviews}
              language={language}
              currentBuyerName={currentBuyerName}
              onAddReview={onAddReview || (() => {})}
            />
          </div>
        )}
      </div>
    </div>
  );
};