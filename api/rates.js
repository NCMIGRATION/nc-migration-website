// NC Migration - Live Currency Rates
// ExchangeRates.com public API - no API key required.

const CURRENCIES = ["GBP", "EUR", "USD", "AED", "NZD", "AUD", "SGD"];

export default async function handler(req, res) {
  try {
    const results = await Promise.all(
      CURRENCIES.map(async (currency) => {
        const url =
          `https://exchangerates.com/api/index.php` +
          `?action=public_rate&from=${currency}&to=INR`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
          },
        });

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
          rate: Math.round(rate * 100) / 100,
        };
      })
    );

    const rates = {};

    for (const item of results) {
      rates[item.currency] = item.rate;
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
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
