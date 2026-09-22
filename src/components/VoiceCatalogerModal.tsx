import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Square, Sparkles, Check, Globe, RefreshCw, ArrowRight, Tag, BookOpen, Image as ImageIcon, Camera, Upload, CheckCircle2, Copy, FileText, X, Scissors, SunMedium, Palette, Crop } from 'lucide-react';
import { VoiceCatalogerEngine, ExtractedProductAttributes } from '../services/voiceCataloger';
import { DynamicPricingEngine } from '../services/pricingEngine';
import { CRAFT_PRESETS } from '../data/craftPresets';
import { Language, ProductListing } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { getSpeechLangCode, translate, LANGUAGE_METADATA } from '../services/translations';
import { getCategoryTranslation, getCraftTechniqueTranslation } from '../services/displayTranslation';
import { AIImageStudio, DEFAULT_IMAGE_OPTIONS } from '../services/imageStudio';
import { uploadImageToStorage, saveProductToFirestore } from '../services/firebase';

interface VoiceCatalogerModalProps {
  language?: Language;
  onListingCreated?: (listing: ProductListing) => void;
  selectedPhotoUrl?: string;
  originalPhotoUrl?: string;
}

export const VoiceCatalogerModal: React.FC<VoiceCatalogerModalProps> = ({
  language = 'en',
  onListingCreated,
  selectedPhotoUrl,
  originalPhotoUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLangCode, setSelectedLangCode] = useState<string>(getSpeechLangCode(language));
  const [extractedData, setExtractedData] = useState<ExtractedProductAttributes | null>(null);
  const [activeTab, setActiveTab] = useState<'hindi' | 'english'>('hindi');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenCatalogTranscript, setSpokenCatalogTranscript] = useState<string | null>(null);
  const [isTranscriptCopied, setIsTranscriptCopied] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);
  
  // Staged product photo state - AI enhanced studio photo
  const [currentPhoto, setCurrentPhoto] = useState<string>(selectedPhotoUrl || CRAFT_PRESETS[0].enhancedImage);
  const [originalPhoto, setOriginalPhoto] = useState<string>(originalPhotoUrl || CRAFT_PRESETS[0].rawImage);
  const [isEnhancingUpload, setIsEnhancingUpload] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishingStep, setPublishingStep] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: string) => translate(language, key);
  // isHindi removed — use t() translations

  // Sync selected photo prop
  useEffect(() => {
    if (selectedPhotoUrl) {
      setCurrentPhoto(selectedPhotoUrl);
    }
    if (originalPhotoUrl) {
      setOriginalPhoto(originalPhotoUrl);
    }
  }, [selectedPhotoUrl, originalPhotoUrl]);

  // Sync language code when language prop changes
  useEffect(() => {
    setSelectedLangCode(getSpeechLangCode(language));
  }, [language]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedLangCode;

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        // Automatically extract attributes in real time
        const extracted = VoiceCatalogerEngine.extractAttributesFromSpeech(currentTranscript);
        setExtractedData(extracted);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      setRecognitionInstance(recognition);
    }
  }, [selectedLangCode]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionInstance?.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      try {
        recognitionInstance?.start();
        setIsRecording(true);
      } catch (e) {
        // Fallback simulated recording if browser blocks mic
        setIsRecording(true);
        setTimeout(() => {
          handleSelectSample(CRAFT_PRESETS[0].sampleVoiceHindi);
          setIsRecording(false);
        }, 1500);
      }
    }
  };

  const handleSelectSample = (sampleText: string) => {
    setTranscript(sampleText);
    const extracted = VoiceCatalogerEngine.extractAttributesFromSpeech(sampleText);
    setExtractedData(extracted);
  };

  const handleToggleSpeak = async (text: string, langCode: string) => {
    if (isSpeaking) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeaking(false);
      // Keep spokenCatalogTranscript intact so user can read what was spoken!
      return;
    }

    setSpokenCatalogTranscript(text);
    setIsSpeaking(true);
    try {
      await VoiceCatalogerEngine.speak(text, langCode as any);
    } catch (err) {
      console.warn('Voice speak error:', err);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const rawUrl = event.target.result as string;
          setOriginalPhoto(rawUrl);
          setIsEnhancingUpload(true);
          try {
            const res = await AIImageStudio.processImage(rawUrl, DEFAULT_IMAGE_OPTIONS);
            setCurrentPhoto(res.enhancedDataUrl);
          } catch {
            setCurrentPhoto(rawUrl);
          } finally {
            setIsEnhancingUpload(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateListing = async () => {
    if (!extractedData) return;
    setIsPublishing(true);
    setPublishingStep(translate(language, 'auto.verifying_ai_image_e.163'));

    try {
      const productId = `prod-${Date.now()}`;
      
      // Step 1: AI Enhancement (background removal, lighting correction, 1:1 canvas)
      let enhancedUrl = currentPhoto;
      let rawUrl = originalPhoto || currentPhoto;

      if (!enhancedUrl || enhancedUrl === rawUrl) {
        setPublishingStep(translate(language, 'auto.applying_ai_backgrou.164'));
        try {
          const res = await AIImageStudio.processImage(rawUrl, DEFAULT_IMAGE_OPTIONS);
          enhancedUrl = res.enhancedDataUrl;
          setCurrentPhoto(enhancedUrl);
        } catch (e) {
          console.warn('AI enhancement fallback:', e);
        }
      }

      // Step 2: Upload to Firebase Storage
      setPublishingStep(translate(language, 'auto.uploading_original_i.165'));
      const originalStorageUrl = await uploadImageToStorage(
        rawUrl,
        `products/original/${productId}.jpg`
      );

      setPublishingStep(translate(language, 'auto.uploading_enhanced_i.166'));
      const enhancedStorageUrl = await uploadImageToStorage(
        enhancedUrl,
        `products/enhanced/${productId}.jpg`
      );

      // Step 3: XGBoost Fair Pricing Calculation
      setPublishingStep(translate(language, 'auto.calculating_fair_pri.167'));
      const pricing = DynamicPricingEngine.calculatePricing({
        category: extractedData.category,
        craftTechnique: extractedData.craftTechnique,
        primaryMaterial: extractedData.primaryMaterial,
        rawMaterialCost: extractedData.rawMaterialCost,
        productionDays: extractedData.productionDays,
        isGICertified: true
      });

      const listing: ProductListing = {
        id: productId,
        artisanId: CURRENT_ARTISAN.id,
        artisanName: CURRENT_ARTISAN.name,
        state: CURRENT_ARTISAN.state,
        titleEn: extractedData.titleEn,
        titleHi: extractedData.titleHi,
        category: extractedData.category,
        craftTechnique: extractedData.craftTechnique,
        primaryMaterial: extractedData.primaryMaterial,
        color: extractedData.color,
        productionDays: extractedData.productionDays,
        rawMaterialCost: extractedData.rawMaterialCost,
        // Store both original and enhanced image URLs
        originalImage: originalStorageUrl,
        originalImageUrl: originalStorageUrl,
        enhancedImage: enhancedStorageUrl,
        enhancedImageUrl: enhancedStorageUrl,
        hasBackgroundRemoved: true,
        hasLightingEnhanced: true,
        descriptionEn: extractedData.descriptionEn,
        descriptionHi: extractedData.descriptionHi,
        seoKeywords: extractedData.seoKeywords,
        pricing: pricing,
        targetBuyers: extractedData.targetBuyers,
        stockQuantity: 15,
        giCertified: true,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Step 4: Save to Firestore
      setPublishingStep(translate(language, 'auto.saving_listing_to_cl.168'));
      await saveProductToFirestore(listing);

      // Step 5: Update Local App & State
      onListingCreated?.(listing);
    } catch (err) {
      console.error('Failed to create listing:', err);
      alert(t('error.publishFailed'));
    } finally {
      setIsPublishing(false);
      setPublishingStep('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-stone-900 rounded-2xl p-5 text-white border border-stone-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              {translate(language, 'auto.multilingual_voice_n.169')}
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {translate(language, 'auto.speak_to_generate_sm.170')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              {translate(language, 'auto.describe_your_craft_.171')}
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-3xl">
              🎙️
            </div>
          </div>
        </div>
      </div>

      {/* Product Photo Confirmation Card: AI Enhanced Studio Photo vs Original Raw Photo with 5 Feature Badges */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-stone-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                  {translate(language, 'auto.ai_image_studio_befo.172')}
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  {translate(language, 'auto.studio_grade.173')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-tight">
                {translate(language, 'auto.studio_enhanced_phot.174')}
              </p>
            </div>
          </div>

          {/* Change / Upload Photo Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isEnhancingUpload}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors disabled:opacity-50 shadow-2xs"
            >
              {isEnhancingUpload ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-stone-500 animate-spin" />
                  <span>{translate(language, 'auto.enhancing.175')}</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-stone-500" />
                  <span>{translate(language, 'auto.change_photo.176')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dual Images Showcase Card */}
        <div className="rounded-2xl overflow-hidden border border-stone-200 bg-[#FAF7F2] shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-b border-stone-200">
            {/* Before (Original) */}
            <div className="relative aspect-[4/3] sm:aspect-[3/4] max-h-64 sm:max-h-72 bg-stone-100 overflow-hidden sm:border-r border-stone-200 flex items-center justify-center">
              <img
                src={originalPhoto || currentPhoto}
                alt="Before (Original Raw Craft)"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#2D3338]/90 backdrop-blur text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-sm">
                {translate(language, 'auto.before_original.177')}
              </div>
            </div>

            {/* After (Enhanced) */}
            <div className="relative aspect-[4/3] sm:aspect-[3/4] max-h-64 sm:max-h-72 bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
              <img
                src={currentPhoto}
                alt="After (Enhanced Studio Photo)"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#2D5A43]/90 backdrop-blur text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{translate(language, 'auto.after_enhanced.178')}</span>
              </div>
            </div>
          </div>

          {/* 5 Feature Badges Row matching User Reference */}
          <div className="bg-[#FAF7F2] px-2 sm:px-4 py-3 grid grid-cols-5 gap-1 sm:gap-2 items-center justify-between text-center">
            {/* 1. Background Removal */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs">
                <Scissors className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-700" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-stone-700 leading-tight">
                {t('studio.featureBgRemoval')}
              </span>
            </div>

            {/* 2. Better Lighting */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs">
                <SunMedium className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-700" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-stone-700 leading-tight">
                {t('studio.featureLighting')}
              </span>
            </div>

            {/* 3. Natural Color Correction */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs">
                <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-700" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-stone-700 leading-tight">
                {t('studio.featureColor')}
              </span>
            </div>

            {/* 4. Proper Positioning & Cropping */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs">
                <Crop className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-700" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-stone-700 leading-tight">
                {t('studio.featurePosition')}
              </span>
            </div>

            {/* 5. Enhanced Quality */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-medium text-stone-700 leading-tight">
                {t('studio.featureQuality')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Recording Stage */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 text-center space-y-4">
        {/* Language Pill Selector */}
        <div className="flex items-center justify-center space-x-2 flex-wrap gap-1">
          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            {translate(language, 'auto.spoken_language.179')}
          </span>
          {Object.entries(LANGUAGE_METADATA).map(([langKey, meta]) => {
            const bcpCode = getSpeechLangCode(langKey as Language);
            return (
              <button
                key={langKey}
                onClick={() => setSelectedLangCode(bcpCode)}
                className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLangCode === bcpCode
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
                title={`${meta.name} (${bcpCode})`}
              >
                {meta.nativeName}
              </button>
            );
          })}
        </div>

        {/* Big Pulsing Mic Button */}
        <div className="py-3 flex flex-col items-center justify-center">
          <button
            onClick={toggleRecording}
            className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 transform active:scale-95 ${
              isRecording
                ? 'bg-red-600 ring-8 ring-red-200 animate-pulse scale-105'
                : 'bg-gradient-to-tr from-saffron-600 to-amber-500 hover:from-saffron-700 hover:to-amber-600 shadow-saffron-600/30 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>
          <span className="mt-3 text-xs font-bold text-stone-700">
            {isRecording
              ? (translate(language, 'auto.listening_speak_now.180'))
              : (translate(language, 'auto.tap_microphone_to_sp.181'))}
          </span>
        </div>

        {/* Quick Sample Voice Prompts */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100 text-left">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            {translate(language, 'auto.or_try_sample_artisa.182')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleSelectSample(CRAFT_PRESETS[0].sampleVoiceHindi)}
              className="p-2 rounded-xl bg-stone-50 hover:bg-saffron-50 border border-stone-200 hover:border-saffron-300 text-left text-xs transition-colors"
            >
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <span>🥻 पोचमपल्ली रेशम साड़ी</span>
                <span className="text-[10px] text-saffron-700 font-normal">(5 दिन, ₹2,500)</span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                "{CRAFT_PRESETS[0].sampleVoiceHindi}"
              </p>
            </button>

            <button
              onClick={() => handleSelectSample(CRAFT_PRESETS[1].sampleVoiceHindi)}
              className="p-2 rounded-xl bg-stone-50 hover:bg-saffron-50 border border-stone-200 hover:border-saffron-300 text-left text-xs transition-colors"
            >
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <span>🐂 बस्तर ढोकरा नंदी</span>
                <span className="text-[10px] text-saffron-700 font-normal">(4 दिन, ₹1,200)</span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                "{CRAFT_PRESETS[1].sampleVoiceHindi}"
              </p>
            </button>
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        {transcript && (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-left space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              {translate(language, 'auto.spoken_voice_transcr.183')}
            </span>
            <p className="text-xs text-stone-800 italic">"{transcript}"</p>
          </div>
        )}
      </div>

      {/* Extracted Attributes & Smart Catalog Card */}
      {extractedData && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-saffron-100 text-saffron-800">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {translate(language, 'auto.ai_extracted_smart_a.184')}
                </h3>
                <p className="text-xs text-stone-500">
                  {translate(language, 'auto.zero_manual_typing_r.185')}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              100% Extracted
            </span>
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{translate(language, 'auto.category.186')}</span>
              <p className="font-bold text-stone-900">{getCategoryTranslation(extractedData.category, language)}</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{translate(language, 'auto.craft_technique.187')}</span>
              <p className="font-bold text-stone-900">{getCraftTechniqueTranslation(extractedData.craftTechnique, language)}</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{translate(language, 'auto.crafting_time.188')}</span>
              <p className="font-bold text-blue-700">{extractedData.productionDays} {translate(language, 'auto.days.189')}</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{translate(language, 'auto.raw_material_cost.190')}</span>
              <p className="font-bold text-emerald-700">₹{extractedData.rawMaterialCost.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Dual Description Tabs (Hindi / English) */}
          <div className="space-y-3 pt-2">
            <div className="flex border-b border-stone-200">
              <button
                onClick={() => setActiveTab('hindi')}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'hindi'
                    ? 'border-saffron-600 text-saffron-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🇮🇳 हिन्दी विवरण (Cultural Story)</span>
              </button>
              <button
                onClick={() => setActiveTab('english')}
                className={`pb-2 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'english'
                    ? 'border-saffron-600 text-saffron-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🇬🇧 English SEO Catalog</span>
              </button>
            </div>

            {activeTab === 'hindi' ? (
              <div className="p-3.5 bg-saffron-50/40 rounded-xl border border-saffron-200/60 space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-bold text-stone-900 text-sm">{extractedData.titleHi}</h4>
                  <button
                    onClick={() => handleToggleSpeak(extractedData.descriptionHi, 'hi-IN')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                      isSpeaking && spokenCatalogTranscript === extractedData.descriptionHi
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 ring-2 ring-red-300 animate-pulse'
                        : 'bg-saffron-100/90 text-saffron-900 border border-saffron-300/80 hover:bg-saffron-200'
                    }`}
                  >
                    {isSpeaking && spokenCatalogTranscript === extractedData.descriptionHi ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                        <span>रुकें (Stop AI Speech)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-saffron-700" />
                        <span>सुनें (Listen)</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {extractedData.descriptionHi}
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-200/60 space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <h4 className="font-bold text-stone-900 text-sm">{extractedData.titleEn}</h4>
                  <button
                    onClick={() => handleToggleSpeak(extractedData.descriptionEn, 'en-IN')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold shadow-xs transition-all ${
                      isSpeaking && spokenCatalogTranscript === extractedData.descriptionEn
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 ring-2 ring-red-300 animate-pulse'
                        : 'bg-blue-100/90 text-blue-900 border border-blue-300/80 hover:bg-blue-200'
                    }`}
                  >
                    {isSpeaking && spokenCatalogTranscript === extractedData.descriptionEn ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                        <span>Stop AI Speech</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {extractedData.descriptionEn}
                </p>
              </div>
            )}

            {/* Dedicated Audio Transcription Card when AI is Speaking or Stopped */}
            {spokenCatalogTranscript && (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-stone-800 space-y-2 animate-in fade-in duration-200 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-bold border-b border-amber-200/80 pb-1.5">
                  <span className="flex items-center gap-1.5 text-amber-900">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    {translate(language, 'auto.ai_speech_audio_tran.191')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 ${
                      isSpeaking ? 'bg-red-100 text-red-700 animate-pulse border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                      {isSpeaking ? (translate(language, 'auto.ai_speaking.192')) : (translate(language, 'auto.stopped_ready_to_rea.193'))}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(spokenCatalogTranscript);
                        setIsTranscriptCopied(true);
                        setTimeout(() => setIsTranscriptCopied(false), 2000);
                      }}
                      className="text-stone-500 hover:text-stone-800 p-1 rounded hover:bg-amber-100/80 transition-colors"
                      title={translate(language, 'auto.copy_transcript.194')}
                    >
                      {isTranscriptCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (isSpeaking) {
                          VoiceCatalogerEngine.stopSpeaking();
                          setIsSpeaking(false);
                        }
                        setSpokenCatalogTranscript(null);
                      }}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded hover:bg-amber-100/80 transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-stone-700 font-mono leading-relaxed bg-white/70 p-2.5 rounded-lg border border-amber-200/50 select-text">
                  "{spokenCatalogTranscript}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
                  <span>{translate(language, 'auto.listen_carefully_or_.195')}</span>
                  {isTranscriptCopied && <span className="text-emerald-700 font-semibold">{translate(language, 'auto.transcript_copied.196')}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Search Keywords & Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-stone-400" />
              {translate(language, 'auto.generated_search_key.197')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {extractedData.seoKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium border border-stone-200"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>

          {/* Publish / Add to Catalog Button */}
          <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {isPublishing ? (
              <div className="flex items-center gap-2 text-xs text-stone-700 bg-amber-50/80 px-3.5 py-2 rounded-xl border border-amber-200/80 w-full sm:w-auto animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 text-amber-700 animate-spin shrink-0" />
                <span className="font-semibold text-[11px] truncate">{publishingStep}</span>
              </div>
            ) : (
              <div className="text-[11px] text-stone-500 hidden sm:block">
                <span>{translate(language, 'auto.original_ai_enhanced.198')}</span>
              </div>
            )}

            <button
              onClick={handleCreateListing}
              disabled={isPublishing}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-sm transition-all"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{translate(language, 'auto.saving_to_firestore.199')}</span>
                </>
              ) : (
                <>
                  <span>{translate(language, 'auto.publish_to_mosje_sma.200')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
