import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Check, Globe, RefreshCw, ArrowRight, Tag, BookOpen } from 'lucide-react';
import { VoiceCatalogerEngine, ExtractedProductAttributes } from '../services/voiceCataloger';
import { DynamicPricingEngine } from '../services/pricingEngine';
import { CRAFT_PRESETS } from '../data/craftPresets';
import { Language, ProductListing } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';

interface VoiceCatalogerModalProps {
  language?: Language;
  onListingCreated?: (listing: ProductListing) => void;
  selectedPhotoUrl?: string;
}

export const VoiceCatalogerModal: React.FC<VoiceCatalogerModalProps> = ({
  language = 'en',
  onListingCreated,
  selectedPhotoUrl
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLangCode, setSelectedLangCode] = useState<'hi-IN' | 'en-IN' | 'te-IN' | 'ta-IN' | 'bn-IN' | 'mr-IN'>('hi-IN');
  const [extractedData, setExtractedData] = useState<ExtractedProductAttributes | null>(null);
  const [activeTab, setActiveTab] = useState<'hindi' | 'english'>('hindi');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  const isHindi = language === 'hi';

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

  const handleSpeakDescription = async (text: string, langCode: 'hi-IN' | 'en-IN') => {
    setIsSpeaking(true);
    await VoiceCatalogerEngine.speak(text, langCode);
    setIsSpeaking(false);
  };

  const handleCreateListing = () => {
    if (!extractedData) return;

    const pricing = DynamicPricingEngine.calculatePricing({
      category: extractedData.category,
      craftTechnique: extractedData.craftTechnique,
      primaryMaterial: extractedData.primaryMaterial,
      rawMaterialCost: extractedData.rawMaterialCost,
      productionDays: extractedData.productionDays,
      isGICertified: true
    });

    const matchingPreset = CRAFT_PRESETS.find(p => p.category === extractedData.category) || CRAFT_PRESETS[0];

    const listing: ProductListing = {
      id: `prod-${Date.now()}`,
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
      originalImage: selectedPhotoUrl || matchingPreset.rawImage,
      enhancedImage: selectedPhotoUrl || matchingPreset.enhancedImage,
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

    onListingCreated?.(listing);
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-stone-900 to-craft-indigo rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur text-saffron-300">
              <Sparkles className="w-3.5 h-3.5" />
              {isHindi ? 'बहुभाषी वॉयस एनएलपी इंजन' : 'Multilingual Voice & NLP Auto-Cataloger'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {isHindi ? 'बोलकर कैटलॉग बनाएं (Voice to Catalog)' : 'Speak to Generate Smart Catalog'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              {isHindi
                ? 'अपनी क्षेत्रीय भाषा में बोलें। एआई स्वचालित रूप से उत्पाद का नाम, सामग्री, दिन व लागत पहचानकर अंग्रेजी व हिंदी विवरण तैयार करेगा।'
                : 'Describe your craft naturally in your mother tongue. AI extracts attributes, translates, and generates SEO-ready Hindi & English catalogs.'}
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-3xl">
              🎙️
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
            {isHindi ? 'बोलने की भाषा:' : 'Spoken Language:'}
          </span>
          {[
            { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
            { code: 'en-IN', label: 'English' },
            { code: 'te-IN', label: 'తెలుగు (Telugu)' },
            { code: 'ta-IN', label: 'தமிழ் (Tamil)' },
            { code: 'bn-IN', label: 'বাংলা (Bengali)' },
            { code: 'mr-IN', label: 'मराठी (Marathi)' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLangCode(lang.code as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedLangCode === lang.code
                  ? 'bg-saffron-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {lang.label}
            </button>
          ))}
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
              ? (isHindi ? '🔴 सुन रहा हूँ... बोलिए' : '🔴 Listening... Speak now!')
              : (isHindi ? 'माइक दबाएं और अपने शिल्प के बारे में बोलें' : 'Tap Microphone to Speak')}
          </span>
        </div>

        {/* Quick Sample Voice Prompts */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100 text-left">
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            {isHindi ? 'या त्वरित नमूना आवाज चुनें (Quick Voice Samples):' : 'Or Try Sample Artisan Voice Note:'}
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

            <button
              onClick={() => handleSelectSample(CRAFT_PRESETS[2].sampleVoiceHindi)}
              className="p-2 rounded-xl bg-stone-50 hover:bg-saffron-50 border border-stone-200 hover:border-saffron-300 text-left text-xs transition-colors"
            >
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <span>🏺 बांकुरा टेराकोटा कलश</span>
                <span className="text-[10px] text-saffron-700 font-normal">(3 दिन, ₹450)</span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                "{CRAFT_PRESETS[2].sampleVoiceHindi}"
              </p>
            </button>

            <button
              onClick={() => handleSelectSample(CRAFT_PRESETS[0].sampleVoiceEnglish)}
              className="p-2 rounded-xl bg-stone-50 hover:bg-saffron-50 border border-stone-200 hover:border-saffron-300 text-left text-xs transition-colors"
            >
              <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                <span>🇬🇧 English Sample (Pochampally)</span>
                <span className="text-[10px] text-saffron-700 font-normal">(5 days, ₹2,500)</span>
              </div>
              <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                "{CRAFT_PRESETS[0].sampleVoiceEnglish}"
              </p>
            </button>
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        {transcript && (
          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-left space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              {isHindi ? 'सुनी गई वाणी (Transcribed Speech):' : 'Spoken Voice Transcription:'}
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
                  {isHindi ? 'एआई द्वारा पहचाने गए शिल्प विवरण' : 'AI Extracted Smart Attributes'}
                </h3>
                <p className="text-xs text-stone-500">
                  {isHindi ? 'वाणी से स्वतः निष्कर्षित उत्पाद डेटा' : 'Zero manual typing required for artisan'}
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
              <span className="text-stone-500 text-[10px]">{isHindi ? 'श्रेणी (Category)' : 'Category'}</span>
              <p className="font-bold text-stone-900">{extractedData.category}</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{isHindi ? 'तकनीक (Technique)' : 'Craft Technique'}</span>
              <p className="font-bold text-stone-900">{extractedData.craftTechnique}</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{isHindi ? 'श्रम समय (Days)' : 'Crafting Time'}</span>
              <p className="font-bold text-blue-700">{extractedData.productionDays} {isHindi ? 'दिन' : 'Days'}</p>
            </div>
            <div className="bg-stone-50 p-2.5 rounded-xl">
              <span className="text-stone-500 text-[10px]">{isHindi ? 'कच्चा माल (Raw Cost)' : 'Raw Material Cost'}</span>
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
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-stone-900 text-sm">{extractedData.titleHi}</h4>
                  <button
                    onClick={() => handleSpeakDescription(extractedData.descriptionHi, 'hi-IN')}
                    className="flex items-center space-x-1 text-xs text-saffron-700 font-semibold hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'बोल रहा है...' : 'सुनें (Listen)'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {extractedData.descriptionHi}
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-blue-50/40 rounded-xl border border-blue-200/60 space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-stone-900 text-sm">{extractedData.titleEn}</h4>
                  <button
                    onClick={() => handleSpeakDescription(extractedData.descriptionEn, 'en-IN')}
                    className="flex items-center space-x-1 text-xs text-blue-700 font-semibold hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Speaking...' : 'Listen'}</span>
                  </button>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {extractedData.descriptionEn}
                </p>
              </div>
            )}
          </div>

          {/* Search Keywords & Tags */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3 h-3 text-stone-400" />
              {isHindi ? 'स्वचालित खोज टैग्स (SEO Keywords):' : 'Generated Search Keywords:'}
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
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleCreateListing}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-lg shadow-emerald-700/25 transition-all"
            >
              <span>{isHindi ? 'कैटलॉग में प्रकाशित करें' : 'Publish to MoSJE Smart Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
