import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { LINE } from "../utils/constants.ts";
import { colorize, CYAN } from "../utils/colors.ts";
import type { MenuOption } from "../types/MenuOption.ts";
import type { Unit } from "../types/Settings.ts";
import { getCities } from "../storage/citiesStorage.ts";
import { getUnit } from "../storage/settingsStorage.ts";
import { getDefaultCityWeather, getAllCitiesWeather } from "../actions/getWeather.ts";
import { addCity } from "../actions/addCity.ts";
import { removeCity } from "../actions/removeCity.ts";
import { setDefaultCity } from "../actions/setDefaultCity.ts";
import { getDailyForecast } from "../actions/getForecast.ts";
import { toggleUnit } from "../actions/toggleUnit.ts";
import type { Questioner } from "./input.ts";
import { printError } from "./output.ts";

export function printMenu(cityCount: number, unit: Unit): void {
  console.log(LINE);
  console.log(colorize("         WEATHER CLI", CYAN));
  console.log(LINE);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${cityCount})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico de 7 días");
  console.log(`  8. Ajustes (°${unit})`);
  console.log("  9. Salir");
  console.log(LINE);
}

async function handleOption(option: MenuOption, ask: Questioner): Promise<void> {
  switch (option) {
    case "1":
      await getDefaultCityWeather();
      break;
    case "2":
      await getAllCitiesWeather();
      break;
    case "3":
      await addCity(ask);
      break;
    case "4":
      await removeCity(ask);
      break;
    case "5":
      await setDefaultCity(ask);
      break;
    case "6":
      await getDailyForecast(ask);
      break;
    case "8":
      await toggleUnit();
      break;
    default:
      printError("Opción no válida.");
  }
}

export async function runMenu(): Promise<void> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    for (;;) {
      const cities = await getCities();
      const unit = await getUnit();
      printMenu(cities.length, unit);
      const raw = await rl.question("  Selecciona una opción: ");
      const option = raw.trim() as MenuOption;
      if (option === "9") {
        console.log("  ¡Hasta luego!");
        break;
      }
      await handleOption(option, rl);
      console.log("");
    }
  } finally {
    rl.close();
  }
}
