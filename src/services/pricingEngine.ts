import { Language } from '../types';
import { getStoredTranslation, queuePhrasesForTranslation } from './hybridTranslation';
import { CraftCategory, PricingBreakdown } from '../types';
import { XGBoostFairPricingRegressor, XGBoostPricingInput } from './xgboostPricingModel';

/**
 * SHILP-AI Dynamic Pricing Engine
 * 
 * Machine Learning Regression & Fair-Wage Pricing Assistant for Marginalized Artisans
 * Powered by XGBoost Decision Tree Regressor + Skill India / MoSJE Fair Living Wage Standards
 */

export interface PricingParameters extends XGBoostPricingInput {
  category: CraftCategory | string;
  craftTechnique: string;
  primaryMaterial: string;
  rawMaterialCost: number;
  productionDays: number;
  state?: string;
  isGICertified?: boolean;
  artisanSkillLevel?: 'master' | 'skilled' | 'apprentice';
  artisanMarginPercent?: number; // Default 28%
  productSize?: 'Small' | 'Medium' | 'Large' | 'Extra-Large';
  qualityTier?: 'Standard' | 'Premium Heritage' | 'Masterpiece';
}

export class DynamicPricingEngine {
  /**
   * Calculates comprehensive fair pricing breakdown using XGBoost Regressor
   */
  static calculatePricing(params: PricingParameters): PricingBreakdown {
    // 1. Run XGBoost Decision Tree Ensemble Regressor
    const xgbResult = XGBoostFairPricingRegressor.predict({
      category: params.category,
      craftTechnique: params.craftTechnique,
      primaryMaterial: params.primaryMaterial,
      rawMaterialCost: params.rawMaterialCost,
      productionDays: params.productionDays,
      productSize: params.productSize || 'Medium',
      qualityTier: params.qualityTier || 'Standard',
      isGICertified: params.isGICertified !== false,
      artisanSkillLevel: params.artisanSkillLevel || 'skilled',
      artisanMarginPercent: params.artisanMarginPercent ?? 28,
    });

    const recommendedPrice = xgbResult.recommendedPrice;
    const fairPriceRange = xgbResult.fairPriceRange;

    // Wholesale volume tiers (Retail, Wholesale 10-49 pcs, Govt/Bulk 50+ pcs)
    const wholesaleTiers = [
      {
        tier: 'Retail (1-9 pcs)',
        minUnits: 1,
        discountPercent: 0,
        unitPrice: recommendedPrice
      },
      {
        tier: 'B2B Wholesale (10-49 pcs)',
        minUnits: 10,
        discountPercent: 18,
        unitPrice: Math.round(recommendedPrice * 0.82)
      },
      {
        tier: 'Govt / Bulk Export (50+ pcs)',
        minUnits: 50,
        discountPercent: 28,
        unitPrice: Math.round(recommendedPrice * 0.72)
      }
    ];

    const rawCost = Math.max(50, Number(params.rawMaterialCost) || 500);
    const days = Math.max(0.5, Number(params.productionDays) || 1);
    const dailyRate = params.artisanSkillLevel === 'master' ? 950 : params.artisanSkillLevel === 'apprentice' ? 550 : 750;

    return {
      rawMaterialCost: rawCost,
      wastageBuffer: Math.round(rawCost * 0.15),
      productionDays: days,
      dailyLaborRate: dailyRate,
      totalLaborWage: xgbResult.totalLaborWage,
      giComplexityMultiplier: params.isGICertified !== false ? 1.30 : 1.20,
      artisanMarginPercent: params.artisanMarginPercent ?? 28,
      artisanProfitAmount: xgbResult.artisanProfitMargin,
      suggestedRetailPrice: recommendedPrice,
      recommendedPrice: recommendedPrice,
      fairMinimumPrice: fairPriceRange.min,
      fairPriceRange: fairPriceRange,
      marketBenchmarkMin: fairPriceRange.min,
      marketBenchmarkMax: fairPriceRange.max,
      modelType: 'xgboost_regressor',
      xgboostConfidence: xgbResult.modelMetadata.confidenceScore,
      featureContributions: xgbResult.featureContributions,
      wholesaleTiers
    };
  }

  /**
   * Plain-language explanation for low-literacy artisans in Hindi & English
   */
  static getPricingExplanation(breakdown: PricingBreakdown, lang: Language = 'en'): string {
    const minRange = breakdown.fairPriceRange?.min || breakdown.fairMinimumPrice;
    const maxRange = breakdown.fairPriceRange?.max || breakdown.marketBenchmarkMax;
    const recommended = breakdown.recommendedPrice || breakdown.suggestedRetailPrice;

    if (lang === 'hi') {
      return `एक्सजीबूस्ट (XGBoost) एआई उचित मूल्य: अनुशंसित मूल्य ₹${recommended.toLocaleString('en-IN')} है (उचित मूल्य सीमा: ₹${minRange.toLocaleString('en-IN')} से ₹${maxRange.toLocaleString('en-IN')})। इसमें ₹${breakdown.rawMaterialCost.toLocaleString('en-IN')} कच्चा माल और ${breakdown.productionDays} दिन की मजदूरी (₹${breakdown.dailyLaborRate}/दिन) शामिल है। थोक ऑर्डर (10+ पीस) के लिए ₹${breakdown.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}/पीस की दर तय करें।`;
    }

    const englishText = `XGBoost AI Fair Pricing: Recommended Price is ₹${recommended.toLocaleString('en-IN')} (Fair Price Range: ₹${minRange.toLocaleString('en-IN')} – ₹${maxRange.toLocaleString('en-IN')}). Based on ₹${breakdown.rawMaterialCost.toLocaleString('en-IN')} raw materials + ${breakdown.productionDays} days labor (at ₹${breakdown.dailyLaborRate}/day). For bulk wholesale (10+ pcs), quote ₹${breakdown.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}/pc.`;

    if (lang !== 'en') {
      const cached = getStoredTranslation(lang, englishText);
      if (cached) return cached;
      queuePhrasesForTranslation([englishText], lang);

      const isDevanagari = ['mr', 'sa', 'mai', 'kok', 'ne', 'doi', 'brx'].includes(lang);
      if (isDevanagari) {
        return `एक्सजीबूस्ट (XGBoost) एआई उचित मूल्य: अनुशंसित मूल्य ₹${recommended.toLocaleString('en-IN')} है। कच्चा माल ₹${breakdown.rawMaterialCost.toLocaleString('en-IN')} + ${breakdown.productionDays} दिन की मजदूरी।`;
      }
    }

    return englishText;
  }
}
