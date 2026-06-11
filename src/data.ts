import { Place } from './types';



export const VIETNAM_CITIES = [
  { id: 'hanoi', name: 'Hà Nội', region: 'Miền Bắc' },
  { id: 'saigon', name: 'TP. Hồ Chí Minh', region: 'Miền Nam' },
  { id: 'danang', name: 'Đà Nẵng', region: 'Miền Trung' },
  { id: 'dalat', name: 'Đà Lạt', region: 'Tây Nguyên' }
];

export const PRESET_PLACES: Place[] = [
  // --- HÀ NỘI ---
  {
    id: 'hn-pho-thin',
    name: 'Phở Thìn 13 Lò Đúc',
    category: 'food',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=60',
    priceRange: '90.000đ - 120.000đ',
    priceLevel: 'moderate',
    rating: 4.5,
    totalReviews: 1240,
    address: '13 Lò Đúc, Ngô Thì Nhậm, Hai Bà Trưng, Hà Nội',
    lat: 21.0197,
    lng: 105.8559,
    description: 'Thương hiệu phở bò tái lăn trứ danh Hà Nội với hương thơm ngào ngạt của hành hoa phủ ngập mặt tô phở và nước dùng béo ngậy đặc trưng.',
    reviews: [
      {
        id: 'r1',
        author: 'Nguyễn Minh Anh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-12',
        text: 'Nước dùng béo ngậy, thịt bò nhiều xào thơm lừng tỏi hành. Ăn kèm quẩy giòn rụm quả thực là combo hoàn hảo cho buổi sáng mát mẻ của Hà Nội. Dù có ý kiến trái chiều về lượng hành nhưng mình vẫn rất mê vị béo ngậy ở đây!',
        sentiment: 'positive'
      },
      {
        id: 'r2',
        author: 'Trần Hoàng Nam',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        rating: 4,
        date: '2026-05-01',
        text: 'Vị phở ở đây rất riêng biệt, thơm mùi khói xào bò tái lăn. Tuy nhiên quán hơi chật và nóng vào giờ cao điểm, giá so với mặt bằng chung có phần hơi cao nhưng xứng đáng trải nghiệm thử một lần.',
        sentiment: 'positive'
      },
      {
        id: 'r3',
        author: 'Vũ Thu Trang',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        rating: 3,
        date: '2026-04-22',
        text: 'Nước lèo quá béo so với gu thanh đạm của mình, hành cực kỳ nhiều che hết cả bánh phở. Thích hợp cho bạn nào chuộng nước béo đậm đà.',
        sentiment: 'neutral'
      }
    ],
    videos: [
      {
        id: 'v1',
        channelName: 'Hà Nội Phố Ăn Chơi',
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        description: 'Thử thách hết sạch bát phở tái lăn nhiều hành nhất Hà Nội. Liệu có xứng danh phở 100K xôn xao mạng xã hội?',
        likes: '45.2K',
        comments: 312,
        views: '1.2M',
        duration: '1:30',
        videoThumb: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&auto=format&fit=crop&q=60'
      },
      {
        id: 'v2',
        channelName: 'Bụng Đói Ăn Cả Thế Giới',
        channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        description: 'Kinh nghiệm ăn phở Thìn Lò Đúc đúng chuẩn truyền thống cho khách du lịch lần đầu đến Hà Nội.',
        likes: '12.8K',
        comments: 98,
        views: '340K',
        duration: '0:58',
        videoThumb: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'hn-cafe-giang',
    name: 'Cà Phê Trứng Giảng',
    category: 'coffee',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=60',
    priceRange: '35.000đ - 50.000đ',
    priceLevel: 'cheap',
    rating: 4.7,
    totalReviews: 2450,
    address: 'Ngõ 39 Nguyễn Hữu Huân, Lý Thái Tổ, Hoàn Kiếm, Hà Nội',
    lat: 21.0345,
    lng: 105.8548,
    description: 'Nơi khai sinh ra món cà phê trứng nức tiếng xa gần. Sự hòa quyện tuyệt hảo của lòng đỏ trứng gà đánh bông béo ngậy với cà phê robusta đậm đà.',
    reviews: [
      {
        id: 'r4',
        author: 'Lâm Khánh Linh',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-20',
        text: 'Cà phê trứng siêu thơm, không một chút tanh nào cả! Đánh trứng rất đặc mịn như kem. Quán nằm sâu trong ngõ nhỏ, đậm chất vintage cổ kính Hà Nội.',
        sentiment: 'positive'
      },
      {
        id: 'r5',
        author: 'David Smith',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-18',
        text: 'An absolute masterpiece. Vietnamese Tiramisu in a cup! The warmth and creamy texture blend beautifully with strong espresso. Mandatory stop in Hanoi!',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v3',
        channelName: 'FoodReviewer_HN',
        channelAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
        description: 'Khám phá quán cà phê trứng lâu đời nhất Hà Nội - Liệu có bị rập khuôn hay thơm ngon như lời đồn?',
        likes: '58.4K',
        comments: 244,
        views: '890K',
        duration: '1:12',
        videoThumb: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'hn-ho-tay',
    name: 'Hồ Tây & Chùa Trấn Quốc',
    category: 'entertainment',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?w=800&auto=format&fit=crop&q=60',
    priceRange: 'Miễn phí',
    priceLevel: 'cheap',
    rating: 4.8,
    totalReviews: 5040,
    address: 'Đường Thanh Niên, Yên Phụ, Tây Hồ, Hà Nội',
    lat: 21.0478,
    lng: 105.8364,
    description: 'Khoảng không gian lộng gió bình yên nhất Hà thành, biểu tượng văn hóa tâm linh lâu đời Chùa Trấn Quốc và điểm ngắm hoàng hôn đỉnh nhất thủ đô.',
    reviews: [
      {
        id: 'r6',
        author: 'Phạm Đức Minh',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-25',
        text: 'Thích nhất cảm giác chiều chiều lượn xe máy quanh Hồ Tây hóng gió, rồi ghé vào hiên chùa Trấn Quốc ngắm hoàng hôn rụng xuống nước. Cảnh sắc thanh tịnh, vô ưu.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v4',
        channelName: 'CheckInHanoi',
        channelAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60',
        description: 'Tọa độ săn hoàng hôn đẹp nhất Hồ Tây và những món ngon quanh đường Thanh Niên bạn không thể bỏ lỡ.',
        likes: '34.1K',
        comments: 112,
        views: '512K',
        duration: '1:45',
        videoThumb: 'https://images.unsplash.com/photo-1505993597083-3bd19fb75e57?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'hn-lotte-tayho',
    name: 'Lotte Mall West Lake Tây Hồ',
    category: 'shopping',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
    priceRange: '100.000đ - 1.000.000đ+',
    priceLevel: 'luxury',
    rating: 4.6,
    totalReviews: 890,
    address: '272 Võ Chí Công, Phú Thượng, Tây Hồ, Hà Nội',
    lat: 21.0772,
    lng: 105.8115,
    description: 'Tổ hợp thương mại mua sắm sầm uất bậc nhất phía Tây thủ đô với thủy cung siêu lớn, rạp chiếu phim hiện đại cùng vô vàn thương hiệu thời trang sang xịn mịn.',
    reviews: [
      {
        id: 'r7',
        author: 'Đỗ Thùy Dương',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-15',
        text: 'Nơi check-in đỉnh cao! Rất nhiều góc chụp ảnh sang chảnh như trời Tây. Thủy cung ở đây quy mô lớn, các bạn nhỏ thích mê.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v5',
        channelName: 'Sắm Sửa Toàn Bộ',
        channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        description: 'Oanh tạc thủy cung Lotte Mall West Lake và review những góc check-in cực đỉnh siêu ngầu tại đây.',
        likes: '22.0K',
        comments: 187,
        views: '410K',
        duration: '2:10',
        videoThumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },

  // --- TP. HỒ CHÍ MINH ---
  {
    id: 'sg-banhmi-hh',
    name: 'Bánh Mì Huỳnh Hoa',
    category: 'food',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&auto=format&fit=crop&q=60',
    priceRange: '68.000đ - 85.000đ',
    priceLevel: 'moderate',
    rating: 4.4,
    totalReviews: 3120,
    address: '26 Lê Thị Riêng, Phạm Ngũ Lão, Quận 1, TP. Hồ Chí Minh',
    lat: 10.7712,
    lng: 106.6918,
    description: 'Ổ bánh mì đắt đỏ bậc nhất Việt Nam nhưng luôn tấp nập thực khách xếp hàng nhờ khối lượng pate, bơ tươi béo ngậy kèm ngập tràn giò, chả siêu chất lượng.',
    reviews: [
      {
        id: 'r8',
        author: 'Lê Thành Đạt',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-28',
        text: 'Một ổ bánh mì siêu khổng lồ, giò chả xếp lớp dày đặc, pate béo mượt thơm phưng phức, đồ chua đi kèm ngon chống ngấy tốt. Hai người ăn một ổ mới hết sạch.',
        sentiment: 'positive'
      },
      {
        id: 'r9',
        author: 'Mai Phương Liên',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=60',
        rating: 3,
        date: '2026-05-22',
        text: 'Ngon thì có ngon nhưng hơi nhiều bơ sữa dầu nên khá nhanh ngấy. Lúc nào ghé mua cũng phải xếp hàng rất lâu mệt mỏi.',
        sentiment: 'neutral'
      }
    ],
    videos: [
      {
        id: 'v6',
        channelName: 'Sài Gòn Của Tôi',
        channelAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60',
        description: 'Trải nghiệm ổ bánh mì Huỳnh Hoa 68K có gì đặc sắc mà khiến khách Tây lẫn khách Ta phát cuồng xếp xó hàng giờ?',
        likes: '72.3K',
        comments: 891,
        views: '2.5M',
        duration: '1:15',
        videoThumb: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'sg-cafe-vot',
    name: 'Cà Phê Vợt Phan Đình Phùng',
    category: 'coffee',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=60',
    priceRange: '15.000đ - 25.000đ',
    priceLevel: 'cheap',
    rating: 4.6,
    totalReviews: 1890,
    address: '330 Phan Đình Phùng, Phường 1, Phú Nhuận, TP. Hồ Chí Minh',
    lat: 10.7981,
    lng: 106.6822,
    description: 'Quán cà phê vợt thâu đêm suốt sáng hơn 70 năm tuổi ở Sài Gòn, nơi lưu giữ tinh túy hương vị cà phê cổ điển quyện mùi khói bạt pha thủ công bằng siêu đất sét nung.',
    reviews: [
      {
        id: 'r10',
        author: 'Đỗ Hữu Minh',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-24',
        text: 'Nét văn hóa Sài Gòn không ngủ chính là đây. Uống một ly ly bạc xỉu nồng nàn hồi 2h sáng cùng đám bạn, ngắm phố phường thưa vắng cực kỳ thú vị.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v7',
        channelName: 'Du Hí Sài Thành',
        channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        description: 'Review góc cà phê không ngủ mở 24/7 bán xuyên suốt 70 năm chưa bao giờ tắt lửa lò than gỗ tại Sài Gòn.',
        likes: '48.1K',
        comments: 154,
        views: '930K',
        duration: '1:00',
        videoThumb: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'sg-pho-di-bo',
    name: 'Phố Đi Bộ Nguyễn Huệ & Chung Cư 42',
    category: 'entertainment',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
    priceRange: 'Miễn phí',
    priceLevel: 'cheap',
    rating: 4.7,
    totalReviews: 6200,
    address: 'Đường Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    lat: 10.7744,
    lng: 106.7036,
    description: 'Trái tim nhộn nhịp của quận 1 với tổ hợp chung cư 42 Nguyễn Huệ ngập tràn quán cafe độc đáo, lấp lánh đèn LED khi đêm về cùng biểu diễn đường phố cực cháy.',
    reviews: [
      {
        id: 'r11',
        author: 'Lê Diệu Linh',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-29',
        text: 'Buổi tối dạo mát ở phố đi bộ ngắm dòng người qua lại, check-in chung cứ 42 lấp lánh như búp bê rồi nhâm nhi trà đào là tuyệt vời nhất.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v8',
        channelName: 'Sài Gòn Vlog',
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        description: 'Review trọn gói các hẻm ăn vặt và bí kíp đỗ xe giá rẻ sát sạt Phố đi bộ Nguyễn Huệ cực tiện cho khách du lịch.',
        likes: '39.8K',
        comments: 112,
        views: '720K',
        duration: '1:24',
        videoThumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },

  // --- ĐÀ NẴNG ---
  {
    id: 'dn-mi-quang',
    name: 'Mì Quảng Bà Mua',
    category: 'food',
    city: 'danang',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=60',
    priceRange: '35.000đ - 65.000đ',
    priceLevel: 'cheap',
    rating: 4.4,
    totalReviews: 1450,
    address: '95A Nguyễn Tri Phương, Thạc Gián, Thanh Khê, Đà Nẵng',
    lat: 16.0612,
    lng: 108.2045,
    description: 'Thương hiệu mì Quảng trứ danh, sợi mì dai dẻo làm từ gạo ngon hòa quyện nước nhân đậm đà từ gà ta, tôm thịt rim, ăn kèm bánh tráng nướng vàng rụm.',
    reviews: [
      {
        id: 'r12',
        author: 'Đặng Tuấn Anh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-18',
        text: 'Nước lèo xâm xấp đúng chuẩn mì Quảng, thịt xá xíu thơm và mực rim béo ngậy. Đĩa rau sống đi kèm siêu tươi sạch sẽ làm tôn vị mì.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v9',
        channelName: 'Ẩm Thực Miền Trung',
        channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        description: 'Tất tần tật các loại mì Quảng độc lạ của Bà Mua nức tiếng Đà Nẵng khiến thực khách ăn một thèm hai.',
        likes: '19.4K',
        comments: 67,
        views: '290K',
        duration: '1:10',
        videoThumb: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dn-cau-rong',
    name: 'Cầu Rồng & Đêm Sơn Trà',
    category: 'entertainment',
    city: 'danang',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
    priceRange: 'Miễn phí',
    priceLevel: 'cheap',
    rating: 4.8,
    totalReviews: 5320,
    address: 'Đường Nguyễn Văn Linh, An Hải Tây, Sơn Trà, Đà Nẵng',
    lat: 16.0611,
    lng: 108.2269,
    description: 'Minh chứng sống cho sự phát triển vượt bậc của Đà Nẵng, chiêm ngưỡng Rồng phun lửa và phun nước đỉnh cao vào dịp cuối tuần 21h và thưởng thức ẩm thực ở chợ đêm Sơn Trà kề bên.',
    reviews: [
      {
        id: 'r13',
        author: 'Lý Quốc Việt',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-27',
        text: 'Cảnh rồng phun lửa vô cùng sống động dữ dội. Xem xong ghé ngay chợ đêm sầm uất ăn mực nướng muối ớt cực kỳ thơm ngon, gió biển thổi mát rượi.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v10',
        channelName: 'Đà Nẵng Check-in',
        channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        description: 'Vị trí lý tưởng nhất để ngắm trọn vẹn màn phun lửa phun nước của Cầu Rồng mà không lo bị ướt quẹt người.',
        likes: '28.5K',
        comments: 132,
        views: '480K',
        duration: '1:05',
        videoThumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },

  // --- ĐÀ LẠT ---
  {
    id: 'dl-lau-ga-lae',
    name: 'Lẩu Gà Lá É Tao Ngộ',
    category: 'food',
    city: 'dalat',
    image: 'https://images.unsplash.com/photo-1547928500-4722f55ccd99?w=800&auto=format&fit=crop&q=60',
    priceRange: '200.000đ - 350.000đ (dành cho nồi 2-4 người)',
    priceLevel: 'moderate',
    rating: 4.5,
    totalReviews: 2890,
    address: 'Đường 3 Tháng 4, Phường 3, Đà Lạt, Lâm Đồng',
    lat: 11.9287,
    lng: 108.4419,
    description: 'Trải nghiệm không thể bỏ qua giữa cái lạnh tê tái của Đà Lạt với nồi lẩu gà bốc khói nghi ngút, vị cay nồng nàn thơm hăng của lá é thơm và thịt gà đồi ngọt lịm chắc nịch.',
    reviews: [
      {
        id: 'r14',
        author: 'Khánh Vy Trương',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-21',
        text: 'Nồi lẩu gà quá xuất sắc, nước đậm ngọt có măng củ giòn tơi, nấm rơm ăn bùi dã man. Thời tiết 16 độ mà húp chén nước lẩu lá é cay nồng thì ấm cả lồng ngực.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v11',
        channelName: 'Đà Lạt Nhịp Sống',
        channelAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
        description: 'Vén bức màn phân biệt lẩu gà lá é chính hiệu và lẩu gà fake ăn chán tại Đà Lạt. Địa chỉ nào chuẩn cơm mẹ nấu?',
        likes: '51.3K',
        comments: 290,
        views: '1.1M',
        duration: '1:50',
        videoThumb: 'https://images.unsplash.com/photo-1547928500-4722f55ccd99?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dl-tui-mo-to',
    name: 'Tiệm Cà Phê Túi Mơ To',
    category: 'coffee',
    city: 'dalat',
    image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=60',
    priceRange: '50.000đ - 85.000đ',
    priceLevel: 'moderate',
    rating: 4.7,
    totalReviews: 3200,
    address: 'Hẻm 31 Sào Nam, Phường 11, Đà Lạt',
    lat: 11.9442,
    lng: 108.4875,
    description: 'Căn nhà gỗ mộc mạc ẩn hiện giữa khu vườn hoa cúc họa mi ngút ngàn nở rộ, view thung lũng lồng kính rực sáng rạng ngời huyền ảo khi hoàng hôn rủ bóng.',
    reviews: [
      {
        id: 'r15',
        author: 'Phạm Minh Châu',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-26',
        text: 'Đến đây ngắm đèn lồng nhà kính bật sáng lung linh góc thung lũng lãng mạn vô cùng. Nước dâu tằm thơm dịu ngon mồm dã man, cúc họa mi ngập lối sống ảo mỏi tay.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v12',
        channelName: 'DalatChill',
        channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        description: 'Ngắm hoàng hôn xịn sò nhất Đà Lạt tại Túi Mơ To và kinh nghiệm săn ảnh đẹp thần thánh điệu đà.',
        likes: '64.5K',
        comments: 201,
        views: '1.2M',
        duration: '1:18',
        videoThumb: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'hn-bun-cha-huong-lien',
    name: 'Bún Chả Hương Liên (Obama)',
    category: 'food',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
    priceRange: '50.000đ - 120.000đ',
    priceLevel: 'cheap',
    rating: 4.6,
    totalReviews: 4850,
    address: '24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng, Hà Nội',
    lat: 21.0195,
    lng: 105.8556,
    description: 'Địa chỉ bún chả nổi tiếng thế giới từng đón tiếp Tổng thống Mỹ Barack Obama năm 2016. Sợi bún thanh dai, thịt nướng thơm nức mũi cháy cạnh xì xèo cùng nước chấm đu đủ sần sật mặn ngọt.',
    reviews: [
      {
        id: 'r16',
        author: 'Đức Long Hoàng',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-28',
        text: 'Nước bún chả thơm nức, chả nướng mềm và vị thấm đẫm mật ong. Nem cua bể siêu to giòn rụm rán nóng hổi rất nhiều nhân cua thực tế.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v13',
        channelName: 'Hà Nội Reviewer',
        channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        description: 'Tận mục sở thị bọc suất ăn Obama nổi tiếng tại Bún Chả Hương Liên. Cảm nhận chân thực liệu có bõ công xếp hàng?',
        likes: '35.4K',
        comments: 110,
        views: '450K',
        duration: '1:10',
        videoThumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'sg-landmark-81',
    name: 'Sàn Quan Sát Landmark 81 SkyView',
    category: 'entertainment',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-15195501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
    priceRange: '300.000đ - 500.000đ',
    priceLevel: 'luxury',
    rating: 4.8,
    totalReviews: 1200,
    address: '720A Điện Biên Phủ, Phường 22, Bình Thạnh, TP. Hồ Chí Minh',
    lat: 10.7946,
    lng: 106.7218,
    description: 'Trải nghiệm ngắm toàn cảnh thành phố rực rỡ từ tòa tháp cao nhất Việt Nam tại tầng 79, 80 và 81. Nơi có cầu kính SkyTouch thách thức lòng can đảm và không gian sống ảo vô tận.',
    reviews: [
      {
        id: 'r17',
        author: 'Ngọc Lan Nguyễn',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-29',
        text: 'Review bõ đồng tiền bát gạo luôn nha mọi người, ngắm hoàng hôn rạp bóng sông Sài Gòn uống một ly cocktail sang chảnh cực đỉnh.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v14',
        channelName: 'Sài Gòn Vi Vu',
        channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        description: 'Bí kíp mua vé Landmark 81 SkyView siêu rẻ và ngắm trọn vẹn toàn cảnh Sài Gòn lung linh rực sáng về đêm!',
        likes: '72K',
        comments: 345,
        views: '1.5M',
        duration: '1:45',
        videoThumb: 'https://images.unsplash.com/photo-15195501025264-65ba15a82390?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dn-ba-na-hills',
    name: 'Sun World Bà Nà Hills & Cầu Vàng',
    category: 'entertainment',
    city: 'danang',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
    priceRange: '600.000đ - 900.000đ',
    priceLevel: 'luxury',
    rating: 4.8,
    totalReviews: 8900,
    address: 'Thôn An Sơn, Xã Hòa Ninh, Huyện Hòa Vang, Đà Nẵng',
    lat: 15.9984,
    lng: 107.9964,
    description: 'Địa điểm du lịch biểu tượng thế giới nổi danh với mật độ sương mù bảng lảng lãng mạn, tuyến cáp treo đạt kỷ lục thế giới và tuyệt tác kiến trúc "Cầu Vàng" được nâng đỡ bởi đôi bàn tay khổng lồ rêu phong.',
    reviews: [
      {
        id: 'r18',
        author: 'Tuấn Khải Lê',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-25',
        text: 'Cầu Vàng trong sương mù tựa như cõi bồng lai tiên cảnh thực thụ. Trải nghiệm cáp treo ngắm thác nước chảy trắng xóa cực kỳ hùng vĩ.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v15',
        channelName: 'Đà Nẵng Discovery',
        channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        description: 'Toàn cảnh Bà Nà Hills mùa lễ hội châu Âu, cập nhật giá vé cáp treo và những mốc thời gian sống ảo hoàn hảo nhất.',
        likes: '91K',
        comments: 671,
        views: '2.4M',
        duration: '2:15',
        videoThumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dl-cho-dem',
    name: 'Chợ Đêm Đà Lạt (Chợ Âm Phủ)',
    category: 'shopping',
    city: 'dalat',
    image: 'https://images.unsplash.com/photo-1547928500-4722f55ccd99?w=800&auto=format&fit=crop&q=60',
    priceRange: '20.000đ - 150.000đ',
    priceLevel: 'cheap',
    rating: 4.2,
    totalReviews: 5400,
    address: 'Đường Nguyễn Thị Minh Khai, Phường 1, Đà Lạt',
    lat: 11.9427,
    lng: 108.4381,
    description: 'Thánh địa ẩm thực đường phố sầm uất bậc nhất xứ hoa khi lên đèn: Thưởng thức bánh tráng nướng nóng giòn, khoai nướng ngọt ngậy, dâu tây lắc sần sật và cốc sữa đậu nành nóng hổi bốc khói.',
    reviews: [
      {
        id: 'r19',
        author: 'Gia Bảo Phan',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        rating: 4,
        date: '2026-05-24',
        text: 'Nhiều đồ ăn vặt ngon tuyệt vời ông mặt trời, sữa đậu nành nóng ăn kèm bánh ngọt cực tít dã ngoại, lưu ý sắm áo ấm phòng gió lạnh khi đêm xuống nhé.',
        sentiment: 'neutral'
      }
    ],
    videos: [
      {
        id: 'v16',
        channelName: 'Dalat Food Tour',
        channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        description: 'Cầm 100k quậy tung ẩm thực Chợ Đêm Đà Lạt. Ăn sập bánh tráng nướng và sữa đậu nành nóng siêu phê!',
        likes: '58.3K',
        comments: 119,
        views: '1.1M',
        duration: '1:12',
        videoUrl: 'https://www.tiktok.com',
        videoThumb: 'https://images.unsplash.com/photo-1547928500-4722f55ccd99?w=300&auto=format&fit=crop&q=60'
      }
    ]
  },
  // --- THÊM CÁC ĐỊA ĐIỂM GIẢI TRÍ & TRUNG TÂM THƯƠNG MẠI (MUSIC BOX, GAMEBOX, XEM PHIM, TTTM) ---
  {
    id: 'hn-timezone-lotte',
    name: 'Khu vui chơi Gamebox Timezone - Lotte Mall Tây Hồ',
    category: 'entertainment',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    priceRange: '150.000đ - 300.000đ',
    priceLevel: 'moderate',
    rating: 4.8,
    totalReviews: 450,
    address: 'Tầng 4 Lotte Mall West Lake, 272 Võ Chí Công, Tây Hồ, Hà Nội',
    lat: 21.0772,
    lng: 105.8115,
    description: 'Tổ hợp Gamebox & Arcade hiện đại bậc nhất Hà Nội với hàng trăm máy game đa dạng, từ VR thực tế ảo tới gắp gấu, đua xe mô phỏng tốc độ cao hấp dẫn mọi lứa tuổi học sinh, bạn bè và gia đình.',
    reviews: [
      {
        id: 'r20',
        author: 'Nguyễn Tiến Đạt',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-20',
        text: 'Nhiều máy chơi game xịn đét, nạp thẻ quẹt thẻ nhanh gọn. Tổ chức sinh nhật hay đi chơi nhóm bạn ở đây cuối tuần thì vui hết sẩy.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v17',
        channelName: 'Hà Nội Gaming',
        channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        description: 'Phá đảo khu game thùng xịn sò nhất Tây Hồ, hướng dẫn gom xèng đổi quà khủng siêu hời.',
        likes: '23.4K',
        comments: 65,
        views: '120K',
        duration: '1:10',
        videoThumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'hn-trixie-lounge',
    name: 'Music Box Trixie Cafe & Lounge - Live Music Phòng Trà',
    category: 'entertainment',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60',
    priceRange: '150.000đ - 450.000đ',
    priceLevel: 'luxury',
    rating: 4.7,
    totalReviews: 620,
    address: 'Tòa nhà Sông Hồng Park View, 165 Thái Hà, Đống Đa, Hà Nội',
    lat: 21.0125,
    lng: 105.8197,
    description: 'Sân khấu ca nhạc live music, phòng trà ca nhạc hoành tráng hàng đầu thủ đô với thiết kế sân vườn phủ xanh mát rượi độc đáo. Nơi quy tụ nhiều ca sĩ nổi tiếng biểu diễn mỗi tối cuối tuần.',
    reviews: [
      {
        id: 'r21',
        author: 'Lâm Mỹ Linh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-18',
        text: 'Âm thanh cực đỉnh, ca sĩ hát siêu live đỉnh chóp luôn. Thích hợp cho những ai muốn đổi gió đi nghe nhạc thư giãn cùng người yêu hoặc gia đình.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v18',
        channelName: 'Hà Nội Acoustic',
        channelAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        description: 'Vlogs oanh tạc show nhạc live ấm cúng giữa lòng Hà Nội, chill hết nấc cùng những giai điệu bất hủ.',
        likes: '34K',
        comments: 110,
        views: '350K',
        duration: '2:00',
        videoThumb: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'hn-aeon-hadong',
    name: 'Aeon Mall Hà Đông & Rạp Chiếu Phim CGV',
    category: 'shopping',
    city: 'hanoi',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
    priceRange: '50.000đ - 500.000đ',
    priceLevel: 'moderate',
    rating: 4.8,
    totalReviews: 2980,
    address: 'Dân Chủ, Dương Nội, Hà Đông, Hà Nội',
    lat: 20.9765,
    lng: 105.7489,
    description: 'Đại siêu thị & Trung tâm thương mại phức hợp chuẩn Nhật Bản siêu rộng lớn. Tích hợp rạp chiếu phim CGV IMAX đỉnh cao, siêu thị ẩm thực sầm uất và khu giải trí, sắm sửa rộng mênh mông.',
    reviews: [
      {
        id: 'r22',
        author: 'Phạm Duy Anh',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-15',
        text: 'Nên đi cuối tuần nha, bao rộng ăn chơi cả ngày không chán! Nhà hàng Nhật Bản bao ngon, rạp phim CGV ở đây siêu to khổng lồ xem bao sướng mắt.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v19',
        channelName: 'Hà Đông Vi Vu',
        channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        description: 'Oanh tạc Aeon Mall Hà Đông từ sáng đến tối mịt, chơi sạch khu game và thưởng thức sushi chuẩn Nhật.',
        likes: '45K',
        comments: 204,
        views: '920K',
        duration: '1:55',
        videoThumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'sg-timezone-vivo',
    name: 'Khu Gamebox Timezone - SC VivoCity Quận 7',
    category: 'entertainment',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    priceRange: '100.000đ - 300.000đ',
    priceLevel: 'moderate',
    rating: 4.7,
    totalReviews: 320,
    address: 'Lầu 2 SC VivoCity, 1058 Nguyễn Văn Linh, Tân Phong, Quận 7, TP. Hồ Chí Minh',
    lat: 10.7297,
    lng: 106.7001,
    description: 'Thế giới trò chơi điện tử hiện đại Gamebox tích hợp bowling mini vui nhộn, hệ thống xe điện đụng an toàn và quầy đổi quà lưu niệm vô cùng hoành tráng.',
    reviews: [
      {
        id: 'r23',
        author: 'Lê Hoàng Nam',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-25',
        text: 'Mấy tụi trẻ con mê tít các trò ném bóng rổ với đua xe mô phỏng ở đây. Có trò bowling mini cực kỳ dễ chơi cho mọi người tranh tài vui vẻ.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v20',
        channelName: 'Sài Gòn Ăn Chơi',
        channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        description: 'Khám phá khu game bowling mini sang xịn mịn nhất Quận 7 và thi đấu nảy lửa cùng đồng bọn.',
        likes: '15K',
        comments: 42,
        views: '230K',
        duration: '1:05',
        videoThumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'sg-dongdao-lounge',
    name: 'Music Box Phòng Trà Đồng Dao - Live Music',
    category: 'entertainment',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60',
    priceRange: '200.000đ - 600.000đ',
    priceLevel: 'luxury',
    rating: 4.6,
    totalReviews: 540,
    address: '164 Pasteur, Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    lat: 10.7791,
    lng: 106.6975,
    description: 'Một trong những phòng trà âm nhạc sang trọng, lâu đời bậc nhất Sài Gòn. Sân khấu lung linh biểu diễn mộc mạc acoustic đến các đêm nhạc độc quyền của những tên tuổi ngôi sao hàng đầu V-Pop.',
    reviews: [
      {
        id: 'r24',
        author: 'Nguyễn Thảo Nguyên',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-22',
        text: 'Nơi lắng đọng cảm xúc tuyệt vời. Ca sĩ hát cuốn hút dã man, phục vụ đồ uống chuyên nghiệp lịch thiệp, giữ được nét văn hóa phòng trà sâu lắng giữa lòng Sài Thành.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v21',
        channelName: 'Sài Gòn Đêm Nhạc',
        channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        description: 'Tận hưởng đêm nhạc mộc mạc sâu lắng ngập tràn cảm xúc xưa cũ cực chill tại Đồng Dao.',
        likes: '29K',
        comments: 98,
        views: '400K',
        duration: '2:15',
        videoThumb: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'sg-vanhanhmall-cgv',
    name: 'Vạn Hạnh Mall & Rạp Chiếu Phim CGV Sư Vạn Hạnh',
    category: 'shopping',
    city: 'saigon',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
    priceRange: '60.000đ - 400.000đ',
    priceLevel: 'moderate',
    rating: 4.7,
    totalReviews: 4120,
    address: '11 Sư Vạn Hạnh, Phường 12, Quận 10, TP. Hồ Chí Minh',
    lat: 10.7768,
    lng: 106.6675,
    description: 'Icon mua sắm cực hot của giới trẻ Sài Gòn. TTTM sở hữu mái vòm khổng lồ cực thu hút, tổ hợp rạp phim CGV Sư Vạn Hạnh siêu rộng, trung tâm vui chơi trẻ em và vô vàn thương hiệu thời trang chất chơi.',
    reviews: [
      {
        id: 'r25',
        author: 'Lê Kiều Mỹ',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-24',
        text: 'Nơi này đúng nghĩa thiên đường ăn chơi của Quận 10 luôn. Rạp phim CGV siêu to coi bao đã, sảnh trưng bày đồ sộ góc nào lên hình cũng sang xịn.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v22',
        channelName: 'Học Đi Ăn Chơi',
        channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        description: 'Tại sao Vạn Hạnh Mall lại là điểm tụ họp đông nghịt của giới trẻ Sài Thành vào cuối tuần?',
        likes: '34.8K',
        comments: 112,
        views: '780K',
        duration: '1:30',
        videoThumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dn-may-acoustic',
    name: 'Music Box Mây Acoustic Coffee & Live Music Đà Nẵng',
    category: 'entertainment',
    city: 'danang',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop&q=60',
    priceRange: '80.000đ - 250.000đ',
    priceLevel: 'moderate',
    rating: 4.6,
    totalReviews: 210,
    address: 'Lầu 2, 4 Lê Duẩn, Hải Châu, Đà Nẵng',
    lat: 16.0725,
    lng: 108.2198,
    description: 'Điểm hẹn ca nhạc trực tiếp acoustic cực chill cho bạn trẻ Đà Nẵng. Không gian mở hướng nhìn ra dòng sông Hàn thơ mộng lung linh cùng ban nhạc chơi live lãng mạn mộc mạc.',
    reviews: [
      {
        id: 'r26',
        author: 'Nguyễn Quốc Hùng',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-18',
        text: 'Vừa nhâm nhi trà đào vừa nghe những bản tình ca mộc mạc acoustic ngắm cầu sông Hàn rực sáng. Không gian cực kỳ trữ tình, xứng đáng trải nghiệm!',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v23',
        channelName: 'Đà Nẵng Chill',
        channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        description: 'Khám phá quán cafe nghe nhạc mộc acoustic ngắm toàn cảnh sông Hàn lung linh lộng gió.',
        likes: '12K',
        comments: 34,
        views: '110K',
        duration: '1:15',
        videoThumb: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dn-vincom-plaza',
    name: 'Vincom Plaza Ngô Quyền & CGV Cinema Đà Nẵng',
    category: 'shopping',
    city: 'danang',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
    priceRange: '50.000đ - 450.000đ',
    priceLevel: 'moderate',
    rating: 4.7,
    totalReviews: 1840,
    address: '910A Ngô Quyền, An Hải Bắc, Sơn Trà, Đà Nẵng',
    lat: 16.0718,
    lng: 108.2325,
    description: 'Trung tâm mua sắm sầm uất bậc nhất bờ đông sông Hàn. Cung cấp khu ẩm thực Á - Âu đồ sộ, rạp phim CGV xem phim bom tấn cực nét và sân trượt băng tự nhiên đầu tiên tại Đà Nẵng.',
    reviews: [
      {
        id: 'r27',
        author: 'Phan Bảo Hân',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-24',
        text: 'Nằm sát cầu Sông Hàn, mua sắm thả ga, nhiều gian hàng ẩm thực ngon xỉu. Phù hợp cho những ngày mưa hoặc trưa hè nắng nóng chui vào trượt băng cực mát mẻ.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v24',
        channelName: 'Đà Thành Vlogs',
        channelAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60',
        description: 'Một ngày vui trọn vẹn tại Vincom Đà Nẵng, review rạp phim CGV hoành tráng cực kỳ nhiều chỗ selfie xinh xắn.',
        likes: '19.5K',
        comments: 67,
        views: '430K',
        duration: '1:20',
        videoThumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dl-may-langthang',
    name: 'Music Box Mây Lang Thang Đà Lạt - Sân Khấu Ca Nhạc',
    category: 'entertainment',
    city: 'dalat',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=60',
    priceRange: '200.000đ - 800.000đ',
    priceLevel: 'luxury',
    rating: 4.8,
    totalReviews: 1450,
    address: 'Hẻm 7 Hoàng Hoa Thám, Phường 10, Đà Lạt',
    lat: 11.9333,
    lng: 108.4552,
    description: 'Thánh đường live music biểu diễn ca nhạc ngoài trời vang danh hàng nội địa. Nằm cheo leo trên sườn đồi thơ mộng ngắm mây ngút trời rập rờn quyện với giọng ca ấm áp mộc mạc trữ tình bậc nhất.',
    reviews: [
      {
        id: 'r28',
        author: 'Trịnh Kiều Trang',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-26',
        text: 'Nghe ca hát giữa đồi mây bay lãng đãng quyến rũ dã man mọi người ơi. Giọng ca sống thực xuất sắc, thời tiết lạnh nhẹ khoác áo mỏng đón hoàng hôn cực kỳ thăng hoa cảm xúc.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v25',
        channelName: 'ReviewerSứSương',
        channelAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60',
        description: 'Trải nghiệm nghe ca nhạc acoustic ngắm mây bồng bềnh hoàng hôn lãng mạn tại Mây Lang Thang Đà Lạt.',
        likes: '85K',
        comments: 612,
        views: '1.9M',
        duration: '2:30',
        videoThumb: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&auto=format&fit=crop&q=60'
      }
    ]
  },
  {
    id: 'dl-go-mall',
    name: 'TTTM Go! Đà Lạt & Rạp Chiếu Phim Cinestar',
    category: 'shopping',
    city: 'dalat',
    image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&auto=format&fit=crop&q=60',
    priceRange: '40.000đ - 300.000đ',
    priceLevel: 'cheap',
    rating: 4.6,
    totalReviews: 2200,
    address: 'Quảng trường Lâm Viên, Phường 10, Đà Lạt',
    lat: 11.9385,
    lng: 108.4448,
    description: 'TTTM nằm lọt lòng dưới đóa hoa dã quỳ khổng lồ bằng kính màu độc lạ ngay quảng trường Lâm Viên. Có rạp phim Cinestar siêu hạt dẻ phục vụ giới trẻ dạt dạo xem phim sưởi ấm những buổi chiều lạnh sương mù.',
    reviews: [
      {
        id: 'r29',
        author: 'Đặng Quốc Huy',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        rating: 5,
        date: '2026-05-20',
        text: 'Nằm ngay trung tâm quảng trường, bên ngoài chụp hoa dã quỳ kính rực rỡ, bên trong có rạp chiếu phim giá rẻ bất ngờ để xả stress, rất thích hợp đi cùng bạn bè.',
        sentiment: 'positive'
      }
    ],
    videos: [
      {
        id: 'v26',
        channelName: 'Đà Lạt Go!',
        channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60',
        description: 'Vào đóa hoa dã quỳ khổng lồ ăn lẩu, xem phim chi tiết và mua kem bơ rẻ ngon bất ngờ tại siêu thị bên dưới.',
        likes: '34K',
        comments: 112,
        views: '560K',
        duration: '1:40',
        videoThumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&auto=format&fit=crop&q=60'
      }
    ]
  }
];
