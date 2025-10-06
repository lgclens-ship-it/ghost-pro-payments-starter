// lib/ghost.js
import GhostAdminAPI from '@tryghost/admin-api';

const { GHOST_URL, GHOST_ADMIN_API_KEY } = process.env;

if (!GHOST_URL || !GHOST_ADMIN_API_KEY) {
  throw new Error('Faltan variables de entorno GHOST_URL o GHOST_ADMIN_API_KEY');
}

export const ghost = new GhostAdminAPI({
  url: GHOST_URL,
  key: GHOST_ADMIN_API_KEY,
  version: 'v5',
});

// Crea (o devuelve) un miembro por email
export async function ensureMember(email, name) {
  try {
    const found = await ghost.members.browse({ filter: `email:'${email}'`, limit: 1 });
    if (found?.length) return found[0];
  } catch (_) {
    // si browse falla por vacío, continuamos creando
  }
  return await ghost.members.add({ email, name });
}

// Agrega una etiqueta al miembro si no la tiene
export async function attachLabel(memberId, label) {
  if (!label) return;
  try {
    const member = await ghost.members.read({ id: memberId });
    const labels = (member.labels || []).map(l => l.name);
    if (!labels.includes(label)) {
      labels.push(label);
      await ghost.members.edit({
        id: memberId,
        labels: labels.map(name => ({ name })),
      });
    }
  } catch (e) {
    console.error('attachLabel error', e);
  }
}

export default ghost;
