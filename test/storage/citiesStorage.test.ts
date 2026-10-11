import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { unlinkSync, existsSync } from "node:fs";
import {
  appendCity,
  deleteCity,
  getCities,
  getDefaultCity,
  isCityRegistered,
  putDefaultCity,
} from "../../src/storage/citiesStorage.ts";

let tempFile: string;
let previousEnv: string | undefined;

beforeEach(() => {
  previousEnv = process.env.WEATHER_DATA_FILE;
  tempFile = join(tmpdir(), `weather-test-${crypto.randomUUID()}.json`);
  process.env.WEATHER_DATA_FILE = tempFile;
});

afterEach(() => {
  if (existsSync(tempFile)) {
    unlinkSync(tempFile);
  }
  if (previousEnv === undefined) {
    delete process.env.WEATHER_DATA_FILE;
  } else {
    process.env.WEATHER_DATA_FILE = previousEnv;
  }
});

const MADRID = { name: "Madrid", latitude: 40.4, longitude: -3.7 };
const LIMA = { name: "Lima", latitude: -12, longitude: -77 };

describe("citiesStorage", () => {
  test("getCities devuelve lista vacía sin archivo", async () => {
    expect(await getCities()).toEqual([]);
  });

  test("appendCity añade una ciudad", async () => {
    const ok = await appendCity(MADRID);
    expect(ok).toBe(true);
    expect(await getCities()).toEqual([MADRID]);
  });

  test("appendCity rechaza duplicados (case-insensitive)", async () => {
    await appendCity(MADRID);
    const ok = await appendCity({ ...MADRID, name: "madrid" });
    expect(ok).toBe(false);
    expect(await getCities()).toEqual([MADRID]);
  });

  test("isCityRegistered detecta duplicados sin importar mayúsculas", async () => {
    await appendCity(MADRID);
    expect(await isCityRegistered("MADRID")).toBe(true);
    expect(await isCityRegistered("Otra")).toBe(false);
  });

  test("putDefaultCity y getDefaultCity funcionan", async () => {
    await appendCity(MADRID);
    expect(await getDefaultCity()).toBeNull();
    await putDefaultCity(MADRID);
    expect(await getDefaultCity()).toEqual(MADRID);
  });

  test("deleteCity elimina la ciudad y limpia defaultCity si era la default", async () => {
    await appendCity(MADRID);
    await appendCity(LIMA);
    await putDefaultCity(MADRID);
    await deleteCity(MADRID);
    expect(await getCities()).toEqual([LIMA]);
    expect(await getDefaultCity()).toBeNull();
  });

  test("deleteCity mantiene defaultCity si se elimina otra ciudad", async () => {
    await appendCity(MADRID);
    await appendCity(LIMA);
    await putDefaultCity(MADRID);
    await deleteCity(LIMA);
    expect(await getCities()).toEqual([MADRID]);
    expect(await getDefaultCity()).toEqual(MADRID);
  });
});
