import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, AlertCircle, BookmarkCheck, Bike, Car, Footprints
} from 'lucide-react';
import { Place, Itinerary, BudgetLevel } from '../types';
import AIPlanDisplay from './AIPlanDisplay';
import { motion } from 'framer-motion';

interface AIPlannerProps {
  selectedPlaces: Place[];
  onRemoveSelectedPlace: (placeId: string) => void;
  defaultDestination?: string;
}

const getDestinationLabel = (id: string) => {
  switch (id) {
    case 'hanoi': return 'Hà Nội';
    case 'saigon': return 'TP. Hồ Chí Minh';
    case 'danang': return 'Đà Nẵng';
    case 'dalat': return 'Đà Lạt';
    default: return 'Khác';
  }
};

// Estimate budget level from VND amount
const estimateBudgetLevel = (vnd: number): BudgetLevel => {
  if (vnd < 300000) return 'cheap';
  if (vnd < 800000) return 'moderate';
  return 'luxury';
};

export default function AIPlanner({ selectedPlaces, onRemoveSelectedPlace, defaultDestination = 'hanoi' }: AIPlannerProps) {
  const [destination, setDestination] = useState(defaultDestination);
  const [customDestination, setCustomDestination] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [budgetVnd, setBudgetVnd] = useState(800000);
  const [groupSize, setGroupSize] = useState('3-5');
  const [startTime, setStartTime] = useState('16:00');
  const [endTime, setEndTime] = useState('22:00');
  const [radiusKm, setRadiusKm] = useState(10);
  const [transportation, setTransportation] = useState<'motorbike' | 'taxi' | 'walking'>('motorbike');
  const [weatherPreference, setWeatherPreference] = useState<'auto' | 'sunny' | 'rainy' | 'hot'>('auto');
  const [loading, setLoading] = useState(false);
  const [loaderMessageIndex, setLoaderMessageIndex] = useState(0);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [errorText, setErrorText] = useState('');
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vivu_saved_itineraries');
    if (saved) { try { setSavedItineraries(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (defaultDestination) setDestination(defaultDestination);
  }, [defaultDestination]);

  const loaderMilestones = [
    '🤖 Đang kết nối trực quan hóa dữ liệu du lịch...',
    '⭐ Đang phân tích đánh giá tích cực từ khách hàng...',
    '🏍️ Đang tính toán các tọa độ di chuyển phù hợp...',
    '💰 Tổ chức ngân sách và phân phối hợp lý...',
    '✨ Hoàn thiện lịch trình cá nhân hóa bằng AI...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoaderMessageIndex(prev => (prev + 1) % loaderMilestones.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Compute duration in hours from time range
  const computeDurationHours = () => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMin = sh * 60 + sm;
    let endMin = eh * 60 + em;
    if (endMin <= startMin) endMin += 24 * 60; // overnight
    return Math.max(1, Math.round((endMin - startMin) / 60));
  };

  const handleSaveItinerary = () => {
    if (!itinerary) return;
    setSavedItineraries(prev => {
      const alreadySaved = prev.some(i => i.id === itinerary.id);
      const updated = alreadySaved ? prev.filter(i => i.id !== itinerary.id) : [itinerary, ...prev];
      localStorage.setItem('vivu_saved_itineraries', JSON.stringify(updated));
      return updated;
    });
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorText('');
    setItinerary(null);
    setLoaderMessageIndex(0);

    const finalDestinationName = destination === 'custom'
      ? (customDestination.trim() || 'Hội An')
      : getDestinationLabel(destination);

    const durationHours = computeDurationHours();
    const budgetLevel = estimateBudgetLevel(budgetVnd);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: finalDestinationName,
          budget: budgetLevel,
          budgetVnd,
          groupSize,
          transportation,
          purpose: aiPrompt.trim() || 'Khám phá và trải nghiệm thành phố',
          durationValue: durationHours,
          durationUnit: 'hours',
          startTime,
          endTime,
          radiusKm,
          selectedPlaces,
          weatherPreference
        })
      });

      const data = await response.json();
      if (response.status !== 200 || data.error) throw new Error(data.error || 'Hệ thống AI bận rộn.');

      const formattedDayPlans = (data.dayPlans || []).map((dp: any, dayIdx: number) => ({
        ...dp,
        dayNumber: dp.dayNumber || (dayIdx + 1),
        activities: (dp.activities || []).map((act: any, actIdx: number) => ({
          ...act,
          id: act.id || `activity-${Date.now()}-${dayIdx + 1}-${actIdx}`
        }))
      }));

      setItinerary({
        id: `itinerary-${Date.now()}`,
        destination: data.destination || finalDestinationName,
        totalCost: data.totalCost || budgetVnd,
        durationDays: 1,
        durationValue: durationHours,
        durationUnit: 'hours',
        radiusKm: data.radiusKm || radiusKm,
        transportation: data.transportation || transportation,
        budgetLevel: budgetLevel,
        dayPlans: formattedDayPlans,
        additionalNotes: data.additionalNotes || '',
        weatherCondition: data.weatherCondition,
        weatherTemp: data.weatherTemp,
        weatherDescription: data.weatherDescription,
        isOfflineFallback: !!data.isOfflineFallback
      });
    } catch (err: any) {
      setErrorText(err.message || 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  };

  // ── Styles ──
  const inputCls = "w-full bg-white text-sm border-2 border-orange-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-orange-400 text-gray-800 font-semibold placeholder:text-gray-400 placeholder:font-normal transition-colors";
  const labelCls = "block text-xs font-black text-orange-700 mb-2 uppercase tracking-wider";

  const transportOptions = [
    { id: 'motorbike', label: 'Xe máy',     icon: <Bike className="w-4 h-4" /> },
    { id: 'taxi',     label: 'Ô tô / Grab', icon: <Car className="w-4 h-4" /> },
    { id: 'walking',  label: 'Đi bộ',       icon: <Footprints className="w-4 h-4" /> }
  ];

  const weatherOptions = [
    { id: 'auto',  label: 'Tự động phát hiện',  emoji: '🔄' },
    { id: 'sunny', label: 'Nắng đẹp (Outdoor)',  emoji: '☀️' },
    { id: 'rainy', label: 'Mưa dông (Indoor)',   emoji: '🌧️' },
    { id: 'hot',   label: 'Nắng gắt (Cần mát)', emoji: '🥵' }
  ];

  const groupOptions = [
    { value: '1',    label: 'Một mình (1 người)' },
    { value: '2',    label: 'Cặp đôi (2 người)' },
    { value: '3-5',  label: 'Nhóm bạn (3–5 người)' },
    { value: '6-10', label: 'Nhóm lớn (6–10 người)' },
    { value: '10+',  label: 'Đoàn đông (10+ người)' }
  ];

  if (itinerary) {
    return (
      <div className="animate-fade-in space-y-4">
        <AIPlanDisplay itinerary={itinerary} onModifyItinerary={setItinerary} />
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setItinerary(null)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-orange-200 text-orange-600 rounded-xl text-sm font-black hover:border-orange-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Lập lại lịch trình
          </button>
          <button
            onClick={handleSaveItinerary}
            className="flex items-center gap-2 px-5 py-2.5 btn-teal rounded-xl text-sm"
          >
            <BookmarkCheck className="w-4 h-4" />
            {savedItineraries.some(i => i.id === itinerary.id) ? 'Đã lưu' : 'Lưu lịch trình'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleGeneratePlan} className="space-y-7">

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b-2 border-orange-100">
        <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-base">Thiết kế Tour Ăn Chơi với AI</h3>
          <p className="text-xs text-gray-400 mt-0.5">AI cá nhân hóa lịch trình theo mục đích và thời gian thực.</p>
        </div>
      </div>

      {/* Loading */}
      {/* Loading (Đã thêm hiệu ứng Framer Motion) */}
      {loading && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center space-y-3"
        >
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-orange-700 animate-pulse">
            {loaderMilestones[loaderMessageIndex]}
          </p>
        </motion.div>
      )}

      {errorText && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-semibold">{errorText}</p>
        </div>
      )}

      {/* ── 1. AI Prompt (full width) ── */}
      <div>
        <label className={labelCls}>🎯 Mục Đích & Yêu Cầu Cụ Thể (AI Prompt)</label>
        <textarea
          rows={3}
          value={aiPrompt}
          onChange={e => setAiPrompt(e.target.value)}
          placeholder="Ví dụ: Xả stress sau kỳ thi, đi cafe học Toán, chụp ảnh kỷ yếu, né giờ làm ca sáng (7h-13h)..."
          className={`${inputCls} resize-none leading-relaxed`}
        />
        <p className="text-[10px] text-gray-400 mt-1 ml-1">Càng chi tiết, AI càng lên lịch chính xác hơn.</p>
      </div>

      {/* ── 2. Điểm xuất phát + Phương tiện ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>📍 Điểm Xuất Phát</label>
          <select value={destination} onChange={e => setDestination(e.target.value)} className={inputCls}>
            <option value="hanoi">Hà Nội (Khu Phố Cổ & Tây Hồ)</option>
            <option value="saigon">TP. Hồ Chí Minh (Quận 1 & Bình Thạnh)</option>
            <option value="danang">Đà Nẵng (Bãi biển Mỹ Khê)</option>
            <option value="dalat">Đà Lạt (Trung tâm & Hồ Xuân Hương)</option>
            <option value="custom">📝 Nhập điểm đến khác...</option>
          </select>
          {destination === 'custom' && (
            <input type="text" placeholder="Ví dụ: Hội An, Quảng Nam" value={customDestination}
              onChange={e => setCustomDestination(e.target.value)} className={`${inputCls} mt-2`} />
          )}
        </div>

        <div>
          <label className={labelCls}>🏍️ Phương Tiện Di Chuyển Chính</label>
          <div className="grid grid-cols-3 gap-2">
            {transportOptions.map(t => (
              <button key={t.id} type="button" onClick={() => setTransportation(t.id as any)}
                className={`py-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                  transportation === t.id
                    ? 'btn-orange border-orange-500 shadow-md'
                    : 'bg-white border-orange-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                {t.icon}<span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Ngân sách (VND) + Số lượng người ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>💰 Tổng Ngân Sách (VND)</label>
          <input
            type="number"
            min="0"
            step="50000"
            value={budgetVnd}
            onChange={e => setBudgetVnd(Math.max(0, parseInt(e.target.value) || 0))}
            className={inputCls}
            placeholder="800000"
          />
          {/* Budget hint pill */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {[200000, 500000, 800000, 1500000, 3000000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setBudgetVnd(amt)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  budgetVnd === amt
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white border-orange-200 text-orange-600 hover:border-orange-400'
                }`}
              >
                {amt.toLocaleString('vi-VN')}đ
              </button>
            ))}
          </div>
          {/* Auto-detected level hint */}
          <p className="text-[10px] text-gray-400 mt-1.5 ml-0.5">
            Phân loại tự động:&nbsp;
            <span className="font-bold text-orange-600">
              {estimateBudgetLevel(budgetVnd) === 'cheap' ? '🟢 Tiết kiệm'
               : estimateBudgetLevel(budgetVnd) === 'moderate' ? '🟡 Trung bình'
               : '🔴 Cao cấp'}
            </span>
          </p>
        </div>

        <div>
          <label className={labelCls}>👥 Số Lượng Người</label>
          <select
            value={groupSize}
            onChange={e => setGroupSize(e.target.value)}
            className={inputCls}
          >
            {groupOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── 4. Khung giờ: Bắt đầu + Kết thúc ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>🕐 Bắt Đầu Lúc</label>
          <input
            type="time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>🕙 Kết Thúc Lúc</label>
          <input
            type="time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      {/* Duration preview pill */}
      {startTime && endTime && (
        <div className="flex items-center gap-2 -mt-4">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
            <span className="text-orange-500 font-black">⏱</span>
            <span className="text-gray-600 font-semibold">
              Tổng thời lượng:&nbsp;
              <span className="text-orange-600 font-black">{computeDurationHours()} giờ</span>
              &nbsp;({startTime} – {endTime})
            </span>
          </div>
        </div>
      )}

      {/* ── 5. Bán kính + Thời tiết ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>📏 Bán Kính Di Chuyển (Cự Ly)</label>
          <div className="flex gap-2">
            <input type="number" min="1" max="100" value={radiusKm}
              onChange={e => setRadiusKm(Math.max(1, parseInt(e.target.value) || 1))}
              className={`flex-1 ${inputCls}`} />
            <span className="bg-orange-50 border-2 border-orange-200 text-orange-700 text-sm font-bold px-4 rounded-xl flex items-center shrink-0">
              km bán kính
            </span>
          </div>
        </div>

        <div>
          <label className={labelCls}>🌤️ Trạng Thái Thời Tiết (Weather-Aware)</label>
          <div className="grid grid-cols-2 gap-2">
            {weatherOptions.map(w => (
              <button key={w.id} type="button" onClick={() => setWeatherPreference(w.id as any)}
                className={`px-3 py-2.5 rounded-xl border-2 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer text-left ${
                  weatherPreference === w.id
                    ? 'bg-orange-50 border-orange-400 text-orange-900 shadow-sm'
                    : 'bg-white border-orange-200 text-gray-600 hover:border-orange-300'
                }`}
              >
                <span>{w.emoji}</span>
                <span className="truncate">{w.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Selected places ── */}
      {selectedPlaces.length > 0 && (
        <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
          <p className="text-xs font-black text-orange-700 mb-2.5 flex items-center gap-1.5">
            <BookmarkCheck className="w-4 h-4" />
            Địa điểm đã chọn từ giỏ ({selectedPlaces.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedPlaces.map(pl => (
              <span key={pl.id} onClick={() => onRemoveSelectedPlace(pl.id)}
                className="bg-white border-2 border-orange-200 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition-colors inline-flex items-center gap-1.5">
                📍 {pl.name} <span className="text-gray-300 hover:text-red-500 font-black">×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <div className="space-y-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-base font-black rounded-2xl text-white flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{
            background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
            boxShadow: '0 6px 24px rgba(249,115,22,0.45)'
          }}
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          THIẾT KẾ LỊCH TRÌNH BẰNG AI NGAY
        </button>
        <p className="text-center text-[11px] text-gray-400">
          Dịch vụ sử dụng mô hình trí tuệ nhân tạo Gemini-3.5-Flash
        </p>
      </div>

    </form>
  );
}