// lib/config.js

// Planes México (MXN)
export const MX_PLANS = [
  {
    code: 'newsletter-90d-mx',
    name: 'Creación y gestión de boletín (90 días)',
    currency: 'MXN',
    amount: 45000,
    label: 'newsletter-90d',
  },
  {
    code: 'ghost-business-mx',
    name: 'Negocio Ghost (prepago)',
    currency: 'MXN',
    amount: 16000,
    label: 'ghost-business',
  },
  {
    code: '90-influencers-90d-mx',
    name: '90 Influencers en 90 días (prepago)',
    currency: 'MXN',
    amount: 75000,
    label: '90-influencers-90d',
  },
];

// Planes USA (USD)
export const US_PLANS = [
  {
    code: 'newsletter-90d-us',
    name: 'Newsletter Service (90 days)',
    currency: 'USD',
    amount: 5000,
    label: 'newsletter-90d',
  },
  {
    code: 'ghost-business-us',
    name: 'Ghost Business in a Box',
    currency: 'USD',
    amount: 2500,
    label: 'ghost-business',
  },
  {
    code: '90-influencers-90d-us',
    name: '90 Influencers in 90 Days',
    currency: 'USD',
    amount: 7500,
    label: '90-influencers-90d',
  },
];

export function getPlan(code) {
  return [...MX_PLANS, ...US_PLANS].find(p => p.code === code);
}
