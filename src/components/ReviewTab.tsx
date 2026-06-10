import React, { useState } from 'react';
import { Star, MessageSquarePlus, MessageSquare, ThumbsUp, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { Review, Place } from '../types';

interface ReviewTabProps {
  place: Place;
  onUpdateReviews: (placeId: string, updatedReviews: Review[], newRating: number) => void;
}

export default function ReviewTab({ place, onUpdateReviews }: ReviewTabProps) {
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Total rating counts to draw bars
  const totalReviewsCount = place.reviews.length;
  const ratingCounts = {
    5: place.reviews.filter(r => Math.round(r.rating) === 5).length,
    4: place.reviews.filter(r => Math.round(r.rating) === 4).length,
    3: place.reviews.filter(r => Math.round(r.rating) === 3).length,
    2: place.reviews.filter(r => Math.round(r.rating) === 2).length,
    1: place.reviews.filter(r => Math.round(r.rating) === 1).length,
  };

  const filteredReviews = place.reviews.filter(review => {
    if (selectedSentiment === 'all') return true;
    return review.sentiment === selectedSentiment;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !commentText.trim()) {
      setErrorMessage('Vui lòng điền đầy đủ họ tên và nội dung đánh giá của bạn.');
      return;
    }

    setErrorMessage('');

    // Estimate sentiment based on rating
    let sentiment: 'positive' | 'neutral' | 'negative' = 'positive';
    if (commentRating <= 2) sentiment = 'negative';
    else if (commentRating === 3) sentiment = 'neutral';

    const newReview: Review = {
      id: `review-${Date.now()}`,
      author: authorName.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60', // standard avatar icon
      rating: commentRating,
      date: new Date().toISOString().split('T')[0],
      text: commentText.trim(),
      sentiment
    };

    const newReviewsList = [newReview, ...place.reviews];
    
    // Calculate new average rating
    const totalRatingSum = newReviewsList.reduce((acc, r) => acc + r.rating, 0);
    const calculatedNewRating = parseFloat((totalRatingSum / newReviewsList.length).toFixed(1));

    onUpdateReviews(place.id, newReviewsList, calculatedNewRating);

    // Reset Form state
    setAuthorName('');
    setCommentText('');
    setCommentRating(5);
    setShowWriteReview(false);
  };

  return (
    <div id="review-content" className="space-y-6">
      
      {/* 1. Star Rating progression layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
        
        {/* Score box */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-4 border-b md:border-b-0 md:border-r border-neutral-200/60">
          <span className="text-5xl font-extrabold text-neutral-900 font-mono leading-none">{place.rating}</span>
          
          <div className="flex items-center gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i <= Math.round(place.rating) ? 'text-amber-400 fill-current' : 'text-neutral-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-neutral-500 font-medium mt-2">{place.totalReviews + place.reviews.length - 2} đánh giá khách hàng</span>
          
          {/* Custom micro AI highlight statement */}
          <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-emerald-100 animate-pulse">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>98.6% Khách Đánh Giá Tốt</span>
          </div>
        </div>

        {/* Breakdown bar graph */}
        <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = (ratingCounts as any)[stars] || 0;
            const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-neutral-500 font-mono font-medium text-right flex items-center justify-end gap-1">
                  {stars} <Star className="w-3 h-3 fill-current text-amber-400" />
                </span>
                
                {/* Progress outline */}
                <div className="flex-1 h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-neutral-400 text-left font-mono">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Feedback filters & Submit actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        
        {/* Sentiment Category Tabs */}
        <div className="flex flex-wrap gap-1.5 self-stretch sm:self-auto">
          <button
            onClick={() => setSelectedSentiment('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSentiment === 'all'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            Tất cả ({totalReviewsCount})
          </button>
          <button
            onClick={() => setSelectedSentiment('positive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 ${
              selectedSentiment === 'positive'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
            }`}
          >
            <Smile className="w-3.5 h-3.5" /> Tích cực ({ratingCounts[5] + ratingCounts[4]})
          </button>
          <button
            onClick={() => setSelectedSentiment('neutral')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSentiment === 'neutral'
                ? 'bg-neutral-500 text-white shadow-sm'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            Bình thường ({ratingCounts[3]})
          </button>
          <button
            onClick={() => setSelectedSentiment('negative')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedSentiment === 'negative'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
            }`}
          >
            Cần cải tiến ({ratingCounts[2] + ratingCounts[1]})
          </button>
        </div>

        {/* Trigger Button write review */}
        <button
          onClick={() => setShowWriteReview(!showWriteReview)}
          className="w-full sm:w-auto px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all cursor-pointer border border-neutral-800"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{showWriteReview ? 'Đóng form' : 'Viết đánh giá thực tế'}</span>
        </button>
      </div>

      {/* 3. Dropdown Write Comment Container form */}
      {showWriteReview && (
        <form onSubmit={handleSubmitReview} className="bg-amber-50/50 rounded-2xl p-6 border border-amber-200/50 space-y-4 text-left shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-800 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
            <span>Nêu trải nghiệm chính xác của bạn</span>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg">{errorMessage}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Họ tên của bạn</label>
              <input
                id="reviewer-name-input"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn A"
                className="w-full bg-white text-xs border border-neutral-200 rounded-lg px-3.5 py-2 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Set Star rating */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Mức độ hài lòng: {commentRating} sao</label>
              <div className="flex items-center gap-2 h-[38px]">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setCommentRating(stars)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 cursor-pointer ${
                        stars <= commentRating ? 'text-amber-400 fill-current' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comment text area */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Ý kiến nhận xét của bạn</label>
            <textarea
              id="comment-textarea"
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Chia sẻ chất lượng phục vụ, chi phí hoặc lưu ý chỗ ngồi để cộng đồng tham khảo..."
              className="w-full bg-white text-xs border border-neutral-200 rounded-lg p-3.5 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowWriteReview(false)}
              className="px-4 py-2 hover:bg-neutral-100 text-neutral-500 rounded-lg text-xs font-semibold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold shadow transition-colors cursor-pointer"
            >
              Gửi Đánh Giá Ngay
            </button>
          </div>
        </form>
      )}

      {/* 4. Display list of reviews */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs text-neutral-500">Chưa có đánh giá nào phù hợp với bộ lọc sentiment này.</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="p-5 rounded-2xl bg-white border border-neutral-100 shadow-xs text-left hover:border-neutral-200/80 transition-all">
              
              {/* Header inside specific review */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden">
                    <img src={review.avatar} alt={review.author} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800">{review.author}</h4>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Ngày: {review.date}</p>
                  </div>
                </div>

                {/* Score badge & stamp */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`w-3.5 h-3.5 ${n <= review.rating ? 'text-amber-400 fill-current' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  
                  {/* Sentiment tag */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    review.sentiment === 'positive'
                      ? 'bg-emerald-50 text-emerald-700'
                      : review.sentiment === 'neutral'
                      ? 'bg-neutral-50 text-neutral-600'
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {review.sentiment === 'positive' ? 'Tích cực' : review.sentiment === 'neutral' ? 'Bình thường' : 'Cần cải thiện'}
                  </span>
                </div>
              </div>

              {/* Text content of comment */}
              <p className="text-neutral-600 text-xs leading-relaxed font-sans font-normal pl-1">
                {review.text}
              </p>

              {/* Sentiment verification highlight */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-dotted border-neutral-100 text-[10px] text-neutral-400">
                <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                  <ThumbsUp className="w-3 h-3" /> Hữu ích (8)
                </button>
                <span>•</span>
                <span className="text-[10px] bg-neutral-50 px-2 py-0.5 rounded font-medium text-neutral-400">
                  ✓ Khách đã trải nghiệm thực tế
                </span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
