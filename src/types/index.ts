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

// ============================================================
// AI Demand Prediction & Dynamic Market Pricing Types
// ============================================================

export type DemandLevel = 'Very Low' | 'Low' | 'Moderate' | 'High' | 'Very High';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';
export type FactorImpact = 'Positive' | 'Negative' | 'Neutral' | 'Unavailable';
export type SeasonalStatus = 'Positive' | 'Negative' | 'Neutral' | 'Data unavailable';

export interface DemandFactor {
  factor: string;
  impact: FactorImpact;
  description: string;
}

export interface SeasonalImpact {
  status: SeasonalStatus;
  description: string;
}

export interface DataAvailability {
  historicalSales: boolean;
  buyerInterest: boolean;
  recentOrders: boolean;
  seasonalData: boolean;
  inventoryData: boolean;
}

export interface AIDemandMarketPricingResult {
  demandScore: number;
  demandLevel: DemandLevel;
  basePrice: number;
  recommendedPrice: number;
  minimumPrice: number;
  maximumPrice: number;
  demandAdjustmentPercent: number;
  confidenceScore: number;
  confidenceLevel: ConfidenceLevel;
  factors: DemandFactor[];
  seasonalImpact: SeasonalImpact;
  explanation: string;
  dataAvailability: DataAvailability;
}

export interface MarketDataInputs {
  productCategory?: string;
  craftTechnique?: string;
  rawMaterialCost: number;
  laborCost: number;
  productionDays?: number;
  stockQuantity?: number;
  historicalSalesCount?: number;
  recentOrderCount?: number;
  productViewsCount?: number;
  wishlistCount?: number;
  rfqCount?: number;
  chatEnquiryCount?: number;
  seasonalContext?: {
    isFestiveSeason?: boolean;
    isWeddingSeason?: boolean;
    isRegionalEvent?: boolean;
    isTourismSeason?: boolean;
    eventDescription?: string;
  };
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
  recommendedPrice?: number;
  fairPriceRange?: { min: number; max: number };
  modelType?: 'xgboost_regressor' | 'heuristic_ml';
  xgboostConfidence?: number;
  featureContributions?: { feature: string; impact: string; weight: number }[];
  wholesaleTiers: {
    tier: string;
    minUnits: number;
    discountPercent: number;
    unitPrice: number;
  }[];
  aiMarketPricing?: AIDemandMarketPricingResult;
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
  originalImageUrl?: string;
  enhancedImageUrl?: string;
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
  productSize?: 'Small' | 'Medium' | 'Large' | 'Extra-Large';
  qualityTier?: 'Standard' | 'Premium Heritage' | 'Masterpiece';
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

// ============================================================
// NEW: Messaging, Customization Requests, Reviews
// ============================================================

export interface CustomizationRequest {
  color?: string;
  size?: string;
  material?: string;
  design?: string;
  quantity?: number;
  otherRequirements?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
  customizationRequest?: CustomizationRequest;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  artisanId: string;
  artisanName: string;
  productId?: string;
  productTitle?: string;
  messages: ChatMessage[];
  lastMessageAt: string;
  unreadCount: number;
}

export interface PlacedOrder {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  artisanId: string;
  artisanName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  buyerId?: string;
  buyerName: string;
  buyerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  orderDate: string;
  status: 'confirmed' | 'dispatched' | 'delivered' | 'cancelled' | 'pending' | 'failed';
  items?: { productId: string; quantity: number; unitPrice: number }[];
}

export interface ProductReview {
  id: string;
  productId: string;
  artisanId?: string;
  buyerId: string;
  buyerName: string;
  orderId?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  verifiedPurchase?: boolean;
}

// Translation dictionary type
export type TranslationKey = string;
export type TranslationDictionary = Record<TranslationKey, string>;
export type LanguageTranslations = Record<Language, TranslationDictionary>;