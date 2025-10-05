import jwt from "jsonwebtoken";

const GHOST_URL = process.env.GHOST_URL;
const ADMIN_KEY = process.env.GHOST_ADMIN_API_KEY; // "id:secret"

export async function createGhostMember(email, name = undefined, labels = []) {
  if (!GHOST_URL || !ADMIN_KEY) {
    throw new Error("Missing GHOST_URL or GHOST_ADMIN_API_KEY env vars");
  }
  const [id, secret] = ADMIN_KEY.split(":");
  const token = jwt.sign({ kid: id }, Buffer.from(secret, "hex"), {
    algorithm: "HS256",
    expiresIn: "5m",
    audience: "/admin/"
  });

  const res = await fetch(`${GHOST_URL}/ghost/api/admin/members/`, {
    method: "POST",
    headers: {
      "Authorization": `Ghost ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ members: [{ email, name, labels }] })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ghost error ${res.status}: ${txt}`);
  }
  return await res.json();
}
