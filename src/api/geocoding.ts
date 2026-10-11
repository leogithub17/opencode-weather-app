import type { City } from "../types/City.ts";
import type { GeocodingResponse } from "../types/Weather.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function searchCity(name: string): Promise<City | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(name)}&count=1&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as GeocodingResponse;
  const first = data.results?.[0];
  if (!first) {
    return null;
  }
  return { name: first.name, latitude: first.latitude, longitude: first.longitude };
}
