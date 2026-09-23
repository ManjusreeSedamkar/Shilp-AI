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
import { getProductTitle, getCategoryTranslation as getCategoryDisplayTranslation, getCraftTechniqueTranslation } from '../services/displayTranslation';

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
      <div className="bg-gradient-to-br from-[#1C1815] via-[#2A231D] to-[#181412] rounded-3xl p-5 sm:p-7 text-white border border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.18)] relative overflow-hidden w-full max-w-full">
        {/* Top subtle golden shimmer line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-saffron-400 to-amber-600"></div>

        <div className="absolute -right-8 -bottom-8 opacity-10 text-9xl select-none pointer-events-none">
          🏺
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

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
                  {language !== 'en' && CURRENT_ARTISAN.regionalName
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
              title={isSpeakingAnalytics ? (translate(language, 'auto.stop_speech.28')) : t('dashboard.listenSummary')}
            >
              {isSpeakingAnalytics ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{translate(language, 'auto.stop_speech.29')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-saffron-300" />
                  <span>
                    {t('dashboard.listenSummary')}
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
                {translate(language, 'auto.ai_speech_transcript.30')}
                {isSpeakingAnalytics ? (
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    {translate(language, 'auto.speaking.31')}
                  </span>
                ) : (
                  <span className="bg-white/20 text-stone-200 text-[9px] px-2 py-0.5 rounded-full font-mono">
                    {translate(language, 'auto.stopped_ready.32')}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyTranscript(analyticsTranscript)}
                  className="text-stone-300 hover:text-white text-[10px] flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {isCopiedTranscript ? (translate(language, 'auto.copied.33')) : (translate(language, 'auto.copy.34'))}
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
        className="cursor-pointer group relative overflow-hidden bg-[#231E1B] hover:bg-[#2A2420] border border-stone-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-white shadow-sm transition-all transform hover:-translate-y-0.5 w-full max-w-full"
        role="button"
        tabIndex={0}
        aria-label="Tutorial"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center space-x-3 sm:space-x-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform shrink-0">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-sm sm:text-base text-white tracking-wide truncate">
                  {translate(language, 'auto.tutorial.35')}
                </h4>
                <span className="bg-white/10 text-stone-200 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/15 flex items-center gap-1">
                  <span>2 {translate(language, 'auto.videos.36')}:</span>
                  <span className="text-amber-200 font-bold">{translate(language, 'auto.english_hindi_videos.41')}</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-300 mt-0.5 font-normal leading-tight">
                {translate(language, 'auto.click_to_watch_step_.37')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 shadow-2xs group-hover:bg-white group-hover:text-stone-900 transition-all shrink-0 self-start sm:self-auto">
            <Play className="w-3.5 h-3.5 fill-current text-current" />
            <span>{translate(language, 'auto.watch_tutorials.38')}</span>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3.5 w-full max-w-full">

          {/* Photo AI */}
          <button
            onClick={onOpenStudio}
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
              <Camera className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
                {t('dashboard.photoAI')}
              </span>

              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
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
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
              <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
                {t('dashboard.voiceNLP')}
              </span>

              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
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
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
              <Bot className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
                {t('dashboard.copilotLabel')}
              </span>

              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
                {t('dashboard.copilot')}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
                {t('dashboard.copilotDesc')}
              </p>
            </div>
          </button>

          {/* Fair Pricing */}
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

          {/* Tutorial Tile */}
          <button
            onClick={onOpenTutorials}
            className="p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-stone-200 hover:border-stone-400 text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 group flex flex-col justify-between w-full"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 text-stone-800 group-hover:bg-stone-900 group-hover:text-white flex items-center justify-center mb-2.5 sm:mb-3 transition-colors shadow-2xs">
              <Video className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
            </div>

            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
                {translate(language, 'auto.video_guides.39')}
              </span>

              <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate mt-0.5">
                {translate(language, 'auto.tutorial.40')}
              </h4>

              <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 leading-tight line-clamp-2">
                {translate(language, 'auto.english_hindi_videos.41')}
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
            title={isSpeakingAnalytics ? (translate(language, 'auto.stop_speech.42')) : t('dashboard.readAloud')}
          >
            {isSpeakingAnalytics ? (
              <>
                <Square className="w-3 h-3 fill-white text-white" />
                <span>{translate(language, 'auto.stop.43')}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-saffron-600" />
                <span>{translate(language, 'auto.listen.44')}</span>
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
                {translate(language, 'auto.ai_speech_transcript.45')}
                {isSpeakingAnalytics ? (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full animate-pulse">
                    {translate(language, 'auto.speaking.46')}
                  </span>
                ) : (
                  <span className="bg-stone-200 text-stone-700 text-[9px] px-1.5 py-0.2 rounded-full font-mono">
                    {translate(language, 'auto.stopped.47')}
                  </span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyTranscript(analyticsTranscript)}
                  className="text-stone-600 hover:text-stone-900 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {isCopiedTranscript ? (translate(language, 'auto.copied.48')) : (translate(language, 'auto.copy.49'))}
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

          {/* Revenue */}
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

          {/* Active Listings */}
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

          {/* Bulk Inquiries */}
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

          {/* Rating */}
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

        {/* AI Market Insight */}
        <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-xs flex items-start space-x-3">

          <span className="text-2xl">💡</span>

          <div>

            <span className="font-bold text-stone-900">
              {t('dashboard.marketTrendInsight')}
            </span>

            <p className="text-stone-600 mt-0.5 leading-relaxed">
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

            <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-bold">
              {products.length}
            </span>

          </div>

          <button
            onClick={onOpenCopilot}
            className="text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />

            <span>
              {t('dashboard.addProduct')}
            </span>
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">

          {products.map((product) => (

            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
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
                  {product.enhancedImageUrl || product.enhancedImage ? (translate(language, 'auto.ai_enhanced.50')) : t('dashboard.originalPhoto')}
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
                  <span>{translate(language, 'auto.tap_to_view_details_.51')}</span>
                </div>

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
                    {getProductTitle(product, language)}
                  </h4>

                  {/* Technique + Days */}
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {getCraftTechniqueTranslation(product.craftTechnique, language)} • {product.productionDays}{' '}
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