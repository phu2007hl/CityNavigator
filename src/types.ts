export type PlaceCategory = 'food' | 'entertainment' | 'coffee' | 'shopping';
export type BudgetLevel = 'cheap' | 'moderate' | 'luxury';

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface TikTokVideo {
  id: string;
  channelName: string;
  channelAvatar: string;
  description: string;
  likes: string;
  comments: number;
  views: string;
  duration: string;
  videoThumb: string;
  videoUrl?: string;
}

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  city: string;
  image: string;
  priceRange: string;
  priceLevel: BudgetLevel;
  rating: number;
  totalReviews: number;
  address: string;
  lat: number;
  lng: number;
  reviews: Review[];
  videos: TikTokVideo[];
  description: string;
}

export interface TransportDetails {
  method: 'motorbike' | 'taxi' | 'walking';
  durationMinutes: number;
  distanceKm: number;
  costEstimated: number;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  address?: string;
  placeId?: string;
  // Bổ sung 'entertainment' và 'shopping'
  type: 'meal' | 'visit' | 'coffee' | 'entertainment' | 'shopping' | 'travel' | string;
  description: string;
  costEstimated: number;
  durationMinutes: number;
  lat?: number;
  lng?: number;
  transportToNext?: TransportDetails;
}

export interface DayPlan {
  dayNumber: number;
  activities: Activity[];
}

export interface Itinerary {
  id: string;
  destination: string;
  totalCost: number;
  durationDays: number;
  transportation: 'motorbike' | 'taxi' | 'walking';
  budgetLevel: BudgetLevel;
  dayPlans: DayPlan[];
  additionalNotes?: string;
  weatherCondition?: string;
  weatherTemp?: number;
  weatherDescription?: string;
  durationValue?: number;
  durationUnit?: 'hours' | 'days';
  radiusKm?: number;
  isOfflineFallback?: boolean;
  isGoogleMapsDiscovery?: boolean;
}