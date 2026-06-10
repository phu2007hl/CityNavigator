import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import { PRESET_PLACES } from "./src/data";

function getCityCoordsAndId(destName: string): { id: string, lat: number, lng: number } {
  const norm = destName.toLowerCase();
  if (norm.includes("hà nội") || norm.includes("hanoi")) return { id: "hanoi", lat: 21.0285, lng: 105.8542 };
  if (norm.includes("hồ chí minh") || norm.includes("sài gòn") || norm.includes("saigon")) return { id: "saigon", lat: 10.8231, lng: 106.6297 };
  if (norm.includes("đà nẵng") || norm.includes("danang")) return { id: "danang", lat: 16.0544, lng: 108.2022 };
  if (norm.includes("đà lạt") || norm.includes("dalat")) return { id: "dalat", lat: 11.9404, lng: 108.4583 };
  return { id: "custom", lat: 15.9819, lng: 108.3274 };
}

async function getCoordsForCustomDestination(destination: string, fallbackCoords: { lat: number, lng: number }): Promise<{ lat: number, lng: number }> {
  const norm = destination.toLowerCase();
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`, {
      headers: { "User-Agent": "CityNavigator-App" }
    });
    if (response.ok) {
      const resData = await response.json();
      if (resData && resData.length > 0) {
        return { lat: parseFloat(resData[0].lat), lng: parseFloat(resData[0].lon) };
      }
    }
  } catch (err) {
    console.error("[Geocoding] Lỗi khi gọi Nominatim:", err);
  }

  const predefinedCustoms: { [key: string]: { lat: number, lng: number } } = {
    "hội an": { lat: 15.8801, lng: 108.3380 }, "nha trang": { lat: 12.2388, lng: 109.1967 },
    "vũng tàu": { lat: 10.3460, lng: 107.0843 }, "phú quốc": { lat: 10.2195, lng: 103.9634 },
    "sapa": { lat: 22.3364, lng: 103.8438 }, "huế": { lat: 16.4637, lng: 107.5909 },
    "hạ long": { lat: 20.9501, lng: 107.0733 }
  };
  for (const key of Object.keys(predefinedCustoms)) {
    if (norm.includes(key)) return predefinedCustoms[key];
  }
  return fallbackCoords;
}

async function getWeatherForCoords(lat: number, lng: number, cityName: string): Promise<{ condition: 'sunny' | 'rainy' | 'hot', temp: number, desc: string }> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const current = data.current_weather;
      if (current) {
        const temp = current.temperature;
        const code = current.weathercode;
        let condition: 'sunny' | 'rainy' | 'hot' = 'sunny';
        let desc = "Trời nắng mát dạo chơi.";

        if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
          condition = 'rainy'; desc = "Có mưa dông làm mát thành phố.";
        } else if (temp >= 33) {
          condition = 'hot'; desc = "Nắng nóng đỉnh điểm oi bức.";
        } else {
          condition = 'sunny'; desc = "Trời trong xanh, khí hậu lý tưởng.";
        }
        return { condition, temp, desc: `${desc} (${temp}°C, Trạm Dự Báo ${cityName})` };
      }
    }
  } catch (error) {
    console.warn("Error loading weather, fallback to simulation");
  }

  const hour = new Date().getHours();
  if (hour > 11 && hour < 15) return { condition: 'hot', temp: 34, desc: `Nắng gắt đỉnh điểm (34°C)` };
  return { condition: 'sunny', temp: 29, desc: `Dự báo nắng ráo (29°C)` };
}

// Hàm gọi dữ liệu địa điểm thực tế từ Overpass API (OpenStreetMap) miễn phí
async function fetchOSMPlaces(lat: number, lng: number, radiusKm: number, amenity: string): Promise<any[]> {
  const radiusMeters = radiusKm * 1000;
  const query = `
    [out:json][timeout:10];
    (
      node["amenity"="${amenity}"]["name"](around:${radiusMeters},${lat},${lng});
    );
    out body 15;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.elements) {
        return data.elements.map((el: any) => ({
          name: el.tags.name,
          lat: el.lat,
          lng: el.lon,
          type: amenity,
          address: el.tags['addr:street'] 
            ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}`.trim()
            : 'Khu vực lân cận'
        }));
      }
    }
    return [];
  } catch (err) {
    console.error(`[OSM] Lỗi khi lấy dữ liệu ${amenity}:`, err);
    return [];
  }
}

function generateFallbackPlan(params: {
  destination: string, budget: string, transportation: string, purpose: string,
  durationValue: number, durationUnit: string, radiusKm: number,
  selectedPlaces: any[], weatherInfo: { condition: 'sunny' | 'rainy' | 'hot', temp: number, desc: string }
}) {
  const { destination, budget, transportation, purpose, durationValue, durationUnit, radiusKm, weatherInfo } = params;
  const cityCoords = getCityCoordsAndId(destination);
  const costCoeff = budget === 'cheap' ? 0.65 : budget === 'luxury' ? 2.5 : 1.2;
  const dayPlans: any[] = [];

  // Thêm dòng này để kiểm tra xem mục đích có phải là học/làm việc không
  const isStudying = purpose.toLowerCase().includes('học') || purpose.toLowerCase().includes('làm việc') || purpose.toLowerCase().includes('đề');

  // Cập nhật lại danh sách tên ảo dựa theo mục đích
  const genericNames: Record<string, string[]> = {
    meal: ["Phố ẩm thực địa phương", "Tổ hợp ăn uống Food Court"],
    coffee: isStudying 
      ? ["Quán Cà phê Yên Tĩnh Làm Việc", "Thư viện Cà Phê Không Gian Mở", "Co-working Space"] 
      : ["Tiệm Cà phê Boardgame", "Quán Cà phê check-in xịn sò"],
    visit: isStudying 
      ? ["Nhà sách trung tâm", "Khu triển lãm nghệ thuật yên tĩnh"]
      : ["Bảo tàng nghệ thuật đương đại", "Khu tham quan kiến trúc nổi tiếng"],
    shopping: ["Trung tâm thương mại lớn", "Tổ hợp Complex mua sắm giới trẻ"],
    entertainment: isStudying
      ? ["Đi dạo công viên hóng gió", "Quán Trà Đạo thư giãn"]
      : ["Phòng hát Music Box / Coin Karaoke", "Khu vui chơi Playbox & Gắp gấu", "Tổ hợp Game Center", "Pub Acoustic Acoustic Chill"]
  };

  const getAnActivity = (category: string, index: number, dayNo: number): any => {
    let adaptedCategory = category;
    if (weatherInfo.condition === 'rainy' && category === 'visit') adaptedCategory = 'entertainment';
    if (weatherInfo.condition === 'hot' && category === 'visit') adaptedCategory = 'shopping';

    const names = genericNames[adaptedCategory] || genericNames.visit;
    const sName = names[index % names.length];
    
    return {
      title: sName,
      address: `Khu vực trung tâm`,
      type: adaptedCategory,
      description: `Ghé thăm địa điểm này. Mục đích chuyến đi: ${purpose.substring(0, 50)}...`,
      costEstimated: Math.round((adaptedCategory === 'coffee' ? 50000 : 150000) * costCoeff),
      durationMinutes: adaptedCategory === 'coffee' ? 60 : 120,
      lat: cityCoords.lat + (Math.sin(index + dayNo) * 0.015),
      lng: cityCoords.lng + (Math.cos(index + dayNo) * 0.015)
    };
  };

  if (durationUnit === 'hours') {
    const hoursCount = Math.min(24, Math.max(1, durationValue));
    const numActs = Math.min(6, Math.max(1, Math.round(hoursCount / 2)));
    const activities: any[] = [];
    let currentHour = 8;
    for (let i = 0; i < numActs; i++) {
      const act = getAnActivity(['visit', 'coffee', 'meal', 'entertainment'][i%4], i, 1);
      const nextHour = currentHour + (act.durationMinutes / 60);
      act.time = `${Math.floor(currentHour)}:00 - ${Math.floor(nextHour)}:00`;
      act.transportToNext = { method: transportation, durationMinutes: 15, distanceKm: 2.5, costEstimated: 20000 };
      activities.push(act);
      currentHour = nextHour + 0.5;
    }
    dayPlans.push({ dayNumber: 1, activities });
  } else {
    for (let d = 1; d <= durationValue; d++) {
      const activities: any[] = [];
      const slots = [{ time: "09:00-10:30", cat: "coffee" }, { time: "10:45-12:30", cat: "entertainment" }, { time: "13:00-14:30", cat: "meal" }, { time: "15:00-18:00", cat: "entertainment" }];
      slots.forEach((s, i) => {
        const act = getAnActivity(s.cat, i, d);
        act.time = s.time;
        act.transportToNext = { method: transportation, durationMinutes: 20, distanceKm: 3.0, costEstimated: 25000 };
        activities.push(act);
      });
      dayPlans.push({ dayNumber: d, activities });
    }
  }

  let totalCost = dayPlans.reduce((sum, dp) => sum + dp.activities.reduce((s: number, a: any) => s + a.costEstimated + (a.transportToNext?.costEstimated || 0), 0), 0);

  return {
    isOfflineFallback: true, isGoogleMapsDiscovery: false, destination, totalCost, durationDays: durationUnit === 'days' ? durationValue : 1,
    durationValue, durationUnit, radiusKm, transportation, budgetLevel: budget, weatherCondition: weatherInfo.condition, weatherTemp: weatherInfo.temp, weatherDescription: weatherInfo.desc, dayPlans,
    additionalNotes: `⚡ [Smart Offline Optimizer] Lịch trình được tạo tự động.`
  };
}

let lastQuotaExceededTime = 0;

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get("/api/places", (req, res) => res.json(PRESET_PLACES));

  app.post("/api/generate-plan", async (req, res) => {
    // NHẬN BIẾN PURPOSE TỪ FRONTEND
    const { destination, budget = 'moderate', transportation = 'motorbike', purpose = 'Khám phá và trải nghiệm thành phố', durationValue = 1, durationUnit = 'days', radiusKm = 10, selectedPlaces = [], weatherPreference = 'auto', generationMode = 'gemini' } = req.body;

    let coords = getCityCoordsAndId(destination);
    if (coords.id === "custom") {
      const customCoords = await getCoordsForCustomDestination(destination, coords);
      coords = { id: "custom", ...customCoords };
    }
    
    let weatherInfo: any;
    if (weatherPreference === 'sunny') weatherInfo = { condition: 'sunny', temp: 30, desc: "Trời nắng ráo (30°C)" };
    else if (weatherPreference === 'rainy') weatherInfo = { condition: 'rainy', temp: 26, desc: "Có mưa rải rác (26°C)" };
    else if (weatherPreference === 'hot') weatherInfo = { condition: 'hot', temp: 36, desc: "Nắng gắt (36°C)" };
    else weatherInfo = await getWeatherForCoords(coords.lat, coords.lng, coords.id === 'custom' ? destination : coords.id);

    const currentApiKey = process.env.GEMINI_API_KEY;
    const aiInstance = currentApiKey ? new GoogleGenAI({ apiKey: currentApiKey }) : null;

    if (generationMode === 'offline' || !aiInstance || (Date.now() - lastQuotaExceededTime) < 2000) {
      return res.json(generateFallbackPlan({ destination, budget, transportation, purpose, durationValue: Number(durationValue), durationUnit, radiusKm: Number(radiusKm), selectedPlaces, weatherInfo }));
    }

    try {
      const selectedNames = selectedPlaces.map((p: any) => p.name).join(", ");
      
      console.log(`[OSM Engine] Đang quét các địa điểm thực tế xung quanh ${coords.lat}, ${coords.lng}...`);
      const realCafes = await fetchOSMPlaces(coords.lat, coords.lng, Number(radiusKm), 'cafe');
      const realFood = await fetchOSMPlaces(coords.lat, coords.lng, Number(radiusKm), 'restaurant');
      
      const realPlacesContext = `
      DANH SÁCH ĐỊA ĐIỂM CÓ THẬT TẠI KHU VỰC (Trích xuất từ Bản đồ):
      
      ☕ Quán Cà phê/Đồ uống:
      ${realCafes.length > 0 ? realCafes.map(c => `- Tên: ${c.name}, Tọa độ: ${c.lat}, ${c.lng}, Địa chỉ: ${c.address}`).join('\n') : '- Không tìm thấy data, hãy tự linh hoạt.'}
      
      🍜 Quán Ăn:
      ${realFood.length > 0 ? realFood.map(f => `- Tên: ${f.name}, Tọa độ: ${f.lat}, ${f.lng}, Địa chỉ: ${f.address}`).join('\n') : '- Không tìm thấy data, hãy tự linh hoạt.'}
      `;

      // CẬP NHẬT PROMPT NHẬN BIẾN PURPOSE (MỤC ĐÍCH CÁ NHÂN HÓA)
      const prompt = `
        Hãy thiết kế một lịch trình liền mạch và hợp lý.
        
        📍 ĐIỂM XUẤT PHÁT CỦA NGƯỜI DÙNG: "${destination}"
        - Thời lượng: ${durationValue} ${durationUnit}
        - Ngân sách: ${budget}
        - Phương tiện: ${transportation}
        - Bán kính quét tối đa: ${radiusKm} km từ điểm xuất phát.
        
        ${realPlacesContext}

        🎯 MỤC ĐÍCH VÀ YÊU CẦU CÁ NHÂN HÓA BẮT BUỘC (QUAN TRỌNG NHẤT):
        Người dùng có yêu cầu và bối cảnh cụ thể như sau: "${purpose}".
        - Bạn BẮT BUỘC phải thiết kế lịch trình bám sát 100% vào mục đích này. Cách lựa chọn địa điểm, phong cách viết miêu tả, và phân bổ thời gian phải giải quyết được vấn đề người dùng đặt ra. Nếu mục đích liên quan đến công việc/học tập, hãy chọn không gian yên tĩnh. Nếu có ràng buộc về thời gian rảnh, phải né các khung giờ bận.
        - Nếu mục đích là HỌC TẬP/LÀM VIỆC: Chỉ chọn quán Cafe Yên Tĩnh, Thư viện, Không gian Co-working. Tuyệt đối loại bỏ các từ khóa liên quan đến giải trí ồn ào, bar, pub, boardgame.
        - Nếu mục đích là GIẢI TRÍ/VUI CHƠI: Hãy ưu tiên các khu vui chơi, giải trí hiện đại xen kẽ với các hoạt động, quán ăn uống, địa điểm check-in, dạo phố.
        - Phân bổ thời gian (durationMinutes) cho các hoạt động học tập/làm việc dài hơn bình thường (ví dụ 120 - 240 phút).

        MỤC TIÊU VÀ YÊU CẦU BẮT BUỘC ĐỐI VỚI BẠN:
        1. ƯU TIÊN SỬ DỤNG TỐI ĐA các quán ăn và quán cà phê từ "DANH SÁCH ĐỊA ĐIỂM CÓ THẬT" ở trên. BẮT BUỘC giữ nguyên tọa độ lat, lng.
        2. Dựa vào "MỤC ĐÍCH VÀ YÊU CẦU CÁ NHÂN HÓA" ở trên, hãy tự động lọc và chọn ra những địa điểm thực tế phù hợp nhất. 
        3. Nếu danh sách thật không đáp ứng được mục đích, được phép TỰ BỔ SUNG thêm nhưng phải đảm bảo tên quán CÓ THẬT tại địa phương.
        4. Trả về đúng định dạng JSON chuẩn.

        // Thêm chỉ thị này vào cuối câu lệnh Prompt trong server.ts
        "MỘT LƯU Ý SỐNG CÒN: Tuyệt đối KHÔNG đưa vào lịch trình các địa điểm nổi tiếng là đã đóng cửa vĩnh viễn hoặc tạm ngừng hoạt động trong thời gian dài. Nếu bạn không chắc chắn địa điểm đó còn hoạt động hay không, hãy ưu tiên các địa điểm có thương hiệu lớn hoặc chuỗi cửa hàng để đảm bảo trải nghiệm người dùng."
      `;

        const configPayload = {
        // 1. Cập nhật lại chỉ thị hệ thống để AI thích ứng theo mục đích nhập vào
        systemInstruction: `Bạn là Local Expert AI chuyên nghiệp. Nhiệm vụ của bạn là luôn trả về định dạng JSON hợp lệ dựa trên đúng Schema yêu cầu. 
        1. BẮT BUỘC phải phân tích kỹ mục đích chuyến đi của người dùng để lựa chọn loại hình hoạt động (type) phù hợp:
        - Nếu mục đích là HỌC TẬP, LÀM BÀI TẬP, LÀM VIỆC: Hãy ưu tiên các hoạt động dạng 'coffee' hoặc 'visit' tại các không gian yên tĩnh, thư viện, quán cà phê làm việc. TUYỆT ĐỐI KHÔNG được đưa các hoạt động giải trí náo nhiệt, ồn ào như 'boardgame', 'playbox', 'game center', 'karaoke', 'bar', 'pub' vào lịch trình.
        - Nếu mục đích là GIẢI TRÍ, VUI CHƠI, XẢ STRESS: Lúc này mới ưu tiên đưa các khu vui chơi, giải trí hiện đại vào hành trình.
        2. KỶ LUẬT VỀ ĐỊNH DẠNG DỮ LIỆU (QUAN TRỌNG NHẤT):
        - Trường 'title': CHỈ ĐƯỢC CHỨA TÊN ĐỊA ĐIỂM (Ví dụ: "Thư viện Quốc gia", "The Coffee House"). TUYỆT ĐỐI KHÔNG chèn thêm mục đích chuyến đi, cảm xúc hay bình luận vào tên.
        - Trường 'address': CHỈ ghi địa chỉ thật, không ghi mục đích.
        - Trường 'description': Đây là nơi DUY NHẤT bạn được phép dài dòng và giải thích lý do tại sao địa điểm này phù hợp với mục đích của người dùng.`,
        
        // 2. Hạ nhiệt độ sáng tạo xuống để AI tuân thủ logic chặt chẽ hơn
        temperature: 0.7, 
        
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            totalCost: { type: Type.NUMBER },
            durationDays: { type: Type.INTEGER },
            transportation: { type: Type.STRING },
            budgetLevel: { type: Type.STRING },
            weatherCondition: { type: Type.STRING },
            weatherTemp: { type: Type.NUMBER },
            weatherDescription: { type: Type.STRING },
            dayPlans: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        address: { type: Type.STRING },
                        type: { type: Type.STRING, description: "Phân loại hoạt động: 'meal', 'visit', 'coffee', 'entertainment', 'shopping'" },
                        description: { type: Type.STRING },
                        costEstimated: { type: Type.INTEGER },
                        durationMinutes: { type: Type.INTEGER },
                        lat: { type: Type.NUMBER },
                        lng: { type: Type.NUMBER },
                        transportToNext: {
                          type: Type.OBJECT,
                          properties: {
                            method: { type: Type.STRING },
                            durationMinutes: { type: Type.NUMBER },
                            distanceKm: { type: Type.NUMBER },
                            costEstimated: { type: Type.NUMBER },
                          },
                          required: ["method", "durationMinutes", "distanceKm", "costEstimated"],
                        },
                      },
                      required: ["time", "title", "address", "type", "description", "costEstimated", "durationMinutes", "lat", "lng"],
                    },
                  },
                },
                required: ["dayNumber", "activities"],
              },
            },
            additionalNotes: { type: Type.STRING },
          },
          required: ["destination", "totalCost", "durationDays", "transportation", "budgetLevel", "weatherCondition", "weatherTemp", "weatherDescription", "dayPlans"],
        },
      };

      let response;
      for (const modelName of ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash", "gemini-2.5-flash-lite" ]) {
        try {
          console.log(`[Local Expert Engine] Đang sáng tạo lịch trình giải trí (${modelName}) cho ${destination}...`);
          response = await aiInstance.models.generateContent({ model: modelName, contents: prompt, config: configPayload });
          break;
        } catch (err) {
          console.error(`Lỗi model ${modelName}`, err);
        }
      }

      if (!response) throw new Error("AI không phản hồi.");

      // SỬA LỖI PARSE JSON: Xóa bỏ các ký tự markdown rác do AI thỉnh thoảng tự thêm vào
      const rawText = response.text || "{}";
      const cleanText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const parsedData = JSON.parse(cleanText);
      
      parsedData.durationValue = Number(durationValue);
      parsedData.durationUnit = durationUnit;
      parsedData.radiusKm = Number(radiusKm);
      parsedData.isGoogleMapsDiscovery = false;

      res.json(parsedData);
    } catch (error: any) {
      // IN LỖI THỰC SỰ RA TERMINAL ĐỂ BẮT BỆNH
      console.error("🚨 [CRITICAL ERROR] LỖI KHI GỌI AI HOẶC PARSE DỮ LIỆU:", error);
      
      lastQuotaExceededTime = Date.now();
      const fb = generateFallbackPlan({ destination, budget, transportation, purpose, durationValue: Number(durationValue), durationUnit, radiusKm: Number(radiusKm), selectedPlaces, weatherInfo });
      fb.additionalNotes = `⚠️ Lỗi gọi AI (Hãy xem Terminal). Đang dùng lịch trình dự phòng. ` + fb.additionalNotes;
      return res.json(fb);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(3000, "0.0.0.0", () => console.log(`Server loaded on http://0.0.0.0:3000`));
}

startServer();