import React, { useState } from 'react';
import { Map, MapPin, Navigation2, Navigation, Info } from 'lucide-react';
import { Activity } from '../types';

interface ItineraryMapProps {
  activities: Activity[];
  destination: string;
  transportation: 'motorbike' | 'taxi' | 'walking';
}

export default function ItineraryMap({ activities, destination, transportation }: ItineraryMapProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const cityLabel = (() => {
    switch ((destination || '').toLowerCase()) {
      case 'hanoi': case 'hà nội': return 'Hà Nội';
      case 'saigon': case 'tp. hồ chí minh': return 'TP. Hồ Chí Minh';
      case 'danang': case 'đà nẵng': return 'Đà Nẵng';
      case 'dalat': case 'đà lạt': return 'Đà Lạt';
      default: return destination || '';
    }
  })();

  const getGoogleSearchUrl = (act: Activity) => {
    const q = act.address ? `${act.title}, ${act.address}` : `${act.title}, ${cityLabel}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  };

  const getGoogleDirectionsUrl = (act: Activity) => {
    const mode = transportation === 'walking' ? 'walking' : transportation === 'motorbike' ? 'two-wheeler' : 'driving';
    const dest = act.address ? `${act.title}, ${act.address}` : `${act.title}, ${cityLabel}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(destination)}&destination=${encodeURIComponent(dest)}&travelmode=${mode}`;
  };

  const getFullDayRouteUrl = () => {
    if (activities.length === 0) return '#';
    const mode = transportation === 'walking' ? 'walking' : transportation === 'motorbike' ? 'two-wheeler' : 'driving';
    const last = activities[activities.length - 1];
    const lastDest = last.address ? `${last.title}, ${last.address}` : `${last.title}, ${cityLabel}`;
    const ways = activities.slice(0, -1).map(a => encodeURIComponent(a.address ? `${a.title}, ${a.address}` : `${a.title}, ${cityLabel}`)).join('|');
    let url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(destination)}&destination=${encodeURIComponent(lastDest)}&travelmode=${mode}`;
    if (ways) url += `&waypoints=${ways}`;
    return url;
  };

  const transportLabel = transportation === 'walking' ? 'Đi bộ' : transportation === 'motorbike' ? 'Xe máy' : 'Taxi / Grab';

  return (
    <div className="space-y-4">
      {/* Route map card */}
      <div className="bg-white rounded-3xl border-2 border-orange-100 p-5 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b-2 border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-2xl flex items-center justify-center">
              <span className="text-xl">🗺️</span>
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">Lộ Trình & Hướng Dẫn Bản Đồ</h4>
              <p className="text-xs text-gray-400">Mở trực tiếp lộ trình chính xác trên ứng dụng Google Maps</p>
            </div>
          </div>
          {activities.length > 0 && (
            <a
              href={getFullDayRouteUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange px-4 py-2.5 text-sm flex items-center gap-2 whitespace-nowrap rounded-xl"
            >
              <Navigation className="w-4 h-4" />
              Mở Lộ Trình Hôm Nay
            </a>
          )}
        </div>

        {/* Route diagram */}
        <div className="bg-orange-50/60 rounded-2xl p-5 border border-orange-100 overflow-x-auto">
          {activities.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">Chưa có điểm dừng nào cho lộ trình hôm nay.</p>
          ) : (
            <div className="flex items-start min-w-max gap-1 px-2 py-2">
              {activities.map((act, idx) => {
                const isHovered = selectedIdx === idx;
                return (
                  <React.Fragment key={act.id}>
                    {/* Stop node */}
                    <div
                      className="flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-200 relative"
                      style={{ width: 90 }}
                      onMouseEnter={() => setSelectedIdx(idx)}
                      onMouseLeave={() => setSelectedIdx(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white rounded-xl p-2.5 text-left z-20 w-40 shadow-xl text-[10px] leading-relaxed border border-gray-700 whitespace-normal">
                          <span className="font-black text-orange-400 block text-[9px] uppercase">Chặng {idx + 1} · {act.time}</span>
                          <span className="font-bold block truncate">{act.title}</span>
                          <span className="text-gray-400 block mt-0.5 line-clamp-2">{act.description}</span>
                        </div>
                      )}
                      {/* Circle */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-[3px] transition-all ${
                        isHovered
                          ? 'bg-orange-500 text-white border-orange-300 scale-110 shadow-lg shadow-orange-200'
                          : 'bg-white text-orange-500 border-orange-400'
                      }`}>
                        {idx + 1}
                      </div>
                      {/* Label */}
                      <p className="text-[10px] font-black text-gray-800 text-center truncate w-full leading-tight">
                        {act.title.length > 14 ? act.title.slice(0, 12) + '...' : act.title}
                      </p>
                      <p className="text-[9px] text-orange-500 font-bold">{act.time}</p>
                    </div>

                    {/* Arrow connector */}
                    {idx < activities.length - 1 && (
                      <div className="flex items-center self-center pb-8" style={{ width: 44 }}>
                        <div className="flex-1 border-t-2 border-dashed border-orange-300" />
                        <div className="w-0 h-0 border-l-[8px] border-l-orange-400 border-y-[5px] border-y-transparent ml-[-1px]" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Hint */}
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-gray-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Rà chuột vào từng chặng để xem chi tiết. Di chuyển bằng <span className="text-orange-500 font-bold">{transportLabel}</span></span>
          </div>
        </div>
      </div>

      {/* Place cards list */}
      <div className="space-y-3">
        <h5 className="text-sm font-black text-orange-600 uppercase tracking-wide">DANH SÁCH ĐỊA ĐIỂM</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {activities.map((act, index) => (
            <div
              key={act.id}
              onMouseEnter={() => setSelectedIdx(index)}
              onMouseLeave={() => setSelectedIdx(null)}
              className={`bg-white rounded-2xl border-2 p-3.5 flex flex-col gap-3 text-left transition-all ${
                selectedIdx === index ? 'border-orange-400 shadow-md shadow-orange-100' : 'border-orange-100 hover:border-orange-300'
              }`}
            >
              <div className="space-y-1">
                {/* Badge row */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white" style={{background: 'linear-gradient(135deg, #F97316, #EA580C)'}}>
                    Chặng {index + 1}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold">{act.time}</span>
                </div>
                <h6 className="font-black text-gray-900 text-sm leading-tight line-clamp-1">{act.title}</h6>
                <p className="text-[11px] text-gray-500 line-clamp-1">
                  {act.address ? `Khu vực: ${act.address}` : act.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t-2 border-orange-50">
                <a
                  href={getGoogleSearchUrl(act)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-orange-50 border-2 border-orange-200 px-2 py-1.5 rounded-xl text-[10px] font-black text-gray-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Map className="w-3 h-3 text-orange-500" />
                  Tra cứu
                </a>
                <a
                  href={getGoogleDirectionsUrl(act)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-orange px-2 py-1.5 text-[10px] flex items-center justify-center gap-1 rounded-xl"
                >
                  <Navigation2 className="w-3 h-3 fill-white" />
                  Chỉ đường
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}