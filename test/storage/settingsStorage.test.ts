import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { unlinkSync, existsSync } from "node:fs";
import { getUnit, putUnit } from "../../src/storage/settingsStorage.ts";

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

describe("settingsStorage", () => {
  test("getUnit devuelve C por defecto", async () => {
    expect(await getUnit()).toBe("C");
  });

  test("putUnit persiste la unidad", async () => {
    await putUnit("F");
    expect(await getUnit()).toBe("F");
    await putUnit("C");
    expect(await getUnit()).toBe("C");
  });
});
