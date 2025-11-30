import { Occasion, Gender } from './types';

export const OCCASIONS = Object.values(Occasion);
export const GENDERS = Object.values(Gender);

export const PLACEHOLDER_IMAGE = "https://picsum.photos/600/800"; // Fallback

// We use Open-Meteo for weather as it doesn't require an API key for frontend demos.
export const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";