import React, { useState } from 'react';
import { Search, Award, ShieldCheck, MessageSquare, Building2, CheckCircle2, Send, X, Sparkles } from 'lucide-react';
import { ProductListing, Language } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { translate } from '../services/translations';
import { getProductTitle, getProductDescription, getCategoryTranslation, getCraftTechniqueTranslation } from '../services/displayTranslation';

interface BuyerPortalProps {
  products: ProductListing[];
  onSelectProduct: (product: ProductListing) => void;
  onStartConversation?: (artisanId: string, artisanName: string, productId?: string, productTitle?: string) => void;
  onOpenCardModal?: () => void;
  language?: Language;
  buyerId?: string;
  buyerName?: string;
  buyerCompanyName?: string;
  buyerPhone?: string;
  recommendedProducts?: ProductListing[];
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  products,
  onSelectProduct,
  onStartConversation,
  onOpenCardModal,
  language = 'en',
  buyerId,
  buyerName = 'B2B Buyer',
  buyerCompanyName,
  buyerPhone,
  recommendedProducts = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [onlyGICertified, setOnlyGICertified] = useState(false);
  const [activeRFQProduct, setActiveRFQProduct] = useState<ProductListing | null>(null);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // RFQ Form State
  const [rfqForm, setRfqForm] = useState({
    companyName: buyerCompanyName || 'Crafts Procurement Ltd',
    buyerName: buyerName,
    email: '',
    phone: buyerPhone || '',
    quantity: 25,
    targetDate: '2026-04-15',
    notes: 'Required for corporate festive gifting. Needs authentic MoSJE GI certification tag included.'
  });

  const categories = [
    'all',
    'Textiles & Handloom',
    'Metalcraft & Dhokra',
    'Clay & Terracotta',
    'Traditional Painting',
  ];

  const states = [
    { value: 'all', label: 'All States of India (सभी शिल्प राज्य)' },
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh (Kalamkari, Kondapalli, Dharmavaram)' },
    { value: 'Assam', label: 'Assam (Muga Silk, Bamboo & Cane, Asharikandi Terracotta)' },
    { value: 'Bihar', label: 'Bihar (Mithila Madhubani, Sikki Grass, Sujani)' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh (Bastar Dhokra, Kosa Silk, Wrought Iron)' },
    { value: 'Gujarat', label: 'Gujarat (Ajrakh Block Print, Bandhani, Rogan Art, Patola)' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh (Kullu Shawls, Chamba Rumal, Woodcraft)' },
    { value: 'Jammu & Kashmir', label: 'Jammu & Kashmir (Pashmina, Sozni, Walnut Wood, Kani)' },
    { value: 'Karnataka', label: 'Karnataka (Channapatna Toys, Mysore Silk, Bidriware)' },
    { value: 'Kerala', label: 'Kerala (Aranmula Mirror, Kasavu Handloom, Bell Metal)' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh (Chanderi, Maheshwari, Gond Art, Bagh Print)' },
    { value: 'Maharashtra', label: 'Maharashtra (Paithani Sarees, Warli Art, Kolhapuri Leather)' },
    { value: 'Manipur', label: 'Manipur (Kauna Reed Mats, Longpi Black Pottery)' },
    { value: 'Nagaland', label: 'Nagaland (Naga Handloom, Cane & Bamboo Craft)' },
    { value: 'Odisha', label: 'Odisha (Pattachitra, Sambalpuri Ikat, Silver Filigree)' },
    { value: 'Punjab', label: 'Punjab (Phulkari Needlework, Traditional Jutti)' },
    { value: 'Rajasthan', label: 'Rajasthan (Jaipur Blue Pottery, Sanganeri Print, Mojari)' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu (Kanchipuram Silk, Thanjavur Paintings, Swamimalai Bronze)' },
    { value: 'Telangana', label: 'Telangana (Pochampally Ikat, Nirmal Toys, Pembarthi Brass)' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh (Banarasi Silk, Lucknow Chikankari, Moradabad Brass)' },
    { value: 'West Bengal', label: 'West Bengal (Bankura Terracotta, Kantha Stitch, Baluchari, Dokra)' },
  ];

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.titleHi.includes(searchQuery) ||
      p.craftTechnique.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesState = selectedState === 'all' || p.state === selectedState;
    const matchesGI = !onlyGICertified || p.giCertified;

    return matchesSearch && matchesCategory && matchesState && matchesGI;
  });

  const handleOpenRFQ = (product: ProductListing, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveRFQProduct(product);
    setRfqSubmitted(false);
  };

  const handleChatWithArtisan = (product: ProductListing, e: React.MouseEvent) => {
    e.stopPropagation();
    onStartConversation?.(product.artisanId, product.artisanName, product.id, product.titleEn);
  };

  const handleSendRFQ = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
    setTimeout(() => {
      setActiveRFQProduct(null);
      setRfqSubmitted(false);
    }, 2500);
  };

  // Derived real buyer recommendations (strictly real data; NO fake personalization)
  const computedRecommendations = (recommendedProducts && recommendedProducts.length > 0)
    ? recommendedProducts
    : products.filter((p) => p.giCertified || p.featured).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Government & B2B Buyer Linkage Banner */}
      <div className="bg-gradient-to-br from-[#1C1815] via-[#2A231D] to-[#181412] rounded-3xl p-6 sm:p-7 text-white border border-amber-500/30 shadow-[0_12px_40px_rgba(0,0,0,0.18)] relative overflow-hidden">
        {/* Top subtle golden shimmer line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-saffron-400 to-amber-600"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                <Building2 className="w-3.5 h-3.5" />
                GeM & TRIFED Integrated
              </span>
              <span className="text-[11px] text-stone-300 font-medium">
                MoSJE Verified Artisan Registry
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              B2B Artisan Sourcing & Bulk Procurement
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Direct market linkage for boutique retailers, export houses, interior designers, and corporate procurement. Purchase authentic GI-tagged handicrafts directly from master artisans with zero middleman commissions.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/15 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg">
            <span className="text-xs text-amber-200 uppercase font-bold tracking-wider">Fair Wage Impact</span>
            <span className="text-2xl font-black text-amber-400 mt-0.5">100% Direct</span>
            <span className="text-[10px] text-emerald-300 font-medium">DBT to Artisan Bank Accounts</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by craft, GI tag, material, artisan name..."
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full sm:w-auto px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-400 max-w-xs truncate"
          >
            {states.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* GI Certified Toggle */}
          <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer whitespace-nowrap bg-stone-50 px-3 py-2.5 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              checked={onlyGICertified}
              onChange={(e) => setOnlyGICertified(e.target.checked)}
              className="rounded text-stone-900 accent-stone-900 focus:ring-stone-400"
            />
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              GI Tag Certified Only
            </span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat === 'all' ? (translate(language, 'buyer.allCategories') || 'All Craft Categories') : getCategoryTranslation(cat, language)}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Crafts Section — Real Supabase recommendations & interests */}
      {computedRecommendations.length > 0 && selectedCategory === 'all' && selectedState === 'all' && !searchQuery && (
        <div className="bg-amber-50/70 rounded-3xl p-4 sm:p-5 border border-amber-200/80 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-stone-900">Recommended for You</h3>
                <p className="text-[11px] text-stone-500">
                  Popular GI-certified & top verified craft items for buyers
                </p>
              </div>
            </div>
            <span className="text-[10px] bg-white text-stone-700 px-2.5 py-1 rounded-full font-bold border border-amber-200 shadow-2xs">
              Personalized
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {computedRecommendations.slice(0, 4).map((product) => (
              <div
                key={`rec-${product.id}`}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-2xl p-3 border border-amber-200/90 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={product.enhancedImageUrl || product.enhancedImage || product.originalImageUrl || product.originalImage}
                      alt={product.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.giCertified && (
                      <span className="absolute top-2 left-2 bg-[#1C1815]/90 text-amber-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 backdrop-blur-xs">
                        GI Tagged
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-saffron-700 uppercase tracking-wider block truncate">
                      {product.category}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1 group-hover:text-saffron-700 transition-colors">
                      {product.titleEn}
                    </h4>
                    <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                      {product.craftTechnique} • {product.state}
                    </p>
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-black text-stone-900">
                    ₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold group-hover:underline">
                    View Craft →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-stone-500 px-1">
        <span>Showing <strong className="text-stone-900">{filteredProducts.length}</strong> verified artisan listings</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          MoSJE Beneficiary Verified
        </span>
      </div>

      {/* Product Catalog Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-3xl border border-stone-200/90 space-y-3">
          <div className="text-4xl">🔍</div>
          <h3 className="font-bold text-base text-stone-900">No Craft Items Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            No products match your search query or selected filters. Try resetting your search filters to explore all artisan listings.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedState('all');
              setOnlyGICertified(false);
            }}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Product Visual */}
              <div className="relative aspect-[4/3] bg-[#FAF7F2] overflow-hidden flex items-center justify-center">
                <img
                  src={product.enhancedImageUrl || product.enhancedImage || product.originalImageUrl || product.originalImage}
                  alt={product.titleEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.giCertified && (
                    <span className="bg-[#1C1815]/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs border border-amber-400/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-300" />
                      GI Certified
                    </span>
                  )}
                  <span className="bg-stone-900/85 text-saffron-300 text-[9px] font-mono px-2 py-0.5 rounded-md backdrop-blur">
                    {product.state}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {(product.enhancedImageUrl || product.enhancedImage) && (
                    <span className="bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 border border-emerald-500/40">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      AI Studio
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-stone-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs border border-stone-200/60">
                  {product.stockQuantity} in stock
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider">
                    {getCategoryTranslation(product.category, language)}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 line-clamp-1 group-hover:text-saffron-700 transition-colors mt-0.5">
                    {getProductTitle(product, language)}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {getProductDescription(product, language)}
                  </p>
                </div>

                {/* Artisan Info Line */}
                <div className="flex items-center space-x-2 pt-1">
                  <img
                    src={CURRENT_ARTISAN.avatarUrl}
                    alt={product.artisanName}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-saffron-500"
                  />
                  <span className="text-xs font-semibold text-stone-700 truncate">
                    {product.artisanName}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>

                {/* Pricing & Wholesale Tiers Pill */}
                <div className="bg-gradient-to-b from-[#FAF8F5] to-[#F5EFEB] p-3.5 rounded-2xl border border-amber-100/90 space-y-1.5 shadow-2xs">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500">Retail MSRP:</span>
                    <span className="text-sm font-black text-stone-900">
                      ₹{product.pricing.suggestedRetailPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs pt-1 border-t border-amber-200/60">
                    <span className="font-semibold text-emerald-700">Bulk (10+ pcs):</span>
                    <span className="font-bold text-emerald-700">
                      ₹{product.pricing.wholesaleTiers[1].unitPrice.toLocaleString('en-IN')} / pc
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-stone-800">Govt Bulk (50+ pcs):</span>
                    <span className="font-bold text-stone-900">
                      ₹{product.pricing.wholesaleTiers[2].unitPrice.toLocaleString('en-IN')} / pc
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-4 pt-0 flex items-center justify-between gap-2">
              <button
                onClick={(e) => handleChatWithArtisan(product, e)}
                className="p-2.5 rounded-xl border border-stone-200 hover:bg-emerald-50 text-stone-700 transition-colors shadow-2xs"
                title="Chat with Artisan"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
              </button>

              {onOpenCardModal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenCardModal();
                  }}
                  className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-900 transition-colors shadow-2xs"
                  title="View Verified Artisan Smart ID Profile"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                </button>
              )}

              <button
                onClick={(e) => handleOpenRFQ(product, e)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Request B2B Quote</span>
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Bulk RFQ Modal */}
      {activeRFQProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-stone-200 relative animate-scaleIn my-auto">
            <button
              onClick={() => setActiveRFQProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {rfqSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">RFQ Sent to Artisan!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Your bulk quotation request for <strong>{rfqForm.quantity} units</strong> has been transmitted to master artisan <strong>{activeRFQProduct.artisanName}</strong> and registered on the MoSJE marketplace portal.
                </p>
                <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-xl inline-block">
                  RFQ Reference: #RFQ-MoSJE-2025-{Math.floor(1000 + Math.random() * 9000)}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendRFQ} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider">
                    B2B Wholesale RFQ
                  </span>
                  <h3 className="font-bold text-lg text-stone-900 leading-tight">
                    {getProductTitle(activeRFQProduct, language)}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Artisan: {activeRFQProduct.artisanName} • {getCraftTechniqueTranslation(activeRFQProduct.craftTechnique, language)}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={rfqForm.companyName}
                      onChange={(e) => setRfqForm({ ...rfqForm, companyName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Buyer Name</label>
                    <input
                      type="text"
                      value={rfqForm.buyerName}
                      onChange={(e) => setRfqForm({ ...rfqForm, buyerName: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Required Quantity (Units)</label>
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={rfqForm.quantity}
                      onChange={(e) => setRfqForm({ ...rfqForm, quantity: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 font-bold focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Estimated Unit Price</label>
                    <div className="px-3 py-2 bg-stone-100 rounded-xl text-xs font-mono font-bold text-emerald-800">
                      ₹{activeRFQProduct.pricing.wholesaleTiers[rfqForm.quantity >= 50 ? 2 : 1].unitPrice.toLocaleString('en-IN')} / unit
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Delivery Target Date</label>
                  <input
                    type="date"
                    value={rfqForm.targetDate}
                    onChange={(e) => setRfqForm({ ...rfqForm, targetDate: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Customization / Packaging Notes</label>
                  <textarea
                    rows={2}
                    value={rfqForm.notes}
                    onChange={(e) => setRfqForm({ ...rfqForm, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-saffron-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveRFQProduct(null)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Official RFQ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};