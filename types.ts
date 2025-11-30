
export enum Occasion {
  CASUAL = 'Casual Outing',
  OFFICE = 'Office/Work',
  GYM = 'Gym/Fitness',
  DATE = 'Date Night',
  PARTY = 'Party/Club',
  WEDDING = 'Wedding',
  TRAVEL = 'Travel',
  OUTDOOR = 'Outdoor Event',
  RAINY = 'Rainy Day',
  COLD = 'Cold Weather Event'
}

export enum Gender {
  FEMALE = 'Female',
  MALE = 'Male',
  UNISEX = 'Unisex',
  KIDS = 'Kids'
}

export interface WeatherData {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number; // Estimated or fetched
  isDay: boolean;
  locationName?: string;
}

export interface OutfitRecommendation {
  id: string;
  timestamp: number;
  occasion: Occasion;
  weather: WeatherData;
  gender: Gender;
  title: string;
  description: string;
  items: string[];
  colorPalette: string[];
  whyItWorks: string;
  accessories: string[];
  stylingTips: string[];
  imageUrl?: string; // Base64 or URL
}

export interface SavedOutfit extends OutfitRecommendation {}
