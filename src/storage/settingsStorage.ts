import { readData, writeData } from "./appData.ts";
import type { Unit } from "../types/Settings.ts";

export async function getUnit(): Promise<Unit> {
  return (await readData()).unit;
}

export async function putUnit(unit: Unit): Promise<void> {
  await writeData((data) => ({ ...data, unit }));
}
