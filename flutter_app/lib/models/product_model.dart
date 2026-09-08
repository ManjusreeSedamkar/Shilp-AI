import 'pricing_model.dart';

class ProductListing {
  final String id;
  final String artisanId;
  final String artisanName;
  final String state;
  final String titleEn;
  final String titleHi;
  final String category;
  final String craftTechnique;
  final String primaryMaterial;
  final String color;
  final int productionDays;
  final int rawMaterialCost;
  final String originalImage;
  final String enhancedImage;
  final String descriptionEn;
  final String descriptionHi;
  final List<String> seoKeywords;
  final PricingBreakdown pricing;
  final List<String> targetBuyers;
  final int stockQuantity;
  final bool giCertified;

  ProductListing({
    required this.id,
    required this.artisanId,
    required this.artisanName,
    required this.state,
    required this.titleEn,
    required this.titleHi,
    required this.category,
    required this.craftTechnique,
    required this.primaryMaterial,
    required this.color,
    required this.productionDays,
    required this.rawMaterialCost,
    required this.originalImage,
    required this.enhancedImage,
    required this.descriptionEn,
    required this.descriptionHi,
    required this.seoKeywords,
    required this.pricing,
    required this.targetBuyers,
    required this.stockQuantity,
    required this.giCertified,
  });
}
