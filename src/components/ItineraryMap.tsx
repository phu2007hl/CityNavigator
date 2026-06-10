import React, { useState } from 'react';
import { Map, MapPin, Navigation, Compass, MapPinned, Info, Navigation2 } from 'lucide-react';
import { Activity } from '../types';

interface ItineraryMapProps {
  activities: Activity[];
  destination: string;
  transportation: 'motorbike' | 'taxi' | 'walking';
}

export default function ItineraryMap({ activities, destination, transportation }: ItineraryMapProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const getCityQueryPrefix = (cityId: string) => {
    switch (cityId ? cityId.toLowerCase() : '') {
      case 'hanoi': return 'Hà Nội';
      case 'saigon': return 'TP. Hồ Chí Minh';
      case 'danang': return 'Đà Nẵng';
      case 'dalat': return 'Đà Lạt';
      default: return destination || '';
    }
  };

  const cityLabel = getCityQueryPrefix(destination);

  // SỬA LỖI: Cú pháp tạo link tìm kiếm điểm chuẩn của Google Maps
  const getGoogleSearchUrl = (act: Activity) => {
    const fullQuery = act.address ? `${act.title}, ${act.address}` : `${act.title}, ${cityLabel}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
  };

  // SỬA LỖI: Cú pháp tạo link chỉ đường chuẩn của Google Maps
  const getGoogleDirectionsUrl = (act: Activity) => {
    let mode = 'driving';
    if (transportation === 'walking') mode = 'walking';
    else if (transportation === 'motorbike') mode = 'two-wheeler';
    
    const originParam = encodeURIComponent(destination);
    const destStr = act.address ? `${act.title}, ${act.address}` : `${act.title}, ${cityLabel}`;
    const destParam = encodeURIComponent(destStr);
      
    return `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=${mode}`;
  };

  // SỬA LỖI: Cú pháp cho Lộ trình đi qua nhiều điểm (Waypoints)
  const getFullDayRouteUrl = () => {
    if (activities.length === 0) return '#';
    
    const originParam = encodeURIComponent(destination);
    const last = activities[activities.length - 1];
    const lastDestStr = last.address ? `${last.title}, ${last.address}` : `${last.title}, ${cityLabel}`;
    const destParam = encodeURIComponent(lastDestStr);
    
    const waysArray = activities.slice(0, -1).map(act => {
      return act.address ? `${act.title}, ${act.address}` : `${act.title}, ${cityLabel}`;
    });
    const ways = waysArray.map(w => encodeURIComponent(w)).join('|'); 
    
    let mode = 'driving';
    if (transportation === 'walking') mode = 'walking';
    else if (transportation === 'motorbike') mode = 'two-wheeler';

    let url = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destParam}&travelmode=${mode}`;
    if (ways) {
      url += `&waypoints=${ways}`;
    }
    return url;
  };

  const getTransportIconName = () => {
    if (transportation === 'walking') return 'Đi bộ';
    if (transportation === 'motorbike') return 'Xe máy';
    return 'Taxi';
  };

  return (
    <div className="bg-white rounded-3xl border border-neutral-150 p-5 flex flex-col h-full shadow-xs relative overflow-hidden text-left space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div className="flex items-start gap-2.5">
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 shrink-0">
            <MapPinned className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-neutral-950">Lộ Trình & Hướng Dẫn Bản Đồ</h4>
            <p className="text-[11px] text-neutral-500">Mở trực tiếp lộ trình chính xác trên ứng dụng Google Maps</p>
          </div>
        </div>
        
        {activities.length > 0 && (
          <a
            href={getFullDayRouteUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-xs bg-neutral-900 border border-neutral-850 hover:bg-neutral-800 text-white font-extrabold px-3.5 py-2 rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-emerald-400 rotate-45" />
            <span>Mở Lộ Trình Hôm Nay</span>
          </a>
        )}
      </div>

      <div className="bg-neutral-50/70 p-4 border border-neutral-100 rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
        
        <div className="relative z-10 min-h-[160px] flex flex-col justify-center py-2">
          {activities.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center select-none">Chưa có điểm dừng nào được chọn cho lộ trình hôm nay.</p>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-y-6 gap-x-2.5 px-2 relative">
              {activities.map((act, idx) => {
                const isActive = selectedIdx === idx;
                return (
                  <React.Fragment key={act.id}>
                    <div 
                      onMouseEnter={() => setSelectedIdx(idx)}
                      onMouseLeave={() => setSelectedIdx(null)}
                      className={`relative z-10 flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        isActive ? 'scale-105' : 'opacity-90 hover:opacity-100'
                      }`}
                    >
                      <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-mono font-bold text-xs ring-4 transition-all ${
                        isActive 
                          ? 'bg-emerald-600 text-white ring-emerald-100 border-2 border-white' 
                          : 'bg-white text-emerald-700 ring-neutral-100 border-2 border-emerald-400'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="mt-1.5 text-center max-w-[85px] truncate">
                        <p className="text-[10px] font-black text-neutral-800 truncate" title={act.title}>
                          {act.title}
                        </p>
                        <p className="text-[9px] text-neutral-400 font-mono font-medium">
                          {act.time}
                        </p>
                      </div>

                      {isActive && (
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-neutral-900 text-white rounded-lg p-2 text-left z-35 min-w-[130px] shadow-lg text-[10px] leading-relaxed border border-neutral-800">
                          <span className="font-mono text-emerald-400 block font-bold text-[8.5px] uppercase">Chặng {idx + 1} • {act.time}</span>
                          <span className="font-bold block truncate max-w-[115px]">{act.title}</span>
                          <span className="text-neutral-400 block mt-0.5 max-w-[115px] line-clamp-1">{act.description}</span>
                        </div>
                      )}
                    </div>

                    {idx < activities.length - 1 && (
                      <div className="flex-1 min-w-[20px] max-w-[45px] h-[2px] bg-dashed border-t-2 border-dashed border-emerald-300/80 mx-1 self-center relative -mt-4">
                        <div className="absolute -right-1.5 -top-[5px] border-solid border-l-emerald-400 border-l-[6px] border-y-transparent border-y-[4px]" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 border-t border-neutral-100/60 pt-2 text-[9.5px] text-neutral-400 mt-2 select-none">
          <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>Rà chuột vào từng chặng để xem chi tiết. Di chuyển bằng <b>{getTransportIconName()}</b></span>
        </div>
      </div>

      <div className="space-y-2.5">
        <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Danh Sách Địa Điểm</h5>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {activities.map((act, index) => (
            <div 
              key={act.id} 
              onMouseEnter={() => setSelectedIdx(index)}
              onMouseLeave={() => setSelectedIdx(null)}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-3 text-xs transition-all ${
                selectedIdx === index 
                  ? 'bg-emerald-50/40 border-emerald-200 ring-2 ring-emerald-500/10' 
                  : 'bg-white border-neutral-150 hover:bg-neutral-50/50'
              }`}
            >
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded-full border border-emerald-100/60">
                    Chặng {index + 1}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {act.time}
                  </span>
                </div>
                <h6 className="font-extrabold text-neutral-900 truncate" title={act.title}>
                  {act.title}
                </h6>
                <p className="text-[11px] text-neutral-500 line-clamp-1 leading-normal">
                  {act.address ? `Khu vực: ${act.address}` : act.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-neutral-100">
                <a
                  href={getGoogleSearchUrl(act)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-neutral-100 border border-neutral-200/80 px-2 py-1.5 rounded-xl text-[10px] font-black text-neutral-700 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Map className="w-3 h-3 text-emerald-600" />
                  <span>Tra cứu</span>
                </a>

                <a
                  href={getGoogleDirectionsUrl(act)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2 py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                >
                  <Navigation2 className="w-3 h-3 text-white fill-current shrink-0" />
                  <span>Chỉ đường</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}