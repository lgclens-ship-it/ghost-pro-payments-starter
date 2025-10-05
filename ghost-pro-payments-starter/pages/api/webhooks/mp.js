const API = "https://api.mercadopago.com";
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;

export default async function handler(req, res) {
  try {
    if (req.method === "GET") return res.status(200).send("ok"); // validation ping
    const body = req.body || {};

    const paymentId = body?.data?.id || body?.id || req.query.id;
    if (!paymentId) return res.status(200).json({ ok: true });

    const r = await fetch(`${API}/v1/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${MP_TOKEN}` }
    });
    const pay = await r.json();

    if (pay.status === "approved") {
      const email = pay.payer?.email || null;
      const planLabel = pay.metadata?.planLabel || "plan-premium";
      if (email) {
        const { createGhostMember } = await import("../../../lib/ghost.js");
        await createGhostMember(email, undefined, [planLabel]);
      }
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
