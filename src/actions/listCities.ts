import { getCities } from "../storage/citiesStorage.ts";
import { printCityList } from "../presentation/output.ts";

export async function listCities(): Promise<void> {
  printCityList(await getCities());
}
