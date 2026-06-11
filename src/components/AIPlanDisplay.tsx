import React, { useState } from 'react';
import { 
  MapPin, Clock, CircleDollarSign, Copy, Check,
  Printer, Flame, Landmark, Coffee, Utensils, Bike, Car,
  Footprints, Sparkles, Gamepad2, ShoppingBag, Music, Navigation,
  CheckSquare, Square, Trash2, Calendar
} from 'lucide-react';
import { Itinerary, Activity } from '../types';
import ItineraryMap from './ItineraryMap';
import { motion } from 'framer-motion';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 } // Mỗi phần tử cách nhau 0.15s
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

// Import ảnh nền cho Banner Lịch trình (Bạn có thể đổi sang cao2.jpeg hoặc cao3.jpeg tùy ý)
import planBannerBg from '../images/cao1.jpeg';

interface AIPlanDisplayProps {
  itinerary: Itinerary;
  onModifyItinerary: (updated: Itinerary) => void;
}

export default function AIPlanDisplay({ itinerary, onModifyItinerary }: AIPlanDisplayProps) {
  const [visitedActivities, setVisitedActivities] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleToggleVisited = (activityId: string) => {
    setVisitedActivities(prev =>
      prev.includes(activityId) ? prev.filter(id => id !== activityId) : [...prev, activityId]
    );
  };

  const handleDeleteActivity = (dayNum: number, activityId: string) => {
    const updatedDayPlans = itinerary.dayPlans.map(dp =>
      dp.dayNumber === dayNum
        ? { ...dp, activities: dp.activities.filter(act => act.id !== activityId) }
        : dp
    );
    let newTotal = 0;
    updatedDayPlans.forEach(dp => {
      dp.activities.forEach(act => {
        newTotal += act.costEstimated;
        if (act.transportToNext) newTotal += act.transportToNext.costEstimated;
      });
    });
    onModifyItinerary({ ...itinerary, totalCost: newTotal, dayPlans: updatedDayPlans });
  };

  const decodeTransport = (method: string) => {
    switch (method) {
      case 'motorbike': return 'Xe Máy';
      case 'taxi': return 'Taxi / Grab';
      default: return 'Đi Bộ';
    }
  };

  const transportIcon = (method: string) => {
    switch (method) {
      case 'motorbike': return <Bike className="w-4 h-4" />;
      case 'taxi': return <Car className="w-4 h-4" />;
      default: return <Footprints className="w-4 h-4" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'coffee': return <Coffee className="w-5 h-5 text-sky-500" />;
      case 'visit': return <Landmark className="w-5 h-5 text-orange-500" />;
      case 'entertainment': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      case 'music': return <Music className="w-5 h-5 text-indigo-500" />;
      default: return <Navigation className="w-5 h-5 text-orange-400" />;
    }
  };

  const formatMoney = (val: number) =>
    val === 0 ? 'Miễn phí' : `${val.toLocaleString('vi-VN')} đ`;

  const handleCopyText = () => {
    let text = `LỊCH TRÌNH: ${itinerary.destination.toUpperCase()}\n`;
    text += `Tổng chi phí: ${formatMoney(itinerary.totalCost)} | Phương tiện: ${decodeTransport(itinerary.transportation)}\n\n`;
    itinerary.dayPlans.forEach(dp => {
      text += `NGÀY ${dp.dayNumber}:\n`;
      dp.activities.forEach(act => {
        text += `- [${act.time}] ${act.title}: ${act.description} (${formatMoney(act.costEstimated)})\n`;
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDayPlan = itinerary.dayPlans.find(dp => dp.dayNumber === activeDay);

  // Stats for header
  const durationLabel = itinerary.durationValue && itinerary.durationUnit
    ? `${itinerary.durationValue} ${itinerary.durationUnit === 'hours' ? 'Giờ' : 'Ngày'}`
    : `${itinerary.durationDays} Ngày`;

  const budgetLabel = itinerary.budgetLevel === 'cheap' ? 'CHEAP'
    : itinerary.budgetLevel === 'luxury' ? 'LUXURY' : 'MODERATE';

  return (
    <div className="space-y-5 text-left animate-fade-in">

      {/* ── BANNER HEADER CÓ ẢNH NỀN ── */}
      <div className="relative rounded-3xl overflow-hidden text-white shadow-xl border-4 border-orange-100">
        
        {/* Lớp Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={planBannerBg} 
            alt="Plan Background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Lớp gradient che mờ ảnh để làm nổi chữ (màu sẫm thiên cam) */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-950/90 via-orange-900/60 to-black/30" />
        </div>

        {/* Cáo Mascot góc phải (Z-index thấp để nằm sau text) */}

        {/* Nội dung Banner (Z-10 để nằm đè lên trên ảnh và mask) */}
        <div className="relative z-10 p-5 sm:p-6">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-black px-3 py-1 rounded-full border border-white/30 bg-white/20 flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3" />
              TRỢ LÝ AI ĐÃ SẮP XẾP LỊCH TRÌNH
            </span>
            {itinerary.isOfflineFallback ? (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-400/90 text-amber-900 border border-amber-300 backdrop-blur-md">
                ⚡ NGOẠI TUYẾN
              </span>
            ) : (
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-green-500/40 border border-green-300/60 flex items-center gap-1 backdrop-blur-md">
                📡 TRỰC TUYẾN: GEMINI AI
              </span>
            )}
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-500/40 border border-blue-300/50 backdrop-blur-md">
              📍 ĐIỂM XUẤT PHÁT ĐỘC LẬP
            </span>

            {/* Action buttons */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 bg-black/30 hover:bg-black/50 border border-white/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-md"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>
              <button
                onClick={() => { setTimeout(() => window.print(), 200); }}
                className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 border border-orange-400 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg"
              >
                <Printer className="w-3.5 h-3.5" />
                Xuất bản
              </button>
            </div>
          </div>

          {/* Main title */}
          <h2 className="text-xl sm:text-3xl font-black flex items-center gap-2 mb-5 pr-24 drop-shadow-md">
            <MapPin className="w-6 h-6 text-orange-400 shrink-0" />
            Hành trình khám phá {itinerary.destination}
          </h2>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { icon: '⏱️', label: 'Thời gian', value: durationLabel },
              { icon: '💰', label: 'Chi phí dự tính', value: formatMoney(itinerary.totalCost) },
              { icon: '🛵', label: 'Phương tiện chính', value: decodeTransport(itinerary.transportation) },
              { icon: '📍', label: 'Bán kính quét', value: `≤ ${itinerary.radiusKm || 10} km` },
              { icon: '✨', label: 'Gợi ý ngân sách', value: budgetLabel },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-black/25 rounded-2xl px-3 py-2.5 backdrop-blur-md border border-white/10 shadow-inner">
                <span className="text-lg shrink-0 drop-shadow">{stat.icon}</span>
                <div>
                  <p className="text-[9px] text-orange-200 font-bold uppercase">{stat.label}</p>
                  <p className="text-xs font-black leading-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-day tabs */}
      {itinerary.dayPlans.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {itinerary.dayPlans.map(dp => (
            <button
              key={dp.dayNumber}
              onClick={() => setActiveDay(dp.dayNumber)}
              className={`px-5 py-2.5 rounded-full text-sm font-black shrink-0 cursor-pointer transition-all border-2 ${
                activeDay === dp.dayNumber
                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                  : 'bg-white text-gray-500 border-orange-200 hover:border-orange-400'
              }`}
            >
              Ngày {dp.dayNumber}
            </button>
          ))}
        </div>
      )}

      {/* ── MAP + ROUTE SECTION ── */}
      <ItineraryMap
        activities={currentDayPlan?.activities || []}
        destination={itinerary.destination}
        transportation={itinerary.transportation}
      />

      {/* ── ACTIVITY TIMELINE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Đổi <div> này thành <motion.div> */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-8 space-y-4"
        >
          {!currentDayPlan || currentDayPlan.activities.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-3xl border-2 border-dashed border-orange-200">
              <Calendar className="w-8 h-8 text-orange-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-semibold">Chưa có hoạt động nào được phân bổ.</p>
            </div>
          ) : (
            currentDayPlan.activities.map((activity, index) => {
              const isVisited = visitedActivities.includes(activity.id);
              return (
                <motion.div variants={itemVariants} key={activity.id} className="relative group">
                  {/* Dashed connector line */}
                  {index < currentDayPlan.activities.length - 1 && (
                    <div className="absolute left-[22px] top-[44px] bottom-[-20px] w-[2px] border-l-2 border-dashed border-orange-200" />
                  )}

                  <div className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    isVisited
                      ? 'bg-gray-50 border-gray-100 opacity-60'
                      : 'bg-white border-orange-100 hover:border-orange-300 shadow-sm hover:shadow-md hover:shadow-orange-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button onClick={() => handleToggleVisited(activity.id)} className="mt-0.5 text-orange-300 hover:text-orange-500 cursor-pointer transition-colors shrink-0">
                        {isVisited ? <CheckSquare className="w-5 h-5 text-orange-500" /> : <Square className="w-5 h-5" />}
                      </button>

                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-orange-50 border-2 border-orange-100 flex items-center justify-center shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{background: 'linear-gradient(135deg,#F97316,#EA580C)'}}>
                            Chặng {index + 1}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> {activity.time}
                          </span>
                          <span className="text-[10px] text-orange-500 font-bold">({activity.durationMinutes} phút)</span>
                        </div>
                        <h3 className={`text-sm sm:text-base font-black ${isVisited ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                          {activity.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{activity.description}</p>
                      </div>

                      {/* Cost + delete */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-xl whitespace-nowrap">
                          {formatMoney(activity.costEstimated)}
                        </span>
                        <button
                          onClick={() => handleDeleteActivity(activeDay, activity.id)}
                          className="text-gray-200 hover:text-red-400 cursor-pointer transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Transport connector */}
                    {activity.transportToNext && index < currentDayPlan.activities.length - 1 && (
                      <div className="mt-3 ml-16 flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                        <span className="text-orange-400">{transportIcon(activity.transportToNext.method)}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* AI Notes sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-200 space-y-3 sticky top-4">
            <h3 className="text-sm font-black text-amber-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              Ghi chú từ Trợ Lý AI
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {itinerary.additionalNotes || 'Lịch trình đã được tối ưu dựa trên đường đi ngắn nhất và ngân sách bạn chọn. Chúc bạn có một hành trình vui vẻ! 🎉'}
            </p>

            {/* Total cost summary */}
            <div className="bg-white rounded-xl p-3 border-2 border-orange-100 space-y-2">
              <p className="text-[10px] font-black text-orange-600 uppercase">Tổng chi phí dự tính</p>
              <p className="text-xl font-black text-gray-900">{formatMoney(itinerary.totalCost)}</p>
              <p className="text-[10px] text-gray-400">Bao gồm ăn uống + di chuyển + vui chơi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}