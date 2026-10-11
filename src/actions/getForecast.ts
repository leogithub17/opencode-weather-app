import { getCities } from "../storage/citiesStorage.ts";
import { getUnit } from "../storage/settingsStorage.ts";
import { fetchDailyForecast } from "../api/weather.ts";
import { listCities } from "./listCities.ts";
import { askCitySelection } from "../presentation/input.ts";
import type { Questioner } from "../presentation/input.ts";
import { printDailyForecast, printError } from "../presentation/output.ts";

export async function getDailyForecast(ask: Questioner): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  await listCities();
  const selection = await askCitySelection(
    cities,
    "  Número de ciudad (0 para cancelar): ",
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
  try {
    const unit = await getUnit();
    const forecast = await fetchDailyForecast(
      selection.city.latitude,
      selection.city.longitude,
      unit,
    );
    printDailyForecast(selection.city.name, forecast, unit);
  } catch (err) {
    printError(`No se pudo consultar el pronóstico: ${String(err)}`);
  }
}
