import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle2, Send, AlertTriangle, Loader2, ShoppingBag } from 'lucide-react';
import { ProductReview, Language } from '../types';
import { translate } from '../services/translations';
import { verifyBuyerPurchase } from '../services/firebase';

interface ReviewsSectionProps {
  productId: string;
  productTitle: string;
  artisanId?: string;
  reviews: ProductReview[];
  language?: Language;
  currentBuyerName?: string;
  currentBuyerId?: string;
  onAddReview: (review: ProductReview) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  autoShowForm?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  productTitle,
  artisanId,
  reviews = [],
  language = 'en',
  currentBuyerName = 'Vikram Mehta',
  currentBuyerId = 'buyer-201',
  onAddReview,
  isLoading = false,
  error = null,
  autoShowForm = false,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(autoShowForm);

  useEffect(() => {
    if (autoShowForm) {
      setShowForm(true);
    }
  }, [autoShowForm]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Purchase Verification State
  const [isCheckingVerification, setIsCheckingVerification] = useState<boolean>(true);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const t = (key: string) => translate(language, key);

  // Filter reviews for this specific product
  const productReviews = reviews.filter((r) => r.productId === productId);
  const totalReviews = productReviews.length;

  // Calculate Average Rating: sum of all ratings / number of reviews
  const avgRatingNumber = totalReviews > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;
  const formattedAvgRating = totalReviews > 0 ? avgRatingNumber.toFixed(1) : '0.0';

  // Check buyer order eligibility on mount & when buyer/product changes
  useEffect(() => {
    let isMounted = true;
    setIsCheckingVerification(true);
    setVerificationError(null);

    verifyBuyerPurchase(currentBuyerId, productId)
      .then((res) => {
        if (isMounted) {
          setIsVerifiedBuyer(res.isVerified);
          setIsCheckingVerification(false);
        }
      })
      .catch((err) => {
        console.warn('Purchase verification check failed:', err);
        if (isMounted) {
          setIsVerifiedBuyer(false);
          setVerificationError(language === 'hi' ? 'आपकी खरीद सत्यापित करने में असमर्थ। कृपया पुनः प्रयास करें।' : 'Unable to verify your purchase. Please try again.');
          setIsCheckingVerification(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [productId, currentBuyerId, language]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    if (!isVerifiedBuyer) {
      setSubmitError(language === 'hi' ? 'केवल वे ग्राहक जिन्होंने यह उत्पाद खरीदा है, वे ही समीक्षा छोड़ सकते हैं।' : 'Only customers who have purchased this product can leave a review.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setSubmitError(language === 'hi' ? 'कृपया 1 से 5 स्टार रेटिंग चुनें।' : 'Please select a rating between 1 and 5 stars.');
      return;
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length === 0) {
      setSubmitError(language === 'hi' ? 'कृपया एक समीक्षा लिखें।' : 'Please write a review.');
      setIsSubmitting(false);
      return;
    }

    const newReview: ProductReview = {
      id: `rev-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      productId,
      artisanId,
      buyerId: currentBuyerId,
      buyerName: currentBuyerName,
      rating,
      comment: trimmedComment,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      verifiedPurchase: true,
    };

    try {
      if (onAddReview) {
        await onAddReview(newReview);
      }
      setComment('');
      setShowForm(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('Review submission error:', err);
      // Keep review form open and display user-friendly error
      setSubmitError('Unable to submit your review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, sizeClass = 'w-3.5 h-3.5') => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= value ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200 space-y-4">
      {/* Header & Rating Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/70 flex flex-col items-center justify-center font-bold">
            <span className="text-base leading-none text-stone-900 font-extrabold">{totalReviews > 0 ? formattedAvgRating : '⭐'}</span>
            <span className="text-[9px] text-stone-500 font-normal">/ 5</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-stone-900">
                {language === 'hi' ? 'समीक्षाएं एवं रेटिंग' : 'Reviews & Ratings'}
              </h3>
              {totalReviews > 0 && (
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(avgRatingNumber))}
                </div>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {totalReviews > 0 ? (
                <>
                  <span className="font-semibold text-stone-700">⭐ {formattedAvgRating} / 5</span> • {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </>
              ) : (
                language === 'hi' ? 'अभी कोई समीक्षा नहीं है' : 'No ratings yet'
              )}
            </p>
          </div>
        </div>

        {/* Purchase Verification & Write Review Button */}
        <div className="self-start sm:self-auto">
          {isCheckingVerification ? (
            <div className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-xl text-xs font-medium flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-500" />
              <span>{language === 'hi' ? 'खरीद इतिहास की जाँच हो रही है...' : 'Checking purchase history...'}</span>
            </div>
          ) : verificationError ? (
            <div className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>{verificationError}</span>
            </div>
          ) : isVerifiedBuyer ? (
            <button
              type="button"
              onClick={() => {
                setShowForm(!showForm);
                setSubmitError(null);
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>{showForm ? (language === 'hi' ? 'बंद करें' : 'Close Form') : (language === 'hi' ? 'समीक्षा लिखें' : 'Write a Review')}</span>
            </button>
          ) : (
            <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-[11px] text-stone-600 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span>
                {language === 'hi'
                  ? 'सत्यापित समीक्षा छोड़ने के लिए इस उत्पाद को खरीदें।'
                  : 'Purchase this product to leave a verified review.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Rating Distribution Bar Chart */}
      {totalReviews > 0 && (
        <div className="bg-stone-50/70 p-3 rounded-xl border border-stone-200/60 space-y-1.5">
          <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block">
            {language === 'hi' ? 'रेटिंग वितरण' : 'Rating Distribution'}
          </span>
          {[5, 4, 3, 2, 1].map((starCount) => {
            const count = productReviews.filter((r) => r.rating === starCount).length;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={starCount} className="flex items-center text-[11px] gap-2">
                <span className="w-8 font-bold text-stone-700 text-[10px] flex items-center gap-0.5">
                  {starCount} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 inline" />
                </span>
                <div className="flex-1 h-2 bg-stone-200/80 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="w-10 text-right text-stone-500 font-mono text-[10px]">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Success Notification */}
      {submitted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{language === 'hi' ? 'समीक्षा सफलतापूर्वक सबमिट की गई।' : 'Review submitted successfully.'}</span>
        </div>
      )}

      {/* Write Review Form (Only accessible to verified buyers) */}
      {showForm && isVerifiedBuyer && (
        <form onSubmit={handleSubmit} className="p-4 bg-stone-50/90 border border-stone-200 rounded-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
            <span className="text-xs font-bold text-stone-800">
              {language === 'hi' ? 'रेटिंग चुनें:' : 'Select Rating:'}
            </span>

            {/* Star Rating Picker (1 to 5) */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 rounded transition-transform hover:scale-110 focus:outline-none ${
                    star <= rating ? 'text-amber-500' : 'text-stone-300'
                  }`}
                  title={`${star} Star`}
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}`} />
                </button>
              ))}
              <span className="ml-1.5 font-bold text-xs text-stone-700 font-mono">{rating}/5</span>
            </div>
          </div>

          {/* Review Text Comment */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-stone-600 block">
              {language === 'hi' ? 'आपकी समीक्षा (ऐच्छिक):' : 'Your Review:'}
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={language === 'hi' ? 'यहां अपनी समीक्षा लिखें...' : 'Write your review here...'}
              className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
            />
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Form Buttons */}
          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                setShowForm(false);
                setSubmitError(null);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-white transition-colors"
            >
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'hi' ? 'सबमिट हो रहा है...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'समीक्षा सबमिट करें' : 'Submit Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List / Loading / Error State */}
      {isLoading ? (
        <div className="p-8 text-center space-y-2 bg-stone-50/60 rounded-2xl border border-stone-200">
          <Loader2 className="w-6 h-6 animate-spin text-saffron-600 mx-auto" />
          <p className="text-xs font-semibold text-stone-600">
            {language === 'hi' ? 'समीक्षाएं लोड हो रही हैं...' : 'Loading product reviews...'}
          </p>
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 space-y-1">
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{language === 'hi' ? 'समीक्षाएं लोड करने में विफल' : 'Failed to load reviews'}</span>
          </div>
          <p className="text-stone-600 text-[11px]">{error}</p>
        </div>
      ) : totalReviews === 0 ? (
        <div className="p-6 text-center bg-stone-50/60 rounded-2xl border border-stone-200/80 space-y-1">
          <div className="text-3xl">⭐</div>
          <h4 className="font-bold text-stone-800 text-xs">
            {language === 'hi' ? 'अभी कोई समीक्षा नहीं है' : 'No reviews yet'}
          </h4>
          <p className="text-[11px] text-stone-500">
            {language === 'hi' ? 'इस हस्तशिल्प उत्पाद की समीक्षा करने वाले पहले व्यक्ति बनें।' : 'Be the first to write a review for this craft product.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {productReviews.map((review) => (
            <div key={review.id} className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                    {review.buyerName ? review.buyerName.charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">{review.buyerName}</span>
                      {/* Render Verified Purchase Badge ONLY when verifiedPurchase === true */}
                      {review.verifiedPurchase === true && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {language === 'hi' ? 'सत्यापित खरीद' : 'Verified Purchase'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono block">{review.createdAt}</span>
                  </div>
                </div>

                <div className="text-right">
                  {renderStars(review.rating)}
                </div>
              </div>

              {review.comment && (
                <p className="text-xs text-stone-700 leading-relaxed pt-1 border-t border-stone-100">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};