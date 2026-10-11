import { appendCity, isCityRegistered } from "../storage/citiesStorage.ts";
import { searchCity } from "../api/geocoding.ts";
import { printError, printSuccess } from "../presentation/output.ts";
import type { Questioner } from "../presentation/input.ts";

export async function addCity(ask: Questioner): Promise<void> {
  const name = (await ask.question("  Nombre de la ciudad: ")).trim();
  if (name === "") {
    printError("Nombre vacío.");
    return;
  }
  if (await isCityRegistered(name)) {
    printError("La ciudad ya está registrada.");
    return;
  }
  try {
    const geo = await searchCity(name);
    if (!geo) {
      printError("No se encontró la ciudad.");
      return;
    }
    const ok = await appendCity(geo);
    if (!ok) {
      printError("La ciudad ya está registrada.");
      return;
    }
    printSuccess(`Ciudad agregada: ${geo.name}`);
  } catch (err) {
    printError(`Error al buscar la ciudad: ${String(err)}`);
  }
}
