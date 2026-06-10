import React, { useState, useEffect } from 'react';
import { 
  Compass, Sparkles, MapPin, Search, Eye, Filter, Bookmark, Check, 
  HelpCircle, Video, X, Star, Calendar, ArrowRight, CornerDownRight,
  ExternalLink, PlusCircle, ChevronDown, ChevronUp, Map, Navigation
} from 'lucide-react';
import { motion } from 'motion/react';

// Core imports
import { Place, Review, TikTokVideo } from './types';
import { PRESET_PLACES, VIETNAM_CITIES } from './data';
import PlaceCard from './components/PlaceCard';
import ReviewTab from './components/ReviewTab';
import TikTokVideoPlayer from './components/TikTokVideoPlayer';
import AIPlanner from './components/AIPlanner';

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
  
  // Filtering states
  const [activeTab, setActiveTab] = useState<'discover' | 'planner'>('discover');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Itinerary selected list
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Detailed Modal states
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<TikTokVideo | null>(null);

  // Form states for adding custom places
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

  // States for uploading image files
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url'>('upload');
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  // Drag and Drop handlers for file uploads
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert("Kích thước ảnh tối đa là 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setUploadedImageBase64(reader.result);
        setNewPlaceImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Handle saving new custom added locations to local storage
  const handleAddCustomPlace = (newPlace: Place) => {
    setPlacesList((prev) => {
      const updated = [newPlace, ...prev];
      const customOnes = updated.filter(p => p.id.startsWith('custom-'));
      localStorage.setItem('vivu_custom_places', JSON.stringify(customOnes));
      return updated;
    });
  };

  const handleSubmitCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) {
      alert("Vui lòng nhập tên địa điểm.");
      return;
    }

    const defaultImages = {
      food: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
      coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60',
      entertainment: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
      shopping: 'https://images.unsplash.com/photo-1547928500-4722f55ccd99?w=800&auto=format&fit=crop&q=60'
    };

    const finalImage = newPlaceImage.trim() || defaultImages[newPlaceCategory as 'food' | 'coffee' | 'entertainment' | 'shopping'] || defaultImages.food;

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
      lat: newPlaceCity === 'hanoi' ? 21.0285 
           : newPlaceCity === 'saigon' ? 10.7626 
           : newPlaceCity === 'danang' ? 16.0544 
           : 11.9404, // dalat
      lng: newPlaceCity === 'hanoi' ? 105.8542 
           : newPlaceCity === 'saigon' ? 106.6602 
           : newPlaceCity === 'danang' ? 108.2022 
           : 108.4365,
      reviews: [
        {
          id: `cr-${Date.now()}`,
          author: 'Bạn (Bản địa đóng góp)',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
          rating: 5,
          date: new Date().toISOString().split('T')[0],
          text: newPlaceDesc || 'Nơi lý tưởng với thực phẩm và không gian chất lượng cao! Rất khuyên khích mọi người ghé qua.',
          sentiment: 'positive'
        }
      ],
      videos: newPlaceChannel.trim() ? [
        {
          id: `cvid-${Date.now()}`,
          channelName: newPlaceChannel.trim(),
          channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
          description: `Clip trải nghiệm thực tế tại ${newPlaceName}`,
          likes: '1.2K',
          comments: 24,
          views: '10K',
          duration: '1:00',
          videoThumb: finalImage,
          videoUrl: newPlaceVideoUrl.trim() || 'https://www.tiktok.com'
        }
      ] : [],
      description: newPlaceDesc || `Một địa điểm vô cùng chất lượng nằm tại khu vực ${getDestinationLabel(newPlaceCity)}. Hãy ghé qua và trải nghiệm dịch vụ lôi cuốn nơi đây.`
    };

    handleAddCustomPlace(newPlaceObj);
    
    // Reset Form fields
    setNewPlaceName('');
    setNewPlaceAddress('');
    setNewPlaceDesc('');
    setNewPlaceChannel('');
    setNewPlaceVideoUrl('');
    setNewPlaceImage('');
    setUploadedImageBase64('');
    setFormSuccessMsg('🎉 Thêm địa điểm thành công! Đã cập nhật vào danh sách.');

    setTimeout(() => {
      setFormSuccessMsg('');
    }, 4500);
  };

  // Fetch places from server API on boot, combined with localStorage custom contributions
  useEffect(() => {
    async function loadPlaces() {
      setLoadingPlaces(true);
      let loadedPreset = PRESET_PLACES;
      try {
        const response = await fetch('/api/places');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            loadedPreset = data;
          }
        }
      } catch (err) {
        console.warn("Backend server API offline, utilizing static fallback data.", err);
      } finally {
        const savedCustomPlaces = localStorage.getItem('vivu_custom_places');
        if (savedCustomPlaces) {
          try {
            const parsed = JSON.parse(savedCustomPlaces);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const presetIds = new Set(loadedPreset.map(p => p.id));
              const uniqueCustom = parsed.filter(cp => !presetIds.has(cp.id));
              setPlacesList([...uniqueCustom, ...loadedPreset]);
              setLoadingPlaces(false);
              return;
            }
          } catch (e) {
            console.error("Lỗi đồng bộ địa điểm tự đóng góp", e);
          }
        }
        setPlacesList(loadedPreset);
        setLoadingPlaces(false);
      }
    }
    loadPlaces();
  }, []);

  const selectedPlace = placesList.find(p => p.id === selectedPlaceId);

  // Update reviews locally to keep things interactive
  const handleUpdateReviews = (placeId: string, updatedReviews: Review[], newRating: number) => {
    setPlacesList((prevList) =>
      prevList.map((place) => {
        if (place.id === placeId) {
          return {
            ...place,
            reviews: updatedReviews,
            rating: newRating,
            totalReviews: place.totalReviews + 1
          };
        }
        return place;
      })
    );
  };

  const handleToggleAddPlace = (placeId: string) => {
    setAddedIds((prev) =>
      prev.includes(placeId) 
        ? prev.filter(id => id !== placeId)
        : [...prev, placeId]
    );
  };

  const handleRemoveSelectedPlace = (placeId: string) => {
    setAddedIds((prev) => prev.filter(id => id !== placeId));
  };

  const handleClearSelectedBasket = () => {
    setAddedIds([]);
  };

  // Filtration logic
  const filteredPlaces = placesList.filter(place => {
    const matchCity = selectedCity === 'all' ? true : place.city === selectedCity;
    const matchCategory = selectedCategory === 'all' ? true : place.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' 
      ? true 
      : place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCity && matchCategory && matchSearch;
  });

  // Gather places currently added to basket
  const selectedPlacesInBasket = placesList.filter(p => addedIds.includes(p.id));

  return (
    <div id="vi-vu-app" className="min-h-screen bg-neutral-50/50 font-sans flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* HEADER SECTION WITH HERO BANNER */}
      <header className="relative bg-neutral-900 text-white overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 to-neutral-950/95" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12 self-stretch flex flex-col md:flex-row items-center justify-between gap-6 z-10 text-left">
          
          <div className="space-y-3.5 max-w-2xl">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trợ lý du lịch tối ưu bằng AI</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
              CityNavigator: Khám phá thành phố & Thiết kế hành trình
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
              Ứng dụng tổng hợp địa điểm ăn chơi, giải trí bản địa đi kèm video đánh giá thực tế và trí tuệ nhân tạo (AI) giúp lên kế hoạch di chuyển tối ưu chi phí & thời gian linh hoạt nhất.
            </p>
          </div>

          {/* Quick Stats sidepanel */}
          <div className="bg-white/10 rounded-2xl p-5 border border-white/10 backdrop-blur-md shrink-0 w-full md:w-80 space-y-3.5 text-left text-white">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block">Kho Địa Điểm ({placesList.length})</span>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <span className="text-neutral-300">🍜 Địa ẩm thực:</span>
                <span className="font-mono font-bold text-emerald-300">{placesList.filter(p => p.category === 'food').length} quán</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <span className="text-neutral-300">☕ Cà phê chill:</span>
                <span className="font-mono font-bold text-emerald-300">{placesList.filter(p => p.category === 'coffee').length} quán</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-lg">
                <span className="text-neutral-300">🎡 Điểm vui chơi:</span>
                <span className="font-mono font-bold text-emerald-300">{placesList.filter(p => p.category === 'entertainment').length} nơi</span>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* CORE WRAPPER BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-7">
        
        {/* LEFT COLUMN/SIDE PANEL - SEARCH FILTERS & Basket indicators */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* SEARCH & FILTERS BOX */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-5 shadow-sm space-y-4">
            
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 pb-2.5 text-left">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span>Tìm kiếm & Bộ lọc</span>
            </div>

            {/* Keyword searching */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-600 text-left">Từ khóa tìm kiếm</label>
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Huỳnh Hoa, cà phê trứng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50/80 text-xs border border-neutral-200 rounded-xl pl-9 pr-3.5 py-2.5 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-left"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* City Selector */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-neutral-600">Thành phố khu vực</label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCity('all')}
                  className={`w-full text-xs font-semibold px-3 py-2 rounded-xl text-left border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedCity === 'all'
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200'
                  }`}
                >
                  <span>Mọi Địa Phương</span>
                  <Compass className="w-3.5 h-3.5" />
                </button>
                
                {VIETNAM_CITIES.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`w-full text-xs font-semibold px-3 py-2 rounded-xl text-left border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCity === city.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200'
                    }`}
                  >
                    <span>{city.name}</span>
                    <span className="text-[10px] bg-neutral-200/40 text-neutral-500 font-mono px-1.5 py-0.2 rounded group-hover:bg-neutral-300 transition-colors">
                      {placesList.filter(p => p.city === city.id).length} điểm
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category selector */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold text-neutral-600">Phân loại địa điểm</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-neutral-50 text-xs border border-neutral-200 rounded-xl px-3.5 py-2.5 text-left focus:outline-emerald-500 cursor-pointer text-neutral-800"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="food">🍱 Ăn uống quán ngon</option>
                <option value="coffee">☕ Cà phê & Thư giãn</option>
                <option value="entertainment">🎡 Vui chơi giải trí</option>
                <option value="shopping">🛍️ Trung tâm sắm sửa</option>
              </select>
            </div>

          </div>

          {/* USER CUSTOM ADD PLACE FORM (COLLAPSIBLE) */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-5 shadow-sm space-y-3">
            <button
              onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
              className="w-full flex items-center justify-between text-xs text-neutral-500 font-extrabold uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <PlusCircle className="w-4.5 h-4.5 text-emerald-600" />
                <span>Đóng Góp Địa Điểm Mới</span>
              </div>
              {showAddPlaceForm ? (
                <ChevronUp className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              )}
            </button>

            {formSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-2.5 rounded-xl font-medium leading-normal text-left">
                {formSuccessMsg}
              </div>
            )}

            {showAddPlaceForm && (
              <form onSubmit={handleSubmitCustomPlace} className="pt-2.5 border-t border-neutral-105 space-y-3.5 text-left">
                {/* Tên Quán */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Tên Địa Điểm / Quán *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Phở Lý Quốc Sư"
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-3 py-2 placeholder:text-neutral-400 focus:outline-emerald-500 text-neutral-800"
                  />
                </div>

                {/* Vị Trí Thành Phố & Phân Loại Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Thành Phố</label>
                    <select
                      value={newPlaceCity}
                      onChange={(e) => setNewPlaceCity(e.target.value)}
                      className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-2.5 py-2 text-neutral-800"
                    >
                      <option value="hanoi">Hà Nội</option>
                      <option value="saigon">TP. HCM</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="dalat">Đà Lạt</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Phân Loại</label>
                    <select
                      value={newPlaceCategory}
                      onChange={(e) => setNewPlaceCategory(e.target.value)}
                      className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-2.5 py-2 text-neutral-800"
                    >
                      <option value="food">🍱 Ăn uống</option>
                      <option value="coffee">☕ Cà phê</option>
                      <option value="entertainment">🎡 Vui chơi</option>
                      <option value="shopping">🛍️ Mua sắm</option>
                    </select>
                  </div>
                </div>

                {/* Giá Cả & Mức Budget Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Khoảng Giá</label>
                    <input
                      type="text"
                      placeholder="e.g. 50k - 100k"
                      value={newPlacePrice}
                      onChange={(e) => setNewPlacePrice(e.target.value)}
                      className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Hạng Mức</label>
                    <select
                      value={newPlacePriceLevel}
                      onChange={(e) => setNewPlacePriceLevel(e.target.value as any)}
                      className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-2.5 py-2 text-neutral-800"
                    >
                      <option value="cheap">₫ (Giá rẻ)</option>
                      <option value="moderate">₫₫ (Trung cấp)</option>
                      <option value="luxury">₫₫₫ (Cao cấp)</option>
                    </select>
                  </div>
                </div>

                {/* Địa chỉ cụ thể */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Địa Chỉ Chi Tiết</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Phố Nhà Thờ, Hoàn Kiếm"
                    value={newPlaceAddress}
                    onChange={(e) => setNewPlaceAddress(e.target.value)}
                    className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800"
                  />
                </div>

                {/* Visual Image source tabs */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Hình Ảnh Minh Họa</label>
                  <div className="flex bg-neutral-100 p-0.5 rounded-lg text-neutral-600 mb-2">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('upload')}
                      className={`flex-1 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                        imageSourceMode === 'upload' ? 'bg-white text-neutral-900 shadow-xs animate-fade-in' : 'hover:text-black'
                      }`}
                    >
                      Tải ảnh lên
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={`flex-1 py-1 text-[10px] font-extrabold rounded-md transition-all cursor-pointer ${
                        imageSourceMode === 'url' ? 'bg-white text-neutral-900 shadow-xs animate-fade-in' : 'hover:text-black'
                      }`}
                    >
                      Dùng URL web
                    </button>
                  </div>

                  {imageSourceMode === 'url' ? (
                    <input
                      type="url"
                      placeholder="Trống để dùng ảnh mặc định, ví dụ: https://..."
                      value={newPlaceImage.startsWith('data:') ? '' : newPlaceImage}
                      onChange={(e) => setNewPlaceImage(e.target.value)}
                      className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-emerald-500"
                    />
                  ) : (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                        dragActive ? 'border-emerald-500 bg-emerald-50/30' : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-upload-input"
                      />
                      
                      {uploadedImageBase64 ? (
                        <div className="space-y-1.5 flex flex-col items-center">
                          <img 
                            src={uploadedImageBase64} 
                            alt="Preview" 
                            className="w-14 h-14 object-cover rounded-lg border border-neutral-200" 
                          />
                          <p className="text-[10px] text-neutral-500 line-clamp-1">Đã chọn ảnh thiết bị</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImageBase64('');
                              setNewPlaceImage('');
                            }}
                            className="text-[9px] font-bold text-red-500 hover:underline"
                          >
                            Xóa ảnh
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[11px] font-semibold text-neutral-600">Kéo và thả ảnh tại đây, hoặc bấm để chọn</p>
                          <p className="text-[9px] text-neutral-400">File ảnh PNG, JPG hoặc WEBP (Tối đa 2MB)</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Review Text vắn tắt */}
                <div className="space-y-1">
                  <label className="block text-[10.5px] font-black text-neutral-600 uppercase tracking-wider">Cảm Nhận/Review Nhanh</label>
                  <textarea
                    rows={2}
                    placeholder="Nhập cảm nhận nhanh về nơi này..."
                    value={newPlaceDesc}
                    onChange={(e) => setNewPlaceDesc(e.target.value)}
                    className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 focus:outline-emerald-500"
                  />
                </div>

                {/* Tik Tok reviewer channels */}
                <div className="border-t border-dashed border-neutral-200 pt-3.5 space-y-3">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Tích Hợp Clip Review cũ</span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-extrabold text-neutral-500">Tên Kênh Review</label>
                      <input
                        type="text"
                        placeholder="e.g. Hà Nội Ăn Gì"
                        value={newPlaceChannel}
                        onChange={(e) => setNewPlaceChannel(e.target.value)}
                        className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-2.5 py-1.5 text-neutral-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-extrabold text-neutral-500">Link Clip (TikTok...)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newPlaceVideoUrl}
                        onChange={(e) => setNewPlaceVideoUrl(e.target.value)}
                        className="w-full bg-neutral-50/70 text-xs border border-neutral-200 rounded-xl px-2.5 py-1.5 text-neutral-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-850 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5 hover:shadow-md"
                >
                  <span>Lưu Địa Điểm Đóng Góp</span>
                </button>
              </form>
            )}
          </div>

          {/* ADDED BASKET BUCKET list widget */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-5 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5 text-left">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-bold uppercase tracking-wider">
                <Bookmark className="w-4 h-4 text-neutral-400" />
                <span>Giỏ lịch trình ({addedIds.length})</span>
              </div>
              
              {addedIds.length > 0 && (
                <button 
                  onClick={handleClearSelectedBasket}
                  className="text-[10px] text-neutral-400 hover:text-red-500 font-semibold uppercase cursor-pointer"
                >
                  Xóa hết
                </button>
              )}
            </div>

            {addedIds.length === 0 ? (
              <div className="text-center py-6 text-neutral-400">
                <p className="text-xs">Chưa có quán nào trong giỏ.</p>
                <p className="text-[10px] text-neutral-400 leading-normal mt-1.5">Ấn nút "+ Thêm giỏ" trên thẻ địa điểm để bắt đầu gom đồ vào lịch trình AI.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {selectedPlacesInBasket.map((pl) => (
                  <div key={pl.id} className="text-xs flex items-center justify-between gap-1.5 p-2 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200/80 transition-colors text-left">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[11px]">📍</span>
                      <span className="font-bold text-neutral-800 truncate">{pl.name}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveSelectedPlace(pl.id)}
                      className="text-neutral-300 hover:text-red-500 px-1 font-bold transition-colors cursor-pointer"
                      title="Xóa ra khỏi giỏ"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Submit suggestion trigger */}
                <button
                  onClick={() => setActiveTab('planner')}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl py-2.5 text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-emerald-100"
                >
                  <span>Vào Lập Lịch AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN - CENTRAL MAIN INTERFACE (TABS & CONTENT) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Main Visual tab selector */}
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl w-fit border border-neutral-200">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'discover'
                  ? 'bg-white text-neutral-900 shadow-sm font-black'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Khám Phá Địa Điểm</span>
            </button>
            <button
              onClick={() => setActiveTab('planner')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'planner'
                  ? 'bg-white text-neutral-900 shadow-sm font-black'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Bộ Tối Ưu Lịch Trình AI</span>
            </button>
          </div>

          {activeTab === 'discover' ? (
            /* 1. DISCOVERY VIEW */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                    <span>Đề xuất được tuyển chọn ở {selectedCity === 'all' ? 'Miền Bắc & Nam' : getDestinationLabel(selectedCity)}</span>
                  </h2>
                  <p className="text-xs text-neutral-500">Người dùng có thể xếp hạng review và xem clip TikTok tương tác trực tiếp.</p>
                </div>
                
                {/* Result counts */}
                <div className="text-xs font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 px-3 py-1.5 rounded-xl font-mono">
                  {filteredPlaces.length} địa điểm tìm thấy
                </div>
              </div>

              {filteredPlaces.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200 shadow-sm space-y-4">
                  <Compass className="w-12 h-12 text-neutral-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-700">Không tìm thấy địa điểm phù hợp</p>
                    <p className="text-xs text-neutral-400">Vui lòng thử lại với từ khóa khác hoặc chuyển sang lựa chọn "Mọi Địa Phương".</p>
                  </div>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {filteredPlaces.map((place, index) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
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
            /* 2. PLANNER VIEW */
            <AIPlanner 
              selectedPlaces={selectedPlacesInBasket} 
              onRemoveSelectedPlace={handleRemoveSelectedPlace}
              defaultDestination={selectedCity === 'all' ? 'hanoi' : selectedCity} 
            />
          )}

        </div>

      </main>

      {/* FOOTER BAR */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs py-7 border-t border-neutral-900 mt-12 shrink-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-bold text-neutral-200">CityNavigator - Khám Phá & Thiết Kế Hành Trình</p>
            <p className="text-[11px] text-neutral-500">Mô hình AI xây dựng trên nền tảng Gemini 3.5 và React 19</p>
          </div>
          <div className="text-[11px] text-neutral-500">
            © 2026 Toàn bộ quyền được bảo lưu. Phục vụ hành trình khám phá.
          </div>
        </div>
      </footer>

      {/* FLOATING DETAIL DIALOG MODAL OVERLAY */}
      {selectedPlaceId && selectedPlace && (
        <div id="place-detail-overlay" className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center p-3 sm:p-5 backdrop-blur-xs overflow-y-auto animate-fade-in">
          
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] sm:h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 text-left animate-pop-in">
            
            {/* Modal Image Header bar */}
            <div className="relative h-56 sm:h-64 overflow-hidden shrink-0">
              <img
                src={selectedPlace.image}
                alt={selectedPlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Floating cancel X */}
              <button
                id="btn-close-detail"
                onClick={() => setSelectedPlaceId(null)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full cursor-pointer transition-colors"
                title="Đóng trang thông tin"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Float place descriptions inside image bottom left */}
              <div className="absolute bottom-4 left-5 right-5 text-white text-left">
                <span className="text-[10px] bg-emerald-500 text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  📍 {VIETNAM_CITIES.find(c => c.id === selectedPlace.city)?.name || 'Việt Nam'}
                </span>
                <h3 className="text-lg sm:text-2xl font-black mt-2 leading-tight">
                  {selectedPlace.name}
                </h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-1">{selectedPlace.address}</p>
              </div>
            </div>

            {/* Scrollable details and reviews */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* Left Column: Info, Specs, & Videos */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  {/* Core Descriptions */}
                  <div className="space-y-3 bg-neutral-50/60 p-5 rounded-2xl border border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Khái quát địa lý & dịch vụ</h4>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans first-letter:text-xl first-letter:font-bold first-letter:text-emerald-600">
                      {selectedPlace.description}
                    </p>
                    
                    <div className="inline-flex flex-wrap items-center gap-3 pt-2 text-xs">
                      <span className="font-semibold text-neutral-500">Mức chi trả:</span>
                      <span className="font-bold text-emerald-600 font-mono bg-white border border-emerald-100 px-2.5 py-1 rounded-md">
                        {selectedPlace.priceRange}
                      </span>
                    </div>
                  </div>

                  {/* INTEGRATE PORTRAIT TIKTOK VIDEOS */}
                  {selectedPlace.videos && selectedPlace.videos.length > 0 && (
                    <div className="space-y-3 text-left">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Video className="w-4.5 h-4.5 text-red-500" />
                        <span>Clip Đánh Giá Ngắn Liên Quan ({selectedPlace.videos.length})</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedPlace.videos.map((vid) => (
                          <div 
                            key={vid.id}
                            onClick={() => {
                              const query = encodeURIComponent(`${vid.channelName} ${selectedPlace.name}`);
                              const targetUrl = vid.videoUrl || `https://www.tiktok.com/search?q=${query}`;
                              window.open(targetUrl, '_blank');
                            }}
                            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-neutral-200/60 aspect-video bg-neutral-100 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all duration-350"
                            title="Bấm để xem clip đánh giá thực tế"
                          >
                            <img 
                              src={vid.videoThumb} 
                              alt={vid.description} 
                              referrerPolicy="no-referrer" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/25 transition-colors flex flex-col justify-between p-3.5" />
                            
                            {/* External link indicator */}
                            <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/95 group-hover:bg-red-500 group-hover:text-white text-neutral-800 flex items-center justify-center shadow-lg transition-all duration-300">
                              <ExternalLink className="w-4 h-4" />
                            </div>

                            {/* TikTok metadata */}
                            <div className="absolute bottom-2 left-2 right-2 text-white text-xs space-y-1">
                              <p className="font-bold text-[11px] truncate flex items-center gap-1">
                                <span className="text-sky-400 font-extrabold font-mono">@</span>
                                {vid.channelName}
                              </p>
                              <p className="text-[10px] text-white/80 font-normal line-clamp-1 leading-normal">
                                💬 {vid.comments} • ❤️ {vid.likes}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Reviews & Feedbacks */}
                <div className="lg:col-span-5 lg:border-l lg:border-neutral-100 lg:pl-6 space-y-6">
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Ý kiến và đề xuất thực tế</h4>
                    <ReviewTab 
                      place={selectedPlace} 
                      onUpdateReviews={handleUpdateReviews} 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom control buttons */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => setSelectedPlaceId(null)}
                className="hover:bg-neutral-200 text-neutral-500 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Trở lại danh sách
              </button>

              <button
                onClick={() => {
                  handleToggleAddPlace(selectedPlace.id);
                  setSelectedPlaceId(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 ${
                  addedIds.includes(selectedPlace.id)
                    ? 'bg-red-50 border border-red-200 text-red-600'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {addedIds.includes(selectedPlace.id) ? 'Hủy bỏ khỏi giỏ' : 'Thêm vào giỏ lịch trình'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PORTRAIT OVERLAY TIKTOK SIMULATOR DIALOG */}
      {activeVideo && selectedPlace && (
        <TikTokVideoPlayer 
          video={activeVideo} 
          placeName={selectedPlace.name} 
          onClose={() => setActiveVideo(null)} 
        />
      )}

    </div>
  );
}