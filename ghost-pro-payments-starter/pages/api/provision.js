export default async function handler(req, res) {
  try {
    if (req.method !== "POST") return res.status(405).end();
    const { email, name, planLabel } = req.body || {};
    if (!email) return res.status(400).json({ error: "Missing email" });

const { createGhostMember } = await import("../../lib/ghost.js");
    await createGhostMember(email, name, planLabel ? [planLabel] : []);

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
