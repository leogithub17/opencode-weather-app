import { describe, expect, test } from "bun:test";
import { askCitySelection } from "../../src/presentation/input.ts";
import type { Questioner } from "../../src/presentation/input.ts";
import type { City } from "../../src/types/City.ts";

const CITIES: City[] = [
  { name: "Madrid", latitude: 40.4, longitude: -3.7 },
  { name: "Lima", latitude: -12, longitude: -77 },
];

function fakeQuestioner(answer: string): Questioner {
  return { question: async (_prompt: string) => answer };
}

describe("askCitySelection", () => {
  test("devuelve invalid con lista vacía", async () => {
    const sel = await askCitySelection([], "prompt:", fakeQuestioner("1"));
    expect(sel.status).toBe("invalid");
  });

  test("selecciona la ciudad del número indicado", async () => {
    const sel = await askCitySelection(CITIES, "prompt:", fakeQuestioner("2"));
    expect(sel.status).toBe("selected");
    if (sel.status === "selected") {
      expect(sel.city.name).toBe("Lima");
    }
  });

  test("devuelve cancel con 0", async () => {
    const sel = await askCitySelection(CITIES, "prompt:", fakeQuestioner("0"));
    expect(sel.status).toBe("cancel");
  });

  test("devuelve invalid con entrada no numérica", async () => {
    const sel = await askCitySelection(CITIES, "prompt:", fakeQuestioner("abc"));
    expect(sel.status).toBe("invalid");
  });

  test("devuelve invalid fuera de rango", async () => {
    const sel = await askCitySelection(CITIES, "prompt:", fakeQuestioner("3"));
    expect(sel.status).toBe("invalid");
  });

  test("devuelve invalid con número negativo", async () => {
    const sel = await askCitySelection(CITIES, "prompt:", fakeQuestioner("-1"));
    expect(sel.status).toBe("invalid");
  });

  test("trimea la entrada", async () => {
    const sel = await askCitySelection(CITIES, "prompt:", fakeQuestioner("  1  "));
    expect(sel.status).toBe("selected");
  });
});
