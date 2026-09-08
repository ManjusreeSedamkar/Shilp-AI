class WholesaleTier {
  final String tier;
  final int minUnits;
  final int discountPercent;
  final int unitPrice;

  WholesaleTier({
    required this.tier,
    required this.minUnits,
    required this.discountPercent,
    required this.unitPrice,
  });

  factory WholesaleTier.fromJson(Map<String, dynamic> json) {
    return WholesaleTier(
      tier: json['tier'],
      minUnits: json['minUnits'],
      discountPercent: json['discountPercent'],
      unitPrice: json['unitPrice'],
    );
  }

  Map<String, dynamic> toJson() => {
    'tier': tier,
    'minUnits': minUnits,
    'discountPercent': discountPercent,
    'unitPrice': unitPrice,
  };
}

class PricingBreakdown {
  final int rawMaterialCost;
  final int wastageBuffer;
  final int productionDays;
  final int dailyLaborRate;
  final int totalLaborWage;
  final double giComplexityMultiplier;
  final int artisanMarginPercent;
  final int artisanProfitAmount;
  final int suggestedRetailPrice;
  final int fairMinimumPrice;
  final int marketBenchmarkMin;
  final int marketBenchmarkMax;
  final List<WholesaleTier> wholesaleTiers;

  PricingBreakdown({
    required this.rawMaterialCost,
    required this.wastageBuffer,
    required this.productionDays,
    required this.dailyLaborRate,
    required this.totalLaborWage,
    required this.giComplexityMultiplier,
    required this.artisanMarginPercent,
    required this.artisanProfitAmount,
    required this.suggestedRetailPrice,
    required this.fairMinimumPrice,
    required this.marketBenchmarkMin,
    required this.marketBenchmarkMax,
    required this.wholesaleTiers,
  });

  factory PricingBreakdown.fromJson(Map<String, dynamic> json) {
    return PricingBreakdown(
      rawMaterialCost: json['rawMaterialCost'],
      wastageBuffer: json['wastageBuffer'],
      productionDays: json['productionDays'],
      dailyLaborRate: json['dailyLaborRate'],
      totalLaborWage: json['totalLaborWage'],
      giComplexityMultiplier: (json['giComplexityMultiplier'] as num).toDouble(),
      artisanMarginPercent: json['artisanMarginPercent'],
      artisanProfitAmount: json['artisanProfitAmount'],
      suggestedRetailPrice: json['suggestedRetailPrice'],
      fairMinimumPrice: json['fairMinimumPrice'],
      marketBenchmarkMin: json['marketBenchmarkMin'],
      marketBenchmarkMax: json['marketBenchmarkMax'],
      wholesaleTiers: (json['wholesaleTiers'] as List)
          .map((t) => WholesaleTier.fromJson(t))
          .toList(),
    );
  }
}
