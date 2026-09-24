// src/components/ProductSubmitReview.tsx
//
// Final review step in the Smart Catalog flow:
// Studio → Voice Catalog → (Fair Pricing) → ProductSubmitReview → Submit
//
// Receives a fully-built ProductListing (with pricing, enhanced image, etc.)
// from VoiceCatalogerModal and handles the Supabase save + firebase fallback.
// Does NOT rebuild the product — only reviews and saves what was passed in.

import React, { useState } from 'react';
import {
  CheckCircle2, ArrowLeft, ArrowRight, RefreshCw, Image as ImageIcon,
  IndianRupee, Tag, ShieldCheck, Sparkles
} from 'lucide-react';
import { ProductListing, Language } from '../types';
import { saveProductToSupabase } from '../services/supabase';
import VerificationBadge from './VerificationBadge';

interface ProductSubmitReviewProps {
  product: ProductListing;
  language?: Language;
  /** Called after the product is successfully saved — hands off to App */
  onSubmitted: (product: ProductListing) => void;
  /** Go back to the Voice Catalog step */
  onBack: () => void;
}

export const ProductSubmitReview: React.FC<ProductSubmitReviewProps> = ({
  product,
  language = 'en',
  onSubmitted,
  onBack,
}) => {
  const [saving, setSaving] = useState(false);
  const [savingStep, setSavingStep] = useState('');
  const [done, setDone] = useState(false);

  const isHindi = language === 'hi';

  const handleSubmit = async () => {
    setSaving(true);

    try {
      // Supabase is the sole product database for the Smart Catalog flow.
      // saveProductToSupabase falls back to localStorage internally when
      // Supabase is not yet configured, so no data is lost in dev mode.
      setSavingStep(isHindi ? 'Supabase में सहेजा जा रहा है…' : 'Saving to Supabase…');
      await saveProductToSupabase(product);

      setDone(true);
      onSubmitted(product);
    } catch (err) {
      console.error('[ProductSubmitReview] Save failed:', err);
      alert(
        isHindi
          ? 'उत्पाद सहेजने में समस्या आई। पुनः प्रयास करें।'
          : 'Failed to save product. Please try again.'
      );
    } finally {
      setSaving(false);
      setSavingStep('');
    }
  };

  const recommendedPrice =
    product.pricing.recommendedPrice ?? product.pricing.suggestedRetailPrice;

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <h2 className="text-xl font-extrabold text-stone-900">
          {isHindi ? 'कैटलॉग प्रकाशित हो गया! 🎉' : 'Product Published! 🎉'}
        </h2>
        <p className="text-sm text-stone-500 max-w-xs">
          {isHindi
            ? `"${product.titleHi || product.titleEn}" MoSJE स्मार्ट कैटलॉग में सहेजा गया।`
            : `"${product.titleEn}" saved to MoSJE Smart Catalog.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-stone-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            {isHindi ? 'अंतिम समीक्षा' : 'Final Review'}
          </span>
        </div>
        <h2 className="text-xl font-black">
          {isHindi ? 'कैटलॉग समीक्षा करें और प्रकाशित करें' : 'Review & Publish to Smart Catalog'}
        </h2>
        <p className="text-xs text-stone-300 mt-1">
          {isHindi
            ? 'प्रकाशित करने से पहले सभी विवरण जाँचें।'
            : 'Verify all details before publishing. Product goes live in MoSJE marketplace.'}
        </p>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
          <ImageIcon className="w-4 h-4 text-stone-500" />
          {isHindi ? 'उत्पाद फोटो' : 'Product Photos'}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">
              {isHindi ? 'मूल फोटो' : 'Original'}
            </p>
            <img
              src={product.originalImage || product.originalImageUrl}
              alt="Original"
              className="w-full aspect-square object-cover rounded-xl border border-stone-200"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {isHindi ? 'AI संवर्धित' : 'AI Enhanced'}
            </p>
            <img
              src={product.enhancedImage || product.enhancedImageUrl}
              alt="AI Enhanced"
              className="w-full aspect-square object-cover rounded-xl border border-emerald-200"
            />
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
          <Tag className="w-4 h-4 text-stone-500" />
          {isHindi ? 'उत्पाद विवरण' : 'Product Details'}
        </div>

        <div className="space-y-2 text-xs text-stone-700">
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">Title (EN)</span>
            <span className="font-semibold text-right">{product.titleEn}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">Title (HI)</span>
            <span className="font-semibold text-right">{product.titleHi}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">Category</span>
            <span className="font-semibold">{product.category}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">Craft Technique</span>
            <span className="font-semibold text-right">{product.craftTechnique}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">Material</span>
            <span className="font-semibold">{product.primaryMaterial}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">Production Days</span>
            <span className="font-semibold">{product.productionDays} days</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-stone-400 shrink-0">GI Certified</span>
            <span className={`font-semibold ${product.giCertified ? 'text-emerald-600' : 'text-stone-500'}`}>
              {product.giCertified ? '✓ Yes' : 'No'}
            </span>
          </div>
          {product.descriptionEn && (
            <div className="pt-1">
              <p className="text-stone-400 mb-0.5">Description</p>
              <p className="text-stone-600 leading-relaxed">{product.descriptionEn}</p>
            </div>
          )}
        </div>

        {/* SEO Keywords */}
        {product.seoKeywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.seoKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[11px] border border-stone-200"
              >
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Fair Pricing Summary */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-stone-800">
          <IndianRupee className="w-4 h-4 text-stone-500" />
          {isHindi ? 'उचित मूल्य सारांश' : 'Fair Pricing Summary'}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-stone-50 rounded-xl px-3 py-2">
            <p className="text-stone-400 text-[10px] uppercase tracking-wide">Raw Material</p>
            <p className="font-bold text-stone-800 mt-0.5">
              ₹{product.pricing.rawMaterialCost?.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl px-3 py-2">
            <p className="text-emerald-600 text-[10px] uppercase tracking-wide">Recommended Price</p>
            <p className="font-bold text-emerald-800 mt-0.5">
              ₹{recommendedPrice?.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-stone-50 rounded-xl px-3 py-2">
            <p className="text-stone-400 text-[10px] uppercase tracking-wide">Labor Wage</p>
            <p className="font-bold text-stone-800 mt-0.5">
              ₹{product.pricing.totalLaborWage?.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl px-3 py-2">
            <p className="text-amber-700 text-[10px] uppercase tracking-wide">Artisan Margin</p>
            <p className="font-bold text-amber-800 mt-0.5">
              {product.pricing.artisanMarginPercent}%
            </p>
          </div>
        </div>

        {/* Wholesale tiers */}
        {product.pricing.wholesaleTiers?.length > 0 && (
          <div className="space-y-1 pt-1">
            <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">Wholesale Tiers</p>
            {product.pricing.wholesaleTiers.map((tier, i) => (
              <div key={i} className="flex justify-between text-xs text-stone-700 border-b border-stone-50 py-0.5">
                <span>{tier.tier} ({tier.minUnits}+ units)</span>
                <span className="font-semibold">₹{tier.unitPrice.toLocaleString('en-IN')} / unit</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action row */}
      <div className="flex gap-3 pb-4">
        <button
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-600 font-medium hover:bg-stone-50 transition-all"
          onClick={onBack}
          disabled={saving}
        >
          <ArrowLeft className="w-4 h-4" />
          {isHindi ? 'वापस' : 'Back'}
        </button>

        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold shadow-sm transition-all disabled:opacity-60"
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-xs">{savingStep || (isHindi ? 'सहेजा जा रहा है…' : 'Saving…')}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHindi ? 'MoSJE कैटलॉग में प्रकाशित करें' : 'Publish to MoSJE Smart Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductSubmitReview;
