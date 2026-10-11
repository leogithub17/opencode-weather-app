import { getUnit, putUnit } from "../storage/settingsStorage.ts";
import { printSuccess } from "../presentation/output.ts";

export async function toggleUnit(): Promise<void> {
  const current = await getUnit();
  const next = current === "C" ? "F" : "C";
  await putUnit(next);
  printSuccess(`Unidad de temperatura: °${next}`);
}
