import { CraftCategory, PricingBreakdown, MarketDataInputs, Language } from '../types';
import { XGBoostFairPricingRegressor, XGBoostPricingInput } from './xgboostPricingModel';
import { AIDemandPricingEngine } from './aiDemandPricingEngine';

/**
 * SHILP-AI Dynamic Pricing Engine
 * 
 * Machine Learning Regression & Fair-Wage Pricing Assistant for Marginalized Artisans
 * Powered by XGBoost Decision Tree Regressor + Skill India / MoSJE Fair Living Wage Standards
 * + AI Demand Prediction & Dynamic Market Pricing
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
  marketInputs?: MarketDataInputs;
  language?: Language;
}

export class DynamicPricingEngine {
  /**
   * Calculates comprehensive fair pricing breakdown using XGBoost Regressor + AI Market Demand Engine
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

    const baseRecommendedPrice = xgbResult.recommendedPrice;
    const fairPriceRange = xgbResult.fairPriceRange;

    const rawCost = Math.max(50, Number(params.rawMaterialCost) || 500);
    const days = Math.max(0.5, Number(params.productionDays) || 1);
    const dailyRate = params.artisanSkillLevel === 'master' ? 950 : params.artisanSkillLevel === 'apprentice' ? 550 : 750;
    const laborWage = xgbResult.totalLaborWage;

    // 2. Run AI Demand Prediction & Dynamic Market Pricing Engine
    const inputs: MarketDataInputs = params.marketInputs || {
      rawMaterialCost: rawCost,
      laborCost: laborWage,
      productionDays: days,
      productCategory: String(params.category),
      craftTechnique: params.craftTechnique,
    };

    const aiMarketPricing = AIDemandPricingEngine.calculateMarketPricing(
      baseRecommendedPrice,
      inputs,
      params.language || 'en'
    );

    const finalRecommendedPrice = aiMarketPricing.recommendedPrice;

    // Wholesale volume tiers (Retail, Wholesale 10-49 pcs, Govt/Bulk 50+ pcs)
    const wholesaleTiers = [
      {
        tier: 'Retail (1-9 pcs)',
        minUnits: 1,
        discountPercent: 0,
        unitPrice: finalRecommendedPrice
      },
      {
        tier: 'B2B Wholesale (10-49 pcs)',
        minUnits: 10,
        discountPercent: 18,
        unitPrice: Math.round(finalRecommendedPrice * 0.82)
      },
      {
        tier: 'Govt / Bulk Export (50+ pcs)',
        minUnits: 50,
        discountPercent: 28,
        unitPrice: Math.round(finalRecommendedPrice * 0.72)
      }
    ];

    return {
      rawMaterialCost: rawCost,
      wastageBuffer: Math.round(rawCost * 0.15),
      productionDays: days,
      dailyLaborRate: dailyRate,
      totalLaborWage: laborWage,
      giComplexityMultiplier: params.isGICertified !== false ? 1.30 : 1.20,
      artisanMarginPercent: params.artisanMarginPercent ?? 28,
      artisanProfitAmount: xgbResult.artisanProfitMargin,
      suggestedRetailPrice: finalRecommendedPrice,
      recommendedPrice: finalRecommendedPrice,
      fairMinimumPrice: aiMarketPricing.minimumPrice,
      fairPriceRange: {
        min: aiMarketPricing.minimumPrice,
        max: aiMarketPricing.maximumPrice,
      },
      marketBenchmarkMin: aiMarketPricing.minimumPrice,
      marketBenchmarkMax: aiMarketPricing.maximumPrice,
      modelType: 'xgboost_regressor',
      xgboostConfidence: xgbResult.modelMetadata.confidenceScore,
      featureContributions: xgbResult.featureContributions,
      wholesaleTiers,
      aiMarketPricing
    };
  }

  /**
   * Plain-language explanation for low-literacy artisans in Hindi & English
   */
  static getPricingExplanation(breakdown: PricingBreakdown, lang: 'hi' | 'en' = 'en'): string {
    const minRange = breakdown.fairPriceRange?.min || breakdown.fairMinimumPrice;
    const maxRange = breakdown.fairPriceRange?.max || breakdown.marketBenchmarkMax;
    const recommended = breakdown.recommendedPrice || breakdown.suggestedRetailPrice;

    if (lang === 'hi') {
      return `एक्सजीबूस्ट (XGBoost) एआई उचित मूल्य: अनुशंसित मूल्य ₹${recommended.toLocaleString('en-IN')} है (उचित मूल्य सीमा: ₹${minRange.toLocaleString('en-IN')} से ₹${maxRange.toLocaleString('en-IN')})। इसमें ₹${breakdown.rawMaterialCost.toLocaleString('en-IN')} कच्चा माल और ${breakdown.productionDays} दिन की मजदूरी (₹${breakdown.dailyLaborRate}/दिन) शामिल है। थोक ऑर्डर (10+ पीस) के लिए ₹${breakdown.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}/पीस की दर तय करें।`;
    }
    return `XGBoost AI Fair Pricing: Recommended Price is ₹${recommended.toLocaleString('en-IN')} (Fair Price Range: ₹${minRange.toLocaleString('en-IN')} – ₹${maxRange.toLocaleString('en-IN')}). Based on ₹${breakdown.rawMaterialCost.toLocaleString('en-IN')} raw materials + ${breakdown.productionDays} days labor (at ₹${breakdown.dailyLaborRate}/day). For bulk wholesale (10+ pcs), quote ₹${breakdown.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')}/pc.`;
  }
}
