import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Calendar, CircleDollarSign, Bike, Navigation, MapPin, 
  RefreshCw, CheckCircle2, AlertCircle, BookmarkCheck, Heart, User,
  CloudSun, CloudRain, ThermometerSun, Trash2
} from 'lucide-react';
import { Place, Itinerary, BudgetLevel } from '../types';
import AIPlanDisplay from './AIPlanDisplay';

interface AIPlannerProps {
  selectedPlaces: Place[];
  onRemoveSelectedPlace: (placeId: string) => void;
  defaultDestination?: string;
}

export default function AIPlanner({ selectedPlaces, onRemoveSelectedPlace, defaultDestination = 'hanoi' }: AIPlannerProps) {
  const [destination, setDestination] = useState(defaultDestination);
  const [customDestination, setCustomDestination] = useState('');
  const [durationValue, setDurationValue] = useState(1);
  const [durationUnit, setDurationUnit] = useState<'hours' | 'days'>('days');
  const [radiusKm, setRadiusKm] = useState(10);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('moderate');
  const [transportation, setTransportation] = useState<'motorbike' | 'taxi' | 'walking'>('motorbike');
  const [vibe, setVibe] = useState<'all' | 'family' | 'friends' | 'romantic' | 'adventure'>('friends');
  const [weatherPreference, setWeatherPreference] = useState<'auto' | 'sunny' | 'rainy' | 'hot'>('auto');
  const [loading, setLoading] = useState(false);
  const [loaderMessageIndex, setLoaderMessageIndex] = useState(0);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [errorText, setErrorText] = useState('');

  // Local storage for saved itineraries
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vivu_saved_itineraries');
    if (saved) {
      try {
        setSavedItineraries(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to parse saved itineraries", e);
      }
    }
  }, []);

  const handleSaveItinerary = () => {
    if (!itinerary) return;
    
    setSavedItineraries((prev) => {
      let updated;
      const alreadySaved = prev.some(item => item.id === itinerary.id);
      
      if (alreadySaved) {
        // Toggle remove
        updated = prev.filter(item => item.id !== itinerary.id);
      } else {
        // Toggle add
        updated = [itinerary, ...prev];
      }
      localStorage.setItem('vivu_saved_itineraries', JSON.stringify(updated));
      return updated;
    });
  };

  const isItinerarySaved = (id: string) => {
    return savedItineraries.some(item => item.id === id);
  };

  const handleDeleteSavedItinerary = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItineraries((prev) => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('vivu_saved_itineraries', JSON.stringify(updated));
      return updated;
    });
  };

  // Update selection if user switches city in main header
  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
    }
  }, [defaultDestination]);

  // Loading screen simulated milestone notes ticker
  const loaderMilestones = [
    '🤖 Đang kết nối Trực quan hóa dữ liệu du lịch...',
    '⭐ Đang phân tích ý kiến đánh giá tích cực từ khách hàng cũ...',
    '🏍️ Đang tính toán và kết nối các tọa độ di chuyển phù hợp nhất...',
    '💰 Tổ chức quỹ ngân sách chi tiêu và phân phối hợp lý...',
    '✨ Hoàn hóa tệp lịch trình du lịch bằng Tiếng Việt sắc bén...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoaderMessageIndex((prev) => (prev + 1) % loaderMilestones.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');
    setItinerary(null);
    setLoaderMessageIndex(0);

    const finalDestinationName = destination === 'custom' ? (customDestination.trim() || 'Hội An, Quảng Nam') : getDestinationLabel(destination);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: finalDestinationName,
          budget: budgetLevel,
          transportation,
          vibe,
          durationValue,
          durationUnit,
          radiusKm,
          selectedPlaces, // pass forced spots
          weatherPreference // Send preference
        })
      });

      const data = await response.json();
      if (response.status !== 200 || data.error) {
        throw new Error(data.error || 'Hệ thống AI bận rộn. Vui lòng kiểm tra cài đặt Secrets của bạn.');
      }

      // Ensure every activity has a unique string id
      const formattedDayPlans = (data.dayPlans || []).map((dp: any, dayIdx: number) => ({
        ...dp,
        dayNumber: dp.dayNumber || (dayIdx + 1),
        activities: (dp.activities || []).map((act: any, actIdx: number) => ({
          ...act,
          id: act.id || `activity-${Date.now()}-${dayIdx + 1}-${actIdx}`
        }))
      }));

      // Converted returned result nicely
      setItinerary({
        id: `itinerary-${Date.now()}`,
        destination: data.destination || finalDestinationName,
        totalCost: data.totalCost || 500000,
        durationDays: data.durationDays || (durationUnit === 'days' ? durationValue : 1),
        durationValue: data.durationValue || durationValue,
        durationUnit: data.durationUnit || durationUnit,
        radiusKm: data.radiusKm || radiusKm,
        transportation: data.transportation || transportation,
        budgetLevel: data.budgetLevel || budgetLevel,
        dayPlans: formattedDayPlans,
        additionalNotes: data.additionalNotes || '',
        weatherCondition: data.weatherCondition,
        weatherTemp: data.weatherTemp,
        weatherDescription: data.weatherDescription,
        isOfflineFallback: !!data.isOfflineFallback
      });
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || 'Lỗi không xác định khi kết nối với máy chủ AI.');
    } finally {
      setLoading(false);
    }
  };

  const getDestinationLabel = (id: string) => {
    switch (id) {
      case 'hanoi': return 'Hà Nội';
      case 'saigon': return 'TP. Hồ Chí Minh';
      case 'danang': return 'Đà Nẵng';
      case 'dalat': return 'Đà Lạt';
      default: return 'Khác';
    }
  };

  return (
    <div id="ai-planner-component" className="w-full">
      
      {loading ? (
        /* POLISHED LOADING SCREENS */
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-6 h-[460px] border border-neutral-800 shadow-2xl relative overflow-hidden">
          {/* Subtle spinning space ring */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 animate-pulse" />
          
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
          </div>

          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Trí tuệ nhân tạo đang làm việc</h3>
            
            {/* Displaying moving milestones */}
            <p className="text-sm text-emerald-300 font-medium font-mono min-h-[40px] animate-pulse">
              {loaderMilestones[loaderMessageIndex]}
            </p>
            <p className="text-xs text-neutral-500">
              Quá trình này mất khoảng vài giây để tính toán quãng đường tối ưu và tổng cộng chi tiêu...
            </p>
          </div>
        </div>
      ) : itinerary ? (
        /* DISPLAY TRIP PLAN RESULTS */
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleSaveItinerary}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isItinerarySaved(itinerary.id)
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-700 font-extrabold shadow-xs'
                  : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200'
              }`}
            >
              <BookmarkCheck className={`w-4 h-4 ${isItinerarySaved(itinerary.id) ? 'text-emerald-600' : 'text-neutral-400'}`} />
              <span>{isItinerarySaved(itinerary.id) ? 'Đã lưu vào danh sách' : 'Lưu lại hành trình này'}</span>
            </button>

            <button
              type="button"
              onClick={() => setItinerary(null)}
              className="inline-flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border border-neutral-200"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Thiết lập lịch trình mới</span>
            </button>
          </div>

          <AIPlanDisplay 
            itinerary={itinerary} 
            onModifyItinerary={(updated) => setItinerary(updated)} 
          />
        </div>
      ) : (
        /* STANDARD INPUT CONFIGURATION FORM */
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl p-5 sm:p-7 text-left space-y-6">
          
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-neutral-900">Thiết kế Tour Ăn Chơi với AI</h2>
              <p className="text-xs text-neutral-400">AI tự động cân nhắc review tích cực và lịch trình di chuyển tối ưu nhất.</p>
            </div>
          </div>

          {/* Saved Itineraries Section */}
          {savedItineraries.length > 0 && (
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/60 text-left space-y-3">
              <span className="text-[11px] font-black text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Các Lịch Trình Bạn Đã Lưu Trữ ({savedItineraries.length})</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {savedItineraries.map((saved) => (
                  <div
                    key={saved.id}
                    onClick={() => setItinerary(saved)}
                    className="group relative bg-white border border-neutral-200 hover:border-emerald-400 p-3 rounded-xl transition-all cursor-pointer text-xs flex flex-col justify-between hover:shadow-xs"
                  >
                    <div className="space-y-1.5 pr-6">
                      <p className="font-extrabold text-neutral-800 line-clamp-1 group-hover:text-emerald-700">
                        📍 Chuyến Đi {saved.destination}
                      </p>
                      <p className="text-[10px] text-neutral-500 font-medium">
                        ⏱️ {saved.durationValue && saved.durationUnit
                          ? `${saved.durationValue} ${saved.durationUnit === 'hours' ? 'Giờ' : 'Ngày'}`
                          : `${saved.durationDays} Ngày`
                        } • 💰 {(saved.totalCost || 0).toLocaleString('vi-VN')}đ
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSavedItinerary(saved.id, e)}
                      className="absolute top-2 right-2 p-1 text-neutral-300 hover:text-red-500 rounded-md hover:bg-neutral-50 transition-colors"
                      title="Xóa lịch trình đã lưu"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorText && (
            <div className="bg-red-50 text-red-700 text-xs font-semibold p-4 rounded-2xl flex items-start gap-2.5 border border-red-100 leading-relaxed text-left">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <div>
                <p className="font-bold mb-0.5">Không Thể Hoàn Thành Tạo Lịch Trình</p>
                <p>{errorText}</p>
                <p className="text-[10px] text-neutral-500 font-normal mt-1">Thông thường, lỗi này xảy ra khi bạn chưa khai báo mã khoá Gemini API trong bảng Settings &gt; Secrets của Studio.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleGeneratePlan} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Select City destination */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Mục Tiêu Điểm Đến</label>
                <select
                  id="destination-select"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-neutral-50 text-xs border border-neutral-200 rounded-xl px-3.5 py-2.5 text-left focus:outline-emerald-500 focus:bg-white text-neutral-800 cursor-pointer"
                >
                  <option value="hanoi">Hà Nội (Khu Phố Cổ & Tây Hồ)</option>
                  <option value="saigon">TP. Hồ Chí Minh (Quận 1 / Phú Nhuận)</option>
                  <option value="danang">Đà Nẵng (Sông Hàn & Cầu Rồng)</option>
                  <option value="dalat">Đà Lạt (Đồi chè & Thung lũng sương)</option>
                  <option value="custom">Nhập tọa độ địa điểm khác...</option>
                </select>

                {destination === 'custom' && (
                  <input
                    id="custom-dest-input"
                    type="text"
                    required
                    placeholder="Nhập tên điểm đến (e.g. Hội An, Phú Quốc, Sapa...)"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    className="w-full bg-white text-xs border border-neutral-250 rounded-xl px-3.5 py-2.5 text-left focus:outline-emerald-500 mt-2 font-sans placeholder:text-neutral-400"
                  />
                )}
              </div>

              {/* Budget preference Level */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Hạn Mức Ngân Sách</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cheap', title: 'Tiết kiệm', desc: 'Có quẩy, quán vỉa hè' },
                    { id: 'moderate', title: 'Trung bình', desc: 'Nhà hàng tầm trung' },
                    { id: 'luxury', title: 'Cao cấp', desc: 'Sang trọng sang chảnh' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setBudgetLevel(lvl.id as BudgetLevel)}
                      className={`px-2.5 py-2 rounded-xl text-xs border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        budgetLevel === lvl.id
                          ? 'bg-neutral-900 border-neutral-950 text-white shadow-sm'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="font-bold">{lvl.title}</span>
                      <span className={`text-[9px] font-medium mt-1 ${budgetLevel === lvl.id ? 'text-emerald-300' : 'text-neutral-400'}`}>{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transportation method */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Phương Tiện Di Chuyển Chính</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'motorbike', label: 'Xe máy', icon: <Bike className="w-4 h-4" /> },
                    { id: 'taxi', label: 'Ô tô / Grab', icon: <Navigation className="w-4 h-4 rotate-45" /> },
                    { id: 'walking', label: 'Đi bộ', icon: <User className="w-4 h-4 animate-pulse" /> }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setTransportation(method.id as any)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        transportation === method.id
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {method.icon}
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration choice (number input + select unit) */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Thời Lượng Hành Trình</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max={durationUnit === 'hours' ? 24 : 15}
                    value={durationValue}
                    onChange={(e) => setDurationValue(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-[90px] bg-neutral-50 text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:outline-emerald-500 focus:bg-white text-neutral-800 text-center font-bold"
                  />
                  <select
                    id="duration-unit-select"
                    value={durationUnit}
                    onChange={(e) => {
                      const unit = e.target.value as 'hours' | 'days';
                      setDurationUnit(unit);
                      setDurationValue(unit === 'hours' ? 8 : 1);
                    }}
                    className="flex-1 bg-neutral-50 text-xs border border-neutral-200 rounded-xl px-3 py-2.5 focus:outline-emerald-500 focus:bg-white text-neutral-800 cursor-pointer text-left"
                  >
                    <option value="days">Ngày (Days)</option>
                    <option value="hours">Giờ (Hours)</option>
                  </select>
                </div>
              </div>

              {/* Radius travel limits */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Bán Kính Di Chuyển (Cự Ly)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-neutral-50 text-xs border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500 focus:bg-white text-neutral-800 font-bold"
                  />
                  <span className="text-[11px] font-mono font-semibold text-neutral-500 bg-neutral-100 px-3 py-2.5 rounded-xl border border-neutral-200 shrink-0">
                    km bán kính
                  </span>
                </div>
              </div>

              {/* Companion vibes selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Không Khí Chuyến Đi</label>
                <select
                  id="companion-vibe-select"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value as any)}
                  className="bg-neutral-50 text-xs border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:outline-emerald-500 focus:bg-white text-neutral-800 cursor-pointer w-full text-left"
                >
                  <option value="friends">Cực cháy cùng bạn bè</option>
                  <option value="romantic">Hẹn hò lãng mạn</option>
                  <option value="family">Gia đình ấm cúng</option>
                  <option value="adventure">Phượt & Khám phá</option>
                </select>
              </div>

              {/* Weather Filter override */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wider">Trạng Thái Thời Tiết (Weather-Aware)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWeatherPreference('auto')}
                    className={`px-3 py-2 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all text-left cursor-pointer truncate ${
                      weatherPreference === 'auto'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <CloudSun className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">Tự động phát hiện</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setWeatherPreference('sunny')}
                    className={`px-3 py-2 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all text-left cursor-pointer truncate ${
                      weatherPreference === 'sunny'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <CloudSun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Nắng đẹp (Outdoor)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeatherPreference('rainy')}
                    className={`px-3 py-2 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all text-left cursor-pointer truncate ${
                      weatherPreference === 'rainy'
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <CloudRain className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="truncate">Mưa dông (Indoor)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeatherPreference('hot')}
                    className={`px-3 py-2 rounded-xl text-[11px] font-semibold border flex items-center gap-1.5 transition-all text-left cursor-pointer truncate ${
                      weatherPreference === 'hot'
                        ? 'bg-red-50 border-red-400 text-red-900 font-bold shadow-xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <ThermometerSun className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="truncate">Nắng gắt (Cần mát)</span>
                  </button>
                </div>
              </div>


            </div>

            {/* Selected places list preview */}
            {selectedPlaces.length > 0 && (
              <div className="bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100/50 text-left space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    Các Thẻ Địa Điểm Đã Chọn Cho Tour ({selectedPlaces.length}):
                  </span>
                  <p className="text-[10px] text-neutral-400">Các điểm này sẽ bắt buộc xuất hiện trong lịch trình di chuyển</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedPlaces.map((pl) => (
                    <span 
                      key={pl.id} 
                      className="bg-white border border-emerald-200 text-teal-800 text-[11px] font-medium pl-2.5 pr-1 py-0.5 rounded-full inline-flex items-center gap-1.5 hover:bg-neutral-50 transition-colors cursor-pointer group"
                      onClick={() => onRemoveSelectedPlace(pl.id)}
                      title="Bỏ điểm khỏi lịch trình bắt buộc"
                    >
                      <span className="truncate">{pl.name}</span>
                      <span className="text-neutral-300 group-hover:text-red-500 transition-colors font-bold px-1.5">×</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Action button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl py-3 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
                <span>
                  {selectedPlaces.length > 0 
                    ? `Lên lịch trình kết hợp ${selectedPlaces.length} địa điểm đã chọn` 
                    : 'Thiết kế lịch trình tối ưu bằng AI ngay'}
                </span>
              </button>
              <p className="text-[10px] text-neutral-400 text-center mt-2">Dịch vụ sử dụng mô hình trí tuệ nhân tạo Gemini-3.5-Flash</p>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
