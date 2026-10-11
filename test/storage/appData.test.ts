import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { unlinkSync, existsSync } from "node:fs";
import { DATA_FILE, getDataFile, readData, writeData } from "../../src/storage/appData.ts";

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

describe("getDataFile", () => {
  test("devuelve DATA_FILE cuando no hay env var", () => {
    delete process.env.WEATHER_DATA_FILE;
    expect(getDataFile()).toBe(DATA_FILE);
  });

  test("prioriza la env var WEATHER_DATA_FILE", () => {
    expect(getDataFile()).toBe(tempFile);
  });
});

describe("readData", () => {
  test("devuelve valores por defecto si no existe el archivo", async () => {
    const data = await readData();
    expect(data).toEqual({ cities: [], defaultCity: null, unit: "C" });
  });

  test("lee el archivo existente", async () => {
    await Bun.write(
      tempFile,
      JSON.stringify({ cities: [{ name: "Madrid", latitude: 40.4, longitude: -3.7 }], defaultCity: "Madrid", unit: "F" }),
    );
    const data = await readData();
    expect(data.defaultCity).toBe("Madrid");
    expect(data.unit).toBe("F");
    expect(data.cities).toHaveLength(1);
  });

  test("normaliza la unidad a C si el valor guardado no es válido", async () => {
    await Bun.write(tempFile, JSON.stringify({ unit: "K" }));
    const data = await readData();
    expect(data.unit).toBe("C");
  });

  test("usa valores por defecto con campos parciales", async () => {
    await Bun.write(tempFile, JSON.stringify({ unit: "F" }));
    const data = await readData();
    expect(data.cities).toEqual([]);
    expect(data.defaultCity).toBeNull();
    expect(data.unit).toBe("F");
  });
});

describe("writeData", () => {
  test("aplica el updater y persiste el JSON", async () => {
    await writeData((data) => ({ ...data, defaultCity: "Madrid" }));
    expect(existsSync(tempFile)).toBe(true);
    const data = await readData();
    expect(data.defaultCity).toBe("Madrid");
  });

  test("preserva los campos no modificados", async () => {
    await writeData((data) => ({ ...data, cities: [{ name: "Lima", latitude: -12, longitude: -77 }] }));
    await writeData((data) => ({ ...data, unit: "F" }));
    const data = await readData();
    expect(data.cities).toEqual([{ name: "Lima", latitude: -12, longitude: -77 }]);
    expect(data.unit).toBe("F");
  });

  test("crea el directorio si no existe", async () => {
    const nested = join(tmpdir(), `weather-test-${crypto.randomUUID()}`, "sub", "data.json");
    process.env.WEATHER_DATA_FILE = nested;
    await writeData((data) => ({ ...data, unit: "F" }));
    expect(existsSync(nested)).toBe(true);
    unlinkSync(nested);
  });
});
