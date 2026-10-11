import type { Unit } from "../types/Settings.ts";
import type { DailyForecast, DailyResponse, ForecastResponse } from "../types/Weather.ts";

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function fetchTemperature(
  latitude: number,
  longitude: number,
  unit: Unit,
): Promise<number> {
  const unitParam = unit === "F" ? "&temperature_unit=fahrenheit" : "";
  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m${unitParam}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as ForecastResponse;
  const temp = data.current?.temperature_2m;
  if (temp === undefined) {
    throw new Error("La API no devolvió temperatura");
  }
  return temp;
}

export async function fetchDailyForecast(
  latitude: number,
  longitude: number,
  unit: Unit,
  days = 7,
): Promise<DailyForecast[]> {
  const unitParam = unit === "F" ? "&temperature_unit=fahrenheit" : "";
  const url =
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&daily=temperature_2m_max,temperature_2m_min&forecast_days=${days}&timezone=auto${unitParam}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = (await res.json()) as DailyResponse;
  const { time, temperature_2m_max: max, temperature_2m_min: min } = data.daily ?? {};
  if (
    !time ||
    !max ||
    !min ||
    time.length !== max.length ||
    time.length !== min.length ||
    time.length === 0
  ) {
    throw new Error("La API no devolvió el pronóstico completo");
  }
  return time.map((date, i) => {
    const maxTemp = max[i];
    const minTemp = min[i];
    if (maxTemp === undefined || minTemp === undefined) {
      throw new Error("La API no devolvió el pronóstico completo");
    }
    return { date, max: maxTemp, min: minTemp };
  });
}
