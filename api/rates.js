export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=INR"
    );

    if (!response.ok) {
      throw new Error(`Frankfurter returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.rates) {
      throw new Error("No rates returned");
    }

    const currencies = [
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
      "VND"
    ];

    const rates = {};

    for (const currency of currencies) {
      const inrToCurrency = data.rates[currency];

      if (inrToCurrency > 0) {
        rates[currency] = 1 / inrToCurrency;
      }
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json({
      success: true,
      rates,
      updatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error("Currency API error:", error);

    return res.status(503).json({
      success: false,
      error: String(error)
    });
  }
}
