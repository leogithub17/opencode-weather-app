import type { City } from "./City.ts";

export interface GeocodingResponse {
  results?: City[];
}

export interface ForecastResponse {
  current?: { temperature_2m?: number };
}

export interface DailyResponse {
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export interface DailyForecast {
  date: string;
  max: number;
  min: number;
}
