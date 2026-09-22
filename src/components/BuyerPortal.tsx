import React, { useState } from 'react';
import { Search, Award, ShieldCheck, MessageSquare, Building2, CheckCircle2, Send, X, Sparkles, ShoppingBag, Star, Package, Clock, Check } from 'lucide-react';
import { ProductListing, Language, PlacedOrder, ProductReview } from '../types';
import { CURRENT_ARTISAN } from '../data/craftPresets';
import { ReviewsSection } from './ReviewsSection';

interface BuyerPortalProps {
  products: ProductListing[];
  orders?: PlacedOrder[];
  reviews?: ProductReview[];
  onSelectProduct: (product: ProductListing) => void;
  onStartConversation?: (artisanId: string, artisanName: string, productId?: string, productTitle?: string) => void;
  onAddReview?: (review: ProductReview) => void;
  language?: Language;
  currentBuyerId?: string;
  currentBuyerName?: string;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  products,
  orders = [],
  reviews = [],
  onSelectProduct,
  onStartConversation,
  onAddReview,
  language = 'en',
  currentBuyerId = 'buyer-201',
  currentBuyerName = 'Vikram Mehta',
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'catalog' | 'orders'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [onlyGICertified, setOnlyGICertified] = useState(false);
  const [activeRFQProduct, setActiveRFQProduct] = useState<ProductListing | null>(null);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [activeReviewModalOrder, setActiveReviewModalOrder] = useState<PlacedOrder | null>(null);

  // RFQ Form State
  const [rfqForm, setRfqForm] = useState({
    companyName: 'FabIndia Crafts Procurement Ltd',
    buyerName: 'Vikram Mehta',
    email: 'procurement@fabindia-sample.com',
    phone: '+91 98201 44552',
    quantity: 25,
    targetDate: '2025-04-15',
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

  const buyerOrders = orders.filter(
    (o) => o.buyerId === currentBuyerId || (currentBuyerId === 'buyer-201' && (o.buyerName === 'Vikram Mehta' || !o.buyerId))
  );

  return (
    <div className="space-y-6">
      {/* Buyer Tab Bar: Marketplace Catalog vs My Orders */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <div className="flex items-center space-x-2 bg-stone-200/70 p-1 rounded-2xl">
          <button
            onClick={() => setActivePortalTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activePortalTab === 'catalog' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Marketplace Catalog</span>
          </button>
          <button
            onClick={() => setActivePortalTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activePortalTab === 'orders' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>My Orders ({buyerOrders.length})</span>
          </button>
        </div>

        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Logged in as: <strong className="text-stone-900">{currentBuyerName}</strong>
        </span>
      </div>

      {activePortalTab === 'orders' ? (
        /* My Orders View */
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-saffron-600" />
              <span>Buyer Order History</span>
            </h2>
            <p className="text-xs text-stone-500">
              Track your past craft orders. Once an order is delivered, click <strong className="text-stone-800">Rate & Review</strong> to share your verified craft experience.
            </p>
          </div>

          {buyerOrders.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-800 text-sm">No orders found</h3>
              <p className="text-xs text-stone-500">
                Browse our marketplace catalog to place your first craft order directly from master artisans.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {buyerOrders.map((order) => {
                const existingReview = reviews.find(
                  (r) => r.productId === order.productId && (r.buyerId === currentBuyerId || r.buyerName === currentBuyerName)
                );
                const isDelivered = order.status === 'delivered' || (order.status as string) === 'completed';
                const matchingProduct = products.find((p) => p.id === order.productId);

                return (
                  <div
                    key={order.id}
                    className="p-4 sm:p-5 bg-white rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={order.productImage || matchingProduct?.enhancedImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'}
                        alt={order.productTitle}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-2xs flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md border border-stone-200">
                            {order.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isDelivered
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            {isDelivered ? '✓ Delivered' : order.status.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-stone-900">{order.productTitle}</h4>
                        <p className="text-xs text-stone-500">
                          Artisan: <strong>{order.artisanName}</strong> • Qty: {order.quantity} • Date: {order.orderDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block font-medium">Total Paid</span>
                        <span className="text-base font-black text-stone-900 font-mono">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {isDelivered ? (
                        existingReview ? (
                          <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>✓ Reviewed ({existingReview.rating}★)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setActiveReviewModalOrder(order)}
                            className="px-4 py-2 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-saffron-600/20 transition-all"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>Rate & Review</span>
                          </button>
                        )
                      ) : (
                        <span className="text-[11px] text-stone-500 bg-stone-100 px-3 py-1 rounded-xl border border-stone-200">
                          Review available upon delivery
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Marketplace Catalog View */
        <>
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
              {cat === 'all' ? 'All Craft Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex justify-between items-center text-xs text-stone-500 px-1">
        <span>Showing <strong className="text-stone-900">{filteredProducts.length}</strong> verified artisan listings</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          MoSJE Beneficiary Verified
        </span>
      </div>

      {/* Product Catalog Grid */}
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
                    {product.category}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 line-clamp-1 group-hover:text-saffron-700 transition-colors mt-0.5">
                    {product.titleEn}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.descriptionEn}
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
                    {activeRFQProduct.titleEn}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Artisan: {activeRFQProduct.artisanName} • {activeRFQProduct.craftTechnique}
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
      </>
      )}

      {/* Rate & Review Order Modal */}
      {activeReviewModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-stone-200 relative animate-scaleIn my-auto">
            <button
              onClick={() => setActiveReviewModalOrder(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4 pb-3 border-b border-stone-100">
              <span className="text-[10px] font-bold text-saffron-700 uppercase tracking-wider block">
                Verified Order Review • Order #{activeReviewModalOrder.id}
              </span>
              <h3 className="font-bold text-lg text-stone-900 leading-tight">
                {activeReviewModalOrder.productTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Artisan: <strong>{activeReviewModalOrder.artisanName}</strong> • Delivered on {activeReviewModalOrder.orderDate}
              </p>
            </div>

            <ReviewsSection
              productId={activeReviewModalOrder.productId}
              productTitle={activeReviewModalOrder.productTitle}
              artisanId={activeReviewModalOrder.artisanId}
              reviews={reviews}
              language={language}
              currentBuyerName={currentBuyerName}
              currentBuyerId={currentBuyerId}
              onAddReview={async (rev) => {
                const enrichedReview: ProductReview = {
                  ...rev,
                  orderId: activeReviewModalOrder.id,
                  artisanId: activeReviewModalOrder.artisanId,
                };
                if (onAddReview) {
                  await onAddReview(enrichedReview);
                }
                setActiveReviewModalOrder(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};