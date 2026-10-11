import type { City } from "./City.ts";

export type Unit = "C" | "F";

export interface WeatherData {
  cities: City[];
  defaultCity: string | null;
  unit: Unit;
}
