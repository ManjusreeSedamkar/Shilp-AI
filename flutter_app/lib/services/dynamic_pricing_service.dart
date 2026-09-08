import '../models/pricing_model.dart';

class DynamicPricingService {
  static const Map<String, double> craftComplexity = {
    'Textiles & Handloom': 1.25,
    'Metalcraft & Dhokra': 1.32,
    'Clay & Terracotta': 1.15,
    'Traditional Painting': 1.28,
    'Woodcraft & Carving': 1.22,
    'Leather & Footwear': 1.18,
    'Handmade Jewelry': 1.26,
  };

  static PricingBreakdown calculatePricing({
    required String category,
    required int rawMaterialCost,
    required int productionDays,
    int artisanMarginPercent = 28,
    bool isGICertified = true,
  }) {
    final rawCost = rawMaterialCost > 0 ? rawMaterialCost : 500;
    final days = productionDays > 0 ? productionDays : 1;
    final wastageBuffer = (rawCost * 0.15).round();
    final totalMaterialsCost = rawCost + wastageBuffer;

    const dailyRate = 750; // MoSJE fair artisan daily wage benchmark
    final totalLaborWage = days * dailyRate;

    final baseMultiplier = craftComplexity[category] ?? 1.20;
    final giBonus = isGICertified ? 0.05 : 0.0;
    final giMultiplier = double.parse((baseMultiplier + giBonus).toStringAsFixed(2));

    final productionBaseCost = totalMaterialsCost + totalLaborWage;
    final fairMinimumPrice = (productionBaseCost * 1.10).round();

    final valueAdjustedBase = productionBaseCost * giMultiplier;
    final profitAmount = (valueAdjustedBase * (artisanMarginPercent / 100)).round();
    final suggestedRetailPrice = (valueAdjustedBase + profitAmount).round();

    final marketMin = (suggestedRetailPrice * 0.92).round();
    final marketMax = (suggestedRetailPrice * 1.45).round();

    final wholesaleTiers = [
      WholesaleTier(
        tier: 'Retail (1-9 units)',
        minUnits: 1,
        discountPercent: 0,
        unitPrice: suggestedRetailPrice,
      ),
      WholesaleTier(
        tier: 'B2B Wholesale (10-49 units)',
        minUnits: 10,
        discountPercent: 18,
        unitPrice: (suggestedRetailPrice * 0.82).round(),
      ),
      WholesaleTier(
        tier: 'Govt / Bulk Export (50+ units)',
        minUnits: 50,
        discountPercent: 28,
        unitPrice: (suggestedRetailPrice * 0.72).round(),
      ),
    ];

    return PricingBreakdown(
      rawMaterialCost: rawCost,
      wastageBuffer: wastageBuffer,
      productionDays: days,
      dailyLaborRate: dailyRate,
      totalLaborWage: totalLaborWage,
      giComplexityMultiplier: giMultiplier,
      artisanMarginPercent: artisanMarginPercent,
      artisanProfitAmount: profitAmount,
      suggestedRetailPrice: suggestedRetailPrice,
      fairMinimumPrice: fairMinimumPrice,
      marketBenchmarkMin: marketMin,
      marketBenchmarkMax: marketMax,
      wholesaleTiers: wholesaleTiers,
    );
  }
}
