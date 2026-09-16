// NC Migration - Live Currency Rates
// ExchangeRates.com public API

const CURRENCIES = [
  "GBP",
  "EUR",
  "USD",
  "AED",
  "NZD",
  "AUD",
  "SGD",
  "CAD",
  "CHF",
  "MYR",
  "THB",
  "VND",
];

export default async function handler(req, res) {
  try {
    const results = await Promise.allSettled(
      CURRENCIES.map(async (currency) => {
        const url =
          `https://exchangerates.com/api/index.php` +
          `?action=public_rate&from=${currency}&to=INR`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`${currency}: HTTP ${response.status}`);
        }

        const data = await response.json();

        const rate = Number(data?.rates?.INR);

        if (!Number.isFinite(rate) || rate <= 0) {
          throw new Error(`${currency}: invalid rate`);
        }

        return {
          currency,
          rate,
        };
      })
    );

    const rates = {};

    for (const result of results) {
      if (result.status === "fulfilled") {
        rates[result.value.currency] =
          Math.round(result.value.rate * 100000) / 100000;
      }
    }

    if (Object.keys(rates).length === 0) {
      throw new Error("No currency rates were returned");
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json({
      success: true,
      rates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Currency API error:", error);

    return res.status(503).json({
      success: false,
      error: "Live currency rates temporarily unavailable",
    });
  }
}
