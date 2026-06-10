import React, { useState } from 'react';
import { 
  Calendar, MapPin, Navigation, Clock, CircleDollarSign, CheckSquare, 
  Square, Trash2, Printer, Copy, Check, Flame, Landmark, Coffee, Utensils, 
  CloudSun, CloudRain, ThermometerSun, Gamepad2, ShoppingBag, Music, Bike, Car, Footprints, Sparkles
} from 'lucide-react';
import { Itinerary, Activity } from '../types';
import ItineraryMap from './ItineraryMap';

interface AIPlanDisplayProps {
  itinerary: Itinerary;
  onModifyItinerary: (updated: Itinerary) => void;
}

export default function AIPlanDisplay({ itinerary, onModifyItinerary }: AIPlanDisplayProps) {
  const [visitedActivities, setVisitedActivities] = useState<string[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [copied, setCopied] = useState(false);
  const [printing, setPrinting] = useState(false);

  const handleToggleVisited = (activityId: string) => {
    setVisitedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const handleDeleteActivity = (dayNum: number, activityId: string) => {
    const updatedDayPlans = itinerary.dayPlans.map((dp) => {
      if (dp.dayNumber === dayNum) {
        return {
          ...dp,
          activities: dp.activities.filter((act) => act.id !== activityId),
        };
      }
      return dp;
    });

    let newTotal = 0;
    updatedDayPlans.forEach((dp) => {
      dp.activities.forEach((act) => {
        newTotal += act.costEstimated;
        if (act.transportToNext) {
          newTotal += act.transportToNext.costEstimated;
        }
      });
    });

    onModifyItinerary({
      ...itinerary,
      totalCost: newTotal,
      dayPlans: updatedDayPlans,
    });
  };

  const getTransportIcon = (method: string) => {
    switch (method) {
      case 'motorbike': return <Bike className="w-4 h-4 text-emerald-500" />;
      case 'taxi': return <Car className="w-4 h-4 text-emerald-500" />;
      default: return <Footprints className="w-4 h-4 text-emerald-500" />;
    }
  };

  const decodeTransportMethod = (method: string) => {
    switch (method) {
      case 'motorbike': return 'Xe máy';
      case 'taxi': return 'Taxi / Grab';
      default: return 'Đi bộ';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'meal': return <Utensils className="w-5 h-5 text-amber-500" />;
      case 'coffee': return <Coffee className="w-5 h-5 text-sky-500" />;
      case 'visit': return <Landmark className="w-5 h-5 text-emerald-500" />;
      case 'entertainment': return <Gamepad2 className="w-5 h-5 text-purple-500" />;
      case 'shopping': return <ShoppingBag className="w-5 h-5 text-pink-500" />;
      case 'music': return <Music className="w-5 h-5 text-indigo-500" />;
      default: return <Navigation className="w-5 h-5 text-neutral-400" />;
    }
  };

  const formatMoney = (val: number) => {
    if (val === 0) return 'Miễn phí';
    return `${val.toLocaleString('vi-VN')} đ`;
  };

  const handleCopyText = () => {
    let copyText = `--- LỊCH TRÌNH DU LỊCH AI: ${itinerary.destination.toUpperCase()} ---\n`;
    copyText += `Tổng chi phí dự tính: ${formatMoney(itinerary.totalCost)}\n`;
    copyText += `Phương tiện chính: ${decodeTransportMethod(itinerary.transportation)}\n\n`;

    itinerary.dayPlans.forEach((dp) => {
      copyText += `NGÀY ${dp.dayNumber}:\n`;
      dp.activities.forEach((act) => {
        copyText += `- [${act.time}] ${act.title}: ${act.description} (${formatMoney(act.costEstimated)})\n`;
      });
      copyText += `\n`;
    });

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDayPlan = itinerary.dayPlans.find((dp) => dp.dayNumber === activeDay);

  return (
    <div id="ai-plan-panel" className="bg-white rounded-3xl border border-neutral-100 shadow-xl p-5 sm:p-7 text-left space-y-6">
      
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white text-left space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Trợ Lý AI Đã Sắp Xếp Lịch Trình
              </span>
              {itinerary.isOfflineFallback ? (
                <span className="text-[9px] bg-amber-500 text-neutral-950 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-amber-450 animate-pulse">
                  ⚡ Ngoại tuyến (Backup Engine)
                </span>
              ) : (
                <span className="text-[9px] bg-emerald-500 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-400">
                  ✨ Trực tuyến: Gemini AI
                </span>
              )}
              <span className="text-[9px] bg-blue-600 text-white font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-blue-500">
                📍 Điểm xuất phát độc lập
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-1.5 flex items-center gap-2">
              <MapPin className="w-5.5 h-5.5 shrink-0 text-emerald-300" />
              <span>Hành trình khám phá {itinerary.destination}</span>
            </h2>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyText}
              className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>

            <button
              onClick={() => {
                setPrinting(true);
                setTimeout(() => { window.print(); setPrinting(false); }, 300);
              }}
              className="flex-1 sm:flex-none justify-center inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-850 active:bg-neutral-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Xuất bản</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Clock className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-white/70">Thời gian</p>
              <p className="text-xs font-bold">
                {itinerary.durationValue && itinerary.durationUnit
                  ? `${itinerary.durationValue} ${itinerary.durationUnit === 'hours' ? 'Giờ' : 'Ngày'}`
                  : `${itinerary.durationDays} Ngày`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <CircleDollarSign className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-white/70">Chi phí dự tính</p>
              <p className="text-xs font-bold">{formatMoney(itinerary.totalCost)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Navigation className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-white/70">Phương tiện chính</p>
              <p className="text-xs font-bold capitalize">{decodeTransportMethod(itinerary.transportation)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-white/70">Bán kính quét</p>
              <p className="text-xs font-bold">≤ {itinerary.radiusKm || 10} km</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-white/70">Gu ngân sách</p>
              <p className="text-xs font-bold uppercase">{itinerary.budgetLevel}</p>
            </div>
          </div>
        </div>
      </div>

      {itinerary.dayPlans.length > 1 && (
        <div id="day-tabs" className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-100">
          {itinerary.dayPlans.map((dp) => (
            <button
              key={dp.dayNumber}
              onClick={() => setActiveDay(dp.dayNumber)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all ${
                activeDay === dp.dayNumber ? 'bg-neutral-900 text-white shadow' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
              }`}
            >
              Ngày {dp.dayNumber}
            </button>
          ))}
        </div>
      )}

      <div id="wide-route-map" className="w-full">
        <ItineraryMap activities={currentDayPlan?.activities || []} destination={itinerary.destination} transportation={itinerary.transportation} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        <div className="lg:col-span-8 space-y-7">
          {currentDayPlan && currentDayPlan.activities.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs text-neutral-500">Chưa có hoạt động nào được phân bổ.</p>
            </div>
          ) : (
            currentDayPlan?.activities.map((activity, index) => {
              const isVisited = visitedActivities.includes(activity.id);

              return (
                <div key={activity.id} className="relative group">
                  {index < currentDayPlan.activities.length - 1 && (
                    <div className="absolute left-[20px] top-[40px] bottom-[-45px] w-[2px] bg-neutral-200/60 border-l border-dashed border-neutral-300 group-hover:border-emerald-300" />
                  )}

                  <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${isVisited ? 'bg-neutral-50/50 border-neutral-200 opacity-65' : 'bg-white border-neutral-100 hover:border-neutral-300 shadow-xs'}`}>
                    <div className="flex items-start gap-3.5">
                      <button onClick={() => handleToggleVisited(activity.id)} className="mt-1 transition-all text-neutral-400 hover:text-emerald-600 cursor-pointer">
                        {isVisited ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5" />}
                      </button>

                      <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-xs font-mono font-bold text-neutral-500 flex items-center gap-1 bg-neutral-150 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-neutral-400" />
                            {activity.time}
                          </span>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">
                            ({activity.durationMinutes} phút)
                          </span>
                        </div>

                        <h3 className={`text-sm sm:text-base font-extrabold mt-1.5 ${isVisited ? 'line-through text-neutral-400' : 'text-neutral-950'}`}>
                          {activity.title}
                        </h3>

                        {/* Điểm xuất phát độc lập từ ô nhập vào, chỉ đường bằng Tên quán + Tên đường + Thành phố */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            let mode = 'driving';
                            if (itinerary.transportation === 'walking') mode = 'walking';
                            else if (itinerary.transportation === 'motorbike') mode = 'two-wheeler';

                            const originParam = encodeURIComponent(itinerary.destination);
                            
                            const addressPart = activity.address ? `${activity.address}` : '';
                            const destStr = addressPart ? `${activity.title}, ${addressPart}` : `${activity.title}, ${itinerary.destination}`;
                            const destParam = encodeURIComponent(destStr);
                            
                            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=${mode}`;
                            
                            window.open(googleMapsUrl, '_blank');
                          }}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200 border border-blue-100 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Chỉ đường từ điểm xuất phát</span>
                        </button>
                      </div>

                      <div className="text-right flex flex-col justify-between items-end gap-2.5">
                        <span className="text-xs font-mono font-bold text-neutral-700 bg-neutral-50 px-2 py-1 rounded">
                          {formatMoney(activity.costEstimated)}
                        </span>
                        
                        <button onClick={() => handleDeleteActivity(activeDay, activity.id)} className="text-neutral-300 hover:text-red-500 p-1 rounded hover:bg-neutral-100 cursor-pointer transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-500 leading-relaxed font-sans pl-9 mt-3 text-left">
                      {activity.description}
                    </p>
                  </div>

                  {activity.transportToNext && index < currentDayPlan.activities.length - 1 && (
                    <div className="my-5 pl-[48px] flex items-center gap-3 text-[11px] font-mono text-neutral-400 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100 w-fit max-w-full">
                      {getTransportIcon(activity.transportToNext.method)}
                      <span className="font-semibold text-neutral-600">Di chuyển {activity.transportToNext.distanceKm} km</span>
                      <span>•</span>
                      <span className="font-semibold text-neutral-600">~{activity.transportToNext.durationMinutes} phút ({decodeTransportMethod(activity.transportToNext.method)})</span>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-100 text-left space-y-3.5 shadow-xs font-sans">
            <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
              <Flame className="w-4.5 h-4.5 text-amber-600" />
              <span>Ghi chú từ Trợ Lý AI</span>
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              {itinerary.additionalNotes || 'Lịch trình đã được tối ưu dựa trên đường đi ngắn nhất.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}