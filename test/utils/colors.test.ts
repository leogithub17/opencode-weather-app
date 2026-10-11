import { describe, expect, test } from "bun:test";
import { colorize, CYAN, GREEN, RED, YELLOW } from "../../src/utils/colors.ts";

describe("colorize", () => {
  test("envuelve el texto con el código de color y el reset", () => {
    expect(colorize("hola", CYAN)).toBe(`${CYAN}hola\x1b[0m`);
  });

  test("funciona con cada color exportado", () => {
    expect(colorize("x", YELLOW)).toStartWith(YELLOW);
    expect(colorize("x", GREEN)).toStartWith(GREEN);
    expect(colorize("x", RED)).toStartWith(RED);
  });

  test("termina con el código de reset", () => {
    expect(colorize("x", CYAN)).toEndWith("\x1b[0m");
  });
});
