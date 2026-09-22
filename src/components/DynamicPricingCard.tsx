import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Volume2, ShieldCheck, Check, Sparkles, Building2, Square, FileText, Copy, X, Sliders, Layers } from 'lucide-react';
import { PricingBreakdown, Language } from '../types';
import { DynamicPricingEngine } from '../services/pricingEngine';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';
import { translate, getSpeechLangCode } from '../services/translations';

interface DynamicPricingCardProps {
  initialPricing?: PricingBreakdown;
  category?: string;
  craftTechnique?: string;
  language?: Language;
  onPriceUpdate?: (pricing: PricingBreakdown) => void;
}

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

  // Recalculate dynamically using XGBoost Regressor
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
  });

  const handleSpeechExplanation = async () => {
    if (isSpeaking) {
      VoiceCatalogerEngine.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const explanation = DynamicPricingEngine.getPricingExplanation(pricing, language);
    setPricingTranscript(explanation);
    setIsSpeaking(true);

    try {
      await VoiceCatalogerEngine.speak(explanation, getSpeechLangCode(language));
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleCopyTranscript = (text: string) => {
    navigator.clipboard?.writeText(text);
    setIsCopiedTranscript(true);
    setTimeout(() => setIsCopiedTranscript(false), 2000);
  };

  // isHindi removed — use t() translations
  const recommendedPrice = pricing.recommendedPrice || pricing.suggestedRetailPrice;
  const rangeMin = pricing.fairPriceRange?.min || pricing.fairMinimumPrice;
  const rangeMax = pricing.fairPriceRange?.max || pricing.marketBenchmarkMax;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200/80 space-y-5">
      {/* Header with Minimal Elegant Styling */}
      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              {translate(language, 'auto.xgboost_fair_pricing.98')}
            </h3>
            <span className="text-[10px] bg-stone-100 text-stone-600 font-mono px-2 py-0.5 rounded-md border border-stone-200/70">
              ML Regressor
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {translate(language, 'auto.predicts_fair_market.99')}
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
          title={isSpeaking ? (translate(language, 'auto.stop.100')) : (translate(language, 'auto.listen_to_explanatio.101'))}
        >
          {isSpeaking ? (
            <>
              <Square className="w-3.5 h-3.5 fill-white text-white" />
              <span>{translate(language, 'auto.stop.102')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-stone-600" />
              <span>{translate(language, 'auto.listen.103')}</span>
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
              {translate(language, 'auto.ai_pricing_explanati.104')}
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
      <div className="bg-stone-900 rounded-2xl p-5 text-white shadow-xs border border-stone-800">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
              {translate(language, 'auto.recommended_price.105')}
            </span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-3xl font-extrabold text-white">₹{recommendedPrice.toLocaleString('en-IN')}</span>
              <span className="text-xs text-stone-400">/ piece</span>
            </div>
          </div>

          {/* Fair Price Range Display */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10 text-left sm:text-right">
            <span className="text-[10px] font-bold text-amber-200 uppercase tracking-wider block">
              {translate(language, 'auto.fair_price_range.106')}
            </span>
            <div className="text-base font-bold text-white mt-0.5">
              ₹{rangeMin.toLocaleString('en-IN')} – ₹{rangeMax.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-stone-300">
              {translate(language, 'auto.living_wage_floor_to.107')}
            </span>
          </div>
        </div>

        {/* Feature Sub-Stats */}
        <div className="mt-4 pt-3 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-stone-300">
          <div>
            <span className="text-stone-400 text-[10px] block">{translate(language, 'auto.labor_wage.108')}</span>
            <span className="font-semibold text-white">₹{pricing.totalLaborWage.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block">{translate(language, 'auto.materials_buffer.109')}</span>
            <span className="font-semibold text-white">₹{(pricing.rawMaterialCost + pricing.wastageBuffer).toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-stone-400 text-[10px] block">{translate(language, 'auto.artisan_margin.110')}</span>
            <span className="font-semibold text-emerald-400">+₹{pricing.artisanProfitAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Feature Sliders */}
      <div className="bg-stone-50 rounded-xl p-4 space-y-4 border border-stone-200/70">
        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center justify-between">
          <span>{translate(language, 'auto.adjust_product_featu.111')}</span>
          <span className="text-[10px] text-stone-500 font-normal">Auto-recalculates with XGBoost</span>
        </h4>

        {/* Product Size Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone-600 block">
            {translate(language, 'auto.craft_size.112')}
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
            {translate(language, 'auto.quality_finish_tier.113')}
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
            <span className="text-stone-600">{translate(language, 'auto.raw_material_cost.114')}</span>
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
            <span className="text-stone-600">{translate(language, 'auto.artisan_crafting_day.115')}</span>
            <span className="font-bold text-stone-900">{days} {translate(language, 'auto.days.116')} (₹{days * 750} wage)</span>
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
            <span className="text-stone-600">{translate(language, 'auto.artisan_margin.117')}</span>
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
            <span>{translate(language, 'auto.xgboost_feature_cont.118')}</span>
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
            {translate(language, 'auto.b2b_wholesale_bulk_t.119')}
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
