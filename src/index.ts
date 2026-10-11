import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { fetchTemperature, searchCity } from "./api.ts";
import { loadData, saveData, type WeatherData } from "./storage.ts";
import { formatTemperature, printError, printMenu, printSuccess } from "./ui.ts";

type Questioner = { question: (prompt: string) => Promise<string> };

function listCities(data: WeatherData): void {
  console.log("  Ciudades registradas:");
  data.cities.forEach((city, i) => {
    console.log(`    ${i + 1}. ${city.name}`);
  });
}

async function defaultCityWeather(data: WeatherData): Promise<void> {
  const city = data.defaultCity
    ? data.cities.find((c) => c.name === data.defaultCity)
    : undefined;
  if (!city) {
    printError("No hay ciudad default configurada (opción 5 del menú).");
    return;
  }
  try {
    const temp = await fetchTemperature(city.latitude, city.longitude, data.unit);
    console.log(`  ${city.name}: ${formatTemperature(temp, data.unit)}`);
  } catch (err) {
    printError(`No se pudo consultar el clima: ${String(err)}`);
  }
}

async function allCitiesWeather(data: WeatherData): Promise<void> {
  if (data.cities.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  const results = await Promise.allSettled(
    data.cities.map(async (city) => ({
      city,
      temp: await fetchTemperature(city.latitude, city.longitude, data.unit),
    })),
  );
  for (const result of results) {
    if (result.status === "fulfilled") {
      const { city, temp } = result.value;
      console.log(`  ${city.name}: ${formatTemperature(temp, data.unit)}`);
    } else {
      printError(`No se pudo consultar el clima: ${String(result.reason)}`);
    }
  }
}

async function addCity(data: WeatherData, ask: Questioner): Promise<void> {
  const name = (await ask.question("  Nombre de la ciudad: ")).trim();
  if (name === "") {
    printError("Nombre vacío.");
    return;
  }
  if (data.cities.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    printError("La ciudad ya está registrada.");
    return;
  }
  try {
    const geo = await searchCity(name);
    if (!geo) {
      printError("No se encontró la ciudad.");
      return;
    }
    data.cities.push(geo);
    await saveData(data);
    printSuccess(`Ciudad agregada: ${geo.name}`);
  } catch (err) {
    printError(`Error al buscar la ciudad: ${String(err)}`);
  }
}

function readIndex(answers: string, count: number): number | null {
  const n = Number.parseInt(answers.trim(), 10);
  if (Number.isNaN(n) || n < 0 || n > count) {
    return null;
  }
  return n;
}

async function deleteCity(data: WeatherData, ask: Questioner): Promise<void> {
  if (data.cities.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  listCities(data);
  const answer = (await ask.question("  Número a eliminar (0 para cancelar): ")).trim();
  const n = readIndex(answer, data.cities.length);
  if (n === null) {
    printError("Opción no válida.");
    return;
  }
  if (n === 0) {
    console.log("  Cancelado.");
    return;
  }
  const removed = data.cities[n - 1];
  if (!removed) {
    printError("Opción no válida.");
    return;
  }
  data.cities = data.cities.filter((_, i) => i !== n - 1);
  if (data.defaultCity === removed.name) {
    data.defaultCity = null;
  }
  await saveData(data);
  printSuccess(`Ciudad eliminada: ${removed.name}`);
}

async function setDefaultCity(data: WeatherData, ask: Questioner): Promise<void> {
  if (data.cities.length === 0) {
    printError("No hay ciudades registradas.");
    return;
  }
  listCities(data);
  const answer = (await ask.question("  Número de ciudad default (0 para cancelar): ")).trim();
  const n = readIndex(answer, data.cities.length);
  if (n === null) {
    printError("Opción no válida.");
    return;
  }
  if (n === 0) {
    console.log("  Cancelado.");
    return;
  }
  const city = data.cities[n - 1];
  if (!city) {
    printError("Opción no válida.");
    return;
  }
  data.defaultCity = city.name;
  await saveData(data);
  printSuccess(`Ciudad default establecida: ${city.name}`);
}

async function toggleUnit(data: WeatherData): Promise<void> {
  data.unit = data.unit === "C" ? "F" : "C";
  await saveData(data);
  printSuccess(`Unidad de temperatura: °${data.unit}`);
}

async function handleOption(option: string, data: WeatherData, ask: Questioner): Promise<void> {
  switch (option) {
    case "1":
      await defaultCityWeather(data);
      break;
    case "2":
      await allCitiesWeather(data);
      break;
    case "3":
      await addCity(data, ask);
      break;
    case "4":
      await deleteCity(data, ask);
      break;
    case "5":
      await setDefaultCity(data, ask);
      break;
    case "8":
      await toggleUnit(data);
      break;
    case "9":
      break;
    default:
      printError("Opción no válida.");
  }
}

async function main(): Promise<void> {
  const rl = createInterface({ input, output });
  const data = await loadData();
  try {
    for (;;) {
      printMenu(data);
      const raw = await rl.question("  Selecciona una opción: ");
      const option = raw.trim();
      if (option === "9") {
        console.log("  ¡Hasta luego!");
        break;
      }
      await handleOption(option, data, rl);
      console.log("");
    }
  } finally {
    rl.close();
  }
}

main();
