import { readData, writeData } from "./appData.ts";
import type { City } from "../types/City.ts";

export async function getCities(): Promise<City[]> {
  return (await readData()).cities;
}

export async function isCityRegistered(name: string): Promise<boolean> {
  const cities = await getCities();
  return cities.some((c) => c.name.toLowerCase() === name.toLowerCase());
}

export async function appendCity(city: City): Promise<boolean> {
  if (await isCityRegistered(city.name)) {
    return false;
  }
  await writeData((data) => ({ ...data, cities: [...data.cities, city] }));
  return true;
}

export async function deleteCity(city: City): Promise<void> {
  await writeData((data) => ({
    ...data,
    cities: data.cities.filter((c) => c.name !== city.name),
    defaultCity: data.defaultCity === city.name ? null : data.defaultCity,
  }));
}

export async function getDefaultCity(): Promise<City | null> {
  const data = await readData();
  if (!data.defaultCity) {
    return null;
  }
  return data.cities.find((c) => c.name === data.defaultCity) ?? null;
}

export async function putDefaultCity(city: City): Promise<void> {
  await writeData((data) => ({ ...data, defaultCity: city.name }));
}
