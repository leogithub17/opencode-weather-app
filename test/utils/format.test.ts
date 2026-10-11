import { describe, expect, test } from "bun:test";
import { formatDateShort, formatTemperature } from "../../src/utils/format.ts";

describe("formatTemperature", () => {
  test("redondea a un decimal y añade la unidad", () => {
    const out = formatTemperature(21.43, "C");
    expect(out).toContain("21.4°C");
  });

  test("usa la unidad Fahrenheit cuando corresponde", () => {
    const out = formatTemperature(70, "F");
    expect(out).toContain("70.0°F");
  });

  test("aplica el color amarillo", () => {
    expect(formatTemperature(0, "C")).toContain("\x1b[33m");
    expect(formatTemperature(0, "C")).toEndWith("\x1b[0m");
  });
});

describe("formatDateShort", () => {
  test("convierte fecha ISO a día/mes", () => {
    expect(formatDateShort("2026-01-05")).toBe("05/01");
  });

  test("devuelve la entrada original si no es ISO", () => {
    expect(formatDateShort("ayer")).toBe("ayer");
  });
});
