# Bot status

Private floor for Orel's assistants. It shows what each bot is doing, what needs a decision, and lets you approve, reject, reply, or ask every bot to refresh. Bots push status in, and actions go back out through a webhook plus a pending-actions feed.

The app is meant to be deployed as its own Vercel project and reached at `https://www.orelzilberman.com/admin/bots`. `basePath` is `/admin`, so pages, assets, and APIs all live under that prefix. The portfolio proxies `/admin` to this project's production URL in two places that share the same destination: root `vercel.json` (edge) and `next.config.js` `rewrites` (the Next server). The portfolio is not a static export, so the Next server would otherwise answer `/admin` with its own 404.

Nothing here is indexed (`noindex` plus `X-Robots-Tag`).

## Environment

Set these on the dashboard Vercel project (Production, and Preview if you use it). Do not put them on the portfolio project.

| Name | Required | Purpose |
| --- | --- | --- |
| `BOTDASH_USERNAME` | Yes | Sign-in username. Compared exactly, in constant time. |
| `BOTDASH_PASSWORD` | Yes | Sign-in password. Compared exactly, in constant time. |
| `BOTDASH_SESSION_SECRET` | Yes | HMAC key for the session cookie. Use a long random string (`openssl rand -base64 32`). Rotating it signs everyone out. |
| `BOTDASH_INGEST_TOKEN` | Yes | Bearer token bots send to the ingest and action-ack APIs. |
| `BLOB_READ_WRITE_TOKEN` | Yes in production | Private Vercel Blob read/write token. Vercel injects this when you connect a Blob store. |
| `BOTDASH_WEBHOOK_URL` | No | Where to POST each action immediately. If unset, the action is only stored. |
| `BOTDASH_WEBHOOK_AUTH` | No | Full `Authorization` header value to send with the webhook, for example `Bearer whsec_example`. |

Local `next dev` and `next start` without a Blob token use `bots-dashboard/.data` (gitignored). On Vercel (`VERCEL=1`) the store refuses to run without `BLOB_READ_WRITE_TOKEN`.

The session cookie is `botdash_session`: HttpOnly, SameSite=Lax, Path=`/admin`, about 30 days. It is marked Secure on HTTPS (always, on the public site).

Copy `.env.example` to `.env.local` before `npm run dev`.

## Local development

```bash
cd bots-dashboard
npm install
cp .env.example .env.local
# edit .env.local
npm run dev
```

Open `http://localhost:3000/admin/login`.

`npm run seed` writes **fictional** example bots into `.data` so you can look at the UI. It exits if `NODE_ENV=production` or if `BLOB_READ_WRITE_TOKEN` is set. It never talks to Blob.

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Storage

One module, `src/lib/storage`, hides the driver behind a `BotStore`:

- `bots/<botId>.json` — one document per bot
- `events/log.json` — append-only history, last 200 events
- `actions/log.json` — actions, last 200, never dropping ones that are still pending or delivered

Reads and writes stay on the server. Blob objects are private (`access: 'private'`), read with `useCache: false` so a status push shows up on the next poll, and blob URLs are never sent to the browser.

To move to Postgres later, implement `BotStore` in `src/lib/storage/store.ts` and return it from `getStore()`.

## Auth model

Next.js 16 renamed Middleware to Proxy. `src/proxy.ts` is that gate: it checks the signed session and redirects pages to `/admin/login`, or returns 401 for APIs. Login, ingest, pending-actions, and ack are the exceptions. Every protected route handler checks the session again. Ingest routes check the bearer token again.

Failed sign-ins wait briefly and, after 8 failures from the same IP inside 15 minutes, return 429. The limiter is in-memory per server instance.

## API

Placeholder token below is `INGEST_TOKEN`. Session routes need the sign-in cookie; curl examples for those assume you have already signed in and pass `-b cookies.txt`.

Base URL once the rewrite is live:

`https://www.orelzilberman.com`

The dashboard's own host (`https://orel-bots-dashboard.vercel.app`) accepts the same paths.

### Push one status

`POST /admin/api/status`

Header: `Authorization: Bearer INGEST_TOKEN`

```bash
curl -sS -X POST https://www.orelzilberman.com/admin/api/status \
  -H "Authorization: Bearer INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "botId": "jarvis",
    "name": "Jarvis",
    "title": "Head of Growth",
    "status": "working",
    "summary": "Drafting the Tuesday memo.",
    "lastDone": "Pulled last weeks numbers.",
    "nextUp": "Wait for approval.",
    "needsOrel": [
      {
        "id": "memo",
        "title": "Send the Tuesday memo?",
        "detail": "It recommends doubling the partner test.",
        "link": "https://example.com/memo",
        "kind": "approval"
      }
    ],
    "links": [{ "label": "Draft", "url": "https://example.com/memo" }],
    "updatedAt": "2026-11-12T08:00:00.000Z"
  }'
```

`status` is one of `working`, `idle`, `waiting_on_orel`, `blocked`, `error`.

`needsOrel[].kind` is one of `approval`, `question`, `fyi`.

`botId` and item ids are `[A-Za-z0-9][A-Za-z0-9_-]{0,63}`. Links must be `http` or `https`. `updatedAt` is optional; the server uses its own clock when it is omitted. Unknown fields are ignored. A bad body returns 400 with `{ error, issues: [{ path, message }] }`. Success is `{ ok: true }`. The call also appends a history event.

### Push a batch

`POST /admin/api/status/batch` — same bearer token. Body is `{ "bots": [ ...up to 50 status objects... ] }`. Use this for the 10-minute refresh. Success is `{ ok: true, count }`. The batch is validated before anything is written.

```bash
curl -sS -X POST https://www.orelzilberman.com/admin/api/status/batch \
  -H "Authorization: Bearer INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bots":[{"botId":"notes-bob","name":"Notes Bob","status":"idle","summary":"Inbox clear."}]}'
```

### List actions a bot still has to handle

`GET /admin/api/pending-actions` — same bearer token.

Returns actions that are not yet acknowledged (`pending` or `delivered`). Bots should treat `id` as idempotent, because a delivered action stays in this list until ack.

```bash
curl -sS https://www.orelzilberman.com/admin/api/pending-actions \
  -H "Authorization: Bearer INGEST_TOKEN"
```

```json
{
  "actions": [
    {
      "id": "act-example",
      "botId": "jarvis",
      "type": "approve",
      "itemId": "memo",
      "text": null,
      "status": "delivered",
      "createdAt": "2026-11-12T08:05:00.000Z"
    }
  ]
}
```

`type` is `approve`, `reject`, `message`, or `refresh`. `botId` may be `all` for a floor-wide refresh.

### Acknowledge an action

`POST /admin/api/actions/ack` — same bearer token.

```bash
curl -sS -X POST https://www.orelzilberman.com/admin/api/actions/ack \
  -H "Authorization: Bearer INGEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"act-example","result":"Memo sent."}'
```

`result` is optional and shown in the UI. Ack is idempotent: acknowledging twice returns the handled action. Unknown ids return 404.

### Read the floor (signed in)

`GET /admin/api/bots`

```bash
curl -sS https://www.orelzilberman.com/admin/api/bots -b cookies.txt
```

```json
{
  "bots": [],
  "events": [],
  "actions": [],
  "serverTime": "2026-11-12T08:06:00.000Z"
}
```

The browser polls this about every 12 seconds while the tab is visible.

### Take an action (signed in)

`POST /admin/api/action`

```bash
curl -sS -X POST https://www.orelzilberman.com/admin/api/action \
  -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"botId":"jarvis","type":"approve","itemId":"memo"}'
```

Other shapes:

- Reject: `{"botId":"jarvis","type":"reject","itemId":"memo"}`
- Note on an item: `{"botId":"jarvis","type":"message","itemId":"memo","text":"Hold it until Friday."}`
- Note to a bot: `{"botId":"jarvis","type":"message","text":"Skip Reddit today."}`
- Refresh one bot: `{"botId":"jarvis","type":"refresh"}`
- Refresh now (the header button): `{"botId":"all","type":"refresh"}`

The action is stored as `pending`. If `BOTDASH_WEBHOOK_URL` is set, the server immediately POSTs this JSON and, on a 2xx, marks it `delivered`:

```json
{
  "id": "act-example",
  "botId": "jarvis",
  "type": "approve",
  "itemId": "memo",
  "text": null,
  "createdAt": "2026-11-12T08:05:00.000Z"
}
```

The webhook request uses `Authorization: <BOTDASH_WEBHOOK_AUTH>` when that env is set. A failed webhook leaves the action `pending` and records a short delivery error (status code only, never the auth header). The bot can still pick it up from pending-actions. After ack, status becomes `handled` and `resultNote` is the optional result.

Sign-in is `POST /admin/api/auth/login` with `{ "username", "password" }`. Sign-out is `POST /admin/api/auth/logout`.

## Deploy

Create a **new** Vercel project. Do not point the existing `orel-web` project at this folder.

Dashboard project:

- Name: `orel-bots-dashboard` (production URL `https://orel-bots-dashboard.vercel.app`). If Vercel assigns a different production hostname, change the two destinations in the repo root `vercel.json` to match, then redeploy the portfolio.
- Root Directory: `bots-dashboard`
- Framework preset: Next.js
- Build command: `npm run build` (default)
- Install command: `npm install` (default)
- Output directory: leave the Next.js default. Do not set a static export.
- Node.js: 22.x
- Environment variables: the table above. Connect a **private** Blob store so `BLOB_READ_WRITE_TOKEN` is created for you.
- Deployment Protection / Vercel Authentication: **off** for production. The portfolio rewrite cannot log into Vercel Authentication. This app has its own sign-in.

Portfolio project (`orel-web`):

- No new environment variables.
- Merge this branch. Root `vercel.json` and `next.config.js` both proxy `/admin` to the dashboard production URL.
- Redeploy `orel-web` from `master` after the dashboard production deploy exists, or the proxy will 404 until the target is up.
- If the dashboard production hostname is not `orel-bots-dashboard.vercel.app`, update the destination in both files.

Bots should call `https://www.orelzilberman.com/admin/api/status` (and the batch, pending, and ack URLs). They can also call the `orel-bots-dashboard.vercel.app` host directly if you prefer they not depend on the rewrite.

Times in the UI are `Asia/Jerusalem`. A bot with no update for 2 hours is marked stale.
