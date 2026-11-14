# Diseño — Login y licencias Hotmart (Fase 2)

> Fecha: 2026-11-14 · Estado: spec aprobado por el pastor, pendiente plan de
> implementación. Origen: decisión guardada en `docs/bitacora.md:797-823`
> (25 oct 2026) + guía de webhook Hotmart del pastor (14 nov 2026).

## 1. Objetivo

Login de usuarios en Keryx con cobro mensual cada 30 días vía Hotmart. Si el
cliente no paga, la app se bloquea (pantalla de renovación). Los datos locales
NUNCA se borran.

Decisiones confirmadas el 2026-11-14:

- **Stack**: Cloudflare Workers + Supabase Postgres (cuentas ya creadas).
- **Login**: email + contraseña (el backend valida el email contra la
  suscripción en Hotmart).
- **Trial**: 7 días por cuenta nueva (sin compra en Hotmart).
- **Cobertura**: TODA la app detrás de licencia (gracia offline 7 días).
- **JWT Ed25519** con clave pública embebida en la app.
- **Dispositivos**: máx 3 activaciones por cuenta.
- **Ciclo de 30 días**: lo gestiona Hotmart (cobro automático); la app SOLO
  lee el estado que llega por webhook.

## 2. Arquitectura

```
┌─────────────┐  compra/renovación  ┌──────────┐  webhook POST  ┌──────────────────┐
│   Hotmart   │ ──────────────────► │ Workers  │ ─────────────► │  Supabase        │
│  (suscrip.) │                     │ _backend/│  valida hottok │  suscripciones   │
└─────────────┘                     └────┬─────┘                └────────▲─────────┘
                                        │ login / activar               │ lee/actualiza
                                        ▼                               │ estado
                                   ┌─────────────┐                      │
                                   │ Keryx app   │ ─────────────────────┘ (solo
                                   │ licencia JWT│   vía backend, nunca directo)
                                   └─────────────┘
```

- **Hotmart** emite el webhook (`X-Hotmart-Token` = hottok) en compra
  aprobada, renovación, cancelación y reembolso.
- **Cloudflare Workers** (`_backend/`, sin servidor): 3 endpoints. Es el único
  componente con credenciales de Supabase y con la clave privada Ed25519.
- **Supabase** (proyecto `mxwdtlvbturopelyolli`): tablas `suscripciones` y
  `dispositivos`.
- **Keryx** nunca habla directo con Supabase ni con Hotmart: solo con el
  backend. La app valida el JWT offline con la clave pública.

## 3. Backend `_backend/` (Cloudflare Workers, ~200 líneas TS + Vitest)

### `POST /webhooks/hotmart` — URL que se registra en Hotmart

1. Verifica `X-Hotmart-Token` contra el secret `HOTTOK`. Falla → `403`
   (Hotmart desactiva configuraciones con errores; un 403 limpio es correcto).
2. Mapeo de eventos:
   - `PURCHASE_APPROVED`, `SUBSCRIPTION_RENEWED` → `estado='activa'`,
     `expira_at = next_cycle_date`.
   - `SUBSCRIPTION_CANCELED` → `estado='cancelada'` (sigue usable hasta
     `expira_at`).
   - `REFUND`, `SUBSCRIPTION_EXPIRED` → `estado='inactiva'` (bloqueo
     inmediato).
3. Upsert en `suscripciones` por el email del comprador. El comprador entra
   con el email que puso en Hotmart: ese es su login.

### `POST /auth/login` — `{email, contraseña}`

- Cuenta nueva sin suscripción activa → crea cuenta (bcrypt, coste 10) y
  arranca trial 7 días (`trial_hasta = hoy + 7`).
- Cuenta nueva con suscripción activa en Hotmart → `estado='activa'`.
- Trial agotado → error "Trial agotado, suscríbete" con URL de checkout.
- Devuelve un token de sesión corto (10 min) para llamar a `/license/activar`.

### `POST /license/activar` — `{email, huellaDispositivo, tokenSesion}`

- Si el email tiene < 3 dispositivos activos: registra la huella y devuelve
  el JWT Ed25519: `{sub: email, exp: expira_at + 7 días de gracia, huella,
  trial: bool}`.
- Si ya hay 3 → error "Límite de 3 equipos alcanzado" (endpoint
  `POST /license/desactivar` con sesión permite liberar uno).
- La app re-valida con el backend cada 24 h si hay internet; la gracia de
  7 días ya viene codificada en el `exp` del JWT.

## 4. App Electron (`packages/licencia` + pantallas)

### `packages/licencia` (proceso main, TS puro, sin UI)

- `login(email, contra)` → `/auth/login`; token de sesión en memoria.
- `activar(huella)` → `/license/activar`; JWT guardado **cifrado**
  (AES-GCM vía `safeStorage` de Electron) en `keryx-store.json`.
- `verificar()` → valida JWT con la clave pública Ed25519 embebida
  (offline): `exp` no vencido + huella de esta máquina.
- **Huella** = SHA-256 de (id de máquina + instalación). No son IDs
  intrusivos ni telemetría.

### Pantallas (renderer, i18n es/en/pt como todo el repo)

- **Login** (primer arranque, bloqueante): email + contraseña + "Crear
  cuenta" + "Comprar suscripción" → `shell.openExternal` al checkout.
- **Bloqueo** (si `verificar()` falla tras el arranque): mensaje según estado
  + "Renovar suscripción" (checkout) + "Cerrar sesión".
- Estados: `trial` (banner con días restantes), `activa`, `cancelada`
  (usable hasta `expira_at`), `expirada` (bloqueo), `gracia` (sin internet,
  banner con días restantes), `bloqueada`.

### Integración

Arranque → `licencia.verificar()` → pasa: arranque normal; falla: pantalla de
bloqueo. El gate va sobre el arranque, NO sobre el motor de estudio — los
evals (`npm run eval`, `npm run eval:trad`) quedan intactos.

## 5. Seguridad (no negociable)

- JWT **Ed25519**: clave privada SOLO como secret del Worker; pública
  embebida en el main. Nadie forja licencias ni editando `keryx-store.json`.
- Contraseñas bcrypt (coste 10) en el Worker. Jamás en claro en app ni logs.
- `SUPABASE_SERVICE_ROLE_KEY` SOLO en secrets del Worker; la app no conoce
  Supabase. `HOTTOK` como secret rotable sin redeploy.
- Rate limit en login: 5/min por IP (Worker KV o límite simple en tabla).
- El token cifrado en disco nunca va a git (AGENTS: `keryx-store.json` es
  userData, nunca commit).

## 6. Supabase — esquema SQL

```sql
create table suscripciones (
  email text primary key,
  estado text not null check (estado in ('activa','cancelada','inactiva','trial')),
  expira_at timestamptz,
  trial_hasta timestamptz,
  hotmart_comprador_id text,
  actualizado_at timestamptz not null default now()
);

create table dispositivos (
  email text not null references suscripciones(email),
  huella text not null,
  activado_at timestamptz not null default now(),
  primary key (email, huella)
);
```

## 7. Testing (Vitest, 0 fallos antes de commit)

- **Backend** (mock de Supabase en memoria): webhook con hottok
  válido/inválido; los 4 eventos; upsert; login cuenta nueva con/sin
  suscripción; trial nuevo/agotado; activación < 3 y = 3 dispositivos;
  expiración de sesión; rate limit.
- **`packages/licencia`**: firma/verificación con par Ed25519 de test; `exp`
  vencido; huella distinta; gracia 7 días.
- **App**: pantalla login (errores de red/credenciales), estados de bloqueo.
- Verificación: `npm run typecheck` + `lint` + `test` + `eval` + `eval:trad`
  en 0 fallos.

## 8. Checklist manual del pastor (cuando el código esté listo)

1. **Supabase** (proyecto `mxwdtlvbturopelyolli`): ejecutar el SQL de la
   sección 6; copiar URL + `service_role` (NO pegarlas en el chat; van a
   `wrangler secret put`).
2. **Cloudflare** (cuenta `c4010d4b7fa3981a6278aa49749734c7`): crear el
   Worker y los secrets `HOTTOK`, `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `LICENCIA_PRIVADA` (el par Ed25519 se genera
   con un script del repo).
3. **Hotmart**: Herramientas → Webhook → registrar
   `https://<worker>.workers.dev/webhooks/hotmart` con eventos "Compra
   aprobada/completada" + "Reembolso/Cancelación" (guía del pastor);
   configurar el Área de miembros externa con la URL de la app; copiar el
   hottok.
4. **Compra de prueba con tarjeta real** y validación extremo a extremo:
   cobro → renovación → bloqueo por impago → reactivación.

## 9. Fuera de alcance (YAGNI)

- Firmas sociales (Google/Facebook) — decidido no.
- Panel web de administración — soporte vía SQL de Supabase de momento.
- Claves de licencia offline estilo serial — lo cubre el JWT.
- Desactivar dispositivo desde la app (se hará por endpoint y/o soporte).
