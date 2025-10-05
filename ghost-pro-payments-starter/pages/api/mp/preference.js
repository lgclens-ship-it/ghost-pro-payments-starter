const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
const API = "https://api.mercadopago.com";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { title, price, email, planLabel } = req.body || {};

    const body = {
      items: [{ title, quantity: 1, unit_price: price }],
      payer: email ? { email } : undefined,
      back_urls: {
        success: `${process.env.SITE_URL}/gracias`,
        failure: `${process.env.SITE_URL}/precios`,
        pending: `${process.env.SITE_URL}/precios`
      },
      auto_return: "approved",
      metadata: { planLabel: planLabel || "plan-premium" },
      notification_url: `${process.env.SITE_URL}/api/webhooks/mp`
    };

    const r = await fetch(`${API}/checkout/preferences`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    if (!r.ok) throw new Error(JSON.stringify(j));
    res.status(200).json({ id: j.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
