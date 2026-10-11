import { afterEach, describe, expect, mock, test } from "bun:test";
import { fetchDailyForecast, fetchTemperature } from "../../src/api/weather.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  mock.restore();
});

function mockJsonFetch(payload: unknown, status = 200): void {
  globalThis.fetch = mock(async () => {
    return new Response(JSON.stringify(payload), {
      status,
      headers: { "content-type": "application/json" },
    });
  }) as unknown as typeof fetch;
}

describe("fetchTemperature", () => {
  test("devuelve la temperatura current", async () => {
    mockJsonFetch({ current: { temperature_2m: 21.5 } });
    const temp = await fetchTemperature(40.4, -3.7, "C");
    expect(temp).toBe(21.5);
  });

  test("añade temperature_unit=fahrenheit si la unidad es F", async () => {
    let captured = "";
    globalThis.fetch = mock(async (input: string | URL | Request) => {
      captured = String(input);
      return new Response(JSON.stringify({ current: { temperature_2m: 70 } }));
    }) as unknown as typeof fetch;
    await fetchTemperature(40.4, -3.7, "F");
    expect(captured).toContain("temperature_unit=fahrenheit");
  });

  test("la lanza error si no hay temperatura", async () => {
    mockJsonFetch({ current: {} });
    expect(fetchTemperature(40.4, -3.7, "C")).rejects.toThrow(
      "La API no devolvió temperatura",
    );
  });

  test("la lanza error si la respuesta no es ok", async () => {
    mockJsonFetch({}, 503);
    expect(fetchTemperature(40.4, -3.7, "C")).rejects.toThrow("HTTP 503");
  });
});

describe("fetchDailyForecast", () => {
  const fullDaily = {
    daily: {
      time: ["2026-01-01", "2026-01-02"],
      temperature_2m_max: [10, 12],
      temperature_2m_min: [2, 3],
    },
  };

  test("mapea el pronóstico diario", async () => {
    mockJsonFetch(fullDaily);
    const days = await fetchDailyForecast(40.4, -3.7, "C");
    expect(days).toEqual([
      { date: "2026-01-01", max: 10, min: 2 },
      { date: "2026-01-02", max: 12, min: 3 },
    ]);
  });

  test("solicita 7 días por defecto y timezone auto", async () => {
    let captured = "";
    globalThis.fetch = mock(async (input: string | URL | Request) => {
      captured = String(input);
      return new Response(JSON.stringify(fullDaily));
    }) as unknown as typeof fetch;
    await fetchDailyForecast(40.4, -3.7, "C");
    expect(captured).toContain("forecast_days=7");
    expect(captured).toContain("timezone=auto");
    expect(captured).toContain("daily=temperature_2m_max,temperature_2m_min");
  });

  test("la lanza error si falta algún campo del pronóstico", async () => {
    mockJsonFetch({ daily: { time: ["2026-01-01"], temperature_2m_max: [10] } });
    expect(fetchDailyForecast(40.4, -3.7, "C")).rejects.toThrow(
      "La API no devolvió el pronóstico completo",
    );
  });

  test("la lanza error con arrays de longitudes distintas", async () => {
    mockJsonFetch({
      daily: {
        time: ["2026-01-01", "2026-01-02"],
        temperature_2m_max: [10],
        temperature_2m_min: [2, 3],
      },
    });
    expect(fetchDailyForecast(40.4, -3.7, "C")).rejects.toThrow(
      "La API no devolvió el pronóstico completo",
    );
  });

  test("la lanza error si la respuesta no es ok", async () => {
    mockJsonFetch({}, 404);
    expect(fetchDailyForecast(40.4, -3.7, "C")).rejects.toThrow("HTTP 404");
  });
});
