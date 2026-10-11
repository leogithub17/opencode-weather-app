import type { City } from "../types/City.ts";

export type Questioner = { question: (prompt: string) => Promise<string> };

export type CitySelection =
  | { status: "invalid" }
  | { status: "cancel" }
  | { status: "selected"; city: City };

function readIndex(answer: string, count: number): number | null {
  const n = Number.parseInt(answer.trim(), 10);
  if (Number.isNaN(n) || n < 0 || n > count) {
    return null;
  }
  return n;
}

export async function askCitySelection(
  cities: City[],
  prompt: string,
  ask: Questioner,
): Promise<CitySelection> {
  if (cities.length === 0) {
    return { status: "invalid" };
  }
  const answer = await ask.question(prompt);
  const n = readIndex(answer, cities.length);
  if (n === null) {
    return { status: "invalid" };
  }
  if (n === 0) {
    return { status: "cancel" };
  }
  const city = cities[n - 1];
  if (!city) {
    return { status: "invalid" };
  }
  return { status: "selected", city };
}
