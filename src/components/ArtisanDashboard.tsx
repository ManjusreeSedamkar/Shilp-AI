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
  Play
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
  language = 'en'
}) => {
  const [isSpeakingAnalytics, setIsSpeakingAnalytics] = useState(false);
  const [analyticsTranscript, setAnalyticsTranscript] = useState<string | null>(null);
  const [isCopiedTranscript, setIsCopiedTranscript] = useState(false);
  const [showIdCard, setShowIdCard] = useState(false);

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

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">

      {/* ============================================================
          MoSJE Artisan Beneficiary Banner
      ============================================================ */}
      <div className="bg-gradient-to-r from-saffron-700 via-stone-900 to-navy-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden w-full max-w-full">

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

              <span
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full text-[10px]"
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
                  className="text-stone-300 hover:text-white text-[10px] flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {isCopiedTranscript ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी' : 'Copy')}
                </button>
                <button
                  onClick={() => setAnalyticsTranscript(null)}
                  className="text-stone-400 hover:text-white p-0.5"
                  title="Close transcript"
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

        {/* ============================================================
            Digital ID Card
        ============================================================ */}
        {showIdCard && (
          <div className="mt-4 pt-4 border-t border-stone-700/80 bg-stone-900/60 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">

            <div className="text-xs space-y-1 text-stone-300">

              <div className="font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-saffron-400" />

                <span>
                  {t('dashboard.artisanPass')}
                </span>
              </div>

              <p>
                {t('dashboard.cardNo')}:{' '}
                <span className="font-mono text-saffron-200">
                  {CURRENT_ARTISAN.shilpCardNumber}
                </span>
              </p>

              <p>
                {t('dashboard.exhibitions')}:{' '}
                {CURRENT_ARTISAN.exhibitions.join(' • ')}
              </p>

              <p className="text-[10px] text-emerald-400">
                ✓ {t('dashboard.bankLinked')}
              </p>

            </div>

            <div className="p-2 bg-white rounded-xl text-stone-900 text-center shadow-md">

              <div className="w-20 h-20 bg-stone-900 text-white flex items-center justify-center rounded font-mono text-[9px] p-1">
                [QR: {CURRENT_ARTISAN.beneficiaryId}]
              </div>

              <span className="text-[9px] font-bold text-stone-600 block mt-1">
                {t('dashboard.scanAtShilpFairs')}
              </span>

            </div>

          </div>
        )}
      </div>

      {/* ============================================================
          Tutorial Div Box (Clickable -> Redirects to Tutorial Page)
      ============================================================ */}
      <div
        onClick={onOpenTutorials}
        className="cursor-pointer group relative overflow-hidden bg-gradient-to-r from-amber-500 via-saffron-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5 border border-amber-400/40 w-full max-w-full"
        role="button"
        tabIndex={0}
        aria-label="Tutorial"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform shrink-0">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-sm sm:text-base text-white tracking-wide truncate">
                  {language === 'hi' ? 'वीडियो ट्यूटोरियल (Tutorial)' : 'Tutorial'}
                </h4>
                <span className="bg-white/25 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1">
                  <span>2 {language === 'hi' ? 'वीडियो' : 'Videos'}:</span>
                  <span className="text-amber-200 font-extrabold">English & हिन्दी</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping shrink-0"></span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 font-medium leading-tight">
                {language === 'hi'
                  ? 'क्लिक करें और वीडियो देखें: AI स्टूडियो, बोलकर कैटलॉग बनाना व निष्पक्ष कारीगर मूल्य'
                  : 'Click to watch step-by-step video tutorials on AI Studio, Voice Cataloging & Fair Pricing'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white text-saffron-800 text-xs font-black shadow-sm group-hover:bg-amber-50 transition-colors shrink-0 self-start sm:self-auto">
            <Play className="w-3.5 h-3.5 fill-saffron-700 text-saffron-700" />
            <span>{language === 'hi' ? 'ट्यूटोरियल देखें' : 'Watch Tutorials'}</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          AI Action Tiles
      ============================================================ */}
      <div className="w-full max-w-full overflow-hidden">

        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
          {t('dashboard.quickActions')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 w-full max-w-full">

          {/* Photo AI */}
          <button
            onClick={onOpenStudio}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-saffron-50 border-2 border-stone-200 hover:border-saffron-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between w-full"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-saffron-700 uppercase block truncate">
                {t('dashboard.photoAI')}
              </span>

              <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">
                {t('dashboard.imageStudio')}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
                {t('dashboard.imageStudioDesc')}
              </p>
            </div>
          </button>

          {/* Voice NLP */}
          <button
            onClick={onOpenVoice}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-blue-50 border-2 border-stone-200 hover:border-blue-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between w-full"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-blue-700 uppercase block truncate">
                {t('dashboard.voiceNLP')}
              </span>

              <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">
                {t('dashboard.voiceCatalog')}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
                {t('dashboard.voiceCatalogDesc')}
              </p>
            </div>
          </button>

          {/* Copilot */}
          <button
            onClick={onOpenCopilot}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-saffron-50 to-amber-100 border-2 border-saffron-400 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between w-full"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-saffron-600 text-white flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform shadow-md">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-saffron-800 uppercase block truncate">
                {t('dashboard.copilotLabel')}
              </span>

              <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">
                {t('dashboard.copilot')}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-saffron-900/80 mt-0.5 leading-tight font-medium line-clamp-2">
                {t('dashboard.copilotDesc')}
              </p>
            </div>
          </button>

          {/* Fair Pricing */}
          <button
            onClick={onOpenPricing}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white hover:bg-emerald-50 border-2 border-stone-200 hover:border-emerald-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between w-full"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-700 uppercase block truncate">
                {t('dashboard.fairPricing')}
              </span>

              <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">
                {t('dashboard.pricing')}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
                {t('dashboard.pricingDesc')}
              </p>
            </div>
          </button>

          {/* Tutorial Tile */}
          <button
            onClick={onOpenTutorials}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-500 text-left transition-all shadow-sm hover:shadow-md group flex flex-col justify-between w-full"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mb-2.5 sm:mb-3 group-hover:scale-110 transition-transform shadow-md">
              <Video className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-amber-800 uppercase block truncate">
                {language === 'hi' ? 'वीडियो गाइड' : 'Video Guides'}
              </span>

              <h4 className="font-black text-stone-900 text-xs sm:text-sm truncate">
                {language === 'hi' ? 'ट्यूटोरियल' : 'Tutorial'}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-amber-900/80 mt-0.5 leading-tight font-medium line-clamp-2">
                {language === 'hi' ? '2 वीडियो: हिन्दी व अंग्रेजी' : 'English & Hindi Videos'}
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* ============================================================
          Sales Analytics
      ============================================================ */}
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
            title={isSpeakingAnalytics ? (language === 'hi' ? 'रोकें (Stop)' : 'Stop Speech') : t('dashboard.readAloud')}
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

        {/* Analytics Card Transcript View */}
        {analyticsTranscript && (
          <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                {language === 'hi' ? 'एआई वाणी प्रतिलेख (AI Audio Transcript):' : 'AI Speech Transcription:'}
                {isSpeakingAnalytics ? (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full animate-pulse">
                    {language === 'hi' ? 'बोल रहा है...' : 'Speaking...'}
                  </span>
                ) : (
                  <span className="bg-stone-200 text-stone-700 text-[9px] px-1.5 py-0.2 rounded-full font-mono">
                    {language === 'hi' ? 'रोका गया' : 'Stopped'}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyTranscript(analyticsTranscript)}
                  className="text-stone-600 hover:text-stone-900 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {isCopiedTranscript ? (language === 'hi' ? 'कॉपी हुआ' : 'Copied') : (language === 'hi' ? 'कॉपी' : 'Copy')}
                </button>
                <button
                  onClick={() => setAnalyticsTranscript(null)}
                  className="text-stone-400 hover:text-stone-700 p-0.5"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-stone-800 bg-white p-2.5 rounded-xl border border-amber-200/60 leading-relaxed text-xs">
              "{analyticsTranscript}"
            </p>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

          {/* Revenue */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">

            <span className="text-[10px] font-bold text-stone-500 uppercase">
              {t('dashboard.totalRevenue')}
            </span>

            <p className="text-lg font-black text-stone-900 mt-0.5">
              ₹{CURRENT_ARTISAN.totalEarnings.toLocaleString('en-IN')}
            </p>

            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {t('dashboard.physicalFairComparison')}
            </span>

          </div>

          {/* Active Listings */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">

            <span className="text-[10px] font-bold text-stone-500 uppercase">
              {t('dashboard.activeListings')}
            </span>

            <p className="text-lg font-black text-stone-900 mt-0.5">
              {products.length} {t('dashboard.items')}
            </p>

            <span className="text-[10px] text-blue-600 font-medium">
              {t('dashboard.allGICertified')}
            </span>

          </div>

          {/* Bulk Inquiries */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">

            <span className="text-[10px] font-bold text-stone-500 uppercase">
              {t('dashboard.bulkInquiries')}
            </span>

            <p className="text-lg font-black text-saffron-700 mt-0.5">
              2 {t('dashboard.pendingRFQs')}
            </p>

            <span className="text-[10px] text-saffron-600 font-bold">
              {t('dashboard.gemTrifedBuyers')}
            </span>

          </div>

          {/* Rating */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70">

            <span className="text-[10px] font-bold text-stone-500 uppercase">
              {t('dashboard.artisanRating')}
            </span>

            <p className="text-lg font-black text-stone-900 mt-0.5">
              ★ {CURRENT_ARTISAN.rating} / 5.0
            </p>

            <span className="text-[10px] text-emerald-600 font-medium">
              {CURRENT_ARTISAN.totalSalesCount} {t('dashboard.verifiedOrders')}
            </span>

          </div>

        </div>

        {/* AI Market Insight */}
        <div className="p-3.5 bg-gradient-to-r from-amber-50 to-saffron-50/50 rounded-2xl border border-amber-200 text-xs flex items-start space-x-3">

          <span className="text-xl">💡</span>

          <div>

            <span className="font-bold text-amber-900">
              {t('dashboard.marketTrendInsight')}
            </span>

            <p className="text-stone-700 mt-0.5 leading-relaxed">
              {t('dashboard.marketInsightText')}
            </p>

          </div>
        </div>

      </div>

      {/* ============================================================
          Active Catalog
      ============================================================ */}
      <div className="space-y-3">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-2">

            <Package className="w-4 h-4 text-stone-700" />

            <h3 className="font-bold text-base text-stone-900">
              {t('dashboard.myCatalog')}
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

            <span>
              {t('dashboard.addProduct')}
            </span>
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {products.map((product) => (

            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
            >

              {/* Product Image */}
              <div className="relative aspect-square bg-stone-100 overflow-hidden">

                <img
                  src={product.enhancedImage || product.originalImage}
                  alt={product.titleEn}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />

                {/* AI Enhanced / Studio Photo Badge */}
                <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  {product.enhancedImage ? (language === 'hi' ? 'एआई संवर्धित' : 'AI Enhanced') : t('dashboard.originalPhoto')}
                </span>

                {/* GI Badge */}
                {product.giCertified && (
                  <span className="absolute top-2.5 left-2.5 bg-navy-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur">
                    {t('dashboard.giTagged')}
                  </span>
                )}

              </div>

              {/* Card Body */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">

                <div>

                  {/* Category */}
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    {getCategoryTranslation(product.category)}
                  </span>

                  {/* Product Title */}
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-saffron-700 transition-colors">
                    {language === 'hi'
                      ? product.titleHi
                      : product.titleEn}
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
      </div>

    </div>
  );
};