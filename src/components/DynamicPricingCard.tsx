import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Info, Volume2, ShieldCheck, Check, Sparkles, Building2 } from 'lucide-react';
import { PricingBreakdown, Language } from '../types';
import { DynamicPricingEngine } from '../services/pricingEngine';
import { VoiceCatalogerEngine } from '../services/voiceCataloger';

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
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Recalculate dynamically
  const pricing = DynamicPricingEngine.calculatePricing({
    category,
    craftTechnique,
    primaryMaterial: 'Authentic Craft Raw Materials',
    rawMaterialCost: rawCost,
    productionDays: days,
    artisanMarginPercent: marginPercent,
    isGICertified: true
  });

  const handleSpeechExplanation = async () => {
    setIsSpeaking(true);
    const explanation = DynamicPricingEngine.getPricingExplanation(pricing, language === 'hi' ? 'hi' : 'en');
    await VoiceCatalogerEngine.speak(explanation, language === 'hi' ? 'hi-IN' : 'en-IN');
    setIsSpeaking(false);
  };

  const isHindi = language === 'hi';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 space-y-5">
      {/* Header with Title & Audio Readout Button */}
      <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              {isHindi ? 'एआई गतिशील मूल्य निर्धारण सहायक' : 'AI Dynamic Pricing Assistant'}
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {isHindi
              ? 'एमओएसजेई कुशल कारीगर मजदूरी मानक व बाजार मांग पर आधारित'
              : 'Based on MoSJE Fair Artisan Wage standards & real-time market trends'}
          </p>
        </div>

        {/* Audio Readout Button for Low Literacy */}
        <button
          onClick={handleSpeechExplanation}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isSpeaking
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200'
          }`}
          title="Listen to plain-language explanation"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? (isHindi ? 'बोल रहा है...' : 'Speaking...') : (isHindi ? 'सुनें' : 'Listen')}</span>
        </button>
      </div>

      {/* Primary Recommended Price Box */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-4 text-white shadow-md shadow-emerald-700/20">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-emerald-100 font-medium uppercase tracking-wider">
              {isHindi ? 'अनुशंसित बिक्री मूल्य (MSRP)' : 'Recommended Selling Price'}
            </span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-black">₹{pricing.suggestedRetailPrice.toLocaleString('en-IN')}</span>
              <span className="text-xs text-emerald-200 font-medium">/ unit</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] bg-white/20 backdrop-blur px-2 py-0.5 rounded-full font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-200" />
              {isHindi ? 'उचित मजदूरी सुरक्षित' : 'Fair Wage Guaranteed'}
            </span>
            <p className="text-xs text-emerald-100 mt-1">
              {isHindi ? `शुद्ध लाभ: ₹${pricing.artisanProfitAmount.toLocaleString('en-IN')}` : `Artisan Profit: ₹${pricing.artisanProfitAmount.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        {/* Range Benchmarks */}
        <div className="mt-3 pt-3 border-t border-emerald-400/30 flex justify-between text-xs text-emerald-100">
          <div>
            <span className="opacity-75">{isHindi ? 'न्यूनतम सुरक्षा मूल्य:' : 'Fair Min Floor:'}</span>{' '}
            <span className="font-semibold text-white">₹{pricing.fairMinimumPrice.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="opacity-75">{isHindi ? 'ई-कॉमर्स बाजार दायरा:' : 'Market Benchmark:'}</span>{' '}
            <span className="font-semibold text-white">₹{pricing.marketBenchmarkMin.toLocaleString('en-IN')} - ₹{pricing.marketBenchmarkMax.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Interactive Sliders for Artisan */}
      <div className="bg-stone-50 rounded-xl p-3.5 space-y-3 border border-stone-200/80">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
          {isHindi ? 'मापदंड समायोजित करें (Interactive Sliders)' : 'Adjust Craft Inputs'}
        </h4>

        {/* Raw Material Cost Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600">{isHindi ? 'कच्चा माल खर्च (Raw Material Cost):' : 'Raw Material Cost:'}</span>
            <span className="font-bold text-stone-900">₹{rawCost.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="200"
            max="15000"
            step="100"
            value={rawCost}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRawCost(val);
              onPriceUpdate?.(DynamicPricingEngine.calculatePricing({
                category, craftTechnique, primaryMaterial: 'Craft', rawMaterialCost: val, productionDays: days, artisanMarginPercent: marginPercent
              }));
            }}
            className="w-full accent-saffron-600 cursor-pointer"
          />
        </div>

        {/* Production Days Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600">{isHindi ? 'श्रम समय (Production Days):' : 'Artisan Crafting Days:'}</span>
            <span className="font-bold text-stone-900">{days} {isHindi ? 'दिन' : 'days'} (₹{days * 750} wage)</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={days}
            onChange={(e) => {
              const val = Number(e.target.value);
              setDays(val);
              onPriceUpdate?.(DynamicPricingEngine.calculatePricing({
                category, craftTechnique, primaryMaterial: 'Craft', rawMaterialCost: rawCost, productionDays: val, artisanMarginPercent: marginPercent
              }));
            }}
            className="w-full accent-saffron-600 cursor-pointer"
          />
        </div>

        {/* Profit Margin % */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600">{isHindi ? 'कारीगर लाभ मार्जिन (Profit Margin):' : 'Artisan Margin:'}</span>
            <span className="font-bold text-emerald-700">{marginPercent}%</span>
          </div>
          <input
            type="range"
            min="15"
            max="50"
            step="1"
            value={marginPercent}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMarginPercent(val);
              onPriceUpdate?.(DynamicPricingEngine.calculatePricing({
                category, craftTechnique, primaryMaterial: 'Craft', rawMaterialCost: rawCost, productionDays: days, artisanMarginPercent: val
              }));
            }}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Transparent Cost Breakdown Bar */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
          <span>{isHindi ? 'पारदर्शी लागत विवरण (Transparent Breakdown)' : 'Transparent Cost Breakdown'}</span>
          <span className="text-[10px] text-stone-500 font-normal">{isHindi ? '100% कारीगर के पक्ष में' : 'Zero Hidden Deductions'}</span>
        </h4>

        {/* Visual Stacked Progress Bar */}
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-stone-200">
          <div
            style={{ width: `${(pricing.rawMaterialCost / pricing.suggestedRetailPrice) * 100}%` }}
            className="bg-amber-500"
            title="Raw Materials"
          />
          <div
            style={{ width: `${(pricing.totalLaborWage / pricing.suggestedRetailPrice) * 100}%` }}
            className="bg-blue-600"
            title="Labor Wages"
          />
          <div
            style={{ width: `${(pricing.artisanProfitAmount / pricing.suggestedRetailPrice) * 100}%` }}
            className="bg-emerald-500"
            title="Artisan Profit"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
          <div className="flex items-center space-x-1 text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>{isHindi ? 'सामग्री:' : 'Materials:'} ₹{pricing.rawMaterialCost.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center space-x-1 text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>{isHindi ? 'श्रम मजदूरी:' : 'Labor:'} ₹{pricing.totalLaborWage.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center space-x-1 text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>{isHindi ? 'मुनाफा:' : 'Profit:'} ₹{pricing.artisanProfitAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* B2B Wholesale & Government Marketplace Tiers */}
      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <div className="bg-stone-100 px-3 py-2 flex items-center justify-between">
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-stone-600" />
            {isHindi ? 'थोक व सरकारी मार्केटप्लेस दरें (B2B Tiers)' : 'B2B Wholesale & Bulk Tiers'}
          </span>
          <span className="text-[10px] text-stone-500">{isHindi ? 'बल्क आर्डरों के लिए' : 'Pre-negotiated'}</span>
        </div>
        <div className="divide-y divide-stone-100 text-xs">
          {pricing.wholesaleTiers.map((tier, idx) => (
            <div key={idx} className="px-3 py-2 flex items-center justify-between hover:bg-stone-50">
              <div>
                <span className="font-semibold text-stone-800">{tier.tier}</span>
                {tier.discountPercent > 0 && (
                  <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
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
