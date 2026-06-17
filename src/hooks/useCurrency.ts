import { useState, useEffect } from "react";
import type { Currency } from "../data/catalogue";
export type Rates = Record<string, number>;
const CACHE_KEY = "bt_fx_rates";
const CACHE_TTL = 3600_000;
export function useCurrency() {
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [rates, setRates] = useState<Rates>({ USD: 1.27, EUR: 1.17, CNY: 9.22 });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates: r, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) { setRates(r); return; }
      }
    } catch {}
    setLoading(true);
    fetch("https://api.frankfurter.app/latest?from=GBP&to=USD,EUR,CNY")
      .then(r => r.json())
      .then(data => {
        if (data.rates) {
          setRates(data.rates);
          try { localStorage.setItem(CACHE_KEY, JSON.stringify({ rates: data.rates, ts: Date.now() })); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { currency, setCurrency, rates, loading };
}
