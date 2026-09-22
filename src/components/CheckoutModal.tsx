import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, CheckCircle2, CreditCard, ArrowRight, IndianRupee, Sparkles, Building2, User, Phone, MapPin, Star } from 'lucide-react';
import { ProductListing, Language, PlacedOrder } from '../types';
import { translate } from '../services/translations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductListing;
  language?: Language;
  onOrderSuccess: (order: PlacedOrder) => void;
  onLeaveReview?: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  language = 'en',
  onOrderSuccess,
  onLeaveReview,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'retail' | 'bulk'>('retail');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'gem_escrow' | 'card' | 'cod'>('upi');
  
  // Buyer form fields
  const [buyerName, setBuyerName] = useState('Vikram Mehta');
  const [buyerPhone, setBuyerPhone] = useState('+91 98765 43210');
  const [buyerAddress, setBuyerAddress] = useState('Plot 42, FabIndia Central Hub, Connaught Place, New Delhi - 110001');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const t = (key: string) => translate(language, key);

  if (!isOpen) return null;

  // Pricing calculations
  const retailPrice = product.pricing?.suggestedRetailPrice || 2500;
  const wholesalePrice = product.pricing?.wholesaleTiers?.[0]?.unitPrice || Math.round(retailPrice * 0.8);
  
  const unitPrice = orderType === 'bulk' || quantity >= 10 ? wholesalePrice : retailPrice;
  const subtotal = unitPrice * quantity;
  const volumeDiscount = quantity >= 10 ? Math.round(retailPrice * quantity - subtotal) : 0;
  const shippingFee = 0; // Subsidized by MoSJE
  const finalTotal = subtotal;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: PlacedOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        productId: product.id,
        productTitle: language === 'hi' ? product.titleHi : product.titleEn,
        productImage: product.enhancedImage || product.originalImage,
        artisanId: product.artisanId,
        artisanName: product.artisanName,
        quantity,
        unitPrice,
        totalAmount: finalTotal,
        buyerId: 'buyer-201',
        buyerName,
        buyerPhone,
        shippingAddress: buyerAddress,
        paymentMethod: paymentMethod === 'upi' ? 'UPI / Direct DBT' : paymentMethod === 'gem_escrow' ? 'GeM MoSJE Escrow' : paymentMethod === 'card' ? 'Card / Net Banking' : 'Verified COD',
        orderDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'confirmed',
      };

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('shilp_ai_orders') || '[]');
        localStorage.setItem('shilp_ai_orders', JSON.stringify([newOrder, ...existing]));
      } catch (err) {
        console.warn('Could not save order to storage:', err);
      }

      setPlacedOrder(newOrder);
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92dvh] overflow-y-auto shadow-2xl border border-stone-200 animate-scaleIn my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-saffron-700 via-stone-900 to-navy-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-xl">
              🛍️
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {placedOrder
                  ? (language === 'hi' ? 'ऑर्डर की पुष्टि हो गई!' : 'Order Confirmed!')
                  : (language === 'hi' ? 'कारीगर से सीधे खरीदारी (Direct Purchase)' : 'Direct Artisan Purchase & Checkout')}
              </h3>
              <p className="text-xs text-stone-300">
                {language === 'hi' ? 'MoSJE शून्य-कमीशन कारीगर एस्क्रो प्रणाली' : '100% Direct to Artisan • Zero Middleman Commission'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed Screen */}
        {placedOrder ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Payment & Order Verified
              </span>
              <h4 className="text-xl font-black text-stone-900 mt-2">
                Thank You, {placedOrder.buyerName}!
              </h4>
              <p className="text-xs text-stone-500">
                Order ID: <span className="font-mono font-bold text-stone-900">{placedOrder.id}</span>
              </p>
            </div>

            {/* Order Card Preview */}
            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left flex items-center gap-4">
              <img
                src={placedOrder.productImage}
                alt={placedOrder.productTitle}
                className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-xs text-stone-900 truncate">
                  {placedOrder.productTitle}
                </h5>
                <p className="text-[11px] text-stone-500">
                  Artisan: <span className="font-semibold text-stone-800">{placedOrder.artisanName}</span>
                </p>
                <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-900 mt-1">
                  <span>Qty: {placedOrder.quantity}</span>
                  <span className="text-saffron-700">₹{placedOrder.totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Escrow & Delivery Notice */}
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-left text-xs text-blue-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold block">MoSJE Fair Escrow Protection:</span>
                Your payment is securely held. Funds will be released to the artisan's Aadhaar DBT account upon dispatch tracking confirmation.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  if (placedOrder && onLeaveReview) {
                    onLeaveReview(placedOrder);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold shadow-md shadow-saffron-600/25 transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Back to Marketplace & Leave Review</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handlePlaceOrder} className="p-6 space-y-5">
            {/* Product Summary Row */}
            <div className="flex items-center gap-3.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <img
                src={product.enhancedImage || product.originalImage}
                alt={product.titleEn}
                className="w-16 h-16 rounded-xl object-cover border border-stone-200 shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-saffron-700 bg-saffron-50 px-2 py-0.5 rounded border border-saffron-200">
                  {product.category}
                </span>
                <h4 className="font-extrabold text-sm text-stone-900 truncate mt-0.5">
                  {language === 'hi' ? product.titleHi : product.titleEn}
                </h4>
                <p className="text-[11px] text-stone-500">
                  Artisan: <span className="font-semibold text-stone-800">{product.artisanName}</span> ({product.state})
                </p>
              </div>
            </div>

            {/* Order Type & Quantity Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Order Type
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('retail');
                      if (quantity > 5) setQuantity(1);
                    }}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      orderType === 'retail'
                        ? 'bg-white text-saffron-700 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Retail (1-9 pcs)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('bulk');
                      if (quantity < 10) setQuantity(10);
                    }}
                    className={`py-1.5 rounded-lg font-bold transition-all ${
                      orderType === 'bulk'
                        ? 'bg-saffron-600 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Wholesale (10+ pcs)
                  </button>
                </div>
              </div>

              {/* Quantity Counter */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Quantity
                </label>
                <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-base flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center font-bold text-sm text-stone-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-base flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Buyer Contact & Delivery Details */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-saffron-600" />
                Delivery Information
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] text-stone-500 font-medium mb-1">Buyer / Company Name</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500 font-medium mb-1">Mobile (Aadhaar/OTP Verified)</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-stone-500 font-medium mb-1">Complete Delivery Address</label>
                <input
                  type="text"
                  required
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-saffron-600" />
                Secure Payment Method
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / DBT', sub: 'Zero fee', icon: '⚡' },
                  { id: 'gem_escrow', label: 'GeM Escrow', sub: 'Govt & B2B', icon: '🏛️' },
                  { id: 'card', label: 'Cards / Net', sub: 'All banks', icon: '💳' },
                  { id: 'cod', label: 'Cash on Del.', sub: 'Verified', icon: '💵' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      paymentMethod === p.id
                        ? 'border-saffron-600 bg-saffron-50/70 ring-1 ring-saffron-500'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-base">{p.icon}</div>
                    <div className="font-bold text-xs text-stone-900 mt-1">{p.label}</div>
                    <div className="text-[10px] text-stone-500">{p.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown Bill */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Unit Price ({quantity} x ₹{unitPrice.toLocaleString('en-IN')})</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {volumeDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Bulk Discount Applied (Wholesale Tier)</span>
                  <span>-₹{volumeDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>MoSJE Subsidized Shipping & Insurance</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (Micro-Artisan Exemption Under ₹20L)</span>
                <span className="text-stone-500">₹0 (Exempt)</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-base font-black text-stone-900">
                <span>Total Payable:</span>
                <span className="text-saffron-700">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white font-black text-sm shadow-lg shadow-saffron-600/30 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Processing MoSJE Escrow Transaction...</span>
              ) : (
                <>
                  <span>Confirm Order & Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
