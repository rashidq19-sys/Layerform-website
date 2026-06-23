# Layerform website

The one-page marketing site for Layerform System Ltd. Static HTML + Tailwind. No build step.

## What is in this folder

```
site/
  index.html                  the one-page site
  privacy.html                short, honest privacy policy
  favicon.ico, favicon.svg    favicon set
  apple-touch-icon.png        180 px icon for iOS home-screen
  og-image.png                1024x1024 social share image
  images/
    logo-primary.svg          horizontal logo for light backgrounds
    logo-on-dark.svg          horizontal logo for dark backgrounds
    mark.svg                  layered mark only
    dspops-screenshot.svg     placeholder (live link is the proof)
    estate-revenue-manager.svg  placeholder, swap with real screenshot
    case-management.svg       placeholder, swap with real screenshot
```

## How to swap the screenshots

Drop your real screenshots into `site/images/` and overwrite each placeholder, keeping the file names the same:

- `estate-revenue-manager.svg` -> replace with `estate-revenue-manager.png` (or `.jpg`)
- `case-management.svg` -> replace with `case-management.png` (or `.jpg`)
- `dspops-screenshot.svg` -> optional, replace with a real DSPOps screenshot

If you change the file extension, update the matching `<img src=...>` line in `index.html`. Recommended dimensions, **1280 x 800** (16:10). Compress before uploading; aim for under 200 KB each.

## How to deploy to Railway

Railway hosts the site as a tiny Node service running `server.mjs`, which serves the static files. The `package.json`, `server.mjs` and the rest of this `site/` folder are everything Railway needs.

### Project layout on Railway

- Project: `layerform`
- Service: `web` (auto-builds on push, runs `node server.mjs`)
- Environment: `production`
- Default URL: `web-production-2af33.up.railway.app`

### Redeploying after edits

The easiest path is the Railway CLI, run from this `site/` folder:

```sh
# One-time, get a project token from Railway dashboard:
# Project -> Settings -> Tokens -> New Token (production environment)
export RAILWAY_TOKEN=<your-project-token>

# Deploy any time you change files in this folder:
npx @railway/cli@latest up --service web --detach --ci
```

The first deploy of a new project also needs `railway link --project <project-id>` once, but after that the `.railway/` link file in this directory makes `railway up` enough.

### Connecting via Git (recommended longer-term)

Push this project to GitHub, then in Railway:
1. **New** -> **GitHub Repo** -> pick the repo.
2. Root directory, set to `site` (so Railway looks inside this folder, not the project root).
3. Railway auto-detects the `package.json` and runs `npm install` + `npm start`.
4. Every push to `main` redeploys.

### Connect the custom domain

The canonical domain is `www.layerformsystem.co.uk`. The bare apex `layerformsystem.co.uk` forwards to it via Squarespace's domain forwarding, because Squarespace does not allow CNAME records at the apex.

DNS at Squarespace:

| Setting | Where | Value |
|---------|-------|-------|
| `www` CNAME | DNS Settings -> Custom Records (or Custom Preset) | `o5l77690.up.railway.app` |
| Apex 301 forward | Domain settings -> Forwarding | `https://www.layerformsystem.co.uk/` |

If the Railway CNAME target ever changes (Railway re-issues it when domains are re-added), get the current value from the **Settings -> Networking -> Custom Domains** panel on the `web` service.

**Why www, not apex:** Squarespace returns "CNAME records cannot be added to the root of your domain" because the DNS spec forbids CNAME on an apex alongside SOA. Some providers (Cloudflare, Route 53) get round this with ALIAS/ANAME flattening; Squarespace does not, so we forward the apex instead. If DNS ever moves to Cloudflare, we can switch back to a CNAME at apex and drop the forwarding.

## Editing copy

All visible text lives in `index.html`. Search for a phrase, edit it, save, redeploy. Voice rules (locked in `WEBSITE-BRIEF.md`):
- UK spelling, plain English, first person.
- No long dashes. Use commas, full stops, or brackets.
- No fake numbers. Only `over 15 years` is the approved figure.

## Performance note, optional next step

v1 loads Tailwind via the Play CDN script (`cdn.tailwindcss.com`), which generates the CSS on the fly in the browser. That is fine for a low-traffic single-page site. For maximum speed (smaller payload, no FOUC), you can later run Tailwind's CLI once to produce a static `styles.css`, drop the `<script src="https://cdn.tailwindcss.com">` tag from `index.html` and `privacy.html`, and link the built CSS file instead. Not required for launch.

## Booking link

Every "Book a call" button points to `https://cal.eu/layerform/discovery-call` (Cal.com EU instance, confirmed working). If you ever move the calendar to `cal.com`, search-and-replace the URL across `index.html` and `privacy.html`.

## Local preview

To run the site locally for editing:

```sh
# From the project root (parent of site/):
npx serve site -p 4321 --no-clipboard

# Or run the same server Railway runs:
cd site
npm install
npm start
```

The site will be at http://localhost:4321 (or whatever port `npm start` reports). The `.claude/launch.json` at the project root also pre-configures this for the Claude Code preview pane.
