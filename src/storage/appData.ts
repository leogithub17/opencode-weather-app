import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdirSync } from "node:fs";
import type { WeatherData } from "../types/Settings.ts";

const appDir = join(homedir(), ".weather-cli");
export const DATA_FILE = join(appDir, "weather-data.json");

export function getDataFile(): string {
  return process.env.WEATHER_DATA_FILE ?? DATA_FILE;
}

export async function readData(): Promise<WeatherData> {
  const file = Bun.file(getDataFile());
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

export async function writeData(
  updater: (data: WeatherData) => WeatherData,
): Promise<void> {
  const data = await readData();
  const next = updater(data);
  mkdirSync(dirname(getDataFile()), { recursive: true });
  await Bun.write(getDataFile(), JSON.stringify(next, null, 2));
}
