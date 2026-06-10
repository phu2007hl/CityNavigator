import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, Volume2, VolumeX, X, UserCheck, Star } from 'lucide-react';
import { TikTokVideo } from '../types';

interface TikTokVideoPlayerProps {
  video: TikTokVideo;
  placeName: string;
  onClose: () => void;
}

export default function TikTokVideoPlayer({ video, placeName, onClose }: TikTokVideoPlayerProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseFloat(video.likes) || 12.4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showComments, setShowComments] = useState(false);
  
  // Custom mock comments for the interactive panel
  const [commentsList, setCommentsList] = useState([
    { id: 1, user: '@travel_junkie', text: 'Quán này đợt trước mình đi cũng ổn lắm, đắc địa nhưng chất lượng phết.', likes: 45 },
    { id: 2, user: '@foodie_saigon', text: 'Thèm xỉu ngang! Video quay cuốn quá trời, cuối tuần phải lập hội đi liền mới được.', likes: 12 },
    { id: 3, user: '@du_lich_viet', text: 'Cà phê trứng ở đây chuẩn vị nhất Hà Nội luôn ấy, ngọt ngào ngậy ngậy không tanh tẹo nào!', likes: 3 }
  ]);
  const [newCommentInput, setNewCommentInput] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // loop
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 0.1);
    } else {
      setLikeCount((prev) => prev + 0.1);
    }
    setLiked(!liked);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentInput.trim()) return;
    setCommentsList([
      {
        id: Date.now(),
        user: '@nguoi_dung_vivu',
        text: newCommentInput.trim(),
        likes: 0
      },
      ...commentsList
    ]);
    setNewCommentInput('');
  };

  return (
    <div id="video-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-md">
      {/* Close button outer */}
      <button 
        id="btn-close-video"
        onClick={onClose} 
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 bg-neutral-900/60 rounded-full cursor-pointer transition-all z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col lg:flex-row max-w-4xl w-full h-[90vh] sm:h-[82vh] bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl">
        
        {/* TikTok Left - Vertical Video Simul Panel */}
        <div className="relative flex-1 bg-black flex items-center justify-center h-full max-h-[65vh] lg:max-h-none">
          
          {/* Simulated Looping Ambient Video Visual background */}
          <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
            <div 
              className={`w-full h-full bg-cover bg-center transition-all duration-1000 transform scale-105 filter blur-xs`}
              style={{ backgroundImage: `url(${video.videoThumb})` }}
            />
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Simulated Motion Animation Waves */}
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-64 h-64 border-4 border-emerald-500/30 rounded-full animate-ping duration-3000" />
                <div className="w-80 h-80 border-2 border-emerald-500/20 rounded-full animate-ping duration-2000 delay-500" />
              </div>
            )}
          </div>

          {/* Place Tag in video */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-md z-10 border border-emerald-400/40">
            <Star className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
            <span>Đang xem review: {placeName}</span>
          </div>

          {/* Player controls overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 pointer-events-none">
            {/* Top right mute / play helper */}
            <div className="self-end mt-2 pointer-events-auto flex gap-2">
              <button 
                onClick={() => setMuted(!muted)} 
                className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white cursor-pointer transition-all"
                title={muted ? "Bật âm thanh" : "Tắt âm thanh"}
              >
                {muted ? <VolumeX className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* Play overlay Indicator on click */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-5 rounded-full bg-black/40 hover:bg-black/60 text-white pointer-events-auto cursor-pointer transition-all hover:scale-110 active:scale-95"
              >
                {isPlaying ? <Play className="w-8 h-8 fill-current text-emerald-400 rotate-90" /> : <Play className="w-8 h-8" />}
              </button>
              {!isPlaying && <span className="absolute bottom-24 text-white/80 text-xs px-2 py-1 bg-black/50 rounded">Đang Thử Nghiệm Tạm Dừng</span>}
            </div>

            {/* Bottom Publisher Profile & Description */}
            <div className="mt-auto max-w-[85%] text-left">
              <div className="flex items-center gap-2.5 mb-2.5 pointer-events-auto">
                <div className="w-9 h-9 rounded-full border-2 border-emerald-400 overflow-hidden">
                  <img src={video.channelAvatar} alt={video.channelName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold flex items-center gap-1">
                    {video.channelName}
                    <span className="text-[10px] bg-sky-500 text-white px-1 py-0.2 rounded-sm font-normal">KOL</span>
                  </h4>
                  <p className="text-white/60 text-[11px] font-mono">Đăng tải: 1 ngày trước</p>
                </div>
                <button className="text-[10px] bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-2 py-0.5 rounded-full font-semibold transition-colors cursor-pointer">
                  + Follow
                </button>
              </div>
              <p className="text-white text-xs sm:text-sm font-normal leading-relaxed line-clamp-3 mb-2">
                {video.description}
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                <span className="animate-bounce">🎵</span>
                <span className="text-[11px] truncate">Nhạc nền xu hướng - Âm thanh gốc {video.channelName}</span>
              </div>
            </div>
          </div>

          {/* Vertical Actions Ribbon Right-side */}
          <div className="absolute right-4 bottom-12 flex flex-col items-center gap-5 z-20">
            {/* Heart */}
            <button 
              onClick={handleLike} 
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className={`p-3 rounded-full transition-all duration-300 ${liked ? 'bg-red-500 text-white scale-110' : 'bg-black/60 text-white group-hover:bg-black/80'}`}>
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-white text-[11px] font-mono font-medium mt-1 drop-shadow-md">
                {liked ? (likeCount).toFixed(1) : video.likes}K
              </span>
            </button>

            {/* Comments button toggle */}
            <button 
              onClick={() => setShowComments(!showComments)} 
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="p-3 rounded-full bg-black/60 text-white group-hover:bg-black/80 transition-all">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-white text-[11px] font-mono font-medium mt-1 drop-shadow-md">
                {commentsList.length}
              </span>
            </button>

            {/* Share */}
            <button className="flex flex-col items-center group cursor-pointer" onClick={() => alert("Đã sao chép liên kết video review!")}>
              <div className="p-3 rounded-full bg-black/60 text-white group-hover:bg-black/80 transition-all">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-white text-[11px] font-mono mt-1 drop-shadow-md">Chia sẻ</span>
            </button>

            {/* Animated Vinyl icon spin */}
            <div className={`w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
          </div>

          {/* Landscape play timelines */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-800 z-10">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* TikTok Right - Custom interactive Interactive Comment/Info Desk */}
        <div className={`w-full lg:w-[360px] bg-neutral-900 border-t lg:border-t-0 lg:border-l border-neutral-800 flex flex-col h-full ${showComments ? 'h-full' : 'h-[35vh] lg:h-full'}`}>
          
          {/* Header Panel */}
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
            <div>
              <h3 className="text-sm font-semibold text-white">Yêu thích & Thảo luận</h3>
              <p className="text-[11px] text-neutral-400">Xem thử phản hồi của người đi trước</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/40">
              {video.views} Lượt xem
            </span>
          </div>

          {/* Scrollable comments stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
            <div className="bg-neutral-950/60 p-3 rounded-xl border border-neutral-800 mb-2">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Thông điệp cốt lõi</span>
              <p className="text-xs text-white/95 mt-1 font-sans">
                Reviewer đánh giá cao quán ăn vì không gian độc lạ cùng phong cách phục vụ nhanh chóng. Thích hợp đi đôi hoặc nhóm bạn muốn có những bức ảnh hoài niệm.
              </p>
            </div>

            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-800 pb-1 flex items-center gap-1.5">
              <span>Bình luận ({commentsList.length})</span>
            </h4>

            <div className="space-y-3.5 max-h-[220px] lg:max-h-none overflow-y-auto">
              {commentsList.map((comm) => (
                <div key={comm.id} className="text-xs border-b border-neutral-800/40 pb-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-emerald-400">{comm.user}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">❤️ {comm.likes}</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed font-sans">{comm.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* New Comment Submission form */}
          <form onSubmit={handleAddComment} className="p-3 bg-neutral-950 border-t border-neutral-800">
            <div className="flex items-center gap-2">
              <input
                id="comment-input"
                type="text"
                placeholder="Để lại bình luận của bạn..."
                value={newCommentInput}
                onChange={(e) => setNewCommentInput(e.target.value)}
                className="flex-1 bg-neutral-900 text-white rounded-lg px-3 py-2 text-xs border border-neutral-850 focus:outline-none focus:border-emerald-500 text-left placeholder:text-neutral-500 font-sans"
              />
              <button 
                type="submit" 
                className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
              >
                Gửi
              </button>
            </div>
            <p className="text-[10px] text-neutral-500 text-center mt-2">Bình luận ảo phục vụ trải nghiệm xem trước trực tuyến</p>
          </form>
        </div>

      </div>
    </div>
  );
}
