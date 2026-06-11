import React from 'react';
import { Star, Eye, Plus, Check, Video, MapPin } from 'lucide-react';
import { Place } from '../types';
import { motion } from 'framer-motion';

interface PlaceCardProps {
  place: Place;
  isAdded: boolean;
  onSelect: () => void;
  onToggleAdd: () => void;
}

const getCategoryLabel = (cat: string) => {
  switch (cat) {
    case 'food': return '🍜 Ăn uống';
    case 'coffee': return '☕ Cà phê & Chill';
    case 'entertainment': return '🎡 Vui chơi';
    default: return '🛒 Mua sắm';
  }
};

const getCategoryColor = (cat: string) => {
  switch (cat) {
    case 'food': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'coffee': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'entertainment': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-pink-100 text-pink-700 border-pink-200';
  }
};

const decodePriceLevel = (level: string) => {
  switch (level) {
    case 'cheap': return '₫ Tiết kiệm';
    case 'luxury': return '₫₫₫ Cao cấp';
    default: return '₫₫ Trung cấp';
  }
};

export default function PlaceCard({ place, isAdded, onSelect, onToggleAdd }: PlaceCardProps) {
  return (
    <motion.div 
      // 1. Hiệu ứng trượt từ dưới lên khi cuộn trang tới thẻ này
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      
      // 2. Hiệu ứng Hover: Nổi thẻ lên trên một chút (bay lên 6px)
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      
      // Thêm hover:shadow-xl vào class cũ để kết hợp đổ bóng mượt mà
      className="card-place group flex flex-col h-full text-left overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-orange-50 shrink-0">
        <img
          src={place.image}
          alt={place.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Category badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md bg-white/90 shadow-sm ${getCategoryColor(place.category)}`}>
          {getCategoryLabel(place.category)}
        </span>
        {/* Video badge */}
        {place.videos.length > 0 && (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Video className="w-3 h-3" />
            {place.videos.length} clip
          </span>
        )}
        {/* Heart */}
        <button className="absolute top-3 right-3 bg-white/80 hover:bg-white text-orange-400 hover:text-red-500 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors text-sm">
          ♡
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Rating row */}
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-800">{place.rating}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{place.reviews.length + 42} đánh giá</span>
            <span className="text-gray-400">•</span>
            <span className="text-orange-500 font-semibold text-[10px]">{decodePriceLevel(place.priceLevel)}</span>
          </div>

          {/* Name */}
          <h3 className="font-extrabold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 text-sm leading-snug" style={{fontFamily: 'Nunito, sans-serif'}}>
            {place.name}
          </h3>

          {/* Address */}
          <p className="text-xs text-gray-400 line-clamp-1 flex items-start gap-1">
            <MapPin className="w-3 h-3 text-orange-400 mt-0.5 shrink-0" />
            {place.address}
          </p>

          {/* Price range pill */}
          <div className="orange-badge inline-block">
            {place.priceRange}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 mt-3 border-t border-orange-100">
          <button
            onClick={onSelect}
            className="flex-1 btn-orange py-2 text-xs flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            Xem chi tiết
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleAdd(); }}
            className={`px-3 py-2 rounded-xl border-2 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
              isAdded
                ? 'bg-green-50 border-green-400 text-green-700'
                : 'bg-white border-orange-200 text-orange-500 hover:border-orange-400 hover:bg-orange-50'
            }`}
          >
            {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAdded ? 'Đã chọn' : 'Thêm giỏ'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}