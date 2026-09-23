import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Square, 
  Video, 
  Upload, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Mic, 
  IndianRupee, 
  Bot, 
  CheckCircle2, 
  Info, 
  X,
  ExternalLink
} from 'lucide-react';
import { Language } from '../types';
import { translate, getSpeechLangCode } from '../services/translations';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';

interface TutorialPageProps {
  onBack: () => void;
  language?: Language;
}

interface TutorialData {
  id: string;
  lang: 'hi' | 'en';
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  defaultVideoSrc: string;
  spokenSummary: string;
  chapters: {
    time: string;
    title: string;
    desc: string;
    icon: string;
  }[];
}

export const TutorialPage: React.FC<TutorialPageProps> = ({
  onBack,
  language = 'en'
}) => {
  const [selectedLang, setSelectedLang] = useState<'hi' | 'en'>(language === 'hi' ? 'hi' : 'en');
  const [customVideoSrc, setCustomVideoSrc] = useState<{ [key: string]: string }>({});
  const [videoError, setVideoError] = useState<{ [key: string]: boolean }>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string | null>(null);
  const [isCopiedTranscript, setIsCopiedTranscript] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selectedLang with language prop so English gets English video and Hindi gets Hindi video
  useEffect(() => {
    setSelectedLang(language === 'hi' ? 'hi' : 'en');
  }, [language]);

  // Reset video error when language tab switches so video can reload
  useEffect(() => {
    setVideoError((prev) => ({
      ...prev,
      [selectedLang]: false
    }));
  }, [selectedLang]);

  const t = (key: string) => translate(language, key);
  const isHindi = language === 'hi';

  const tutorials: Record<'hi' | 'en', TutorialData> = {
    hi: {
      id: 'tutorial-hi',
      lang: 'hi',
      tabLabel: '🇮🇳 हिन्दी ट्यूटोरियल (Hindi Video)',
      badge: 'हिन्दी वीडियो गाइड',
      title: 'SHILP-AI का उपयोग कैसे करें - संपूर्ण हिन्दी गाइड',
      description: 'इस वीडियो ट्यूटोरियल में सीखें कि कैसे AI स्टूडियो से अपने शिल्प की तस्वीर को बेहतर बनाएं, अपनी भाषा में बोलकर उत्पाद कैटलॉग बनाएं, उचित कारीगर मूल्य (₹750/दिन) तय करें, और खरीदारों से सीधे संपर्क करें।',
      defaultVideoSrc: '/videos/tutorial-hi.mp4',
      spokenSummary: 'नमस्ते कारीगर साथियों। SHILP-AI ट्यूटोरियल में आपका स्वागत है। इस ऐप में आप चार मुख्य काम कर सकते हैं: पहला, AI स्टूडियो से उत्पाद का फोटो लेकर बैकग्राउंड हटाएं और रोशनी सुधारें। दूसरा, बोलकर स्मार्ट कैटलॉग बनाएं जिससे हिन्दी और अंग्रेजी दोनों में विवरण तैयार हो जाएगा। तीसरा, डायनामिक प्राइसिंग कैलकुलेटर से निष्पक्ष मजदूरी पाएं। और चौथा, AI कोपायलट की मदद से सीधे खरीदारों से चैट करें।',
      chapters: [
        {
          time: '00:00 - 01:15',
          title: 'शुरुआत और कारीगर प्रोफ़ाइल',
          desc: 'MoSJE लाभार्थी कार्ड और डिजिटल शिल्प पास का सत्यापन।',
          icon: '🏺'
        },
        {
          time: '01:16 - 03:00',
          title: 'AI स्टूडियो से उत्पाद फोटो सुधारना',
          desc: 'कार्यशाला की साधारण तस्वीर से बैकग्राउंड हटाना और पेशेवर लाइटिंग जोड़ना।',
          icon: '📸'
        },
        {
          time: '03:01 - 04:45',
          title: 'बोलकर स्मार्ट कैटलॉग तैयार करना',
          desc: 'अपनी मातृभाषा में बोलें, AI स्वचालित रूप से हिन्दी कहानी व अंग्रेजी SEO विवरण तैयार करेगा।',
          icon: '🎙️'
        },
        {
          time: '04:46 - 06:10',
          title: 'उचित कारीगर मूल्य निर्धारण (Fair Pricing)',
          desc: 'न्यूनतम ₹750/दिन मजदूरी और GI प्रमाणन मूल्य सुरक्षा की गणना।',
          icon: '💰'
        },
        {
          time: '06:11 - 07:30',
          title: 'खरीदार चैट व थोक ऑर्डर प्रबंधन',
          desc: 'थोक खरीदारों के प्रस्तावों का विश्लेषण और सुरक्षित भुगतान प्रक्रिया।',
          icon: '💬'
        }
      ]
    },
    en: {
      id: 'tutorial-en',
      lang: 'en',
      tabLabel: '🇬🇧 English Tutorial (English Video)',
      badge: 'English Video Guide',
      title: 'How to Use SHILP-AI - Complete Step-by-Step Walkthrough',
      description: 'Watch this comprehensive walkthrough to master SHILP-AI. Learn how to transform raw workshop photos with AI Studio, generate dual-language SEO listings using voice input, ensure ₹750/day fair artisan wages, and negotiate directly with B2B buyers.',
      defaultVideoSrc: '/videos/tutorial-en.mp4',
      spokenSummary: 'Welcome to the SHILP-AI complete guide. In this walkthrough, you will learn how to leverage AI to grow your craft business: First, use AI Image Studio to clean backgrounds and enhance lighting. Second, use the Multilingual Voice Cataloger to dictate product stories in your regional language. Third, calculate fair wages with the Dynamic Pricing Engine. And fourth, use Artisan Copilot to manage buyer negotiations.',
      chapters: [
        {
          time: '00:00 - 01:15',
          title: 'Platform Overview & MoSJE Digital Pass',
          desc: 'Setting up your verified artisan profile and GI-certified credentials.',
          icon: '🏺'
        },
        {
          time: '01:16 - 03:00',
          title: 'AI Photo Enhancement & Studio Staging',
          desc: 'Automatic background removal, edge softening, contrast boost, and realistic studio shadows.',
          icon: '📸'
        },
        {
          time: '03:01 - 04:45',
          title: 'Multilingual Voice Cataloger',
          desc: 'Hands-free voice recognition in 7 Indian languages generating cultural story + English SEO catalog.',
          icon: '🎙️'
        },
        {
          time: '04:46 - 06:10',
          title: 'Dynamic Fair Pricing Engine',
          desc: 'Ensuring at least ₹750/day fair wage standard, raw material multipliers, and wholesale tiers.',
          icon: '💰'
        },
        {
          time: '06:11 - 07:30',
          title: 'Artisan Copilot & B2B Inquiries',
          desc: 'AI-assisted wholesale negotiations, trade fair bookings, and direct buyer messaging.',
          icon: '💬'
        }
      ]
    }
  };

  const currentTutorial = tutorials[selectedLang];
  const activeVideoUrl = customVideoSrc[selectedLang] || currentTutorial.defaultVideoSrc;

  // Handle local video file upload from user's computer
  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomVideoSrc((prev) => ({
        ...prev,
        [selectedLang]: objectUrl
      }));
      setVideoError((prev) => ({
        ...prev,
        [selectedLang]: false
      }));
    }
  };

  // Handle custom URL input
  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setCustomVideoSrc((prev) => ({
        ...prev,
        [selectedLang]: customUrlInput.trim()
      }));
      setVideoError((prev) => ({
        ...prev,
        [selectedLang]: false
      }));
      setShowUrlInput(false);
      setCustomUrlInput('');
    }
  };

  // Toggle voice playback of the tutorial summary notes
  const handleToggleSpeak = async () => {
    if (isSpeaking) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setSpokenTranscript(currentTutorial.spokenSummary);
    setIsSpeaking(true);

    try {
      await VoiceCatalogerEngine.speak(
        currentTutorial.spokenSummary,
        selectedLang === 'hi' ? 'hi-IN' : 'en-IN'
      );
    } catch (err) {
      console.warn('Voice speak error:', err);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleCopyTranscript = () => {
    if (spokenTranscript) {
      navigator.clipboard?.writeText(spokenTranscript);
      setIsCopiedTranscript(true);
      setTimeout(() => setIsCopiedTranscript(false), 2000);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 w-full max-w-full overflow-x-hidden animate-in fade-in duration-300">
      {/* Top Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-sm w-full max-w-full">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={onBack}
            className="p-2 sm:p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-2xs shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{translate(language, 'auto.back_to_dashboard.138')}</span>
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center text-white shadow-xs shrink-0">
                <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <h1 className="text-base sm:text-xl font-black text-stone-900 truncate">
                {translate(language, 'auto.shilp_ai_video_tutor.139')}
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
              {translate(language, 'auto.step_by_step_visual_.140')}
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 w-full sm:w-auto justify-center shrink-0">
          <button
            onClick={() => {
              setSelectedLang('hi');
              if (isSpeaking) {
                VoiceCatalogerEngine.stopSpeaking();
                setIsSpeaking(false);
              }
            }}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedLang === 'hi'
                ? 'bg-saffron-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🇮🇳 हिन्दी ट्यूटोरियल</span>
          </button>
          <button
            onClick={() => {
              setSelectedLang('en');
              if (isSpeaking) {
                VoiceCatalogerEngine.stopSpeaking();
                setIsSpeaking(false);
              }
            }}
            className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedLang === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🇬🇧 English Tutorial</span>
          </button>
        </div>
      </div>

      {/* Main Video Presentation Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 shadow-md overflow-hidden w-full max-w-full">
        {/* Card Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-800 to-navy-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-saffron-500 text-white shadow-xs">
                {currentTutorial.badge}
              </span>
              <span className="text-[11px] sm:text-xs text-stone-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                HD 1080p • Full Audio
              </span>
            </div>
            <h2 className="text-sm sm:text-lg font-black text-white">
              {currentTutorial.title}
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed max-w-3xl">
              {currentTutorial.description}
            </p>
          </div>

          {/* Video Sourcing Actions */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/webm,video/ogg,video/*"
              onChange={handleLocalVideoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              title="Select local video file from your computer"
            >
              <Upload className="w-3.5 h-3.5 text-saffron-300" />
              <span>{translate(language, 'auto.choose_video_file.141')}</span>
            </button>
            <button
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5 shadow-xs"
              title="Add video URL"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-300" />
              <span>{translate(language, 'auto.video_url.142')}</span>
            </button>
          </div>
        </div>

        {/* Custom URL Input Bar if toggled */}
        {showUrlInput && (
          <div className="p-3 bg-stone-100 border-b border-stone-200 flex items-center gap-2">
            <input
              type="url"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder={translate(language, 'auto.paste_video_url_e_g_.143')}
              className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
            <button
              onClick={handleApplyCustomUrl}
              disabled={!customUrlInput.trim()}
              className="px-4 py-2 bg-saffron-600 text-white rounded-xl text-xs font-bold hover:bg-saffron-700 transition-colors disabled:opacity-40"
            >
              {translate(language, 'auto.apply_url.144')}
            </button>
            <button
              onClick={() => setShowUrlInput(false)}
              className="p-2 text-stone-500 hover:text-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Video Player Area */}
        <div className="relative bg-black aspect-video max-h-[520px] w-full flex items-center justify-center overflow-hidden">
          {videoError[selectedLang] ? (
            /* Fallback display if video file is missing or still being added */
            <div className="p-8 text-center text-stone-300 space-y-3 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-stone-800 text-saffron-400 mx-auto flex items-center justify-center border border-stone-700">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-white">
                {translate(language, 'auto.video_file_ready_for.145')}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {isHindi
                  ? `अपनी हिन्दी वीडियो फ़ाइल को public/videos/tutorial-hi.mp4 के रूप में रखें, या ऊपर दिए गए 'लोकल वीडियो फ़ाइल चुनें' बटन से सीधे सेलेक्ट करें।`
                  : `Place your video file in 'public/videos/${selectedLang === 'hi' ? 'tutorial-hi.mp4' : 'tutorial-en.mp4'}', or click 'Choose Video File' above to play any local video instantly.`}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>{translate(language, 'auto.choose_local_video.146')}</span>
                </button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              key={`${selectedLang}-${activeVideoUrl}`}
              controls
              playsInline
              className="w-full h-full object-contain"
              onError={() => {
                setVideoError((prev) => ({
                  ...prev,
                  [selectedLang]: true
                }));
              }}
            >
              <source src={activeVideoUrl} type="video/mp4" />
              {selectedLang === 'hi' ? (
                <source src="/videos/WhatsApp Video 2026-09-09 at 00.13.12.mp4" type="video/mp4" />
              ) : (
                <source src="/videos/WhatsApp Video 2026-09-09 at 00.13.12(2).mp4" type="video/mp4" />
              )}
              <source src={activeVideoUrl} type="video/webm" />
              {translate(language, 'auto.your_browser_does_no.147')}
            </video>
          )}
        </div>

        {/* Video Controls & Audio Transcription Bar */}
        <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-xs text-stone-900">
                  {translate(language, 'auto.audio_tutorial_narra.148')}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {translate(language, 'auto.listen_to_the_full_s.149')}
                </p>
              </div>
            </div>

            {/* Universal Start & Stop Audio Toggle */}
            <button
              onClick={handleToggleSpeak}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isSpeaking
                  ? 'bg-red-600 text-white hover:bg-red-700 ring-4 ring-red-200 animate-pulse'
                  : 'bg-gradient-to-r from-saffron-600 to-amber-600 text-white hover:from-saffron-700 hover:to-amber-700'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-white text-white" />
                  <span>{translate(language, 'auto.stop_speech.150')}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{translate(language, 'auto.listen_summary.151')}</span>
                </>
              )}
            </button>
          </div>

          {/* Dedicated Audio Transcription Card when Speaking or Paused */}
          {spokenTranscript && (
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-stone-800 space-y-2 animate-in fade-in duration-200 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold border-b border-amber-200/80 pb-1.5">
                <span className="flex items-center gap-1.5 text-amber-900">
                  <FileText className="w-4 h-4 text-amber-700" />
                  {translate(language, 'auto.ai_spoken_audio_tran.152')}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                    isSpeaking 
                      ? 'bg-red-100 text-red-700 animate-pulse border border-red-200' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                    {isSpeaking ? (translate(language, 'auto.speaking.153')) : (translate(language, 'auto.stopped_ready_to_rea.154'))}
                  </span>
                  <button
                    onClick={handleCopyTranscript}
                    className="text-stone-500 hover:text-stone-800 p-1 rounded hover:bg-amber-100 transition-colors"
                    title="Copy transcript"
                  >
                    {isCopiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        VoiceCatalogerEngine.stopSpeaking();
                        setIsSpeaking(false);
                      }
                      setSpokenTranscript(null);
                    }}
                    className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-amber-100 transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-stone-700 font-mono leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-200/60 select-text">
                "{spokenTranscript}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
                <span>{translate(language, 'auto.listen_carefully_or_.155')}</span>
                {isCopiedTranscript && <span className="text-emerald-700 font-semibold">{translate(language, 'auto.copied_to_clipboard.156')}</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chapters & Topics Covered Grid */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-saffron-100 text-saffron-800">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-sm text-stone-900">
                {translate(language, 'auto.video_chapters_topic.157')}
              </h3>
              <p className="text-[11px] text-stone-500">
                {translate(language, 'auto.quick_navigation_bre.158')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            {currentTutorial.chapters.length} {translate(language, 'auto.chapters.159')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {currentTutorial.chapters.map((chapter, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-saffron-400 hover:bg-saffron-50/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">{chapter.icon}</span>
                <span className="text-[10px] font-mono font-bold text-saffron-700 bg-saffron-100/80 px-2 py-0.5 rounded-md">
                  {chapter.time}
                </span>
              </div>
              <h4 className="font-bold text-xs text-stone-900 group-hover:text-saffron-800 transition-colors">
                {chapter.title}
              </h4>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                {chapter.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Helpful Tips Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-emerald-950">
              {translate(language, 'auto.ready_to_practice_af.160')}
            </h4>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              {translate(language, 'auto.put_your_learning_in.161')}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          {translate(language, 'auto.go_to_dashboard.162')}
        </button>
      </div>
    </div>
  );
};
