import { deleteCity, getCities } from "../storage/citiesStorage.ts";
import { listCities } from "./listCities.ts";
import { askCitySelection } from "../presentation/input.ts";
import type { Questioner } from "../presentation/input.ts";
import { printError, printSuccess } from "../presentation/output.ts";

export async function removeCity(ask: Questioner): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  await listCities();
  const selection = await askCitySelection(
    cities,
    "  Número a eliminar (0 para cancelar): ",
    ask,
  );
  if (selection.status === "invalid") {
    printError("Opción no válida.");
    return;
  }
  if (selection.status === "cancel") {
    console.log("  Cancelado.");
    return;
  }
  await deleteCity(selection.city);
  printSuccess(`Ciudad eliminada: ${selection.city.name}`);
}
