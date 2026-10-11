import { afterEach, describe, expect, mock, test } from "bun:test";
import { searchCity } from "../../src/api/geocoding.ts";
import type { GeocodingResponse } from "../../src/types/Weather.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  mock.restore();
});

function mockJsonFetch(payload: GeocodingResponse, status = 200): void {
  globalThis.fetch = mock(async () => {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json" },
    });
  }) as unknown as typeof fetch;
}

describe("searchCity", () => {
  test("devuelve la primera ciudad encontrada", async () => {
    mockJsonFetch({
      results: [{ name: "Madrid", latitude: 40.4168, longitude: -3.7038 }],
    });
    const city = await searchCity("Madrid");
    expect(city).toEqual({ name: "Madrid", latitude: 40.4168, longitude: -3.7038 });
  });

  test("devuelve null si no hay resultados", async () => {
    mockJsonFetch({});
    const city = await searchCity("Ahoraquenoexiste");
    expect(city).toBeNull();
  });

  test("lanza error si la respuesta no es ok", async () => {
    mockJsonFetch({}, 500);
    expect(searchCity("Madrid")).rejects.toThrow("HTTP 500");
  });

  test("codifica el nombre de la ciudad en la URL", async () => {
    let captured = "";
    globalThis.fetch = mock(async (input: string | URL | Request) => {
      captured = String(input);
      return new Response(JSON.stringify({ results: [] }));
    }) as unknown as typeof fetch;
    await searchCity("Ciudad Real");
    expect(captured).toContain("name=Ciudad%20Real");
    expect(captured).toContain("count=1");
    expect(captured).toContain("language=es");
  });
});
