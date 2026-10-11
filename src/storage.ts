import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";

export type Unit = "C" | "F";

export interface CityRecord {
  name: string;
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  cities: CityRecord[];
  defaultCity: string | null;
  unit: Unit;
}

const appDir = join(homedir(), ".weather-cli");
export const DATA_FILE = join(appDir, "weather-data.json");

export async function loadData(): Promise<WeatherData> {
  const file = Bun.file(DATA_FILE);
  if (await file.exists()) {
    const parsed = (await file.json()) as Partial<WeatherData>;
    return {
      cities: parsed.cities ?? [],
      defaultCity: parsed.defaultCity ?? null,
      unit: parsed.unit === "F" ? "F" : "C",
    };
  }
  return { cities: [], defaultCity: null, unit: "C" };
}

export function saveData(data: WeatherData): Promise<number> {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  return Bun.write(DATA_FILE, JSON.stringify(data, null, 2));
}
