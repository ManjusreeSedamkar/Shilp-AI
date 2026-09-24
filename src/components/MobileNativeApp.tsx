import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Settings, 
  CreditCard, 
  Menu, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Check, 
  LogOut, 
  User, 
  Globe, 
  Sun, 
  Moon, 
  HelpCircle, 
  Camera, 
  Mic, 
  MicOff, 
  Bot, 
  IndianRupee, 
  CheckCircle2, 
  SlidersHorizontal,
  Compass,
  X,
  MessageSquare,
  Send,
  Volume2,
  VolumeX,
  Copy,
  FileText,
  Square,
  Loader2,
  Palette,
  Ruler,
  Package,
  Phone,
  Clock
} from 'lucide-react';
import { 
  ProductListing, 
  UserRole, 
  Language, 
  ProductReview, 
  Conversation, 
  ChatMessage, 
  CustomizationRequest, 
  CopilotMessage 
} from '../types';
import { CURRENT_ARTISAN, CRAFT_PRESETS } from '../data/craftPresets';
import { AuthUser } from './AuthModal';
import { VoiceCatalogerModal } from './VoiceCatalogerModal';
import { DynamicPricingCard } from './DynamicPricingCard';
import { CraftAtlasExplorer } from './CraftAtlasExplorer';
import { ApiSettingsModal } from './ApiSettingsModal';
import { ArtisanCopilotService } from '../services/copilotService';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';
import { askGemini, hasGeminiApiKey } from '../services/geminiService';
import { getSpeechLangCode, translate } from '../services/translations';

interface MobileNativeAppProps {
  products: ProductListing[];
  currentUser: AuthUser | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  conversations: Conversation[];
  onSendMessage?: (conversationId: string, text: string, customizationRequest?: CustomizationRequest) => void;
  reviews: ProductReview[];
  onSelectProduct: (prod: ProductListing) => void;
  onStartConversation: (artisanId: string, artisanName: string, productId?: string, productTitle?: string) => string | void;
  onBuyNow: (prod: ProductListing) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCardModal: () => void;
  onOpenTutorial: () => void;
  isLightOn?: boolean;
  onToggleLightMode?: () => void;
  onListingCreated?: (newProd: ProductListing) => void;
}

// Hero Video Sources matching HeritageHeroSection.tsx
const HERO_VIDEO_PROFILES = {
  textiles: {
    id: 'textiles',
    label: 'Option A: Weaving',
    shortLabel: '🧵 Weaving',
    hindiLabel: 'हथकरघा बुनाई',
    localSrc: '/videos/hero-textile-craft.mp4',
    remoteSrc: 'https://v1.pinimg.com/videos/iht/expMp4/86/79/f9/8679f9803ae04ed603e07f140b095dbf_720w.mp4',
    poster: 'https://i.pinimg.com/originals/de/24/77/de24770350c103d6c1bea63bc767019c.jpg',
  },
  pottery: {
    id: 'pottery',
    label: 'Option B: Pottery',
    shortLabel: '🏺 Pottery',
    hindiLabel: 'मृत्तिका शिल्प',
    localSrc: '/videos/hero-pottery-craft.mp4',
    remoteSrc: 'https://videos.pexels.com/video-files/7948427/7948427-hd_1280_720_24fps.mp4',
    poster: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1920&q=85',
  }
};

// 6 Colorful Squircle Category Tiles (Exact Match to Screen 3 of User Reference Image)
const MOBILE_CATEGORIES = [
  {
    id: 'Textiles & Handloom',
    name: 'Textiles',
    sub: 'Pure Silk & Zari',
    icon: '❖',
    bgColor: 'bg-indigo-600',
    textColor: 'text-white'
  },
  {
    id: 'Clay & Terracotta',
    name: 'Terracotta',
    sub: 'Alluvial Claywares',
    icon: '🏺',
    bgColor: 'bg-rose-500',
    textColor: 'text-white'
  },
  {
    id: 'Leather & Footwear',
    name: 'Leather',
    sub: 'Kolhapuri Tanned',
    icon: '👞',
    bgColor: 'bg-amber-500',
    textColor: 'text-white'
  },
  {
    id: 'Metalcraft & Dhokra',
    name: 'Metalwork',
    sub: 'Lost-Wax Dhokra',
    icon: '🔱',
    bgColor: 'bg-teal-500',
    textColor: 'text-white'
  },
  {
    id: 'Traditional Painting',
    name: 'Painting',
    sub: 'Pattachitra & Warli',
    icon: '⦿',
    bgColor: 'bg-pink-500',
    textColor: 'text-white'
  },
  {
    id: 'Woodcraft & Carving',
    name: 'Woodcraft',
    sub: 'Channapatna Toys',
    icon: '🪵',
    bgColor: 'bg-blue-600',
    textColor: 'text-white'
  }
];

// Color Swatches matching Screen 5 of the User Reference Image
const COLOR_SWATCHES = [
  { id: 'cyan', name: 'Cyan Blue', hex: '#06B6D4' },
  { id: 'coral', name: 'Coral Pink', hex: '#F43F5E' },
  { id: 'indigo', name: 'Deep Indigo', hex: '#4338CA' },
  { id: 'amber', name: 'Golden Zari', hex: '#F59E0B' },
  { id: 'emerald', name: 'Emerald', hex: '#10B981' },
  { id: 'terracotta', name: 'Terracotta', hex: '#C85A32' },
  { id: 'midnight', name: 'Charcoal', hex: '#1E293B' },
  { id: 'raw-silk', name: 'Raw Silk', hex: '#F8FAFC' },
  { id: 'ruby', name: 'Ruby Saffron', hex: '#E11D48' },
  { id: 'peacock', name: 'Peacock Teal', hex: '#0D9488' }
];

export const MobileNativeApp: React.FC<MobileNativeAppProps> = ({
  products,
  currentUser,
  role,
  setRole,
  language,
  setLanguage,
  conversations,
  onSendMessage,
  reviews,
  onSelectProduct,
  onStartConversation,
  onBuyNow,
  onOpenAuth,
  onLogout,
  onOpenCardModal,
  onOpenTutorial,
  isLightOn = true,
  onToggleLightMode,
  onListingCreated
}) => {
  // Navigation Tabs: shop (Market), messages (Direct Messaging), copilot (AI Copilot), studio (AI Studio), profile (Settings & ID)
  const [activeTab, setActiveTab] = useState<'shop' | 'messages' | 'copilot' | 'studio' | 'profile'>('shop');
  
  // Search query & category filter for Marketplace
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Show / Hide Craft Atlas within mobile app
  const [showAtlas, setShowAtlas] = useState(false);

  // Selected product for Mobile Inspection Screen (Screens 4 & 5)
  const [inspectProduct, setInspectProduct] = useState<ProductListing | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0].id);
  const [selectedSize, setSelectedSize] = useState('Standard');

  // Mobile Auth screen toggle (Screen 1)
  const [isAuthScreenOpen, setIsAuthScreenOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authMobileInput, setAuthMobileInput] = useState('');
  const [authPasswordInput, setAuthPasswordInput] = useState('');

  // ---------------------------------------------------------------------------
  // 1. HERO VIDEO STATE & CONTROLS
  // ---------------------------------------------------------------------------
  const [activeHeroVideoKey, setActiveHeroVideoKey] = useState<'textiles' | 'pottery'>('textiles');
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const currentHeroProfile = HERO_VIDEO_PROFILES[activeHeroVideoKey];

  const handleSwitchHeroVideo = (key: 'textiles' | 'pottery') => {
    setActiveHeroVideoKey(key);
    if (heroVideoRef.current) {
      heroVideoRef.current.load();
      heroVideoRef.current.play().catch(() => {});
    }
  };

  const handleToggleHeroAudio = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !heroVideoRef.current.muted;
      setIsHeroMuted(heroVideoRef.current.muted);
    }
  };

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      heroVideoRef.current.play().catch(() => {});
    }
  }, [activeHeroVideoKey]);

  // ---------------------------------------------------------------------------
  // 2. DIRECT MESSAGING STATE & CONTROLS
  // ---------------------------------------------------------------------------
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chatSearchFilter, setChatSearchFilter] = useState('');
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState('Royal Indigo');
  const [customSize, setCustomSize] = useState('Medium (6.5m)');
  const [customQuantity, setCustomQuantity] = useState('1');
  const [customNotes, setCustomNotes] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages.length, activeConversationId]);

  const handleSendChatMessage = (textToSend?: string, customReq?: CustomizationRequest) => {
    if (!activeConversationId) return;
    const text = (textToSend || chatInputText).trim();
    if (!text && !customReq) return;

    if (onSendMessage) {
      onSendMessage(activeConversationId, text, customReq);
    }
    setChatInputText('');
  };

  const handleSendCustomizationQuote = () => {
    if (!activeConversationId) return;
    const customReq: CustomizationRequest = {
      color: customColor,
      size: customSize,
      quantity: parseInt(customQuantity) || 1,
      otherRequirements: customNotes,
      notes: customNotes
    };
    const summaryText = `📋 Customization Request: Color: ${customColor}, Size: ${customSize}, Qty: ${customQuantity}${customNotes ? `, Notes: ${customNotes}` : ''}`;
    handleSendChatMessage(summaryText, customReq);
    setIsCustomizationModalOpen(false);
    setCustomNotes('');
  };

  const handleStartChatFromProduct = (product: ProductListing) => {
    const convId = onStartConversation(product.artisanId, product.artisanName, product.id, product.titleEn);
    if (typeof convId === 'string') {
      setActiveConversationId(convId);
    } else {
      const existing = conversations.find(c => c.artisanId === product.artisanId);
      if (existing) {
        setActiveConversationId(existing.id);
      }
    }
    setInspectProduct(null);
    setActiveTab('messages');
  };

  // ---------------------------------------------------------------------------
  // 3. AI COPILOT STATE & CONTROLS
  // ---------------------------------------------------------------------------
  const [copilotSubTab, setCopilotSubTab] = useState<'chat' | 'pricing'>('chat');
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    ArtisanCopilotService.getInitialGreeting(language === 'hi' ? 'hi' : 'en')
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [isCopilotRecording, setIsCopilotRecording] = useState(false);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [isSpeakingMessageId, setIsSpeakingMessageId] = useState<string | null>(null);
  const [spokenTranscripts, setSpokenTranscripts] = useState<{ [id: string]: string }>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showApiSettings, setShowApiSettings] = useState(false);
  const copilotBottomRef = useRef<HTMLDivElement>(null);
  const copilotRecognitionRef = useRef<any>(null);

  // Setup Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getSpeechLangCode(language);

      recognition.onresult = (event: any) => {
        const transcriptText = event.results[0][0].transcript;
        setIsCopilotRecording(false);
        if (transcriptText) {
          handleSendCopilotMessage(transcriptText);
        }
      };
      recognition.onerror = () => setIsCopilotRecording(false);
      recognition.onend = () => setIsCopilotRecording(false);
      copilotRecognitionRef.current = recognition;
    }
  }, [language]);

  // Stop active speech on unmount
  useEffect(() => {
    return () => {
      VoiceCatalogerEngine.stopSpeaking();
    };
  }, []);

  useEffect(() => {
    copilotBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages, isCopilotLoading, copilotSubTab]);

  const handleToggleCopilotRecording = () => {
    if (isCopilotRecording) {
      copilotRecognitionRef.current?.stop();
      setIsCopilotRecording(false);
    } else {
      try {
        setIsCopilotRecording(true);
        copilotRecognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech recognition not available:', err);
        setTimeout(() => {
          setIsCopilotRecording(false);
          const sample = language === 'hi' ? CRAFT_PRESETS[0].sampleVoiceHindi : CRAFT_PRESETS[0].sampleVoiceEnglish;
          handleSendCopilotMessage(sample);
        }, 1500);
      }
    }
  };

  const handleToggleCopilotVoice = (msg: CopilotMessage) => {
    if (isSpeakingMessageId === msg.id) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeakingMessageId(null);
    } else {
      handlePlayCopilotVoice(msg);
    }
  };

  const handlePlayCopilotVoice = async (msg: CopilotMessage) => {
    VoiceCatalogerEngine.stopSpeaking();
    setIsSpeakingMessageId(msg.id);

    const textToSpeak = msg.audioText || msg.text;
    const langCode = getSpeechLangCode(language);

    setSpokenTranscripts(prev => ({
      ...prev,
      [msg.id]: textToSpeak
    }));

    try {
      await VoiceCatalogerEngine.speak(textToSpeak, langCode as any);
    } catch (err) {
      console.warn('Speech playback error:', err);
    } finally {
      setIsSpeakingMessageId(null);
    }
  };

  const handleSendCopilotMessage = async (textToSend?: string) => {
    const text = (textToSend || copilotInput).trim();
    if (!text) return;

    VoiceCatalogerEngine.stopSpeaking();
    setIsSpeakingMessageId(null);

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'artisan',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...copilotMessages, userMsg];
    setCopilotMessages(newHistory);
    setCopilotInput('');
    setIsCopilotLoading(true);

    try {
      let replyText = '';
      let replyAudioText = '';
      let actionCard = undefined;

      if (hasGeminiApiKey()) {
        try {
          const geminiReply = await askGemini(
            text,
            language,
            `You are SHILP-AI Copilot, an empathetic, expert virtual business manager supporting Indian marginalized artisans, weavers, and craftspersons. Explain app procedures, pricing (at least ₹750/day), MoSJE smart cards, and wholesale buyers. Concise, structured bullet points.`
          );
          replyText = geminiReply;
          replyAudioText = geminiReply.slice(0, 200);
        } catch (err) {
          console.warn('Gemini failed, falling back to local copilot:', err);
        }
      }

      if (!replyText) {
        const localResult = ArtisanCopilotService.processArtisanInput(
          text,
          newHistory,
          language === 'hi' ? 'hi' : 'en'
        );
        replyText = localResult.reply.text;
        replyAudioText = localResult.reply.audioText || localResult.reply.text;
        actionCard = localResult.reply.actionCard;
      }

      const copilotReply: CopilotMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: replyText,
        audioText: replyAudioText,
        actionCard,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setCopilotMessages(prev => [...prev, copilotReply]);
      handlePlayCopilotVoice(copilotReply);
    } catch (err) {
      const fallbackMsg: CopilotMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        text: language === 'hi' ? 'माफ़ कीजिए, उत्तर तैयार करने में समस्या आई।' : 'I encountered an issue generating a response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setCopilotMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchable = `${p.titleEn} ${p.titleHi} ${p.craftTechnique} ${p.artisanName} ${p.state}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  // Product reviews
  const currentReviews = useMemo(() => {
    if (!inspectProduct) return [];
    return reviews.filter(r => r.productId === inspectProduct.id);
  }, [inspectProduct, reviews]);

  const handleOpenProduct = (product: ProductListing) => {
    setInspectProduct(product);
  };

  const handleCloseInspect = () => {
    setInspectProduct(null);
  };

  return (
    <div className="w-full h-full bg-[#FAF8F5] dark:bg-[#070B14] text-stone-900 dark:text-stone-100 flex flex-col justify-between overflow-hidden relative font-sans select-none">

      {/* ========================================================================= */}
      {/* SCREEN 1: DEDICATED MOBILE LOGIN / SIGNUP SCREEN                          */}
      {/* ========================================================================= */}
      {isAuthScreenOpen && (
        <div className="absolute inset-0 z-50 bg-[#FAF8F5] dark:bg-[#070B14] flex flex-col justify-between overflow-y-auto no-scrollbar animate-fadeIn">
          {/* Top Orange Curved Banner */}
          <div className="bg-gradient-to-b from-amber-500 to-[#C85A32] text-white pt-6 pb-8 px-6 rounded-b-[36px] shadow-lg relative">
            <button
              onClick={() => setIsAuthScreenOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Title / MoSJE Badge */}
            <div className="text-center mt-2 mb-4">
              <span className="text-[10px] font-mono tracking-widest uppercase bg-black/20 px-2.5 py-0.5 rounded-full">
                SHILP-AI • MoSJE Registry
              </span>
              <h2 className="text-2xl font-black mt-1">Namaste! 🙏</h2>
            </div>

            {/* Pill Toggle: LOG IN | SIGN UP */}
            <div className="max-w-[220px] mx-auto bg-white/20 p-1 rounded-full flex items-center justify-between backdrop-blur-md">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  authMode === 'login' ? 'bg-white text-[#C85A32] shadow-md' : 'text-white'
                }`}
              >
                LOG IN
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                  authMode === 'signup' ? 'bg-white text-[#C85A32] shadow-md' : 'text-white'
                }`}
              >
                SIGN UP
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="flex-1 px-6 py-6 space-y-4 max-w-sm mx-auto w-full">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                {authMode === 'login' ? 'Beneficiary Mobile / Shilp ID' : 'Full Name'}
              </label>
              <input
                type="text"
                value={authMobileInput}
                onChange={(e) => setAuthMobileInput(e.target.value)}
                placeholder={authMode === 'login' ? '+91 98480 23145' : 'Rameshwaram Koli'}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Password / OTP
              </label>
              <input
                type="password"
                value={authPasswordInput}
                onChange={(e) => setAuthPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#C85A32] accent-[#C85A32]" />
                <span>Remember me</span>
              </label>
              <span className="text-[#C85A32] font-bold cursor-pointer">Forgot PIN?</span>
            </div>

            {/* Action Button: LOG IN */}
            <button
              onClick={() => {
                onOpenAuth();
                setIsAuthScreenOpen(false);
              }}
              className="w-full py-3 mt-4 rounded-xl bg-[#C85A32] hover:bg-[#b04b26] text-white font-extrabold text-sm tracking-wide shadow-md transition-all cursor-pointer"
            >
              {authMode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}
            </button>

            {/* Quick Demo Login Shortcut */}
            <div className="pt-2 text-center">
              <p className="text-[10px] text-stone-400 mb-2">Or continue with verified demo persona:</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setRole('artisan');
                    setIsAuthScreenOpen(false);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold border border-stone-200 dark:border-stone-700"
                >
                  Artisan Mode
                </button>
                <button
                  onClick={() => {
                    setRole('buyer');
                    setIsAuthScreenOpen(false);
                  }}
                  className="flex-1 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold border border-stone-200 dark:border-stone-700"
                >
                  Buyer Mode
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 text-center text-[10px] text-stone-400 border-t border-stone-100 dark:border-stone-800">
            Ministry of Social Justice & Empowerment • Govt of India
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREENS 4 & 5: DEDICATED MOBILE PRODUCT DETAIL & CUSTOMIZATION SCREEN     */}
      {/* ========================================================================= */}
      {inspectProduct && (
        <div className="absolute inset-0 z-40 bg-[#FAF8F5] dark:bg-[#070B14] flex flex-col justify-between overflow-y-auto no-scrollbar animate-fadeIn">
          {/* Top Colored Header Banner (Matching Reference Image Screen 4 & 5) */}
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white pt-4 pb-5 px-4 rounded-b-[28px] shadow-md relative shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={handleCloseInspect}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-mono tracking-wider uppercase">
                Craft Inspection
              </span>
              <button
                onClick={() => handleStartChatFromProduct(inspectProduct)}
                className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                title="Chat with Artisan"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span className="hidden xs:inline">Chat</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 px-4 py-3 space-y-4 overflow-y-auto no-scrollbar">
            
            {/* White Hero Card (Matching Reference Image Screen 4) */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-sm space-y-3">
              <div className="relative aspect-[4/4.5] rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
                <img
                  src={inspectProduct.enhancedImageUrl || inspectProduct.enhancedImage || inspectProduct.originalImageUrl}
                  alt={inspectProduct.titleEn}
                  className="w-full h-full object-contain p-2"
                />
                {inspectProduct.giCertified && (
                  <span className="absolute top-2 left-2 bg-stone-900/90 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                    <Award className="w-2.5 h-2.5 text-amber-300" />
                    GI Tagged
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                  {inspectProduct.titleEn}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {inspectProduct.craftTechnique} • {inspectProduct.state}
                </p>
              </div>

              {/* Rating & Price Row */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>5.0</span>
                  <span className="text-[10px] text-stone-400 font-normal">({currentReviews.length || 18} reviews)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block leading-none">Artisan Price</span>
                  <span className="text-base font-black text-[#C85A32] dark:text-amber-400">
                    ₹{inspectProduct.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Color Swatch Palette (Exact Match to Screen 5 of User Reference Image) */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 shadow-sm space-y-2">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                Authentic Vegetable / Mineral Color Swatches:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {COLOR_SWATCHES.map((color) => {
                  const isSelected = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      style={{ backgroundColor: color.hex }}
                      className={`h-8 rounded-lg transition-transform flex items-center justify-center shadow-xs cursor-pointer ${
                        isSelected ? 'scale-110 ring-2 ring-stone-900 dark:ring-white ring-offset-1' : 'opacity-85'
                      }`}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 ${color.id === 'raw-silk' ? 'text-stone-900' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizing Pills (Screen 5 of User Reference Image) */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                Size / Dimension:
              </span>
              <div className="flex gap-1.5">
                {['S', 'M', 'L', 'Standard'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Reviews (Screen 4 of User Reference Image) */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 shadow-sm space-y-2.5">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                Verified Buyer Reviews
              </span>
              
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 dark:text-stone-100">Vikram Mehta (FabIndia)</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                    Authentic double ikat craftsmanship. Direct procurement from master artisan ensures 100% verified GI tag.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900 dark:text-stone-100">Ananya Deshmukh</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                    Exquisite handloom texture with MoSJE seal of authenticity. Arrived safely in eco packaging.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Fixed Action Bar: BUY NOW & CHAT */}
          <div className="p-3 bg-white dark:bg-[#0B1120] border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleStartChatFromProduct(inspectProduct)}
              className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title="Chat with Artisan"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => {
                onBuyNow(inspectProduct);
                handleCloseInspect();
              }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[#C85A32] hover:opacity-95 text-stone-950 font-black text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-stone-950" />
              <span>BUY NOW • ₹{inspectProduct.pricing.suggestedRetailPrice.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: PROFILE & SETTINGS (When activeTab === 'profile')                */}
      {/* ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-16">
          {/* Top Curved Coral / Pink Header Banner (Screen 2 of User Reference Image) */}
          <div className="bg-gradient-to-b from-rose-500 to-pink-600 text-white pt-6 pb-6 px-6 rounded-b-[36px] shadow-md text-center relative shrink-0">
            {/* Avatar Circle */}
            <div className="w-18 h-18 mx-auto rounded-full bg-white p-1 shadow-lg overflow-hidden border-2 border-white/80">
              <img
                src={currentUser?.avatarUrl || CURRENT_ARTISAN.avatarUrl}
                alt="User Profile"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <h3 className="font-extrabold text-base mt-2 text-white">
              {currentUser?.name || CURRENT_ARTISAN.name}
            </h3>
            <p className="text-xs text-rose-100 font-mono">
              {currentUser?.beneficiaryId || CURRENT_ARTISAN.beneficiaryId}
            </p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-bold uppercase">
              {role === 'artisan' ? 'Master Artisan' : 'Institutional Buyer'}
            </span>
          </div>

          {/* Menu Items with Horizontal Dividers & Right Chevrons (Screen 2 Reference) */}
          <div className="px-4 py-3 divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            
            {/* Switch Role */}
            <button
              onClick={() => setRole(role === 'artisan' ? 'buyer' : 'artisan')}
              className="w-full py-3 flex items-center justify-between text-left font-bold text-stone-800 dark:text-stone-200 hover:text-[#C85A32] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🏛️</span>
                <div>
                  <span>Switch Mode</span>
                  <span className="block text-[10px] font-normal text-stone-400">
                    Current: {role === 'artisan' ? 'Artisan Studio' : 'Buyer Marketplace'}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Smart ID */}
            <button
              onClick={onOpenCardModal}
              className="w-full py-3 flex items-center justify-between text-left font-bold text-stone-800 dark:text-stone-200 hover:text-[#C85A32] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <div>
                  <span>MoSJE Smart ID Card</span>
                  <span className="block text-[10px] font-normal text-stone-400">
                    Official Artisan Registry Partner
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Language */}
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 font-bold text-stone-800 dark:text-stone-200">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Interface Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded-md text-xs font-bold text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
                <option value="ta">தமிழ்</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>

            {/* Light / Dark Mode Toggle */}
            {onToggleLightMode && (
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-bold text-stone-800 dark:text-stone-200">
                  {isLightOn ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-400" />}
                  <span>{isLightOn ? 'Light Mode' : 'Dark Mode'}</span>
                </div>
                <button
                  onClick={onToggleLightMode}
                  className="px-3 py-1 rounded-full text-[11px] font-bold bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[#C85A32] dark:text-amber-400"
                >
                  {isLightOn ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            )}

            {/* Tutorial */}
            <button
              onClick={onOpenTutorial}
              className="w-full py-3 flex items-center justify-between text-left font-bold text-stone-800 dark:text-stone-200 hover:text-[#C85A32] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span>How to Use SHILP-AI</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Login / Logout */}
            <button
              onClick={() => {
                if (currentUser) {
                  onLogout();
                } else {
                  setIsAuthScreenOpen(true);
                }
              }}
              className="w-full py-3 flex items-center justify-between text-left font-bold text-red-600 dark:text-red-400 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 text-red-500" />
                <span>{currentUser ? 'Sign Out / Logout' : 'Sign In / Register'}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-red-400" />
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: ARTISAN STUDIO & VOICE CATALOGER (When activeTab === 'studio')    */}
      {/* ========================================================================= */}
      {activeTab === 'studio' && (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-16 p-3 space-y-3">
          <div className="bg-gradient-to-r from-amber-500 to-[#C85A32] text-white p-4 rounded-2xl shadow-sm space-y-1">
            <h3 className="font-extrabold text-sm">Artisan AI Studio & Voice Cataloger</h3>
            <p className="text-[11px] text-amber-100">
              Zero-typing AI listing: speak in your dialect or snap a photo.
            </p>
          </div>

          <VoiceCatalogerModal
            language={language}
            onListingCreated={(newProd) => {
              onListingCreated?.(newProd);
              setActiveTab('shop');
            }}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: DIRECT MESSAGING SPACE (When activeTab === 'messages')            */}
      {/* ========================================================================= */}
      {activeTab === 'messages' && (
        <div className="flex-1 flex flex-col overflow-hidden pb-14 bg-white dark:bg-[#070B14]">
          
          {/* Customization Request Modal / Drawer */}
          {isCustomizationModalOpen && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 animate-fadeIn">
              <div className="bg-white dark:bg-[#0F172A] w-full max-w-sm rounded-2xl p-4 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-stone-900 dark:text-stone-100">
                    <Palette className="w-4 h-4 text-indigo-600" />
                    <span>Customization Quotation</span>
                  </div>
                  <button 
                    onClick={() => setIsCustomizationModalOpen(false)}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Preferred Color Shade:
                    </label>
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="e.g. Royal Indigo, Saffron, Natural Terracotta"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Dimensions / Length:
                    </label>
                    <input
                      type="text"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="e.g. 6.5 meters with blouse piece, 12 inches dia"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Order Units / Batch Size:
                    </label>
                    <input
                      type="number"
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(e.target.value)}
                      placeholder="1"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                      Special Weaver / Artisan Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Need authentic peacock motifs on pallu with gold zari..."
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setIsCustomizationModalOpen(false)}
                    className="flex-1 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendCustomizationQuote}
                    className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send Request</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW A: CONVERSATION LIST (When no thread is actively open) */}
          {!activeConversationId ? (
            <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-stone-900 text-white p-4 shadow-sm shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm">Direct Craft Inquiries</h3>
                      <p className="text-[10px] text-stone-300">Direct artisan-to-buyer negotiation</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/10">
                    {conversations.length} Active Chats
                  </span>
                </div>

                {/* Search Bar for Inquiries */}
                <div className="relative mt-2">
                  <Search className="w-3 h-3 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={chatSearchFilter}
                    onChange={(e) => setChatSearchFilter(e.target.value)}
                    placeholder="Search conversations by artisan or craft..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/10 text-white placeholder-stone-400 text-xs border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-300"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="divide-y divide-stone-100 dark:divide-stone-800 flex-1 overflow-y-auto no-scrollbar">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-14 h-14 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center text-2xl">
                      💬
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-800 dark:text-stone-200">No Inquiries Yet</h4>
                      <p className="text-[11px] text-stone-400 max-w-[220px] mx-auto mt-0.5">
                        Tap "Chat with Artisan" from any craft listing in the Market to start direct negotiation.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('shop')}
                      className="px-3 py-1.5 rounded-lg bg-[#C85A32] text-white text-xs font-bold shadow-xs"
                    >
                      Browse Marketplace
                    </button>
                  </div>
                ) : (
                  conversations
                    .filter((conv) => {
                      if (!chatSearchFilter.trim()) return true;
                      const q = chatSearchFilter.toLowerCase();
                      const other = role === 'buyer' ? conv.artisanName : conv.buyerName;
                      return other.toLowerCase().includes(q) || (conv.productTitle || '').toLowerCase().includes(q);
                    })
                    .map((conv) => {
                      const otherName = role === 'buyer' ? conv.artisanName : conv.buyerName;
                      const lastMsg = conv.messages[conv.messages.length - 1];

                      return (
                        <div
                          key={conv.id}
                          onClick={() => setActiveConversationId(conv.id)}
                          className="p-3.5 hover:bg-stone-50 dark:hover:bg-stone-900/40 cursor-pointer transition-colors flex items-center gap-3"
                        >
                          {/* Avatar with Online Dot */}
                          <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-[#C85A32] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                              {otherName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-stone-900"></span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                                {otherName}
                              </span>
                              <span className="text-[9px] text-stone-400 shrink-0 font-mono">
                                {conv.lastMessageAt}
                              </span>
                            </div>

                            {conv.productTitle && (
                              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold truncate block">
                                📦 {conv.productTitle}
                              </span>
                            )}

                            {lastMsg && (
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                                <span className="font-medium text-stone-700 dark:text-stone-300">
                                  {lastMsg.senderRole === role ? 'You: ' : ''}
                                </span>
                                {lastMsg.text}
                              </p>
                            )}
                          </div>

                          {/* Unread Badge */}
                          {conv.unreadCount > 0 && (
                            <span className="bg-[#C85A32] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          ) : (
            /* VIEW B: 1-ON-1 ACTIVE CHAT ROOM */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Chat Header */}
              <div className="bg-stone-900 text-white px-3 py-2.5 border-b border-stone-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveConversationId(null)}
                    className="p-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-[#C85A32] text-white font-bold text-xs flex items-center justify-center">
                    {(role === 'buyer' ? activeConversation?.artisanName : activeConversation?.buyerName)?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white leading-tight">
                      {role === 'buyer' ? activeConversation?.artisanName : activeConversation?.buyerName}
                    </h4>
                    <span className="text-[9.5px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Verified • Online
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded-full text-stone-300 font-mono">
                    MoSJE Direct
                  </span>
                </div>
              </div>

              {/* Linked Product Banner (if linked) */}
              {activeConversation?.productTitle && (
                <div className="bg-amber-50 dark:bg-stone-900/80 px-3 py-1.5 border-b border-amber-200/50 dark:border-stone-800 flex items-center justify-between text-xs shrink-0">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-[11px]">Craft Inquiry:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 truncate text-[11px]">
                      {activeConversation.productTitle}
                    </span>
                  </div>
                  {activeConversation.productId && (
                    <button
                      onClick={() => {
                        const prod = products.find(p => p.id === activeConversation.productId);
                        if (prod) setInspectProduct(prod);
                      }}
                      className="text-[10px] font-bold text-[#C85A32] dark:text-amber-400 hover:underline shrink-0"
                    >
                      View Craft
                    </button>
                  )}
                </div>
              )}

              {/* Message Bubbles Scroll Area */}
              <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-3 bg-[#FAF8F5] dark:bg-[#070B14]">
                {activeConversation?.messages.map((msg) => {
                  const isUser = msg.senderRole === role;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 shadow-2xs text-xs space-y-1.5 ${
                          isUser
                            ? 'bg-[#C85A32] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#0F172A] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-bl-xs'
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-75 flex items-center justify-between gap-3">
                          <span>{msg.senderName}</span>
                          <span className="font-mono text-[9px]">{msg.timestamp}</span>
                        </div>

                        <p className="leading-relaxed whitespace-pre-line text-xs font-normal">
                          {msg.text}
                        </p>

                        {/* Customization Request Card */}
                        {msg.customizationRequest && (
                          <div className={`p-2 rounded-xl text-[11px] space-y-1 border ${
                            isUser 
                              ? 'bg-black/20 border-white/20 text-white' 
                              : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                          }`}>
                            <span className="font-bold flex items-center gap-1">
                              <Palette className="w-3 h-3" />
                              Custom Specification Details:
                            </span>
                            {msg.customizationRequest.color && (
                              <div className="flex justify-between">
                                <span className="opacity-75">Shade:</span>
                                <span className="font-bold">{msg.customizationRequest.color}</span>
                              </div>
                            )}
                            {msg.customizationRequest.size && (
                              <div className="flex justify-between">
                                <span className="opacity-75">Dimensions:</span>
                                <span className="font-bold">{msg.customizationRequest.size}</span>
                              </div>
                            )}
                            {msg.customizationRequest.quantity && (
                              <div className="flex justify-between">
                                <span className="opacity-75">Units:</span>
                                <span className="font-bold">{msg.customizationRequest.quantity}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatScrollRef} />
              </div>

              {/* Quick Prompt Chips for Inquiry */}
              <div className="px-3 py-1.5 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] font-bold text-stone-400 shrink-0">Quick:</span>
                {[
                  '✨ 100% handwoven?',
                  '⏱️ Delivery timeframe?',
                  '📜 MoSJE GI Tag copy?',
                  '📦 Wholesale pricing discount?'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChatMessage(chip)}
                    className="whitespace-nowrap px-2 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium border border-stone-200 dark:border-stone-700 hover:border-[#C85A32] shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Fixed Bottom Input Bar */}
              <div className="p-2.5 bg-white dark:bg-[#0B1120] border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsCustomizationModalOpen(true)}
                  className="px-2.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold flex items-center gap-1 shrink-0"
                  title="Request Customization"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Custom</span>
                </button>

                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChatMessage();
                  }}
                  placeholder="Type message to artisan..."
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                />

                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={!chatInputText.trim()}
                  className="p-2.5 rounded-xl bg-[#C85A32] hover:bg-[#b04b26] disabled:opacity-40 text-white shadow-xs cursor-pointer shrink-0 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN: FULL AI COPILOT & FAIR PRICING (When activeTab === 'copilot')     */}
      {/* ========================================================================= */}
      {activeTab === 'copilot' && (
        <div className="flex-1 flex flex-col overflow-hidden pb-14 bg-white dark:bg-[#070B14]">
          
          {/* Copilot Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-stone-900 text-white p-3.5 shadow-sm shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-stone-900"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <span>SHILP Saathi (शिल्प साथी)</span>
                    <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono text-amber-200">
                      {hasGeminiApiKey() ? 'Gemini 2.0' : 'AI Saathi'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-emerald-200">
                    Bilingual Voice Assistant & Fair Wage Advisor
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowApiSettings(true)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Configure Gemini API Key"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Tab Selector: [ 🤖 AI Assistant ] | [ 📊 Fair Wage ML ] */}
            <div className="mt-2.5 flex rounded-lg bg-black/30 p-1">
              <button
                onClick={() => setCopilotSubTab('chat')}
                className={`flex-1 py-1 text-center font-bold text-xs rounded-md transition-all ${
                  copilotSubTab === 'chat' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100'
                }`}
              >
                🤖 AI Chat Copilot
              </button>
              <button
                onClick={() => setCopilotSubTab('pricing')}
                className={`flex-1 py-1 text-center font-bold text-xs rounded-md transition-all ${
                  copilotSubTab === 'pricing' ? 'bg-white text-emerald-900 shadow-xs' : 'text-emerald-100'
                }`}
              >
                📊 Fair Wage Calculator
              </button>
            </div>
          </div>

          {/* Sub-Tab 1: AI Chat Assistant */}
          {copilotSubTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Message Stream */}
              <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-3 bg-[#FAF8F5] dark:bg-[#070B14]">
                {copilotMessages.map((msg) => {
                  const isUser = msg.sender === 'artisan';
                  const isCurrentlyPlaying = isSpeakingMessageId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3 shadow-2xs text-xs space-y-1.5 ${
                          isUser
                            ? 'bg-stone-900 text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#0F172A] text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 rounded-bl-xs'
                        }`}
                      >
                        {/* Header: User / Copilot + Voice Listen Button */}
                        <div className="flex items-center justify-between text-[10px] opacity-80 border-b border-stone-100 dark:border-stone-800 pb-1">
                          <span className="font-bold flex items-center gap-1">
                            {isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-emerald-600" />}
                            {isUser ? 'You' : 'SHILP Copilot'}
                          </span>

                          {!isUser && (
                            <button
                              onClick={() => handleToggleCopilotVoice(msg)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9.5px] font-bold cursor-pointer transition-colors ${
                                isCurrentlyPlaying
                                  ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                              }`}
                            >
                              {isCurrentlyPlaying ? (
                                <>
                                  <Square className="w-2.5 h-2.5 fill-red-600" />
                                  <span>Stop Voice</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-2.5 h-2.5" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        {/* Body Text */}
                        <p className="leading-relaxed whitespace-pre-line text-xs font-normal">
                          {msg.text}
                        </p>

                        {/* Spoken Transcription Card */}
                        {!isUser && spokenTranscripts[msg.id] && (
                          <div className="mt-2 p-2 bg-amber-50 dark:bg-stone-900 rounded-lg border border-amber-200 dark:border-stone-700 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-[9.5px] font-bold text-amber-800 dark:text-amber-400">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                Audio Transcript:
                              </span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(spokenTranscripts[msg.id]);
                                  setCopiedMessageId(msg.id);
                                  setTimeout(() => setCopiedMessageId(null), 2000);
                                }}
                                className="text-stone-500 hover:text-stone-800"
                              >
                                {copiedMessageId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <p className="text-[10px] font-mono text-stone-700 dark:text-stone-300">
                              "{spokenTranscripts[msg.id]}"
                            </p>
                          </div>
                        )}

                        {/* Action Card: Ready-to-Publish Product */}
                        {msg.actionCard?.type === 'listing_ready' && msg.actionCard.data && (
                          <div className="mt-2 p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={msg.actionCard.data.enhancedImage || msg.actionCard.data.originalImage}
                                alt="Listing"
                                className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                              />
                              <div className="flex-1 min-w-0 text-xs">
                                <span className="text-[9px] font-bold text-emerald-600 uppercase block">Listing Ready</span>
                                <h4 className="font-bold truncate">{msg.actionCard.data.titleEn}</h4>
                                <span className="font-mono text-amber-600 font-bold">
                                  ₹{msg.actionCard.data.pricing?.suggestedRetailPrice?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                onListingCreated?.(msg.actionCard!.data);
                                setActiveTab('shop');
                              }}
                              className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1"
                            >
                              <span>Publish to Marketplace</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <span className="block text-[8.5px] opacity-60 text-right">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                })}

                {isCopilotLoading && (
                  <div className="flex items-start">
                    <div className="bg-white dark:bg-[#0F172A] border border-stone-200 dark:border-stone-800 rounded-2xl rounded-bl-none p-3 shadow-xs flex items-center space-x-2 text-stone-600 dark:text-stone-400 text-xs">
                      <Loader2 className="w-4 h-4 animate-spin text-[#C85A32]" />
                      <span>{hasGeminiApiKey() ? 'Gemini 2.0 Thinking...' : 'Copilot Analyzing...'}</span>
                    </div>
                  </div>
                )}
                <div ref={copilotBottomRef} />
              </div>

              {/* Quick Prompt Pills */}
              <div className="px-3 py-1.5 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <span className="text-[10px] font-bold text-stone-400 shrink-0">Topics:</span>
                {[
                  '💡 How to use app?',
                  '💰 Fair wage ₹750/day',
                  '🪪 MoSJE Smart ID',
                  '🤝 Wholesale tips',
                  '🏅 GI Tag certificate',
                  '📦 Courier packaging'
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendCopilotMessage(chip)}
                    className="whitespace-nowrap px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-medium border border-stone-200 dark:border-stone-700 hover:border-emerald-600 shadow-2xs"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Fixed Bottom Input with Mic & Send */}
              <div className="p-2.5 bg-white dark:bg-[#0B1120] border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleToggleCopilotRecording}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isCopilotRecording
                      ? 'bg-red-500 text-white border-red-600 animate-pulse'
                      : 'bg-stone-100 dark:bg-stone-900 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-emerald-600'
                  }`}
                  title={isCopilotRecording ? 'Stop Recording' : 'Voice Input'}
                >
                  {isCopilotRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendCopilotMessage();
                  }}
                  placeholder={language === 'hi' ? 'शिल्प सवाल या मार्गदर्शन पूछें...' : 'Ask copilot business questions...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />

                <button
                  onClick={() => handleSendCopilotMessage()}
                  disabled={!copilotInput.trim()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white shadow-xs cursor-pointer shrink-0 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Sub-Tab 2: Fair Wage ML Pricing Calculator */}
          {copilotSubTab === 'pricing' && (
            <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
              <DynamicPricingCard language={language} />
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: HOME & EXPLORE (When activeTab === 'shop')                       */}
      {/* Exact Match to Screen 3 of User Reference Image with Video & Atlas        */}
      {/* ========================================================================= */}
      {activeTab === 'shop' && (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-16">
          
          {/* ===================================================================== */}
          {/* HERO SECTION VIDEO IN MOBILE APPLICATION                               */}
          {/* ===================================================================== */}
          <div className="relative w-full h-[210px] overflow-hidden bg-[#0A0807] text-white shrink-0 shadow-md">
            
            {/* HTML5 Craft Video */}
            <video
              ref={heroVideoRef}
              key={currentHeroProfile.localSrc}
              autoPlay
              muted={isHeroMuted}
              loop
              playsInline
              poster={currentHeroProfile.poster}
              className="w-full h-full object-cover object-center transform scale-[1.01] brightness-[0.88] contrast-[1.05]"
            >
              <source src={currentHeroProfile.localSrc} type="video/mp4" />
              <source src={currentHeroProfile.remoteSrc} type="video/mp4" />
            </video>

            {/* Dark Scrim Gradient for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 z-10 pointer-events-none" />

            {/* Top Interactive Controls Row */}
            <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between">
              {/* MoSJE Badge */}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-200">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>MoSJE Verified Registry</span>
              </div>

              {/* Video Switcher & Audio Controls */}
              <div className="flex items-center gap-1.5">
                {/* Switch Weaving vs Pottery */}
                <div className="bg-black/60 backdrop-blur-md p-0.5 rounded-full border border-white/20 flex items-center">
                  <button
                    onClick={() => handleSwitchHeroVideo('textiles')}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                      activeHeroVideoKey === 'textiles' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-white'
                    }`}
                  >
                    🧵 Weave
                  </button>
                  <button
                    onClick={() => handleSwitchHeroVideo('pottery')}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all cursor-pointer ${
                      activeHeroVideoKey === 'pottery' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-white'
                    }`}
                  >
                    🏺 Clay
                  </button>
                </div>

                {/* Sound Toggle */}
                <button
                  onClick={handleToggleHeroAudio}
                  className="p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:text-amber-300 transition-colors cursor-pointer"
                  title={isHeroMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isHeroMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* Bottom Hero Center Title: Solid Luminous Bright White "SHILP-AI" */}
            <div className="absolute bottom-3 inset-x-3 z-20 text-center pointer-events-none select-none">
              <h1 className="text-2xl font-black tracking-tight uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                <span className="text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]">SHILP</span>
                <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] mx-1">-</span>
                <span className="text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.6)]">AI</span>
              </h1>
              <p className="text-[10px] font-medium text-amber-200/90 mt-1 tracking-wider uppercase drop-shadow-sm">
                शिल्प • विरासत • DIRECT ARTISAN MARKETPLACE
              </p>
            </div>

          </div>

          {/* Top Cyan / Sky-Blue Curved Header with Search Pill (Screen 3 Reference) */}
          <div className="bg-gradient-to-b from-cyan-500 to-teal-600 text-white pt-3 pb-4 px-4 rounded-b-[24px] shadow-md relative shrink-0">
            
            {/* Top Row: App Title & Quick Mode Switch */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                <span className="font-bold text-xs tracking-wider uppercase text-white drop-shadow-sm">
                  Catalog Explorer
                </span>
              </div>

              <button
                onClick={() => setRole(role === 'artisan' ? 'buyer' : 'artisan')}
                className="px-2.5 py-0.5 rounded-full bg-black/20 text-white text-[10px] font-bold border border-white/20"
              >
                {role === 'artisan' ? 'Artisan Mode' : 'Buyer Mode'}
              </button>
            </div>

            {/* Rounded Pill Search Input (Exact match to Screen 3 search bar) */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Indian crafts, sarees, pottery..."
                className="w-full pl-8.5 pr-8 py-2 rounded-full bg-white text-stone-900 placeholder-stone-400 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="p-3.5 space-y-4">
            
            {/* 6 Squircle Colorful Category Tiles (Exact Match to Screen 3 Reference) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-stone-800 dark:text-stone-200">
                  Heritage Craft Domains
                </span>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-[10px] font-bold text-[#C85A32] hover:underline"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* 2 Columns x 3 Rows Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {MOBILE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`${cat.bgColor} ${cat.textColor} p-3 rounded-2xl shadow-sm text-left flex flex-col justify-between h-20 transition-all cursor-pointer relative overflow-hidden ${
                        isSelected ? 'ring-3 ring-stone-900 dark:ring-white scale-102' : 'hover:opacity-95'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{cat.icon}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-white text-stone-900 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs leading-none">{cat.name}</div>
                        <div className="text-[9.5px] opacity-85 mt-0.5 leading-none">{cat.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Craft Atlas Banner Button */}
            <div className="bg-white dark:bg-[#0F172A] rounded-2xl p-3 border border-stone-200 dark:border-stone-800 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-[#8B1D1D] dark:text-red-400 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100">National Craft Atlas</h4>
                  <p className="text-[10px] text-stone-400">Explore GI clusters on India Map</p>
                </div>
              </div>
              <button
                onClick={() => setShowAtlas(!showAtlas)}
                className="px-3 py-1.5 rounded-lg bg-[#8B1D1D] text-white text-[11px] font-bold shadow-xs cursor-pointer"
              >
                {showAtlas ? 'Hide Map' : 'Open Atlas'}
              </button>
            </div>

            {/* Expandable Craft Atlas */}
            {showAtlas && (
              <div className="bg-white dark:bg-[#0F172A] rounded-2xl border border-stone-200 dark:border-stone-800 p-2 shadow-sm animate-fadeIn">
                <CraftAtlasExplorer
                  onSelectStateFromAtlas={(st) => {
                    setSearchQuery(st);
                    setShowAtlas(false);
                  }}
                />
              </div>
            )}

            {/* Verified Artifacts Feed: 2-Column Mobile Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-stone-800 dark:text-stone-200">
                  Verified Crafts ({filteredProducts.length})
                </span>
                <span className="text-[10px] text-stone-400">MoSJE Certified</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleOpenProduct(product)}
                    className="bg-white dark:bg-[#0F172A] rounded-xl border border-stone-200 dark:border-stone-800 p-2 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="relative aspect-[4/4.5] rounded-lg overflow-hidden bg-stone-50 dark:bg-stone-900 flex items-center justify-center mb-1.5">
                        <img
                          src={product.enhancedImageUrl || product.enhancedImage || product.originalImageUrl}
                          alt={product.titleEn}
                          className="w-full h-full object-contain p-1"
                        />
                        {product.giCertified && (
                          <span className="absolute top-1 left-1 bg-stone-900/90 text-amber-300 text-[8px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                            <Award className="w-2 h-2" />
                            GI
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-[11px] text-stone-900 dark:text-stone-100 line-clamp-1 leading-snug group-hover:text-[#C85A32] transition-colors">
                        {product.titleEn}
                      </h4>
                      <p className="text-[9.5px] text-stone-400 truncate mt-0.5">
                        {product.artisanName}
                      </p>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-stone-100 dark:border-stone-800 flex items-baseline justify-between">
                      <span className="text-[9px] text-stone-400">MSRP</span>
                      <span className="font-black text-xs text-[#C85A32] dark:text-amber-400">
                        ₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5-TAB BOTTOM NAVIGATION BAR (Market, Messages, Copilot, Studio, Profile)   */}
      {/* ========================================================================= */}
      <nav className="h-14 bg-white dark:bg-[#0B1120] border-t border-stone-200 dark:border-stone-800 px-3 flex items-center justify-around z-30 shrink-0">
        
        {/* Tab 1: Shop / Marketplace */}
        <button
          onClick={() => {
            setActiveTab('shop');
            setInspectProduct(null);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer ${
            activeTab === 'shop' ? 'text-[#C85A32] dark:text-amber-400 font-bold scale-105' : 'text-stone-400 hover:text-stone-700'
          }`}
          title="Marketplace"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Market</span>
        </button>

        {/* Tab 2: Direct Messaging Space */}
        <button
          onClick={() => {
            setActiveTab('messages');
            setInspectProduct(null);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer relative ${
            activeTab === 'messages' ? 'text-[#C85A32] dark:text-amber-400 font-bold scale-105' : 'text-stone-400 hover:text-stone-700'
          }`}
          title="Direct Messaging"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            {totalUnreadCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#C85A32] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                {totalUnreadCount}
              </span>
            )}
          </div>
          <span className="text-[9px] mt-0.5">Messages</span>
        </button>

        {/* Tab 3: Full AI Copilot */}
        <button
          onClick={() => {
            setActiveTab('copilot');
            setInspectProduct(null);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer ${
            activeTab === 'copilot' ? 'text-[#C85A32] dark:text-amber-400 font-bold scale-105' : 'text-stone-400 hover:text-stone-700'
          }`}
          title="SHILP Saathi & Fair Pricing"
        >
          <Bot className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Saathi</span>
        </button>

        {/* Tab 4: Artisan Studio */}
        <button
          onClick={() => {
            setActiveTab('studio');
            setInspectProduct(null);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer ${
            activeTab === 'studio' ? 'text-[#C85A32] dark:text-amber-400 font-bold scale-105' : 'text-stone-400 hover:text-stone-700'
          }`}
          title="AI Studio & Voice Catalog"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] mt-0.5">Studio</span>
        </button>

        {/* Tab 5: Menu / Profile */}
        <button
          onClick={() => {
            setActiveTab('profile');
            setInspectProduct(null);
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-[#C85A32] dark:text-amber-400 font-bold scale-105' : 'text-stone-400 hover:text-stone-700'
          }`}
          title="Profile & Settings"
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Profile</span>
        </button>

      </nav>

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={showApiSettings}
        onClose={() => setShowApiSettings(false)}
      />

    </div>
  );
};
