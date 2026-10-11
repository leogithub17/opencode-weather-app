import type { Unit, WeatherData } from "./storage.ts";
import type { DailyForecast } from "./api.ts";

const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

function colorize(text: string, color: string): string {
  return `${color}${text}${RESET}`;
}

const LINE = colorize("════════════════════════════════════════", CYAN);

export function printMenu(data: WeatherData): void {
  console.log(LINE);
  console.log(colorize("         WEATHER CLI", CYAN));
  console.log(LINE);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${data.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico de 7 días");
  console.log(`  8. Ajustes (°${data.unit})`);
  console.log("  9. Salir");
  console.log(LINE);
}

export function formatTemperature(temp: number, unit: Unit): string {
  return colorize(`${temp.toFixed(1)}°${unit}`, YELLOW);
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
    const [y, m, d] = day.date.split("-");
    const shortDate = d !== undefined && m !== undefined ? `${d}/${m}` : day.date;
    const max = formatTemperature(day.max, unit);
    const min = formatTemperature(day.min, unit);
    console.log(`  ${shortDate}  Máx: ${max}  Mín: ${min}`);
  }
  console.log(LINE);
}

export function printError(message: string): void {
  console.log(colorize(`  ✗ ${message}`, RED));
}

export function printSuccess(message: string): void {
  console.log(colorize(`  ✓ ${message}`, GREEN));
}
