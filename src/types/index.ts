export type Language = 'hi' | 'en' | 'te' | 'ta' | 'bn' | 'mr' | 'gu';

export type UserRole = 'artisan' | 'buyer';

export type CraftCategory = 
  | 'Textiles & Handloom'
  | 'Clay & Terracotta'
  | 'Metalcraft & Dhokra'
  | 'Traditional Painting'
  | 'Woodcraft & Carving'
  | 'Leather & Footwear'
  | 'Handmade Jewelry';

export interface ArtisanProfile {
  id: string;
  name: string;
  regionalName: string;
  phone: string;
  craftCluster: string;
  district: string;
  state: string;
  beneficiaryId: string; // MoSJE Beneficiary Card No
  shilpCardNumber: string;
  avatarUrl: string;
  giTagCraft: string;
  experienceYears: number;
  exhibitions: string[]; // e.g. ["Shilp Samagam 2024", "Dilli Haat", "Surajkund International Mela"]
  rating: number;
  totalSalesCount: number;
  totalEarnings: number;
  bankLinked: boolean;
}

export interface PricingBreakdown {
  rawMaterialCost: number;
  wastageBuffer: number; // 15%
  productionDays: number;
  dailyLaborRate: number; // ₹750/day fair artisan wage standard
  totalLaborWage: number;
  giComplexityMultiplier: number;
  artisanMarginPercent: number;
  artisanProfitAmount: number;
  suggestedRetailPrice: number; // MSRP
  fairMinimumPrice: number;
  marketBenchmarkMin: number;
  marketBenchmarkMax: number;
  wholesaleTiers: {
    tier: string;
    minUnits: number;
    discountPercent: number;
    unitPrice: number;
  }[];
}

export interface ProductListing {
  id: string;
  artisanId: string;
  artisanName: string;
  state: string;
  titleEn: string;
  titleHi: string;
  category: CraftCategory;
  craftTechnique: string;
  primaryMaterial: string;
  color: string;
  productionDays: number;
  rawMaterialCost: number;
  originalImage: string;
  enhancedImage: string;
  hasBackgroundRemoved: boolean;
  hasLightingEnhanced: boolean;
  descriptionEn: string;
  descriptionHi: string;
  seoKeywords: string[];
  pricing: PricingBreakdown;
  targetBuyers: string[];
  stockQuantity: number;
  giCertified: boolean;
  createdAt: string;
  featured?: boolean;
}

export interface CopilotMessage {
  id: string;
  sender: 'artisan' | 'copilot';
  text: string;
  audioText?: string;
  timestamp: string;
  actionCard?: {
    type: 'product_extracted' | 'pricing_suggested' | 'listing_ready';
    data: any;
  };
}

export interface BulkRFQInquiry {
  id: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  buyerPhone: string;
  productId: string;
  productTitle: string;
  requestedQuantity: number;
  offeredUnitPrice: number;
  deliveryDateNeeded: string;
  customizationNotes?: string;
  status: 'pending' | 'accepted' | 'negotiating' | 'declined';
  createdAt: string;
}
