# Ghost Pro + PayPal + Mercado Pago (Starter)

## 1) Variables de entorno
En tu hosting (Vercel/Netlify) crea:
- GHOST_URL = https://tu-sitio.ghost.io
- GHOST_ADMIN_API_KEY = id:secret (de Settings → Integrations → tu integración)
- SITE_URL = https://tudominio.com

- PAYPAL_ENV = sandbox (o live)
- PAYPAL_CLIENT_ID = ...
- PAYPAL_SECRET = ...

- MP_PUBLIC_KEY = TEST-...
- MP_ACCESS_TOKEN = TEST-...

## 2) Endpoints
- POST /api/provision → crea Member manualmente (email, name?, planLabel?)
- POST /api/webhooks/paypal → webhook de PayPal (regístralo en su panel)
- POST /api/mp/preference → genera preference de MP
- POST /api/webhooks/mp → webhook de Mercado Pago (notification_url de la preference)

## 3) Front en Ghost (/precios)
- PayPal Smart Buttons: pega el script y en onApprove llama a /api/provision
- Mercado Pago: primero llama a /api/mp/preference para obtener `id`, luego renderizas el checkout con el SDK v2.

## 4) Página /gracias
- Botón que abre Ghost Portal (signin) para que el usuario entre con magic link.

## 5) Prueba
- Haz un pago de prueba en cada método y confirma que el Member se crea en Ghost con el label.
