import {
  AIDemandMarketPricingResult,
  ConfidenceLevel,
  DataAvailability,
  DemandFactor,
  DemandLevel,
  MarketDataInputs,
  SeasonalImpact,
  SeasonalStatus,
  Language
} from '../types';
import { askGemini, hasGeminiApiKey } from './geminiService';

/**
 * SHILP-AI Demand Prediction & Dynamic Market Pricing Engine
 * 
 * Computes AI-assisted market pricing while maintaining strict living wage guarantees.
 * Integrates raw material cost, labor days/wage, historical sales, product demand,
 * seasonal relevance, buyer interest, and inventory movement.
 */
export class AIDemandPricingEngine {
  /**
   * Main entry point to compute structured AI Demand Market Pricing Result
   */
  public static calculateMarketPricing(
    basePrice: number,
    inputs: MarketDataInputs,
    language: Language = 'en'
  ): AIDemandMarketPricingResult {
    const rawBasePrice = Math.max(100, Math.round(basePrice));

    // 1. Evaluate Data Availability
    const hasSales = inputs.historicalSalesCount !== undefined && inputs.historicalSalesCount !== null;
    const hasOrders = inputs.recentOrderCount !== undefined && inputs.recentOrderCount !== null;
    const hasInterest =
      (inputs.productViewsCount !== undefined && inputs.productViewsCount > 0) ||
      (inputs.wishlistCount !== undefined && inputs.wishlistCount > 0) ||
      (inputs.chatEnquiryCount !== undefined && inputs.chatEnquiryCount > 0);
    const hasSeasonal = inputs.seasonalContext !== undefined && inputs.seasonalContext !== null;
    const hasInventory = inputs.stockQuantity !== undefined && inputs.stockQuantity !== null;

    const dataAvailability: DataAvailability = {
      historicalSales: hasSales,
      buyerInterest: hasInterest,
      recentOrders: hasOrders,
      seasonalData: hasSeasonal,
      inventoryData: hasInventory,
    };

    // 2. Calculate Confidence Score (0 - 100)
    let confidenceScore = 25; // Production cost baseline
    if (hasSales) confidenceScore += 20;
    if (hasOrders) confidenceScore += 20;
    if (hasInterest) confidenceScore += 15;
    if (hasSeasonal) confidenceScore += 10;
    if (hasInventory) confidenceScore += 10;

    confidenceScore = Math.min(100, Math.max(0, Math.round(confidenceScore)));

    let confidenceLevel: ConfidenceLevel = 'Low';
    if (confidenceScore >= 70) confidenceLevel = 'High';
    else if (confidenceScore >= 40) confidenceLevel = 'Medium';

    // 3. Demand Score Calculation with Weight Redistribution
    // Signal weights when present:
    // Recent orders: 25, Buyer Interest: 25, RFQs/Sales: 20, Seasonality: 15, Inventory: 15
    const signalScores: { key: string; weight: number; score: number }[] = [];

    if (hasOrders) {
      const orders = inputs.recentOrderCount || 0;
      // 0 orders -> 20, 1-2 -> 45, 3-5 -> 65, 6-10 -> 82, 10+ -> 95
      let orderScore = 20;
      if (orders >= 10) orderScore = 95;
      else if (orders >= 6) orderScore = 82;
      else if (orders >= 3) orderScore = 65;
      else if (orders >= 1) orderScore = 45;
      signalScores.push({ key: 'orders', weight: 25, score: orderScore });
    }

    if (hasInterest) {
      const views = inputs.productViewsCount || 0;
      const wishlists = inputs.wishlistCount || 0;
      const chats = inputs.chatEnquiryCount || 0;
      const interestPoints = views * 0.5 + wishlists * 5 + chats * 10;
      let interestScore = 30;
      if (interestPoints >= 100) interestScore = 95;
      else if (interestPoints >= 50) interestScore = 78;
      else if (interestPoints >= 20) interestScore = 60;
      else if (interestPoints >= 5) interestScore = 45;
      signalScores.push({ key: 'interest', weight: 25, score: interestScore });
    }

    if (hasSales || (inputs.rfqCount !== undefined && inputs.rfqCount > 0)) {
      const sales = inputs.historicalSalesCount || 0;
      const rfqs = inputs.rfqCount || 0;
      let salesScore = 40;
      if (sales + rfqs >= 15) salesScore = 92;
      else if (sales + rfqs >= 8) salesScore = 75;
      else if (sales + rfqs >= 3) salesScore = 58;
      else if (sales + rfqs >= 1) salesScore = 48;
      signalScores.push({ key: 'sales_rfq', weight: 20, score: salesScore });
    }

    if (hasSeasonal) {
      const ctx = inputs.seasonalContext!;
      let seasonalScore = 50;
      if (ctx.isFestiveSeason || ctx.isWeddingSeason) seasonalScore = 85;
      else if (ctx.isRegionalEvent || ctx.isTourismSeason) seasonalScore = 70;
      signalScores.push({ key: 'seasonal', weight: 15, score: seasonalScore });
    }

    if (hasInventory) {
      const stock = inputs.stockQuantity || 0;
      // Scarcity or rapid movement: low stock (< 5) -> high demand score 80; high stock (> 50) -> lower score 40
      let stockScore = 55;
      if (stock <= 3) stockScore = 85;
      else if (stock <= 10) stockScore = 70;
      else if (stock > 40) stockScore = 35;
      signalScores.push({ key: 'inventory', weight: 15, score: stockScore });
    }

    // Normalized demand score calculation
    let demandScore = 50; // Neutral baseline if no market signals
    if (signalScores.length > 0) {
      const totalWeight = signalScores.reduce((acc, curr) => acc + curr.weight, 0);
      const weightedSum = signalScores.reduce((acc, curr) => acc + curr.weight * curr.score, 0);
      demandScore = Math.round(weightedSum / totalWeight);
    }
    demandScore = Math.min(100, Math.max(0, demandScore));

    // 4. Determine Demand Level
    let demandLevel: DemandLevel = 'Moderate';
    if (demandScore <= 24) demandLevel = 'Very Low';
    else if (demandScore <= 44) demandLevel = 'Low';
    else if (demandScore <= 64) demandLevel = 'Moderate';
    else if (demandScore <= 79) demandLevel = 'High';
    else demandLevel = 'Very High';

    // 5. Calculate Bounded Demand Adjustment Percentage (-10% to +15%)
    let demandAdjustmentPercent = 0;
    if (demandLevel === 'Very Low') {
      // 0 -> -10%, 24 -> -5%
      demandAdjustmentPercent = -10 + (demandScore / 24) * 5;
    } else if (demandLevel === 'Low') {
      // 25 -> -5%, 44 -> 0%
      demandAdjustmentPercent = -5 + ((demandScore - 25) / 19) * 5;
    } else if (demandLevel === 'Moderate') {
      // 45 -> 0%, 64 -> +5%
      demandAdjustmentPercent = 0 + ((demandScore - 45) / 19) * 5;
    } else if (demandLevel === 'High') {
      // 65 -> +5%, 79 -> +10%
      demandAdjustmentPercent = 5 + ((demandScore - 65) / 14) * 5;
    } else {
      // Very High: 80 -> +10%, 100 -> +15%
      demandAdjustmentPercent = 10 + ((demandScore - 80) / 20) * 5;
    }

    demandAdjustmentPercent = Math.min(15, Math.max(-10, Number(demandAdjustmentPercent.toFixed(1))));

    // 6. Calculate Recommended, Minimum, and Maximum Prices
    const recommendedPrice = Math.round(rawBasePrice * (1 + demandAdjustmentPercent / 100));
    const minimumPrice = Math.round(rawBasePrice * 0.95);
    const maximumPrice = Math.round(rawBasePrice * 1.15);

    // Enforce bounds: Recommended Price can never drop below minimumPrice or exceed maximumPrice
    const clampedRecommendedPrice = Math.max(minimumPrice, Math.min(maximumPrice, recommendedPrice));

    // 7. Factors Affecting Recommendation
    const factors: DemandFactor[] = [];

    if (hasOrders) {
      const count = inputs.recentOrderCount || 0;
      factors.push({
        factor: 'Recent Order Frequency',
        impact: count >= 5 ? 'Positive' : count >= 1 ? 'Neutral' : 'Negative',
        description: count >= 5
          ? `High order volume with ${count} recent orders.`
          : count >= 1
          ? `Steady stream of ${count} recent order(s).`
          : `Low order frequency recently.`
      });
    } else {
      factors.push({
        factor: 'Recent Orders Data',
        impact: 'Unavailable',
        description: 'Recent order frequency data is currently unavailable.'
      });
    }

    if (hasInterest) {
      const views = inputs.productViewsCount || 0;
      const wishlists = inputs.wishlistCount || 0;
      factors.push({
        factor: 'Buyer Interest & Enquiries',
        impact: views > 20 || wishlists > 3 ? 'Positive' : 'Neutral',
        description: `${views} views and ${wishlists} wishlist additions logged.`
      });
    } else {
      factors.push({
        factor: 'Buyer Interest Signal',
        impact: 'Unavailable',
        description: 'Buyer traffic and wishlist tracking data is unavailable.'
      });
    }

    if (hasSeasonal) {
      const ctx = inputs.seasonalContext!;
      if (ctx.isFestiveSeason || ctx.isWeddingSeason) {
        factors.push({
          factor: 'Seasonal Festival Demand',
          impact: 'Positive',
          description: ctx.eventDescription || 'Festive and wedding season demand surge active.'
        });
      } else {
        factors.push({
          factor: 'Seasonal Demand Index',
          impact: 'Neutral',
          description: 'Regular non-festive period demand baseline.'
        });
      }
    } else {
      factors.push({
        factor: 'Seasonal Market Data',
        impact: 'Unavailable',
        description: 'Regional festival and seasonal index data unavailable.'
      });
    }

    if (hasSales) {
      const sales = inputs.historicalSalesCount || 0;
      factors.push({
        factor: 'Historical Sales Performance',
        impact: sales > 10 ? 'Positive' : sales > 0 ? 'Neutral' : 'Negative',
        description: `${sales} historical completed sales recorded.`
      });
    } else {
      factors.push({
        factor: 'Historical Sales Data',
        impact: 'Unavailable',
        description: 'Historical sales records are limited or unavailable.'
      });
    }

    if (hasInventory) {
      const stock = inputs.stockQuantity || 0;
      factors.push({
        factor: 'Inventory Availability',
        impact: stock <= 5 ? 'Positive' : stock > 40 ? 'Negative' : 'Neutral',
        description: stock <= 5
          ? `Limited stock (${stock} units) creating scarcity.`
          : `Sufficient stock available (${stock} units).`
      });
    } else {
      factors.push({
        factor: 'Inventory Tracking',
        impact: 'Unavailable',
        description: 'Real-time stock inventory level data unavailable.'
      });
    }

    // 8. Seasonal Impact Object
    let seasonalImpact: SeasonalImpact;
    if (hasSeasonal) {
      const ctx = inputs.seasonalContext!;
      if (ctx.isFestiveSeason || ctx.isWeddingSeason) {
        seasonalImpact = {
          status: 'Positive',
          description: ctx.eventDescription || 'Festive and wedding season surge increases buyer interest.'
        };
      } else if (ctx.isRegionalEvent || ctx.isTourismSeason) {
        seasonalImpact = {
          status: 'Positive',
          description: ctx.eventDescription || 'Regional exhibition & craft fair demand surge.'
        };
      } else {
        seasonalImpact = {
          status: 'Neutral',
          description: 'Standard baseline period for seasonal demand.'
        };
      }
    } else {
      seasonalImpact = {
        status: 'Data unavailable',
        description: 'Seasonal demand trend data for this craft cluster is currently unavailable.'
      };
    }

    // 9. Plain-Language Artisan Explanation (Fallback / Initial)
    const explanation = this.getFallbackExplanation(
      demandLevel,
      clampedRecommendedPrice,
      rawBasePrice,
      dataAvailability,
      language
    );

    return {
      demandScore,
      demandLevel,
      basePrice: rawBasePrice,
      recommendedPrice: clampedRecommendedPrice,
      minimumPrice,
      maximumPrice,
      demandAdjustmentPercent,
      confidenceScore,
      confidenceLevel,
      factors,
      seasonalImpact,
      explanation,
      dataAvailability,
    };
  }

  /**
   * Deterministic plain-language artisan explanation fallback
   */
  public static getFallbackExplanation(
    demandLevel: DemandLevel,
    recommendedPrice: number,
    basePrice: number,
    dataAvailability: DataAvailability,
    language: Language = 'en'
  ): string {
    const isHindi = language === 'hi';
    const isAvailable = Object.values(dataAvailability).some((val) => val === true);

    if (!isAvailable) {
      if (isHindi) {
        return `सीमित बाजार डेटा उपलब्ध है। अनुशंसित मूल्य मुख्य रूप से सामग्री और श्रम लागत पर आधारित है। अनुशंसित मूल्य: ₹${recommendedPrice.toLocaleString('en-IN')}`;
      }
        return `Limited market data available. Recommendation is based primarily on production cost. Recommended price: ₹${recommendedPrice.toLocaleString('en-IN')}`;
    }

    if (demandLevel === 'High' || demandLevel === 'Very High') {
      if (isHindi) {
        return `इस उत्पाद की मांग वर्तमान में काफी अधिक है। हाल के ऑर्डर और खरीदार पूछताछ के आधार पर, आप इसे अपने मूल उत्पादन मूल्य (₹${basePrice.toLocaleString('en-IN')}) से थोड़ा ऊपर ₹${recommendedPrice.toLocaleString('en-IN')} पर बेच सकते हैं।`;
      }
      return `Demand for this product is currently high. Recent buyer enquiries and order activity suggest that you can price this product slightly above the base production cost (₹${basePrice.toLocaleString('en-IN')}) at ₹${recommendedPrice.toLocaleString('en-IN')}.`;
    }

    if (demandLevel === 'Low' || demandLevel === 'Very Low') {
      if (isHindi) {
        return `वर्तमान में बाजार मांग सामान्य से कम है। अधिक बिक्री आकर्षित करने के लिए, मूल्य को उचित सीमा के करीब ₹${recommendedPrice.toLocaleString('en-IN')} पर रखने की सलाह दी जाती है।`;
      }
      return `Demand is currently low in the market. To encourage faster sales, pricing closer to ₹${recommendedPrice.toLocaleString('en-IN')} is recommended while preserving your living wage.`;
    }

    if (isHindi) {
      return `इस हस्तशिल्प की बाजार मांग स्थिर है। आपका अनुशंसित बिक्री मूल्य ₹${recommendedPrice.toLocaleString('en-IN')} है, जो आपकी पूरी मजदूरी और सामग्री लागत की सुरक्षा करता है।`;
    }
    return `Market demand for this craft is steady. Your recommended selling price is ₹${recommendedPrice.toLocaleString('en-IN')}, fully covering your labor wages and raw materials.`;
  }

  /**
   * Enhanced Gemini AI explanation generation
   */
  public static async generateAIExplanation(
    result: AIDemandMarketPricingResult,
    language: Language = 'en'
  ): Promise<string> {
    if (!hasGeminiApiKey()) {
      return result.explanation;
    }

    const prompt = `Act as an AI Artisan Business Mentor on Shilp-AI. Explain this craft market price recommendation to a rural Indian artisan in 2-3 short, simple, encouraging sentences.
Do NOT use complex financial jargon.
Data context:
- Product Demand Level: ${result.demandLevel} (${result.demandScore}/100)
- Base Production Cost: ₹${result.basePrice}
- Recommended Price: ₹${result.recommendedPrice}
- Min Price: ₹${result.minimumPrice} | Max Price: ₹${result.maximumPrice}
- Demand Adjustment: ${result.demandAdjustmentPercent}%
- Main Factors: ${result.factors.map(f => `${f.factor}: ${f.description}`).join('; ')}

Language target: ${language === 'hi' ? 'Hindi' : 'English'}. Include currency symbols ₹.`;

    try {
      const response = await askGemini(prompt, language);
      return response || result.explanation;
    } catch {
      return result.explanation;
    }
  }
}
