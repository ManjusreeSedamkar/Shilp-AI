import React, { useState } from 'react';
import {
  TrendingUp,
  Volume2,
  Check,
  Building2,
  Square,
  FileText,
  Copy,
  X,
  Sparkles,
  HelpCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  Layers,
  Edit3,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MinusCircle
} from 'lucide-react';
import { PricingBreakdown, Language, MarketDataInputs } from '../types';
import { DynamicPricingEngine } from '../services/pricingEngine';
import { AIDemandPricingEngine } from '../services/aiDemandPricingEngine';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';

interface DynamicPricingCardProps {
  initialPricing?: PricingBreakdown;
  category?: string;
  craftTechnique?: string;
  language?: Language;
  onPriceUpdate?: (pricing: PricingBreakdown) => void;
}

type TestPreset = 'default' | 'no_data' | 'moderate' | 'high' | 'low' | 'ai_unavailable';

export const DynamicPricingCard: React.FC<DynamicPricingCardProps> = ({
  initialPricing,
  category = 'Textiles & Handloom',
  craftTechnique = 'Double Ikat Handloom',
  language = 'en',
  onPriceUpdate
}) => {
  const [rawCost, setRawCost] = useState<number>(initialPricing?.rawMaterialCost || 2500);
  const [days, setDays] = useState<number>(initialPricing?.productionDays || 5);
  const [marginPercent, setMarginPercent] = useState<number>(initialPricing?.artisanMarginPercent || 28);
  const [productSize, setProductSize] = useState<'Small' | 'Medium' | 'Large' | 'Extra-Large'>('Medium');
  const [qualityTier, setQualityTier] = useState<'Standard' | 'Premium Heritage' | 'Masterpiece'>('Standard');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pricingTranscript, setPricingTranscript] = useState<string | null>(null);
  const [isCopiedTranscript, setIsCopiedTranscript] = useState(false);

  // AI Market Pricing scenario state & manual override
  const [selectedPreset, setSelectedPreset] = useState<TestPreset>('high');
  const [customOverridePrice, setCustomOverridePrice] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const isHindi = language === 'hi';

  // Construct market data inputs based on selected test preset
  const getPresetInputs = (): MarketDataInputs => {
    const baseLabor = days * 750;

    switch (selectedPreset) {
      case 'no_data':
        // Test 1 — No market data (Only material & labor)
        return {
          rawMaterialCost: rawCost,
          laborCost: baseLabor,
          productionDays: days,
          productCategory: category,
          craftTechnique: craftTechnique,
        };

      case 'moderate':
        // Test 2 — Moderate demand
        return {
          rawMaterialCost: rawCost,
          laborCost: baseLabor,
          productionDays: days,
          productCategory: category,
          craftTechnique: craftTechnique,
          recentOrderCount: 2,
          productViewsCount: 45,
          wishlistCount: 4,
          stockQuantity: 12,
          historicalSalesCount: 5,
        };

      case 'high':
        // Test 3 — High demand
        return {
          rawMaterialCost: rawCost,
          laborCost: baseLabor,
          productionDays: days,
          productCategory: category,
          craftTechnique: craftTechnique,
          recentOrderCount: 8,
          productViewsCount: 195,
          wishlistCount: 14,
          rfqCount: 3,
          chatEnquiryCount: 6,
          stockQuantity: 3,
          historicalSalesCount: 18,
          seasonalContext: {
            isFestiveSeason: true,
            isWeddingSeason: true,
            eventDescription: 'Diwali & Wedding Season craft surge active'
          }
        };

      case 'low':
        // Test 4 — Low demand
        return {
          rawMaterialCost: rawCost,
          laborCost: baseLabor,
          productionDays: days,
          productCategory: category,
          craftTechnique: craftTechnique,
          recentOrderCount: 0,
          productViewsCount: 6,
          wishlistCount: 0,
          stockQuantity: 45,
          historicalSalesCount: 1,
        };

      case 'ai_unavailable':
        // Test 5 — AI unavailable simulation
        return {
          rawMaterialCost: rawCost,
          laborCost: baseLabor,
          productionDays: days,
          productCategory: category,
          craftTechnique: craftTechnique,
        };

      default:
        return {
          rawMaterialCost: rawCost,
          laborCost: baseLabor,
          productionDays: days,
          productCategory: category,
          craftTechnique: craftTechnique,
          recentOrderCount: 4,
          productViewsCount: 85,
          wishlistCount: 7,
          stockQuantity: 8,
          historicalSalesCount: 10,
        };
    }
  };

  const marketInputs = getPresetInputs();

  // Recalculate dynamically using XGBoost Regressor + AI Demand Pricing Engine
  const pricing = DynamicPricingEngine.calculatePricing({
    category,
    craftTechnique,
    primaryMaterial: 'Authentic Craft Raw Materials',
    rawMaterialCost: rawCost,
    productionDays: days,
    artisanMarginPercent: marginPercent,
    isGICertified: true,
    productSize,
    qualityTier,
    marketInputs,
    language
  });

  const aiResult = pricing.aiMarketPricing;
  const recommendedPrice = customOverridePrice ?? (pricing.recommendedPrice || pricing.suggestedRetailPrice);
  const rangeMin = aiResult?.minimumPrice || pricing.fairPriceRange?.min || pricing.fairMinimumPrice;
  const rangeMax = aiResult?.maximumPrice || pricing.fairPriceRange?.max || pricing.marketBenchmarkMax;
  const baseCostPrice = aiResult?.basePrice || pricing.suggestedRetailPrice;

  const handleSpeechExplanation = async () => {
    if (isSpeaking) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const explanation = aiResult?.explanation || DynamicPricingEngine.getPricingExplanation(pricing, language === 'hi' ? 'hi' : 'en');
    setPricingTranscript(explanation);
    setIsSpeaking(true);

    try {
      await VoiceCatalogerEngine.speak(explanation, language === 'hi' ? 'hi-IN' : 'en-IN');
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopiedTranscript(true);
    setTimeout(() => setIsCopiedTranscript(false), 2000);
  };

  // Helper colors for Demand Level Badge
  const getDemandBadgeStyle = (level?: string) => {
    switch (level) {
      case 'Very High':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Moderate':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Low':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      case 'Very Low':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  // Helper icons for Factors Impact
  const renderFactorIcon = (impact: string) => {
    switch (impact) {
      case 'Positive':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
      case 'Negative':
        return <XCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />;
      case 'Neutral':
        return <MinusCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />;
      case 'Unavailable':
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/80 space-y-6">
      {/* Header with Minimal Elegant Styling */}
      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              {isHindi ? 'एक्सजीबूस्ट (XGBoost) एआई उचित एवं बाजार मूल्य निर्धारण' : 'XGBoost & AI Market Pricing Assistant'}
            </h3>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-2 py-0.5 rounded-md border border-stone-200/70">
              ML + AI Demand
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {isHindi
              ? 'सामग्री, श्रम, मांग संकेतों और मौसमी रुझानों के आधार पर निष्पक्ष बाजार मूल्य'
              : 'Fair artisan pricing combining cost-based living wages with real-time market demand signals'}
          </p>
        </div>

        {/* Audio Readout Button */}
        <button
          onClick={handleSpeechExplanation}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSpeaking
              ? 'bg-stone-900 text-white'
              : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
          }`}
          title={isSpeaking ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'व्याख्या सुनें' : 'Listen to explanation')}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-white text-white" />
              <span>{isHindi ? 'रोकें' : 'Stop'}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-stone-600" />
              <span>{isHindi ? 'सुनें' : 'Listen'}</span>
            </>
          )}
        </button>
      </div>

      {/* AI Speech Transcript Box */}
      {pricingTranscript && (
        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-stone-800 font-bold text-[11px]">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              {isHindi ? 'मूल्य निर्धारण वाणी प्रतिलेख:' : 'AI Pricing Rationale:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyTranscript(pricingTranscript)}
                className="text-stone-600 hover:text-stone-900 text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-stone-200 transition-colors"
              >
                {isCopiedTranscript ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {isCopiedTranscript ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={() => setPricingTranscript(null)}
                className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <p className="text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200 leading-relaxed text-xs">
            "{pricingTranscript}"
          </p>
        </div>
      )}

      {/* Recommended Price + Fair Price Range (Minimalist Warm Card) */}
      <div className="bg-stone-900 rounded-2xl p-5 text-white shadow-xs border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                {isHindi ? 'अनुशंसित बिक्री मूल्य (Recommended Price)' : 'Recommended Price'}
              </span>
              <button
                onClick={() => setShowTooltip(!showTooltip)}
                className="text-stone-400 hover:text-white transition-colors relative"
                title="What is this recommendation?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {showTooltip && (
              <div className="mt-1.5 p-2 bg-stone-800 text-[11px] text-stone-300 rounded-lg border border-stone-700 max-w-sm leading-snug">
                {isHindi
                  ? 'यह मूल्य उत्पादन लागत, निष्पक्ष मजदूरी और बाजार मांग संकेतों का संतुलन है। आप चाहें तो इसे मैन्युअल रूप से बदल सकते हैं।'
                  : 'The AI recommended price balances production costs with market demand signals. Base living wage is protected. You can manually override this price below.'}
              </div>
            )}

            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-3xl font-extrabold text-white">₹{recommendedPrice.toLocaleString('en-IN')}</span>
              {customOverridePrice !== null && (
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  {isHindi ? 'मैन्युअल बदलाव' : 'Overridden'}
                </span>
              )}
              <span className="text-xs text-stone-400">/ piece</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-0.5">
              {isHindi ? 'मूल उत्पादन मूल्य (Base Cost): ' : 'Base Cost Price: '}
              <span className="font-semibold text-stone-300">₹{baseCostPrice.toLocaleString('en-IN')}</span>
              {aiResult?.demandAdjustmentPercent ? (
                <span className={`ml-2 text-[10px] font-bold ${aiResult.demandAdjustmentPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ({aiResult.demandAdjustmentPercent >= 0 ? '+' : ''}{aiResult.demandAdjustmentPercent}% demand adjustment)
                </span>
              ) : null}
            </div>
          </div>

          {/* Fair Price Range Display */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 text-left sm:text-right">
            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider block">
              {isHindi ? 'अनुशंसित मूल्य सीमा (Price Range)' : 'Price Range (Min – Max)'}
            </span>
            <div className="text-base font-bold text-white mt-0.5">
              ₹{rangeMin.toLocaleString('en-IN')} – ₹{rangeMax.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-stone-300">
              {isHindi ? 'न्यूनतम (Base × 0.95) – अधिकतम (Base × 1.15)' : 'Minimum (Base × 0.95) to Max (Base × 1.15)'}
            </span>
          </div>
        </div>

        {/* Manual Price Override slider & Reset */}
        <div className="pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Edit3 className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-300 text-[11px] whitespace-nowrap">
              {isHindi ? 'मूल्य बदलें (Override Price):' : 'Set Custom Price:'}
            </span>
            <input
              type="number"
              value={recommendedPrice}
              onChange={(e) => setCustomOverridePrice(Number(e.target.value) || null)}
              className="w-24 bg-stone-800 text-white px-2 py-1 rounded border border-stone-700 text-xs font-mono font-bold focus:outline-none focus:border-amber-400"
            />
          </div>
          {customOverridePrice !== null && (
            <button
              onClick={() => setCustomOverridePrice(null)}
              className="text-[10px] text-amber-300 underline hover:text-amber-200"
            >
              {isHindi ? 'एआई सिफारिश पर रीसेट करें' : 'Reset to AI Recommendation'}
            </button>
          )}
        </div>

        {/* Feature Sub-Stats */}
        <div className="pt-3 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-300">
          <div>
            <span className="text-stone-400 text-[10px] block">{isHindi ? 'श्रम मजदूरी (Labor):' : 'Labor Wage:'}</span>
            <span className="font-semibold text-white">₹{pricing.totalLaborWage.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block">{isHindi ? 'कच्चा माल (Materials):' : 'Materials + Buffer:'}</span>
            <span className="font-semibold text-white">₹{(pricing.rawMaterialCost + pricing.wastageBuffer).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block">{isHindi ? 'कारीगर लाभ (Profit):' : 'Artisan Margin:'}</span>
            <span className="font-semibold text-emerald-400">+₹{pricing.artisanProfitAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* NEW: AI MARKET INSIGHTS SECTION */}
      {/* ============================================================ */}
      <div className="bg-stone-50/90 rounded-2xl p-4 sm:p-5 border border-stone-200/90 space-y-4 shadow-2xs">
        {/* Section Header & Test Presets Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-900 text-amber-400 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>{isHindi ? 'एआई बाजार अंतर्दृष्टि' : 'AI Market Insights'}</span>
                {aiResult && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getDemandBadgeStyle(aiResult.demandLevel)}`}>
                    {aiResult.demandLevel} Demand
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-stone-500">
                {isHindi
                  ? 'बाजार मांग स्कोर, आत्मविश्वास स्तर एवं कारक विश्लेषण'
                  : 'Real-time demand score, confidence rating, factors & seasonal trends'}
              </p>
            </div>
          </div>

          {/* Quick Scenario Tester Pills (For Test Scenarios 1 to 5) */}
          <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-stone-200 text-[10px]">
            <span className="text-stone-400 font-bold px-1.5 uppercase text-[9px]">Test Preset:</span>
            {([
              { key: 'high', label: 'High Demand' },
              { key: 'moderate', label: 'Moderate' },
              { key: 'low', label: 'Low Demand' },
              { key: 'no_data', label: 'No Market Data' },
              { key: 'ai_unavailable', label: 'AI Offline' },
            ] as const).map((preset) => (
              <button
                key={preset.key}
                onClick={() => {
                  setSelectedPreset(preset.key);
                  setCustomOverridePrice(null);
                }}
                className={`px-2 py-1 rounded-lg font-medium transition-all ${
                  selectedPreset === preset.key
                    ? 'bg-stone-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Offline Warning state (Test 5) */}
        {selectedPreset === 'ai_unavailable' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-start gap-2 text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">AI Market Insights Temporarily Unavailable</span>
              <p className="text-[11px] text-amber-700 mt-0.5">
                The AI market analysis service is currently offline. Pricing has automatically fallen back to the deterministic cost-based calculation (Base Price: ₹{baseCostPrice.toLocaleString('en-IN')}).
              </p>
            </div>
          </div>
        )}

        {/* Core AI Market Metrics Grid */}
        {aiResult && selectedPreset !== 'ai_unavailable' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Demand Score & Level */}
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {isHindi ? 'उत्पाद मांग (Demand)' : 'Product Demand'}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-stone-900">{aiResult.demandLevel}</span>
                <span className="text-xs font-mono font-bold text-stone-600">{aiResult.demandScore}/100</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    aiResult.demandScore >= 65
                      ? 'bg-emerald-500'
                      : aiResult.demandScore >= 45
                      ? 'bg-blue-500'
                      : aiResult.demandScore >= 25
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${aiResult.demandScore}%` }}
                />
              </div>
            </div>

            {/* Metric 2: AI Recommended Price */}
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {isHindi ? 'अनुशंसित मूल्य' : 'Recommended Price'}
              </span>
              <div className="text-lg font-extrabold text-stone-900">
                ₹{aiResult.recommendedPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-stone-500 block">
                {aiResult.demandAdjustmentPercent >= 0 ? '+' : ''}{aiResult.demandAdjustmentPercent}% vs Base Cost
              </span>
            </div>

            {/* Metric 3: Price Range (Min - Max) */}
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {isHindi ? 'मूल्य सीमा (Price Range)' : 'Price Range'}
              </span>
              <div className="text-sm font-bold text-stone-900 mt-0.5">
                ₹{aiResult.minimumPrice.toLocaleString('en-IN')} – ₹{aiResult.maximumPrice.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-stone-500 block">
                Min: Base × 0.95 | Max: Base × 1.15
              </span>
            </div>

            {/* Metric 4: Confidence Score */}
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                {isHindi ? 'विश्वास स्तर (Confidence)' : 'Confidence Score'}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-extrabold text-stone-900">{aiResult.confidenceScore}%</span>
                <span className="text-[10px] font-semibold text-stone-600">{aiResult.confidenceLevel}</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    aiResult.confidenceScore >= 70
                      ? 'bg-emerald-500'
                      : aiResult.confidenceScore >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${aiResult.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Data Availability Pills */}
        {aiResult && selectedPreset !== 'ai_unavailable' && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              {isHindi ? 'डेटा स्रोत स्थिति (Data Signals Availability):' : 'Data Sources Evaluated:'}
            </span>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {[
                { label: 'Historical Sales', active: aiResult.dataAvailability.historicalSales },
                { label: 'Buyer Interest / Views', active: aiResult.dataAvailability.buyerInterest },
                { label: 'Recent Orders', active: aiResult.dataAvailability.recentOrders },
                { label: 'Seasonal Trends', active: aiResult.dataAvailability.seasonalData },
                { label: 'Inventory Level', active: aiResult.dataAvailability.inventoryData },
              ].map((src, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded-md font-medium border flex items-center gap-1 ${
                    src.active
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-stone-100 text-stone-500 border-stone-200 line-through'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${src.active ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                  {src.label}: {src.active ? 'Available' : 'Data unavailable'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Factors Breakdown ("Why?") */}
        {aiResult && selectedPreset !== 'ai_unavailable' && (
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
              <span>{isHindi ? 'यह सिफारिश क्यों? (Why?)' : 'Why this recommendation?'}</span>
              <span className="text-[10px] font-normal text-stone-500">Key Factors</span>
            </h5>
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-stone-200/80">
              {aiResult.factors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  {renderFactorIcon(f.impact)}
                  <div className="flex-1">
                    <span className="font-semibold text-stone-900 text-[11px]">{f.factor}: </span>
                    <span className="text-stone-600 text-[11px]">{f.description}</span>
                  </div>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold border ${
                      f.impact === 'Positive'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : f.impact === 'Negative'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : f.impact === 'Neutral'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    {f.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Impact Card */}
        {aiResult?.seasonalImpact && selectedPreset !== 'ai_unavailable' && (
          <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-xs space-y-1 flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-stone-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-[11px]">
                  {isHindi ? 'मौसमी प्रभाव (Seasonal Demand Index):' : 'Seasonal Demand Impact:'}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${
                    aiResult.seasonalImpact.status === 'Positive'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : aiResult.seasonalImpact.status === 'Negative'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : aiResult.seasonalImpact.status === 'Neutral'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-stone-100 text-stone-500 border-stone-200'
                  }`}
                >
                  {aiResult.seasonalImpact.status}
                </span>
              </div>
              <p className="text-stone-600 text-[11px] mt-0.5">{aiResult.seasonalImpact.description}</p>
            </div>
          </div>
        )}

        {/* Artisan Plain-Language Explanation */}
        {aiResult && selectedPreset !== 'ai_unavailable' && (
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              {isHindi ? 'कारीगर सरल व्याख्या (Artisan Explanation):' : 'Artisan Friendly Explanation:'}
            </span>
            <p className="text-amber-900/90 leading-relaxed text-[11px]">
              "{aiResult.explanation}"
            </p>
          </div>
        )}
      </div>

      {/* Interactive Controls & Feature Sliders */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4 border border-stone-200/70">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
          <span>{isHindi ? 'उत्पाद मापदंड (Product Features)' : 'Adjust Product Features'}</span>
          <span className="text-[10px] text-stone-500 font-normal">Auto-recalculates XGBoost & Demand</span>
        </h4>

        {/* Product Size Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600 block">
            {isHindi ? 'उत्पाद का आकार (Size):' : 'Craft Size:'}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['Small', 'Medium', 'Large', 'Extra-Large'] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setProductSize(size)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                  productSize === size
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Tier Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600 block">
            {isHindi ? 'कारीगरी गुणवत्ता (Quality Tier):' : 'Quality & Finish Tier:'}
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['Standard', 'Premium Heritage', 'Masterpiece'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setQualityTier(tier)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                  qualityTier === tier
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Raw Material Cost Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600">{isHindi ? 'कच्चा माल खर्च:' : 'Raw Material Cost:'}</span>
            <span className="font-bold text-stone-900">₹{rawCost.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="200"
            max="15000"
            step="100"
            value={rawCost}
            onChange={(e) => setRawCost(Number(e.target.value))}
            className="w-full accent-stone-800 cursor-pointer"
          />
        </div>

        {/* Production Days Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600">{isHindi ? 'श्रम समय:' : 'Artisan Crafting Days:'}</span>
            <span className="font-bold text-stone-900">{days} {isHindi ? 'दिन' : 'days'} (₹{days * 750} wage)</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full accent-stone-800 cursor-pointer"
          />
        </div>

        {/* Profit Margin % */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600">{isHindi ? 'लाभ मार्जिन:' : 'Artisan Margin:'}</span>
            <span className="font-bold text-stone-900">{marginPercent}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="50"
            step="1"
            value={marginPercent}
            onChange={(e) => setMarginPercent(Number(e.target.value))}
            className="w-full accent-stone-800 cursor-pointer"
          />
        </div>
      </div>

      {/* XGBoost Feature Contribution Breakdown */}
      {pricing.featureContributions && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
            <span>{isHindi ? 'एक्सजीबूस्ट फीचर प्रभाव (Feature Importance)' : 'XGBoost Feature Contributions'}</span>
            <span className="text-[10px] text-stone-500 font-mono">Ensemble Trees</span>
          </h4>
          <div className="space-y-1.5 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
            {pricing.featureContributions.map((fc, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-stone-600 text-[11px] truncate max-w-[210px]">{fc.feature}</span>
                <span className="font-mono font-semibold text-stone-900 text-[11px]">{fc.impact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* B2B Wholesale & Government Marketplace Tiers */}
      <div className="border border-stone-200/80 rounded-xl overflow-hidden">
        <div className="bg-stone-50 px-3 py-2 flex items-center justify-between border-b border-stone-200/80">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-600" />
            {isHindi ? 'थोक व सरकारी मार्केटप्लेस दरें' : 'B2B Wholesale & Bulk Tiers'}
          </span>
          <span className="text-[10px] text-stone-500">Volume Discounts</span>
        </div>
        <div className="divide-y divide-stone-100 text-xs">
          {pricing.wholesaleTiers.map((tier, idx) => (
            <div key={idx} className="px-3.5 py-2.5 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div>
                <span className="font-semibold text-stone-800">{tier.tier}</span>
                {tier.discountPercent > 0 && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-medium border border-stone-200">
                    {tier.discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="font-mono font-bold text-stone-900">
                ₹{tier.unitPrice.toLocaleString('en-IN')} <span className="text-[10px] text-stone-500 font-normal">/ unit</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
