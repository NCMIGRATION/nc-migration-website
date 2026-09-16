export default async function handler(req, res) {
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
    "VND",
  ];

  try {
    const rates = {};

    for (const currency of currencies) {
      const response = await fetch(
        `https://exchangerates.com/api/index.php?action=public_rate&from=${currency}&to=INR`
      );

      const data = await response.json();

      const rate = Number(data?.rates?.INR);

      if (Number.isFinite(rate) && rate > 0) {
        rates[currency] = rate;
      }
    }

    if (Object.keys(rates).length === 0) {
      return res.status(503).json({
        success: false,
        error: "No rates received",
      });
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).json({
      success: true,
      rates: rates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return res.status(503).json({
      success: false,
      error: String(error),
    });
  }
}
