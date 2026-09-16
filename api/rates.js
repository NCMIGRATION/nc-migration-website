// Vercel Serverless Function: GET /api/rates
//
// Fetches current mid-market FX rates from ExchangeRates.com (no API key).
// The provider documents its public_rate endpoint as being cached for about
// one minute. We cache our server response for one minute as well, so the
// browser gets fresh data without hammering the upstream provider.
//
// Attribution required by the provider: the UI shows a small "Rates by
// ExchangeRates.com" link in the currency ticker.

const CODES = ["GBP", "EUR", "USD", "AED", "NZD", "AUD", "SGD"];

async function getRate(from, to) {
  const url = `https://exchangerates.com/api/index.php?action=public_rate&from=${from}&to=${to}`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`ExchangeRates.com ${from}/${to}: HTTP ${response.status}`);
  }

  const data = await response.json();
  const rate = Number(data?.rates?.[to]);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Invalid ${from}/${to} rate`);
  }

  return {
    rate: round2(rate),
    date: data.date || null,
    source: data.source || null,
  };
}

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      CODES.map((code) => getRate(code, "INR"))
    );

    const rates = {};
    const dates = {};
    const sources = {};

    CODES.forEach((code, index) => {
      rates[code] = results[index].rate;
      dates[code] = results[index].date;
      sources[code] = results[index].source;
    });

    // Keep the server response fresh for 60 seconds. If the provider is
    // briefly slow/unavailable, Vercel may serve the cached response for
    // another 5 minutes while revalidating.
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );
    res.status(200).json({
      rates,
      updatedAt: new Date().toISOString(),
      dates,
      sources,
      fallback: false,
    });
  } catch (error) {
    // Do NOT return old hard-coded rates. That could make an old value look
    // current. The frontend will keep the last successfully fetched values,
    // or show an em dash on the very first failed request.
    res.setHeader("Cache-Control", "no-store");
    res.status(503).json({
      rates: null,
      updatedAt: null,
      fallback: false,
      error: "Currency rates are temporarily unavailable.",
    });
  }
}

function round2(value) {
  return Math.round(value * 100) / 100;
}
