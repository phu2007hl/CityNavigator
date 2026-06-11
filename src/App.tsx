import React, { useState, useEffect } from 'react';
import { 
  Compass, Sparkles, Search, Filter, Bookmark, Check, 
  X, Star, ArrowRight, PlusCircle, ChevronDown, ChevronUp,
  Eye, Video, ExternalLink, Plus, MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { Place, Review, TikTokVideo } from './types';
import { PRESET_PLACES, VIETNAM_CITIES } from './data';
import PlaceCard from './components/PlaceCard';
import ReviewTab from './components/ReviewTab';
import TikTokVideoPlayer from './components/TikTokVideoPlayer';
import AIPlanner from './components/AIPlanner';

// ── Import các ảnh local từ thư mục images vào Header ──
//import cao1 from './images/cao1.jpeg';
import cao2 from './images/cao2.jpeg';
//import cao3 from './images/cao3.jpeg';

export const getCategoryLabel = (id: string) => {
  switch (id) {
    case 'food': return 'Ăn uống';
    case 'coffee': return 'Cà phê & Chill';
    case 'entertainment': return 'Vui chơi';
    case 'shopping': return 'Mua sắm';
    default: return 'Tất cả';
  }
};

export const getDestinationLabel = (id: string) => {
  switch (id) {
    case 'hanoi': return 'Hà Nội';
    case 'saigon': return 'TP. Hồ Chí Minh';
    case 'danang': return 'Đà Nẵng';
    case 'dalat': return 'Đà Lạt';
    default: return 'Khác';
  }
};

export default function App() {
  const [placesList, setPlacesList] = useState<Place[]>(PRESET_PLACES);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [activeTab, setActiveTab] = useState<'discover' | 'planner'>('discover');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<TikTokVideo | null>(null);
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCity, setNewPlaceCity] = useState('hanoi');
  const [newPlaceCategory, setNewPlaceCategory] = useState('food');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlacePrice, setNewPlacePrice] = useState('30.000đ - 100.000đ');
  const [newPlacePriceLevel, setNewPlacePriceLevel] = useState<'cheap' | 'moderate' | 'luxury'>('cheap');
  const [newPlaceImage, setNewPlaceImage] = useState('');
  const [newPlaceDesc, setNewPlaceDesc] = useState('');
  const [newPlaceChannel, setNewPlaceChannel] = useState('');
  const [newPlaceVideoUrl, setNewPlaceVideoUrl] = useState('');
  const [formSuccessMsg, setFormSuccessMsg] = useState('');

  // ── State quản lý vòng lặp slideshow ảnh nền Header ──
  const headerImages = [ cao2];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % headerImages.length);
    }, 4000); // Tự động đổi ảnh sau mỗi 4 giây
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function loadPlaces() {
      setLoadingPlaces(true);
      let loadedPreset = PRESET_PLACES;
      try {
        const response = await fetch('/api/places');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) loadedPreset = data;
        }
      } catch {}
      finally {
        const savedCustomPlaces = localStorage.getItem('vivu_custom_places');
        if (savedCustomPlaces) {
          try {
            const parsed = JSON.parse(savedCustomPlaces);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const presetIds = new Set(loadedPreset.map(p => p.id));
              const uniqueCustom = parsed.filter((cp: Place) => !presetIds.has(cp.id));
              setPlacesList([...uniqueCustom, ...loadedPreset]);
              setLoadingPlaces(false);
              return;
                }
              } catch {}
            }
        setPlacesList(loadedPreset);
        setLoadingPlaces(false);
          }
        }
    loadPlaces();
  }, []);

  const selectedPlace = placesList.find(p => p.id === selectedPlaceId);

  const handleUpdateReviews = (placeId: string, updatedReviews: Review[], newRating: number) => {
    setPlacesList(prev => prev.map(place =>
      place.id === placeId ? { ...place, reviews: updatedReviews, rating: newRating, totalReviews: place.totalReviews + 1 } : place
    ));
  };

  const handleToggleAddPlace = (placeId: string) => {
    setAddedIds(prev => prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]);
  };

  const handleRemoveSelectedPlace = (placeId: string) => {
    setAddedIds(prev => prev.filter(id => id !== placeId));
  };

  const handleClearSelectedBasket = () => setAddedIds([]);

  const handleSubmitCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) { alert('Vui lòng nhập tên địa điểm.'); return; }
    const defaultImages: Record<string, string> = {
      food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
      coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60',
      entertainment: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
      shopping: 'https://images.unsplash.com/photo-1547928500-4722f55ccd99?w=800&auto=format&fit=crop&q=60'
    };
    const finalImage = newPlaceImage.trim() || defaultImages[newPlaceCategory] || defaultImages.food;
    const newPlaceObj: Place = {
      id: `custom-${Date.now()}`,
      name: newPlaceName,
      category: newPlaceCategory as any,
      city: newPlaceCity,
      image: finalImage,
      priceRange: newPlacePrice || '30.000đ - 100.000đ',
      priceLevel: newPlacePriceLevel,
      rating: 5.0,
      totalReviews: 1,
      address: newPlaceAddress || 'Chưa cập nhật cụ thể',
      lat: newPlaceCity === 'hanoi' ? 21.0285 : newPlaceCity === 'saigon' ? 10.7626 : newPlaceCity === 'danang' ? 16.0544 : 11.9404,
      lng: newPlaceCity === 'hanoi' ? 105.8542 : newPlaceCity === 'saigon' ? 106.6602 : newPlaceCity === 'danang' ? 108.2022 : 108.4365,
      reviews: [{ id: `cr-${Date.now()}`, author: 'Bạn (Đóng góp)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60', rating: 5, date: new Date().toISOString().split('T')[0], text: newPlaceDesc || 'Rất tuyệt! Khuyến khích mọi người ghé qua.', sentiment: 'positive' }],
      videos: newPlaceChannel.trim() ? [{ id: `cvid-${Date.now()}`, channelName: newPlaceChannel.trim(), channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', description: `Clip tại ${newPlaceName}`, likes: '1.2K', comments: 24, views: '10K', duration: '1:00', videoThumb: finalImage, videoUrl: newPlaceVideoUrl.trim() || 'https://www.tiktok.com' }] : [],
      description: newPlaceDesc || `Một địa điểm tuyệt vời tại ${getDestinationLabel(newPlaceCity)}.`
    };
    setPlacesList(prev => {
      const updated = [newPlaceObj, ...prev];
      const custom = updated.filter(p => p.id.startsWith('custom-'));
      localStorage.setItem('vivu_custom_places', JSON.stringify(custom));
      return updated;
    });
    setNewPlaceName(''); setNewPlaceAddress(''); setNewPlaceDesc('');
    setNewPlaceChannel(''); setNewPlaceVideoUrl(''); setNewPlaceImage('');
    setFormSuccessMsg('🎉 Thêm địa điểm thành công!');
    setTimeout(() => setFormSuccessMsg(''), 4000);
  };

  const filteredPlaces = placesList.filter(place => {
    const matchCity = selectedCity === 'all' || place.city === selectedCity;
    const matchCategory = selectedCategory === 'all' || place.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCategory && matchSearch;
  });

  const selectedPlacesInBasket = placesList.filter(p => addedIds.includes(p.id));

  // ── SIDEBAR PANEL STYLING ──
  const sidebarInput = "w-full bg-white text-sm border-2 border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 text-gray-800 font-semibold placeholder:text-gray-400 placeholder:font-normal transition-colors";

  return (
    <div className="min-h-screen flex flex-col" style={{fontFamily: 'Nunito, sans-serif'}}>
      
      {/* ── HEADER ── */}
      {/* Tăng chiều cao lên h-80 cho mobile, 400px cho tablet và 480px cho desktop để khung ảnh rộng rãi hơn */}
      <header className="relative h-80 md:h-[400px] lg:h-[480px] overflow-hidden shrink-0 w-full flex items-center">
        {/* Carousel hình ảnh local nền chuyển động mượt mà */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.img
            key={currentBgIndex}
            src={headerImages[currentBgIndex]}
            alt="City Navigator Cover Background"
            /* Thêm object-center để đảm bảo luôn lấy tâm điểm của ảnh, tránh bị cắt xén quá mức */
            className="w-full h-full object-cover object-center"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />
          {/* Lớp phủ màu Gradient mờ sẫm để text hiển thị sắc nét nhất */}
          
        </div>

        <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between w-full z-10">
          {/* Khu vực chữ Logo */}
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-0" style={{lineHeight: 1}}>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black" style={{
                color: '#F97316',
                textShadow: '3px 3px 0px #C2410C, 0 0 40px rgba(249,115,22,0.4)',
                fontFamily: 'Nunito, sans-serif',
                letterSpacing: '-2px'
              }}></span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black" style={{
                color: '#2DD4BF',
                textShadow: '3px 3px 0px #0D9488, 0 0 40px rgba(45,212,180,0.4)',
                fontFamily: 'Nunito, sans-serif',
                letterSpacing: '-2px'
              }}></span>
            </div>
          </div>

          {/* Dấu chấm hiển thị vị trí ảnh Slider nhỏ góc dưới bên phải */}
          <div className="absolute right-6 bottom-4 flex gap-2 z-20">
            {headerImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBgIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentBgIndex ? 'w-8 bg-orange-500' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ── LEFT SIDEBAR ── */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Search & Filter */}
          <div className="sidebar-panel p-4 space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-black uppercase text-xs tracking-wide border-b-2 border-orange-100 pb-2">
              <Filter className="w-4 h-4" />
              TÌM KIẾM & BỘ LỌC
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-bold text-orange-600 mb-1.5">Từ khóa tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Bánh mì Huỳnh Hoa..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={sidebarInput + ' pl-9'}
                />
                <Search className="w-4 h-4 text-orange-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-orange-600 mb-1.5">Thành phố khu vực</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCity('all')}
                  className={`w-full text-sm font-bold px-3 py-2 rounded-xl text-left border-2 flex items-center justify-between cursor-pointer transition-all ${
                    selectedCity === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 hover:border-orange-300 border-orange-200'
                  }`}
                >
                  Mọi địa điểm
                </button>
                {[
                  { id: 'hanoi', name: 'Hà Nội' },
                  { id: 'dalat', name: 'Đà Lạt' },
                  { id: 'saigon', name: 'Hồ Chí Minh' },
                  { id: 'danang', name: 'Huế' },
                ].map(city => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`w-full text-sm font-bold px-3 py-2 rounded-xl text-left border-2 flex items-center justify-between cursor-pointer transition-all ${
                      selectedCity === city.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 hover:border-orange-300 border-orange-200'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-orange-600 mb-1.5">Phân loại địa điểm</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className={sidebarInput}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="food">🍱 Ăn uống quán ngon</option>
                <option value="coffee">☕ Cà phê & Thư giãn</option>
                <option value="entertainment">🎡 Vui chơi giải trí</option>
                <option value="shopping">🛍️ Trung tâm mua sắm</option>
              </select>
            </div>
          </div>

          {/* Add place form */}
          <div className="sidebar-panel p-4 space-y-3">
            <button
              onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
              className="w-full flex items-center justify-between text-xs font-black text-orange-600 uppercase tracking-wide cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" />
                ĐÓNG GÓP ĐỊA ĐIỂM MỚI
              </div>
              {showAddPlaceForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {formSuccessMsg && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 text-xs p-2.5 rounded-xl font-bold">{formSuccessMsg}</div>
            )}

            {showAddPlaceForm && (
              <form onSubmit={handleSubmitCustomPlace} className="pt-2 border-t-2 border-orange-100 space-y-3 text-left">
                <div>
                  <label className="block text-[10px] font-black text-orange-600 uppercase mb-1">Tên Địa Điểm *</label>
                  <input type="text" required placeholder="Ví dụ: Phở Lý Quốc Sư" value={newPlaceName} onChange={e => setNewPlaceName(e.target.value)} className={sidebarInput} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black text-orange-600 uppercase mb-1">Thành Phố</label>
                    <select value={newPlaceCity} onChange={e => setNewPlaceCity(e.target.value)} className={sidebarInput}>
                      <option value="hanoi">Hà Nội</option>
                      <option value="saigon">TP. HCM</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="dalat">Đà Lạt</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-orange-600 uppercase mb-1">Phân Loại</label>
                    <select value={newPlaceCategory} onChange={e => setNewPlaceCategory(e.target.value)} className={sidebarInput}>
                      <option value="food">🍱 Ăn uống</option>
                      <option value="coffee">☕ Cà phê</option>
                      <option value="entertainment">🎡 Vui chơi</option>
                      <option value="shopping">🛍️ Mua sắm</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-orange-600 uppercase mb-1">Địa Chỉ</label>
                  <input type="text" placeholder="10 Phố Nhà Thờ, Hoàn Kiếm" value={newPlaceAddress} onChange={e => setNewPlaceAddress(e.target.value)} className={sidebarInput} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-orange-600 uppercase mb-1">Khoảng Giá</label>
                  <input type="text" placeholder="50k - 100k" value={newPlacePrice} onChange={e => setNewPlacePrice(e.target.value)} className={sidebarInput} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-orange-600 uppercase mb-1">Cảm Nhận Nhanh</label>
                  <textarea rows={2} placeholder="Nhập cảm nhận..." value={newPlaceDesc} onChange={e => setNewPlaceDesc(e.target.value)} className={sidebarInput} />
                </div>
                <button type="submit" className="w-full btn-orange py-2.5 text-sm flex items-center justify-center gap-1.5">
                  Lưu Địa Điểm
                </button>
              </form>
            )}
          </div>

          {/* Basket */}
          <div className="sidebar-panel p-4 space-y-3">
            <div className="flex items-center justify-between border-b-2 border-orange-100 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-orange-600 uppercase">
                <Bookmark className="w-4 h-4" />
                GIỎ LỊCH TRÌNH ({addedIds.length})
              </div>
              {addedIds.length > 0 && (
                <button onClick={handleClearSelectedBasket} className="text-[10px] text-gray-400 hover:text-red-500 font-bold">Xóa hết</button>
              )}
            </div>

            {addedIds.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                <p className="text-xs font-semibold">Chưa có quán nào trong giỏ.</p>
                <p className="text-[10px] mt-1 leading-relaxed">Ấn nút "+ Thêm giỏ" trên thẻ địa điểm để bắt đầu gom đồ vào lịch trình AI.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedPlacesInBasket.map(pl => (
                  <div key={pl.id} className="flex items-center justify-between gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                    <span className="text-xs font-bold text-gray-800 truncate">📍 {pl.name}</span>
                    <button onClick={() => handleRemoveSelectedPlace(pl.id)} className="text-gray-300 hover:text-red-500 font-black transition-colors">×</button>
                  </div>
                ))}
                <button
                  onClick={() => setActiveTab('planner')}
                  className="w-full bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 text-orange-600 font-bold rounded-xl py-2.5 text-xs transition-colors flex items-center justify-center gap-1"
                >
                  Vào Lập Lịch AI <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT MAIN ── */}
        <div className="lg:col-span-9 space-y-5">

          {/* Tab switcher */}
          <div className="flex bg-white p-1.5 rounded-2xl w-fit border-2 border-orange-200 shadow-sm">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'discover' ? 'tab-active' : 'text-gray-500 hover:text-orange-600'
              }`}
            >
              <Compass className="w-4 h-4" />
              Khám phá
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'planner' ? 'tab-active' : 'text-gray-500 hover:text-orange-600'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Lên lịch
            </button>
          </div>

          {activeTab === 'discover' ? (
            <div className="space-y-4">
              {/* Heading */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Đề xuất được tuyển chọn ở {selectedCity === 'all' ? 'Miền Bắc & Nam' : getDestinationLabel(selectedCity)}
                  </h2>
                </div>
                <div className="text-xs font-bold text-orange-600 bg-orange-50 border-2 border-orange-200 px-3 py-1.5 rounded-xl whitespace-nowrap">
                  {filteredPlaces.length} địa điểm tìm thấy
                </div>
              </div>

              {filteredPlaces.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-orange-200 space-y-3">
                  <Compass className="w-12 h-12 text-orange-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-600">Không tìm thấy địa điểm phù hợp</p>
                  <p className="text-xs text-gray-400">Hãy thử từ khóa khác hoặc chọn "Mọi địa điểm"</p>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filteredPlaces.map((place, index) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                    >
                      <PlaceCard
                        place={place}
                        isAdded={addedIds.includes(place.id)}
                        onSelect={() => setSelectedPlaceId(place.id)}
                        onToggleAdd={() => handleToggleAddPlace(place.id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border-2 border-orange-200 p-6 shadow-sm">
              <AIPlanner 
                selectedPlaces={selectedPlacesInBasket} 
                onRemoveSelectedPlace={handleRemoveSelectedPlace}
                defaultDestination={selectedCity === 'all' ? 'hanoi' : selectedCity} 
              />
            </div>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t-2 border-orange-100 py-5 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <p className="font-black text-orange-600">CityNavigator - Khám Phá & Thiết Kế Hành Trình</p>
            <p className="text-xs text-gray-400 mt-0.5">Mô hình AI xây dựng trên nền tảng Gemini & React</p>
          </div>
          <p className="text-xs text-gray-400">© 2026 Toàn bộ quyền được bảo lưu.</p>
        </div>
      </footer>

      {/* ── PLACE DETAIL MODAL ── */}
      {selectedPlaceId && selectedPlace && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-2 border-orange-200 animate-pop-in">
            
            {/* Modal header image */}
            <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
              <img src={selectedPlace.image} alt={selectedPlace.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button
                onClick={() => setSelectedPlaceId(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full cursor-pointer transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="text-[10px] bg-orange-500 text-white px-2.5 py-1 rounded-full font-bold uppercase">
                  📍 {VIETNAM_CITIES.find(c => c.id === selectedPlace.city)?.name || 'Việt Nam'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2">{selectedPlace.name}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-1">{selectedPlace.address}</p>
              </div>
            </div>

            {/* Modal content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Info + Videos */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-100 space-y-3">
                    <h4 className="text-xs font-black text-orange-600 uppercase tracking-wide">GIỚI THIỆU</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedPlace.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-orange-600">CHI PHÍ</span>
                      <span className="orange-badge">{selectedPlace.priceRange}</span>
                    </div>
                  </div>

                  {selectedPlace.videos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-orange-600 uppercase tracking-wide flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-red-500" /> CLIP ĐÁNH GIÁ LIÊN QUAN
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedPlace.videos.map(vid => (
                          <div
                            key={vid.id}
                            onClick={() => window.open(vid.videoUrl || `https://www.tiktok.com/search?q=${encodeURIComponent(selectedPlace.name)}`, '_blank')}
                            className="relative rounded-2xl overflow-hidden group cursor-pointer border-2 border-orange-200 aspect-video bg-gray-100 hover:border-orange-400 shadow-sm hover:shadow-md transition-all"
                          >
                            <img src={vid.videoThumb} alt={vid.description} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-white/90 group-hover:bg-orange-500 flex items-center justify-center shadow-lg transition-colors">
                                <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-white" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                              <p className="font-bold truncate"><span className="text-orange-400">@</span>{vid.channelName}</p>
                              <p className="text-white/70 text-[10px]">👁 {vid.views} · ❤️ {vid.likes}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Reviews */}
                <div className="lg:col-span-5 lg:border-l-2 lg:border-orange-100 lg:pl-5">
                  <h4 className="text-xs font-black text-orange-600 uppercase tracking-wide mb-3">ĐÁNH GIÁ</h4>
                  <ReviewTab place={selectedPlace} onUpdateReviews={handleUpdateReviews} />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="p-4 bg-orange-50 border-t-2 border-orange-100 flex items-center justify-between gap-3 shrink-0">
              <button onClick={() => setSelectedPlaceId(null)} className="text-gray-500 hover:text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white transition-colors">
                Trở lại danh sách
              </button>
              <button
                onClick={() => { handleToggleAddPlace(selectedPlace.id); setSelectedPlaceId(null); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  addedIds.includes(selectedPlace.id)
                    ? 'bg-red-50 border-2 border-red-200 text-red-600'
                    : 'btn-orange'
                }`}
              >
                {addedIds.includes(selectedPlace.id) ? 'Hủy bỏ khỏi giỏ' : '+ Thêm vào giỏ lịch trình'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TikTok overlay */}
      {activeVideo && selectedPlace && (
        <TikTokVideoPlayer video={activeVideo} placeName={selectedPlace.name} onClose={() => setActiveVideo(null)} />
      )}
    </div>
  );
}