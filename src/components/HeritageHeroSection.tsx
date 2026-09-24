import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Layers, 
  ChevronRight, 
  ChevronLeft, 
  Compass,
  Film
} from 'lucide-react';
import { Language } from '../types';
import { useMobileMode } from './MobileFrame';

interface HeritageHeroSectionProps {
  language?: Language;
  onExploreCraft?: (category: string) => void;
  onLaunchStudio?: () => void;
  /** Optional overrides for margin artwork watermarks */
  leftMarginImage?: string;
  rightMarginImage?: string;
}

export interface CraftCategoryItem {
  id: string;
  name: string;
  hindiName: string;
  region: string;
  tradition: string;
  description: string;
  tags: string[];
  imageUrl: string;
  accentColor: string;
}

export const CRAFT_CATEGORIES: CraftCategoryItem[] = [
  {
    id: 'leather',
    name: 'Leather',
    hindiName: 'चर्म शिल्प',
    region: 'Kolhapur, Maharashtra & Shantiniketan, WB',
    tradition: 'Vegetable-Tanned Hand-Stitched Leathercraft',
    description: 'Heritage Kolhapuri braiding and Shantiniketan batik embossing crafted with organic tree bark tannins, zero synthetic chemicals, and multi-generational cobbler guild mastery.',
    tags: ['GI Tagged', 'Vegetable Dyes', 'Zero-Chemical'],
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
    accentColor: 'from-amber-800 to-stone-900',
  },
  {
    id: 'metalwork',
    name: 'Metalwork',
    hindiName: 'धातु शिल्प व डोकरा',
    region: 'Bastar, Chhattisgarh & Moradabad, UP',
    tradition: 'Lost-Wax Cire Perdue Bell Metal & Brass Etching',
    description: 'Ancient lost-wax bronze casting by indigenous Ghadwa tribal artisans, capturing primordial folk deities, sacred totems, and intricately perforated bell metal ware.',
    tags: ['4,000 Yr Technique', 'Tribal Guilds', 'Bell Metal'],
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=80',
    accentColor: 'from-amber-600 to-amber-950',
  },
  {
    id: 'natural-fibre',
    name: 'Natural Fibre Craft',
    hindiName: 'प्राकृतिक रेशा शिल्प',
    region: 'Madhubani, Bihar & Imphal, Manipur',
    tradition: 'Golden Sikki Grass & Kauna Water Reed Weaving',
    description: 'Luminous wild river grass and aquatic reed coiling transformed by women collectives into resilient storage vessels, ceremonial boxes, and eco-friendly lifestyle decor.',
    tags: ['Eco-Friendly', 'Women Co-ops', 'Biodegradable'],
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=900&q=80',
    accentColor: 'from-yellow-700 to-stone-900',
  },
  {
    id: 'paperwork',
    name: 'Paperwork',
    hindiName: 'कागज़ शिल्प व चित्रकथी',
    region: 'Sanganer, Rajasthan & Pinguli, Maharashtra',
    tradition: 'Kagzi Cotton Rag Mill & Chitrakathi Story Folios',
    description: 'Hand-pulled cotton rag sheets dyed with turmeric and pomegranate rinds, serving as the sacred canvas for the historic Pinguli Chitrakathi puppeteer tradition.',
    tags: ['Pinguli Tradition', 'Cotton Rag Pulp', 'Natural Pigments'],
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=900&q=80',
    accentColor: 'from-orange-700 to-stone-950',
  },
  {
    id: 'clay-terracotta',
    name: 'Clay & Terracotta',
    hindiName: 'मृत्तिका व टेराकोटा',
    region: 'Bankura, West Bengal & Longpi, Manipur',
    tradition: 'Sacred Clay Sculpting & Black Serpentine Stone Pottery',
    description: 'Fired earth sculpted on pedal wheels into iconic hollow Bankura votive horses and Longpi serpentine clay utensils polished with wild machi leaves without chemical glaze.',
    tags: ['Alluvial Clay', 'No-Kiln Blackware', 'GI Certified'],
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80',
    accentColor: 'from-red-800 to-amber-950',
  },
];

// Both User Videos (Option A: Textiles, Option B: Pottery)
const VIDEO_PROFILES = {
  textiles: {
    id: 'textiles',
    label: 'Option A: Handloom Saree Weaving',
    hindiLabel: 'हथकरघा बुनाई',
    localSrc: '/videos/hero-textile-craft.mp4',
    remoteSrc: 'https://v1.pinimg.com/videos/iht/expMp4/86/79/f9/8679f9803ae04ed603e07f140b095dbf_720w.mp4',
    poster: 'https://i.pinimg.com/originals/de/24/77/de24770350c103d6c1bea63bc767019c.jpg',
    credit: 'Pinterest: Indian Textile Making Aesthetic Video'
  },
  pottery: {
    id: 'pottery',
    label: 'Option B: Claywares & Pottery',
    hindiLabel: 'मृत्तिका शिल्प',
    localSrc: '/videos/hero-pottery-craft.mp4',
    remoteSrc: 'https://videos.pexels.com/video-files/7948427/7948427-hd_1280_720_24fps.mp4',
    poster: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1920&q=85',
    credit: 'Pexels: Collection of Claywares (7948426)'
  }
};

export const HeritageHeroSection: React.FC<HeritageHeroSectionProps> = ({
  language = 'en',
  onExploreCraft,
  onLaunchStudio,
  leftMarginImage = '/crafts/chitrakathi-margin-left.png',
  rightMarginImage = '/crafts/chitrakathi-margin-right.png',
}) => {
  const { isMobileMode } = useMobileMode();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeVideoKey, setActiveVideoKey] = useState<'textiles' | 'pottery'>('textiles');
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const currentProfile = VIDEO_PROFILES[activeVideoKey];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVideoSwitch = (key: 'textiles' | 'pottery') => {
    setActiveVideoKey(key);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  };

  // Programmatic Autoplay enforcement across browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [activeVideoKey]);

  return (
    /* HERO SECTION WRAPPER: Zero Padding (Flush Edge-to-Edge) */
    <div className="w-full max-w-full overflow-hidden p-0 m-0 bg-[#FAF8F5] dark:bg-[#070B14] transition-colors font-sans">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH VIDEO CONTAINER & DEDICATED MARGIN PANELS (0 PADDING) */}
      {/* ========================================================================= */}
      <div className={`relative w-full ${isMobileMode ? 'min-h-[480px] h-[500px]' : 'min-h-[580px] lg:min-h-[660px]'} rounded-none overflow-hidden bg-[#0A0807] text-stone-100 border-b border-amber-500/30 shadow-2xl flex flex-col justify-between items-center p-0 m-0`}>
        
        {/* LEFT MARGIN: Dedicated Side Panel (Hidden in mobile mode) */}
        <aside 
          aria-label="Pinguli Chitrakathi Left Margin Tapestry"
          className={`${isMobileMode ? 'hidden' : 'hidden xl:block'} absolute inset-y-0 left-0 w-[140px] 2xl:w-[160px] z-10 overflow-hidden bg-[#0A0807] border-r border-amber-500/30 shadow-2xl select-none`}
        >
          {/* Full-Height Authentic Chitrakathi Painting in Dedicated Margin */}
          <img
            src={leftMarginImage}
            alt="Pinguli Chitrakathi Tradition Painting"
            className="w-full h-full object-cover object-center select-none"
          />
        </aside>

        {/* RIGHT MARGIN: Dedicated Side Panel (Hidden in mobile mode) */}
        <aside 
          aria-label="Pinguli Chitrakathi Right Margin Tapestry"
          className={`${isMobileMode ? 'hidden' : 'hidden xl:block'} absolute inset-y-0 right-0 w-[140px] 2xl:w-[160px] z-10 overflow-hidden bg-[#0A0807] border-l border-amber-500/30 shadow-2xl select-none`}
        >
          {/* Full-Height Authentic Chitrakathi Painting in Dedicated Margin */}
          <img
            src={rightMarginImage}
            alt="Pinguli Chitrakathi Sacred Folk Motif"
            className="w-full h-full object-cover object-center select-none"
          />
        </aside>

        {/* CENTER VIDEO CONTAINER: Strictly Cut Between Margins on Desktop */}
        <div className={`absolute inset-y-0 ${isMobileMode ? 'left-0 right-0' : 'left-0 xl:left-[140px] 2xl:left-[160px] right-0 xl:right-[140px] 2xl:right-[160px]'} z-0 overflow-hidden pointer-events-none`}>
          <video
            ref={videoRef}
            key={currentProfile.localSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={currentProfile.poster}
            className="w-full h-full object-cover object-center transform scale-[1.01] filter brightness-[0.98] contrast-[1.05]"
          >
            <source src={currentProfile.localSrc} type="video/mp4" />
            <source src={currentProfile.remoteSrc} type="video/mp4" />
            Your browser does not support HTML5 video streaming.
          </video>

          {/* Gentle, Translucent Cinematic Scrim for Content Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 z-10" />
        </div>

        {/* ========================================================================= */}
        {/* CENTER HERO SECTION: SPEC 1 HERO TITLE ("SHILP-AI" Solid Luminous White) */}
        {/* ========================================================================= */}
        <div className={`relative z-20 max-w-4xl mx-auto text-center ${isMobileMode ? 'px-3 my-auto py-2' : 'px-4 sm:px-6 my-auto py-3'}`}>

          {/* Top MoSJE Classification Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center mb-1.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-950/75 border border-amber-500/40 shadow-[0_4px_25px_rgba(245,158,11,0.2)] backdrop-blur-md text-[11px] font-bold text-amber-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>MoSJE Verified Artisan Registry • Government Partner Portal</span>
            </div>
          </div>

          {/* HERO TITLE ("SHILP-AI"): Solid Luminous Bright White with High-Contrast Drop Shadow */}
          <div className={`${isMobileMode ? 'my-3' : 'my-6 sm:my-8'} relative flex flex-col items-center justify-center`}>
            {/* Ambient Background Glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-amber-600/35 via-[#c85a32]/35 to-amber-500/35 blur-3xl opacity-75 pointer-events-none rounded-full" />

            <h1 className={`relative ${isMobileMode ? 'text-[32px] sm:text-[36px]' : 'text-[44px] sm:text-[54px] md:text-[64px]'} font-black tracking-tighter uppercase select-none leading-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.98)]`}>
              <span className="text-white drop-shadow-[0_4px_25px_rgba(255,255,255,0.5)]">
                SHILP
              </span>
              <span className="text-amber-400 drop-shadow-[0_0_30px_rgba(245,158,11,0.95)] mx-1">
                -
              </span>
              <span className="text-white drop-shadow-[0_4px_25px_rgba(255,255,255,0.5)]">
                AI
              </span>
            </h1>

            {/* Devanagari Twin Script */}
            <div className="mt-2 flex items-center gap-2 sm:gap-3">
              <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-amber-400/80" />
              <span className={`${isMobileMode ? 'text-sm font-bold' : 'text-lg sm:text-xl md:text-2xl font-bold'} tracking-widest text-amber-200/90 font-serif drop-shadow-md`}>
                शिल्प • बुद्धिमत्ता
              </span>
              <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-amber-400/80" />
            </div>
          </div>

          {/* Tagline / Mission */}
          <p className={`max-w-2xl mx-auto ${isMobileMode ? 'text-xs line-clamp-2 px-2 mb-3' : 'text-sm sm:text-base px-4 mb-6'} text-stone-200 font-medium leading-relaxed text-balance drop-shadow-md`}>
            Multimodal AI for India's traditional artisans and weavers. 
            Smart cataloging, dialect translation, and direct market linkage without intermediaries.
          </p>

          {/* Action CTAs */}
          <div className={`flex ${isMobileMode ? 'flex-col w-full px-2 gap-2' : 'flex-col sm:flex-row gap-3'} items-center justify-center pt-1`}>
            <button
              onClick={() => onLaunchStudio?.()}
              className={`${isMobileMode ? 'w-full py-2.5 px-4 text-xs' : 'w-full sm:w-auto px-7 py-3.5 text-sm'} rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-[#c85a32] text-stone-950 font-black tracking-wide shadow-[0_10px_30px_rgba(245,158,11,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer`}
            >
              <span>Launch Artisan AI Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const lowerSection = document.getElementById('craft-showcase-section');
                lowerSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`${isMobileMode ? 'w-full py-2.5 px-4 text-xs' : 'w-full sm:w-auto px-6 py-3.5 text-sm'} rounded-2xl bg-stone-950/80 hover:bg-stone-900 text-stone-200 border border-stone-700/80 hover:border-amber-500/50 font-bold backdrop-blur-md transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Explore Craft Showcase</span>
            </button>
          </div>
        </div>

        {/* Video Switcher Bar (Option A: Textiles vs Option B: Pottery) */}
        <div className={`relative z-20 w-full max-w-5xl flex ${isMobileMode ? 'flex-col gap-2 py-2 px-3' : 'flex-col sm:flex-row gap-3 py-3.5 px-6'} items-center justify-between text-xs text-stone-400 border-t border-white/10`}>
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-stone-950/85 border border-stone-800 rounded-full p-1 backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-amber-400 ml-2" />
            <span className="text-[10px] sm:text-[11px] font-mono text-stone-400 mr-1 hidden sm:inline">Active Video:</span>
            
            <button
              onClick={() => handleVideoSwitch('textiles')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeVideoKey === 'textiles'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🧵 Weaving
            </button>

            <button
              onClick={() => handleVideoSwitch('pottery')}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeVideoKey === 'pottery'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              🏺 Pottery
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono text-stone-400 hidden md:inline">
              {currentProfile.credit}
            </span>

            <button
              onClick={toggleMute}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-stone-950/80 hover:bg-stone-900 text-stone-300 border border-stone-800 transition shadow-sm cursor-pointer"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              <span className="text-[10px] sm:text-[11px]">{isMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* LOWER SECTION: CONTAINER FOR DIVIDER & CRAFT SHOWCASE                     */}
      {/* ========================================================================= */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* SPEC 1: DIVIDER LINE (Clean horizontal rule with compact vertical margin)  */}
        <div className="w-full my-6 sm:my-8 relative flex items-center justify-center">
          {/* Hairline rule */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-stone-300 dark:via-stone-700 to-transparent" />
          {/* Centered Emblem */}
          <div className="absolute px-5 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#070B14] border border-stone-300 dark:border-stone-800 text-[10px] font-mono tracking-[0.25em] text-[#666666] dark:text-amber-400 flex items-center gap-2 shadow-xs">
            <span className="text-amber-600 dark:text-amber-500 text-xs">❖</span>
            <span>HERITAGE CRAFT DOMAINS</span>
            <span className="text-amber-600 dark:text-amber-500 text-xs">❖</span>
          </div>
        </div>


        {/* SPEC 4: CRAFT SHOWCASE SECTION & INTERACTIVE OVERLAPPING CAROUSEL        */}
        <section 
          id="craft-showcase-section"
          className="w-full space-y-6"
        >
          {/* Section Header & Navigation Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#C85A32] dark:text-amber-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C85A32] dark:text-amber-400">
                  Five Living Heritage Categories
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                Living Traditions & Master Guilds
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
                Explore authentic regional craft clusters digitized through SHILP-AI. 
                Select any discipline to browse verified master artisans and direct procurement listings.
              </p>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center space-x-2 self-start md:self-end">
              <button
                onClick={() => scrollCarousel('left')}
                className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500 transition shadow-sm cursor-pointer active:scale-95"
                aria-label="Previous Craft Card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500 transition shadow-sm cursor-pointer active:scale-95"
                aria-label="Next Craft Card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CRAFT_CATEGORIES.map((craft, idx) => (
              <button
                key={craft.id}
                onClick={() => {
                  setActiveCategoryIndex(idx);
                  if (carouselContainerRef.current) {
                    const cardWidth = 350;
                    carouselContainerRef.current.scrollTo({
                      left: idx * cardWidth,
                      behavior: 'smooth',
                    });
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  activeCategoryIndex === idx
                    ? 'bg-[#C85A32] dark:bg-amber-500 text-white dark:text-stone-950 font-bold shadow-xs'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800'
                }`}
              >
                <span>{craft.name}</span>
                <span className="text-[10px] opacity-75 font-serif">({craft.hindiName})</span>
              </button>
            ))}
          </div>

          {/* Overlapping Card Carousel Container */}
          <div
            ref={carouselContainerRef}
            className="flex items-stretch gap-5 overflow-x-auto no-scrollbar pt-2 pb-6 px-1 scroll-smooth snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {CRAFT_CATEGORIES.map((craft, idx) => {
              const isActive = activeCategoryIndex === idx;

              return (
                <div
                  key={craft.id}
                  onClick={() => {
                    setActiveCategoryIndex(idx);
                    onExploreCraft?.(craft.name);
                  }}
                  className={`relative flex-shrink-0 ${isMobileMode ? 'w-[270px]' : 'w-[290px] sm:w-[330px] md:w-[360px]'} rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 transform snap-start border group ${
                    isActive
                      ? 'scale-[1.02] border-[#C85A32] dark:border-amber-500 shadow-[0_15px_35px_rgba(200,90,50,0.18)] bg-white dark:bg-stone-900'
                      : 'border-stone-200 dark:border-stone-800/90 bg-white/80 dark:bg-stone-900/60 hover:scale-[1.01] hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  {/* Header Image with Lazy Loading */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-900">
                    <img
                      src={craft.imageUrl}
                      alt={`${craft.name} Indian craft`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${craft.accentColor} mix-blend-multiply opacity-50`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                    {/* Region Pill */}
                    <div className="absolute top-3.5 left-3.5 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                        {craft.region}
                      </span>
                    </div>

                  {/* Number Badge */}
                  <div className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-stone-950/80 backdrop-blur-md border border-stone-700 flex items-center justify-center text-[11px] font-mono font-bold text-amber-400">
                    0{idx + 1}
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <div className="text-[11px] font-serif text-amber-300/90 tracking-wide">
                      {craft.hindiName}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {craft.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-mono text-[#C85A32] dark:text-amber-400 font-semibold uppercase tracking-wider">
                      {craft.tradition}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3">
                      {craft.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {craft.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                      Verified Artisans
                    </span>
                    <div className="flex items-center text-[#C85A32] dark:text-amber-400 font-bold gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Listings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Monograph Spotlight: Pinguli Chitrakathi Tradition */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-amber-500/25 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-700 dark:text-stone-300">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <span className="text-[#C85A32] dark:text-amber-400 font-serif text-lg font-bold">चित्र</span>
            </div>
            <div>
              <span className="font-bold text-stone-900 dark:text-amber-300 font-mono text-[11px] uppercase tracking-wider block">
                Heritage Spotlight
              </span>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Chitrakathi painting (specifically, the Pinguli Chitrakathi tradition from Maharashtra) preserves 17th-century mythological epics through handmade visual folios and string puppetry by the Thakar artisan community.
              </p>
            </div>
          </div>
          <button
            onClick={() => onExploreCraft?.('Paperwork')}
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-amber-300 border border-stone-300 dark:border-amber-500/30 font-bold text-xs whitespace-nowrap transition cursor-pointer shrink-0"
          >
            Explore Chitrakathi Archive
          </button>
        </div>

      </section>
      </div>

    </div>
  );
};
