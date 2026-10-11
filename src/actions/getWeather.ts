import { getDefaultCity, getCities } from "../storage/citiesStorage.ts";
import { getUnit } from "../storage/settingsStorage.ts";
import { fetchTemperature } from "../api/weather.ts";
import type { City } from "../types/City.ts";
import { printCityWeather, printError } from "../presentation/output.ts";

export async function getDefaultCityWeather(): Promise<void> {
  const city = await getDefaultCity();
  if (!city) {
    printError("No hay ciudad default configurada (opción 5 del menú).");
    return;
  }
  try {
    const unit = await getUnit();
    const temp = await fetchTemperature(city.latitude, city.longitude, unit);
    printCityWeather(city, temp, unit);
  } catch (err) {
    printError(`No se pudo consultar el clima: ${String(err)}`);
  }
}

export async function getAllCitiesWeather(): Promise<void> {
  const cities = await getCities();
  if (cities.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  const unit = await getUnit();
  const calls = cities.map(async (city: City) => ({
    city,
    temp: await fetchTemperature(city.latitude, city.longitude, unit),
  }));
  const results = await Promise.allSettled(calls);
  for (const result of results) {
    if (result.status === "fulfilled") {
      printCityWeather(result.value.city, result.value.temp, unit);
    } else {
      printError(`No se pudo consultar el clima: ${String(result.reason)}`);
    }
  }
}
