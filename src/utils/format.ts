import { colorize, YELLOW } from "./colors.ts";
import type { Unit } from "../types/Settings.ts";

export function formatTemperature(temp: number, unit: Unit): string {
  return colorize(`${temp.toFixed(1)}°${unit}`, YELLOW);
}

export function formatDateShort(date: string): string {
  const [, m, d] = date.split("-");
  return d !== undefined && m !== undefined ? `${d}/${m}` : date;
}
