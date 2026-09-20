import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle2, Send } from 'lucide-react';
import { ProductReview, Language } from '../types';
import { translate } from '../services/translations';

interface ReviewsSectionProps {
  productId: string;
  productTitle: string;
  reviews: ProductReview[];
  language: Language;
  currentBuyerName: string;
  onAddReview: (review: ProductReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  productId,
  productTitle,
  reviews,
  language,
  currentBuyerName,
  onAddReview,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const t = (key: string) => translate(language, key);

  const handleSubmit = () => {
    if (!comment.trim()) return;
    const review: ProductReview = {
      id: `review-${Date.now()}`,
      productId,
      buyerId: 'buyer-201',
      buyerName: currentBuyerName,
      rating,
      comment: comment.trim(),
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    onAddReview(review);
    setComment('');
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const renderStars = (value: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= value ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 space-y-3">
      {/* Header */}
      <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/60">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </span>
          <div>
            <h3 className="font-bold text-sm text-stone-900">{t('review.title')}</h3>
            <p className="text-[11px] text-stone-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} • {productTitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {t('review.writeReview')}
        </button>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {t('success.reviewSubmitted')}
        </div>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="p-4 bg-[#FAF8F5] border border-stone-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800">{t('review.rating')}:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`p-0.5 rounded transition-transform hover:scale-110 ${
                    star <= rating ? 'text-amber-500' : 'text-stone-300'
                  }`}
                >
                  <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('review.comment')}
            className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 resize-none"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!comment.trim()}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {t('review.submit')}
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="p-6 text-center bg-stone-50/60 rounded-2xl border border-stone-200/80">
          <div className="text-3xl mb-1">⭐</div>
          <p className="text-xs text-stone-600">{t('review.noReviews')}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {reviews.map((review) => (
            <div key={review.id} className="p-3.5 bg-white rounded-xl border border-stone-200/80 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center text-[10px] font-bold">
                    {review.buyerName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-stone-900">{review.buyerName}</span>
                    <span className="text-[10px] text-stone-500 font-medium flex items-center gap-1 ml-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      {t('review.verifiedPurchase')}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <span className="text-[9px] text-stone-400 block mt-0.5">{review.createdAt}</span>
                </div>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed pt-0.5">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};