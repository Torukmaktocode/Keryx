# Configuración de licencias (checklist del pastor)

Cuentas: Supabase `mxwdtlvbturopelyolli` · Cloudflare `c4010d4b7fa3981a6278aa49749734c7` · Hotmart producto `8968763`.

> Regla de oro: los PEM, secretos y tokens NUNCA van al repo ni al chat.
> El PEM privado solo se pega en `npx wrangler secret put`; el público solo
> en `apps/desktop/src/main/clave-publica.ts`.

## 1. Supabase (una vez)

SQL Editor → ejecutar el SQL de la sección 6 del spec
(`docs/superpowers/specs/2026-11-14-licencias-hotmart-design.md`):
las 3 tablas `suscripciones`, `usuarios`, `dispositivos` (el SQL va tal
cual del spec, sin cambios). El webhook del backend hace upsert sobre
`suscripciones.email`, el login busca en `usuarios` y la activación
registra huella en `dispositivos` (máx. 3 por email).

Copiar: Project URL (`https://mxwdtlvbturopelyolli.supabase.co`, base REST
`https://mxwdtlvbturopelyolli.supabase.co/rest/v1/`) y service_role secret
(Settings → API). NO pegarlos en el chat: se usan en los secrets del paso 2.

## 2. Cloudflare (una vez)

1. `cd _backend && npx wrangler login`
2. `node scripts/generar-claves-licencia.mjs` — imprime los 2 PEM;
   el privado queda solo en pantalla (o en archivo con `--archivo`, fuera
   del repo) para pegarlo en el secret `LICENCIA_PRIVADA`.
3. Secrets (exactamente estos 4 nombres):
   - `npx wrangler secret put HOTTOK` (el hottok de Hotmart, paso 3)
   - `npx wrangler secret put SUPABASE_URL` (la Project URL del paso 1)
   - `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` (el service_role del paso 1)
   - `npx wrangler secret put LICENCIA_PRIVADA` (el PEM privado PKCS8 del paso 2)
4. `npx wrangler deploy` → anota la URL (ej. `https://keryx-licencias.tu-subdomain.workers.dev`)
5. Pegar esa URL en `packages/core/src/licencia.ts` (BACKEND_URL) y el PEM
   público en `apps/desktop/src/main/clave-publica.ts`; pegar también la URL
   del checkout de Hotmart en `CHECKOUT_URL` (mismo archivo). Correr batería
   (`typecheck` + `lint` + `test` + `eval` + `eval:trad`) + commit + build de
   instaladores (`npm run build:win`).

## 3. Hotmart (producto 8968763)

1. Herramientas → Webhook (API y notificaciones) → + Registrar webhook.
2. Eventos: "Compra aprobada/completada" + "Reembolso/Cancelación".
3. URL de destino: `https://<worker>.workers.dev/webhooks/hotmart`
4. Copiar el token (hottok) → usarlo en el secret HOTTOK del paso 2.
5. Área de miembros externa: usar la URL del checkout/descarga de la app.

## 4. Prueba extremo a extremo (con tarjeta real)

1. Comprar la suscripción → esperar aprobación.
2. Abrir Keryx → login con el email de la compra → debe entrar con estado activa.
3. Webhook de renovación (simular o esperar ciclo) → `expira_at` se re-fecha.
4. Cancelar/reembolsar en Hotmart → la app muestra bloqueo en el siguiente arranque.
5. Reactivar → la app vuelve a activa. Los datos locales nunca se pierden.
