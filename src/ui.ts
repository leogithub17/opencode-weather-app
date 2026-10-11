import type { Unit, WeatherData } from "./storage.ts";

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
  console.log(`  8. Ajustes (°${data.unit})`);
  console.log("  9. Salir");
  console.log(LINE);
}

export function formatTemperature(temp: number, unit: Unit): string {
  return colorize(`${temp.toFixed(1)}°${unit}`, YELLOW);
}

export function printError(message: string): void {
  console.log(colorize(`  ✗ ${message}`, RED));
}

export function printSuccess(message: string): void {
  console.log(colorize(`  ✓ ${message}`, GREEN));
}
