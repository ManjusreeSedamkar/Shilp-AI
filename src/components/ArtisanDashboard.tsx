import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Mic,
  Bot,
  IndianRupee,
  TrendingUp,
  Volume2,
  ShieldCheck,
  QrCode,
  ArrowUpRight,
  Package,
  Award,
  Square,
  FileText,
  Copy,
  Check,
  X,
  Video,
  Play,
  Trash2,
  AlertTriangle,
  Loader2
} from 'lucide-react';

import { ProductListing, Language } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';
import { translate, getSpeechLangCode } from '../services/translations';

interface ArtisanDashboardProps {
  products: ProductListing[];
  onOpenStudio: () => void;
  onOpenVoice: () => void;
  onOpenCopilot: () => void;
  onOpenPricing: () => void;
  onOpenTutorials?: () => void;
  onSelectProduct: (product: ProductListing) => void;
  onDeleteProduct?: (productId: string) => Promise<void>;
  currentUserId?: string;
  language?: Language;
}

export const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({
  products,
  onOpenStudio,
  onOpenVoice,
  onOpenCopilot,
  onOpenPricing,
  onOpenTutorials,
  onSelectProduct,
  onDeleteProduct,
  currentUserId,
  language = 'en'
}) => {
  const [isSpeakingAnalytics, setIsSpeakingAnalytics] = useState(false);
  const [analyticsTranscript, setAnalyticsTranscript] = useState<string | null>(null);
  const [isCopiedTranscript, setIsCopiedTranscript] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<ProductListing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Central translation helper
  const t = (key: string) => translate(language, key);

  // Translate product category names
  const getCategoryTranslation = (category: ProductListing['category']) => {
    const categoryKeys: Record<ProductListing['category'], string> = {
      'Textiles & Handloom': 'dashboard.categoryTextiles',
      'Clay & Terracotta': 'dashboard.categoryClay',
      'Metalcraft & Dhokra': 'dashboard.categoryMetalcraft',
      'Traditional Painting': 'dashboard.categoryPainting',
      'Woodcraft & Carving': 'dashboard.categoryWood',
      'Leather & Footwear': 'dashboard.categoryLeather',
      'Handmade Jewelry': 'dashboard.categoryJewelry'
    };

    return t(categoryKeys[category]);
  };

  const handleSpeakAnalytics = async () => {
    if (isSpeakingAnalytics) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeakingAnalytics(false);
      return;
    }

    let speechText = '';

    switch (language) {
      case 'hi':
        speechText = `नमस्ते ${CURRENT_ARTISAN.regionalName} जी। आपके कैटलॉग में ${products.length} उत्पाद सक्रिय हैं। इस सप्ताह आपको 2 नए थोक ऑर्डर मिले हैं। आगामी त्योहारी सीजन के कारण पोचमपल्ली साड़ियों की मांग 35% अधिक है। अपनी इन्वेंट्री में 5 और साड़ियां जोड़ने की सिफारिश की जाती है।`;
        break;

      case 'te':
        speechText = `నమస్కారం ${CURRENT_ARTISAN.name} గారు. మీ కేటలాగ్‌లో ${products.length} ఉత్పత్తులు యాక్టివ్‌గా ఉన్నాయి. ఈ వారం మీకు 2 కొత్త బల్క్ ఆర్డర్లు వచ్చాయి. పండుగ మరియు వివాహ సీజన్ కారణంగా పోచంపల్లి చీరలకు డిమాండ్ 35 శాతం పెరిగింది. మీ ఇన్వెంటరీలో మరో 5 చీరలను జోడించాలని సిఫార్సు చేస్తున్నాము.`;
        break;

      case 'ta':
        speechText = `வணக்கம் ${CURRENT_ARTISAN.name}. உங்கள் பட்டியலில் ${products.length} தயாரிப்புகள் செயலில் உள்ளன. இந்த வாரம் உங்களுக்கு 2 புதிய மொத்த ஆர்டர் விசாரணைகள் வந்துள்ளன. பண்டிகை மற்றும் திருமண காலம் காரணமாக போச்சம்பள்ளி புடவைகளுக்கான தேவை 35 சதவீதம் அதிகரித்துள்ளது. உங்கள் கையிருப்பில் மேலும் 5 புடவைகளை சேர்க்க பரிந்துரைக்கப்படுகிறது.`;
        break;

      case 'bn':
        speechText = `নমস্কার ${CURRENT_ARTISAN.name}। আপনার ক্যাটালগে ${products.length}টি পণ্য সক্রিয় রয়েছে। এই সপ্তাহে আপনি 2টি নতুন পাইকারি অর্ডার পেয়েছেন। উৎসব ও বিয়ের মরসুমের কারণে পোচমপল্লি শাড়ির চাহিদা 35 শতাংশ বেড়েছে। আপনার ইনভেন্টরিতে আরও 5টি শাড়ি যোগ করার পরামর্শ দেওয়া হচ্ছে।`;
        break;

      case 'mr':
        speechText = `नमस्कार ${CURRENT_ARTISAN.name}. तुमच्या कॅटलॉगमध्ये ${products.length} उत्पादने सक्रिय आहेत. या आठवड्यात तुम्हाला 2 नवीन घाऊक ऑर्डर मिळाल्या आहेत. सण आणि लग्नाच्या हंगामामुळे पोचमपल्ली साड्यांची मागणी 35 टक्क्यांनी वाढली आहे. तुमच्या इन्व्हेंटरीमध्ये आणखी 5 साड्या जोडण्याची शिफारस केली जाते.`;
        break;

      case 'gu':
        speechText = `નમસ્તે ${CURRENT_ARTISAN.name}. તમારા કેટલોગમાં ${products.length} ઉત્પાદનો સક્રિય છે. આ અઠવાડિયે તમને 2 નવા જથ્થાબંધ ઓર્ડર મળ્યા છે. તહેવાર અને લગ્નની સીઝનને કારણે પોચમપલ્લી સાડીઓની માંગ 35 ટકા વધી છે. તમારી ઇન્વેન્ટરીમાં વધુ 5 સાડીઓ ઉમેરવાની ભલામણ કરવામાં આવે છે.`;
        break;

      default:
        speechText = `Namaste ${CURRENT_ARTISAN.name} ji. You have ${products.length} active listings on the MoSJE marketplace. You received 2 bulk B2B inquiry requests this week. Demand for Pochampally silk sarees is 35% higher ahead of the festive wedding season. Stocking 5 additional units is recommended.`;
    }

    setAnalyticsTranscript(speechText);
    setIsSpeakingAnalytics(true);

    try {
      await VoiceCatalogerEngine.speak(
        speechText,
        getSpeechLangCode(language)
      );
    } finally {
      setIsSpeakingAnalytics(false);
    }
  };

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopiedTranscript(true);
    setTimeout(() => setIsCopiedTranscript(false), 2000);
  };

  // Trigger Delete Confirmation Modal with Ownership Verification
  const handlePromptDelete = (product: ProductListing, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);

    const activeUserId = currentUserId || CURRENT_ARTISAN.id;
    if (product.artisanId && product.artisanId !== activeUserId) {
      setDeleteError(
        language === 'hi'
          ? 'अनधिकृत: आप केवल अपने खाते के उत्पादों को ही हटा सकते हैं।'
          : 'Unauthorized: You can only delete products that belong to your account.'
      );
    }

    setProductToDelete(product);
  };

  // Confirm Deletion Handler
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    const activeUserId = currentUserId || CURRENT_ARTISAN.id;
    if (productToDelete.artisanId && productToDelete.artisanId !== activeUserId) {
      setDeleteError(
        language === 'hi'
          ? 'अनधिकृत: आप केवल अपने खाते के उत्पादों को ही हटा सकते हैं।'
          : 'Unauthorized: You can only delete products that belong to your account.'
      );
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      if (onDeleteProduct) {
        await onDeleteProduct(productToDelete.id);
      }
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product:', err);
      setDeleteError(
        language === 'hi'
          ? 'उत्पाद हटाने में असमर्थ। कृपया पुनः प्रयास करें।'
          : 'Unable to delete the product. Please try again.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* ============================================================
          Artisan Profile Banner (MoSJE Card)
      ============================================================ */}
      <div className="relative bg-[#1C1815] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-stone-800 overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-saffron-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={CURRENT_ARTISAN.avatarUrl}
                alt={CURRENT_ARTISAN.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-400/80 ring-offset-2 ring-offset-[#1C1815] shadow-lg"
              />
              <span
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px] shadow-sm border border-emerald-300"
                title={t('dashboard.mosjeVerified')}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black">
                  {language === 'hi'
                    ? CURRENT_ARTISAN.regionalName
                    : CURRENT_ARTISAN.name}
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
                  {t('dashboard.digitalId')}
                </button>
              </div>
            </div>
          </div>

          {/* Audio Summary */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
            <button
              onClick={handleSpeakAnalytics}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shadow-md ${
                isSpeakingAnalytics
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur border border-white/20'
              }`}
              title={isSpeakingAnalytics ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop Speech') : t('dashboard.listenSummary')}
            >
              {isSpeakingAnalytics ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{language === 'hi' ? 'रोकें (Stop)' : 'Stop Speech'}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-saffron-300" />
                  <span>
                    {language === 'hi' ? 'विश्लेषण सुनें' : t('dashboard.listenSummary')}
                  </span>
                </>
              )}
            </button>
            <span className="text-[10px] text-stone-400 font-medium">
              {t('dashboard.mosjeConnected')}
            </span>
          </div>
        </div>

        {/* AI Audio Transcript Card in Banner */}
        {analyticsTranscript && (
          <div className="mt-4 p-3.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-white font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-300" />
                {language === 'hi' ? 'एआई विश्लेषण वाणी प्रतिलेख (AI Spoken Transcript):' : 'AI Speech Transcription:'}
                {isSpeakingAnalytics ? (
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    {language === 'hi' ? 'बोल रहा है...' : 'Speaking...'}
                  </span>
                ) : (
                  <span className="bg-white/20 text-stone-200 text-[9px] px-2 py-0.5 rounded-full font-mono">
                    {language === 'hi' ? 'रोका गया (Stopped)' : 'Stopped / Ready'}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyTranscript(analyticsTranscript)}
                  className="text-stone-200 hover:text-white text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                >
                  {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {isCopiedTranscript ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी' : 'Copy')}
                </button>
                <button
                  onClick={() => setAnalyticsTranscript(null)}
                  className="text-stone-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-stone-100 bg-white/10 p-2.5 rounded-xl border border-white/10 leading-relaxed text-xs">
              "{analyticsTranscript}"
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenStudio}
          className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
            <Camera className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
              {t('dashboard.aiStudio')}
            </span>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
              {t('dashboard.smartPhotoStudio')}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
              {t('dashboard.smartPhotoStudioDesc')}
            </p>
          </div>
        </button>

        <button
          onClick={onOpenVoice}
          className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
            <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
              {t('dashboard.multilingualVoice')}
            </span>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
              {t('dashboard.voiceCataloger')}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
              {t('dashboard.voiceCatalogerDesc')}
            </p>
          </div>
        </button>

        <button
          onClick={onOpenPricing}
          className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
            <IndianRupee className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
              {t('dashboard.fairPricing')}
            </span>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
              {t('dashboard.pricing')}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
              {t('dashboard.pricingDesc')}
            </p>
          </div>
        </button>

        <button
          onClick={onOpenTutorials}
          className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
            <Video className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
          </div>
          <div>
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
              {language === 'hi' ? 'वीडियो गाइड' : 'Video Guides'}
            </span>
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
              {language === 'hi' ? 'ट्यूटोरियल' : 'Tutorial'}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
              {language === 'hi' ? '2 वीडियो: हिन्दी व अंग्रेजी' : 'English & Hindi Videos'}
            </p>
          </div>
        </button>
      </div>

      {/* Sales Analytics */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <TrendingUp className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                {t('dashboard.salesAnalytics')}
              </h3>
              <p className="text-[11px] text-stone-500">
                {t('dashboard.salesAnalyticsDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={handleSpeakAnalytics}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSpeakingAnalytics
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {isSpeakingAnalytics ? (
              <>
                <Square className="w-3 h-3 fill-white text-white" />
                <span>{language === 'hi' ? 'रोकें' : 'Stop'}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-saffron-600" />
                <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
              </>
            )}
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
              {t('dashboard.totalRevenue')}
            </span>
            <p className="text-xl font-black text-stone-900 mt-1">
              ₹{CURRENT_ARTISAN.totalEarnings.toLocaleString('en-IN')}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
              {t('dashboard.physicalFairComparison')}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
              {t('dashboard.activeListings')}
            </span>
            <p className="text-xl font-black text-stone-900 mt-1">
              {products.length} {t('dashboard.items')}
            </p>
            <span className="text-[10px] text-stone-600 font-semibold">
              {t('dashboard.allGICertified')}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
              {t('dashboard.bulkInquiries')}
            </span>
            <p className="text-xl font-black text-stone-900 mt-1">
              2 {t('dashboard.pendingRFQs')}
            </p>
            <span className="text-[10px] text-amber-700 font-semibold">
              {t('dashboard.gemTrifedBuyers')}
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-all">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
              {t('dashboard.artisanRating')}
            </span>
            <p className="text-xl font-black text-stone-900 mt-1">
              ★ {CURRENT_ARTISAN.rating} / 5.0
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">
              {CURRENT_ARTISAN.totalSalesCount} {t('dashboard.verifiedOrders')}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================
          Active Catalog Section with Delete Product Action
      ============================================================ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-stone-700" />
            <h3 className="font-bold text-base text-stone-900">
              {t('dashboard.myCatalog')}
            </h3>
            <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-bold">
              {products.length}
            </span>
          </div>

          <button
            onClick={onOpenCopilot}
            className="text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('dashboard.addProduct')}</span>
          </button>
        </div>

        {/* Catalog Grid or Empty State */}
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">
              {language === 'hi' ? 'अभी कोई उत्पाद नहीं है।' : 'No active products yet.'}
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'hi'
                ? 'विक्री शुरू करने के लिए अपना पहला हस्तशिल्प उत्पाद स्मार्ट कैटलॉग में जोड़ें।'
                : 'Add your first craft product to start selling on the MoSJE marketplace.'}
            </p>
            <button
              onClick={onOpenCopilot}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'hi' ? 'पहला उत्पाद जोड़ें' : 'Add First Product'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
                  <img
                    src={product.enhancedImageUrl || product.enhancedImage || product.originalImageUrl || product.originalImage}
                    alt={product.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* AI Enhanced / Studio Photo Badge */}
                  <span className="absolute top-3 right-3 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 border border-emerald-500/40">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    {product.enhancedImageUrl || product.enhancedImage ? (language === 'hi' ? 'एआई संवर्धित' : 'AI Enhanced') : t('dashboard.originalPhoto')}
                  </span>

                  {/* GI Badge */}
                  {product.giCertified && (
                    <span className="absolute top-3 left-3 bg-[#1C1815]/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs border border-amber-400/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-300" />
                      {t('dashboard.giTagged')}
                    </span>
                  )}

                  {/* Bottom Peek Pill */}
                  <div className="absolute bottom-2.5 inset-x-3 bg-black/65 backdrop-blur-xs text-white text-[9px] font-medium py-1 px-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <span>{language === 'hi' ? 'विवरण देखने हेतु टैप करें' : 'Tap to view details'}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    {/* Category & Delete Action Bar */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                        {getCategoryTranslation(product.category)}
                      </span>

                      {/* Delete Product Button */}
                      <button
                        type="button"
                        onClick={(e) => handlePromptDelete(product, e)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white transition-colors shadow-2xs border border-rose-200/80"
                        title={language === 'hi' ? 'उत्पाद हटाएं' : 'Delete Product'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Product Title */}
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-saffron-700 transition-colors mt-1">
                      {language === 'hi' ? product.titleHi : product.titleEn}
                    </h4>

                    {/* Technique + Days */}
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {product.craftTechnique} • {product.productionDays}{' '}
                      {t('dashboard.days')}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="pt-2 border-t border-stone-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block">
                        {t('dashboard.price')}
                      </span>
                      <span className="text-sm font-black text-stone-900">
                        ₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        {product.stockQuantity} {t('dashboard.inStock')}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {t('dashboard.wholesale')} ₹
                        {product.pricing.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================
          DELETE PRODUCT CONFIRMATION MODAL
      ============================================================ */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-rose-100 text-rose-700">
                  <Trash2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg">
                    {language === 'hi' ? 'उत्पाद हटाएं?' : 'Delete Product?'}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'hi' ? 'यह कार्रवाई वापस नहीं ली जा सकती' : 'This action cannot be undone'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1">
              <span className="font-bold text-stone-900 block text-sm">
                "{language === 'hi' ? productToDelete.titleHi : productToDelete.titleEn}"
              </span>
              <p className="text-stone-600 text-[11px]">
                {language === 'hi'
                  ? 'क्या आप निश्चित रूप से इस उत्पाद को अपने उत्पाद सूची से स्थायी रूप से हटाना चाहते हैं?'
                  : 'Are you sure you want to delete this product from your product listings?'}
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 border border-stone-200 transition-colors"
              >
                {language === 'hi' ? 'रद्द करें (Cancel)' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'hi' ? 'हटाया जा रहा है...' : 'Deleting...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'उत्पाद हटाएं' : 'Delete Product'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};