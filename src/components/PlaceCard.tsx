import React from 'react';
import { Star, Eye, Plus, Check, Video } from 'lucide-react';
import { Place } from '../types';

interface PlaceCardProps {
  place: Place;
  isAdded: boolean;
  onSelect: () => void;
  onToggleAdd: () => void;
  key?: string | number;
}

export default function PlaceCard({ place, isAdded, onSelect, onToggleAdd }: PlaceCardProps) {
  
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'food':
        return '🍜 Ăn uống';
      case 'coffee':
        return '☕ Cà phê & Chill';
      case 'entertainment':
        return '🎡 Vui chơi giải trí';
      default:
        return '🛒 Mua sắm lưu niệm';
    }
  };

  const decodePriceLevel = (level: string) => {
    switch (level) {
      case 'cheap':
        return '₫ (Tiết kiệm)';
      case 'luxury':
        return '₫₫₫ (Sang chảnh)';
      default:
        return '₫₫ (Trung cấp)';
    }
  };

  return (
    <div id={`place-card-${place.id}`} className="group bg-white rounded-3xl border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden flex flex-col h-full text-left">
      
      {/* Visual Image container banner */}
      <div className="relative h-48 overflow-hidden bg-neutral-100 shrink-0">
        <img
          src={place.image}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Category tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-white/40">
          {getCategoryLabel(place.category)}
        </span>

        {/* Video count floating pill */}
        {place.videos.length > 0 && (
          <span className="absolute bottom-3 left-3 bg-red-500/95 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-xs animate-pulse">
            <Video className="w-3.5 h-3.5" />
            <span>{place.videos.length} Clip Review</span>
          </span>
        )}
      </div>

      {/* Body specifications */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div className="space-y-2">
          {/* Rating stars line */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-neutral-800 font-mono mt-0.5">{place.rating}</span>
            </div>
            <span>•</span>
            <span className="font-mono">{place.reviews.length + 42} đánh giá</span>
            <span>•</span>
            <span className="text-neutral-400 font-mono text-[10px]">{decodePriceLevel(place.priceLevel)}</span>
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-neutral-900 group-hover:text-emerald-600 transition-colors line-clamp-1 text-sm sm:text-base">
            {place.name}
          </h3>

          {/* Address */}
          <p className="text-xs text-neutral-400 font-normal line-clamp-1">
            📍 {place.address}
          </p>

          {/* Desc */}
          <p className="text-xs text-neutral-500 font-normal line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center justify-between gap-2.5 pt-4 border-t border-dotted border-neutral-150 mt-4 shrink-0">
          
          {/* Explore detail button */}
          <button
            onClick={onSelect}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border border-neutral-800"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xem chi tiết</span>
          </button>

          {/* Add to itinerary checkbox bucket */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAdd();
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1 shrink-0 ${
              isAdded
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-bold shadow-sm'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
            }`}
            title={isAdded ? 'Bỏ chọn khỏi giỏ lịch trình' : 'Thêm vào giỏ lịch trình tự thiết lập'}
          >
            {isAdded ? (
              <Check className="w-4 h-4 text-emerald-600 font-bold" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{isAdded ? 'Đã chọn' : 'Thêm giỏ'}</span>
          </button>

        </div>

      </div>

    </div>
  );
}