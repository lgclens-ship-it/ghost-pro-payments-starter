const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox";
const BASE = PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const sec = process.env.PAYPAL_SECRET;
  const auth = Buffer.from(`${id}:${sec}`).toString("base64");
  const r = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Authorization": `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials"
  });
  const j = await r.json();
  return j.access_token;
}

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const event = req.body;
    const resource = event?.resource;
    const orderId = resource?.id || resource?.supplementary_data?.related_ids?.order_id;
    if (!orderId) return res.status(200).json({ ok: true });

    const token = await getAccessToken();
    const or = await fetch(`${BASE}/v2/checkout/orders/${orderId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const order = await or.json();

    const status = order.status;
    const email = order?.payer?.email_address || null;
    const name = order?.payer?.name?.given_name || undefined;

    if (status === "COMPLETED" && email) {
      const { createGhostMember } = await import("../../../lib/ghost.js");
      await createGhostMember(email, name, ["plan-premium"]);
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
