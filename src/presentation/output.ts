import { colorize, CYAN, GREEN, RED } from "../utils/colors.ts";
import { LINE } from "../utils/constants.ts";
import { formatDateShort, formatTemperature } from "../utils/format.ts";
import type { City } from "../types/City.ts";
import type { DailyForecast } from "../types/Weather.ts";
import type { Unit } from "../types/Settings.ts";

export function printError(message: string): void {
  console.log(colorize(`  ✗ ${message}`, RED));
}

export function printSuccess(message: string): void {
  console.log(colorize(`  ✓ ${message}`, GREEN));
}

export function printCityList(cities: City[]): void {
  console.log("  Ciudades registradas:");
  cities.forEach((city, i) => {
    console.log(`    ${i + 1}. ${city.name}`);
  });
}

export function printCityWeather(city: City, temp: number, unit: Unit): void {
  console.log(`  ${city.name}: ${formatTemperature(temp, unit)}`);
}

export function printDailyForecast(
  cityName: string,
  forecast: DailyForecast[],
  unit: Unit,
): void {
  console.log(LINE);
  console.log(colorize(`  PRONÓSTICO DE 7 DÍAS — ${cityName}`, CYAN));
  console.log(LINE);
  for (const day of forecast) {
    const max = formatTemperature(day.max, unit);
    const min = formatTemperature(day.min, unit);
    console.log(`  ${formatDateShort(day.date)}  Máx: ${max}  Mín: ${min}`);
  }
  console.log(LINE);
}
