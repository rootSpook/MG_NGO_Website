# Deployment Playbook — NGO-MG Website (ENS 491)

> **Tech stack**: Next.js 16 (App Router) + Firebase (Auth · Firestore · Storage)  
> **Hosting target**: Vercel (Next.js runtime) + Firebase (rules & backend services)

---

## Critical Architecture Note

The system prompt for this project assumed a plain React SPA deployed to Firebase Hosting. **This project is not a plain SPA.** It is a **Next.js 16 App Router application** with:

- Server-side API routes under `app/api/**` that use `firebase-admin`
- Next.js instrumentation hook (`instrumentation.ts`) that seeds Firestore on startup
- ISR-style caching via Next.js `unstable_cache`

**Firebase Hosting cannot run this application** — it only serves static files and cannot execute Node.js server code. The correct deployment target is **Vercel**, which has first-party Next.js support built in (it was created by the same team).

Firebase continues to manage Auth, Firestore, Storage, and security rules. Vercel only runs the Next.js application server.

---

## Phase 1: Environment & Secret Management

### 1.1 Create a Separate Production Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project: `ngo-mg-website-prod`.
2. Enable the same services as the dev project:
   - **Authentication** → Email/Password provider → authorized domains (add prod domain after setup)
   - **Firestore** → create database in production mode, same region as dev
   - **Storage** → default bucket
3. Your dev project (`ngo-mg-website-47a1a`) remains unchanged for local development.

### 1.2 Environment Variable Taxonomy

| Prefix | Where it lives | Visible in browser? |
|---|---|---|
| `NEXT_PUBLIC_*` | Client bundle (baked in at build time) | **Yes** |
| *(no prefix)* | Server only — API routes, instrumentation | No |

**Rule**: Firebase Client SDK keys use `NEXT_PUBLIC_`. Firebase Admin SDK credentials do **not**. Never swap these.

### 1.3 Obtain Firebase Admin SDK Credentials

1. Firebase Console → Project Settings → **Service accounts**
2. Click **Generate new private key** → download the JSON file
3. Extract these three fields from the JSON:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`
4. **Delete the JSON file** — never commit it. The `serviceAccountKey.json` pattern has been replaced with env vars in this project.

### 1.4 Configure Vercel Environment Variables

In the Vercel dashboard → Project → **Settings → Environment Variables**, add each variable from `.env.example` **twice** (once for each environment scope):

| Variable | Production scope | Preview scope |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Prod Firebase project values | Dev Firebase project values |
| `FIREBASE_ADMIN_*` | Prod service account values | Dev service account values |
| `NEXT_PUBLIC_SITE_URL` | `https://www.your-ngo-domain.org` | Your Vercel preview URL pattern |

> **Private key newlines**: Vercel's dashboard handles `\n` in private key values correctly. Paste the entire `-----BEGIN RSA PRIVATE KEY-----` block as-is — do not manually escape it.

### 1.5 Configure GitHub Secrets (for rules deployment only)

In the GitHub repository → **Settings → Secrets and variables → Actions**, add:

| Secret name | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_DEV` | Full JSON of dev project service account |
| `FIREBASE_SERVICE_ACCOUNT_PROD` | Full JSON of prod project service account |
| `DEV_FIREBASE_API_KEY` | Dev project API key |
| `DEV_FIREBASE_AUTH_DOMAIN` | Dev project auth domain |
| `DEV_FIREBASE_PROJECT_ID` | Dev project ID |
| `DEV_FIREBASE_STORAGE_BUCKET` | Dev project storage bucket |
| `DEV_FIREBASE_MESSAGING_SENDER_ID` | Dev project sender ID |
| `DEV_FIREBASE_APP_ID` | Dev project app ID |
| `DEV_FIREBASE_ADMIN_PROJECT_ID` | Dev admin project ID |
| `DEV_FIREBASE_ADMIN_CLIENT_EMAIL` | Dev admin client email |
| `DEV_FIREBASE_ADMIN_PRIVATE_KEY` | Dev admin private key |

> The `DEV_*` secrets are only used by the CI build job as placeholder values — they let the Next.js build compiler resolve `NEXT_PUBLIC_*` vars without failing. The Vercel deployment uses Vercel's own secret store, not GitHub secrets.

---

## Phase 2: Firebase Security Rules Deployment

The rules files are already production-grade. No content changes are needed.

### 2.1 Manual Deploy (one-time setup)

```bash
# Install Firebase CLI (already a devDependency)
npm install  # ensures firebase-tools is in node_modules/.bin

# Log in
npx firebase login

# Verify project aliases
npx firebase use

# Deploy rules to the DEV project (default)
npx firebase use default
npx firebase deploy --only firestore:rules,firestore:indexes,storage

# Deploy rules to the PROD project
npx firebase use prod
npx firebase deploy --only firestore:rules,firestore:indexes,storage
```

### 2.2 Automated Deploy (CI/CD)

The `.github/workflows/deploy-rules.yml` workflow handles automated rules deployment:
- **`develop` branch** → deploys to `ngo-mg-website-47a1a` (dev)
- **`main` branch** → deploys to `ngo-mg-website-prod` (prod), gated by the `production` GitHub Environment with required reviewer approval

Rules tests (`npm run test:rules`) must pass in the `ci.yml` workflow before merging to `main` (enforce this via branch protection).

### 2.3 Rollback Rules

If a rules deploy breaks the app:

```bash
# Revert the commit that changed the rules
git revert <bad-commit-sha>
git push origin main  # triggers automatic redeploy via the workflow

# Or immediately redeploy from a known-good commit
git checkout <good-commit-sha> -- firestore.rules storage.rules
git commit -m "revert: rollback rules to known-good state"
git push origin main
```

Firebase Console also retains a history of rule versions under **Firestore → Rules** tab.

---

## Phase 3: Hosting — Vercel Deployment

### 3.1 Connect the Repository to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub → select this repository
3. Vercel auto-detects Next.js 16 — accept the defaults:
   - **Framework**: Next.js
   - **Build command**: `npm run build`
   - **Output directory**: `.next` (Vercel sets this automatically)
   - **Install command**: `npm ci`
4. Add all environment variables (from Phase 1.4) before the first deploy
5. Click **Deploy**

### 3.2 Branch → Environment Mapping

| Branch | Vercel environment | Firebase project |
|---|---|---|
| `main` | Production | `ngo-mg-website-prod` |
| `develop` | Preview | `ngo-mg-website-47a1a` |
| Feature branches | Preview | `ngo-mg-website-47a1a` |

Vercel automatically creates unique preview URLs for every PR — each preview hits the dev Firebase project.

### 3.3 Why No `vercel.json`?

Vercel's zero-config Next.js support handles routing, rewrites, and SSR natively. A `vercel.json` is only needed if you want to:
- Override the serverless function region (e.g., `fra1` for Europe, closer to Firebase's EU region)
- Add custom headers not already in `next.config.mjs`

If you need region overrides, create `vercel.json`:

```json
{
  "functions": {
    "app/api/**/*.ts": {
      "regions": ["fra1"]
    }
  }
}
```

### 3.4 Storage CORS — One-Time Setup

Firebase Storage requires a CORS policy to allow uploads directly from the browser. Run this once after creating the production project:

```bash
# Install Google Cloud SDK or use Cloud Shell in the Firebase Console
# The cors.json file is already in the repository root

# Apply to dev bucket
gsutil cors set cors.json gs://ngo-mg-website-47a1a.firebasestorage.app

# Apply to prod bucket (update cors.json with your prod domain first)
gsutil cors set cors.json gs://ngo-mg-website-prod.firebasestorage.app

# Verify
gsutil cors get gs://ngo-mg-website-prod.firebasestorage.app
```

Update `cors.json` with your actual production domain before running the prod command.

### 3.5 Alternative: Firebase App Hosting (Bonus Path)

If you want everything inside the Firebase ecosystem, Firebase App Hosting (GA, May 2024) runs Next.js on Cloud Run. This requires:

1. **Billing enabled** on the prod Firebase project (Blaze plan)
2. An `apphosting.yaml` at the repo root:

```yaml
runConfig:
  runtime: nodejs20
  minInstances: 0
  maxInstances: 2

env:
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    secret: NEXT_PUBLIC_FIREBASE_API_KEY
  - variable: FIREBASE_ADMIN_PRIVATE_KEY
    secret: FIREBASE_ADMIN_PRIVATE_KEY
  # ... (repeat for all vars, storing them in Cloud Secret Manager)
```

3. Firebase Console → **App Hosting** → Create backend → link to GitHub repo → `main` branch

The existing `firebase.json` does **not** need a `"hosting"` block — App Hosting is configured entirely in the Console.

---

## Phase 4: CI/CD Pipeline

Two workflows handle the complete pipeline:

### `.github/workflows/ci.yml`
Runs on every push and pull request. Runs lint, unit tests, security rules tests, and a full Next.js build. All must pass before merging.

### `.github/workflows/deploy-rules.yml`
Runs only when rule files change. Deploys Firestore and Storage rules to the appropriate Firebase project based on branch.

**App deployment is handled by Vercel's native Git integration** — no GitHub Action is needed for that. Vercel watches the repository and deploys automatically on every push to `main`.

### Branch Protection Setup

In GitHub → Repository → **Settings → Branches → Add branch protection rule** for `main`:

- [x] Require a pull request before merging
- [x] Require status checks to pass: `CI / Lint · Test · Build`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings

### GitHub Environment Setup

In GitHub → Repository → **Settings → Environments** → create environment named `production`:

- Add required reviewers (at least one team member must approve before rules deploy to prod)
- This creates an approval gate that appears in the Actions UI before the `deploy-rules-prod` job runs

---

## Phase 5: Custom Domain & SSL

### 5.1 Add Domain in Vercel

1. Vercel dashboard → Project → **Settings → Domains**
2. Add `your-ngo-domain.org` and `www.your-ngo-domain.org`
3. Vercel shows the required DNS records:

| Type | Name | Value |
|---|---|---|
| `A` | `@` (apex domain) | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

> If your registrar does not support `CNAME` at the apex (`@`), use an `ALIAS` or `ANAME` record pointing to `cname.vercel-dns.com` instead. Some registrars (Namecheap, Cloudflare) support this.

### 5.2 Configure DNS at Your Registrar

Log in to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare) and add these records. Example for Cloudflare:

```
Type: A     | Name: @   | Content: 76.76.21.21       | Proxy: DNS only (grey cloud)
Type: CNAME | Name: www | Content: cname.vercel-dns.com | Proxy: DNS only
```

> **Do not proxy through Cloudflare** (orange cloud) if using Vercel — this causes SSL certificate conflicts. Set to "DNS only."

DNS propagation takes up to 48 hours, but typically 15–30 minutes.

### 5.3 SSL/TLS Certificate

Vercel provisions SSL certificates automatically via **Let's Encrypt** within minutes of DNS verification. You do not manage certificates manually. They auto-renew before expiry.

### 5.4 Update Firebase Auth Authorized Domains

After the domain is live, Firebase Auth will reject sign-in redirects from the new domain unless it is whitelisted:

1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Click **Add domain**
3. Add `www.your-ngo-domain.org` and `your-ngo-domain.org`

Repeat this for both the dev project (adding the Vercel preview URL pattern `*.vercel.app`) and the prod project.

---

## Phase 6: Post-Deployment Verification Checklist

Run these checks immediately after the first production deployment and after every major change.

### 6.1 Core Smoke Tests

- [ ] **Home page loads** — no console errors, no 404s on assets
- [ ] **Correct Firebase project** — open browser DevTools → Network → filter by `firestore.googleapis.com` → confirm the project ID in the URL matches the prod project
- [ ] **API routes respond** — `GET /api/public/home` returns 200 with data (confirms `firebase-admin` initialized correctly from env vars)
- [ ] **Authentication** — sign in with an admin account, verify the session persists after page reload
- [ ] **Admin panel loads** — navigate to `/admin` → redirects to `/admin/login` when unauthenticated ✓ → sign in → admin dashboard renders ✓
- [ ] **Firestore writes work** — create a draft blog post in the admin panel, publish it, verify it appears on the public `/blogs` page
- [ ] **Firestore security rules active** — open browser console, try `db.collection('staff').get()` as an unauthenticated user → should be rejected with "Missing or insufficient permissions"
- [ ] **Storage upload works** — upload an image in the admin panel, verify the public URL resolves
- [ ] **Storage CORS** — if direct browser upload fails, run `gsutil cors set cors.json gs://your-prod-bucket` (see Phase 3.4)
- [ ] **ISR / cache revalidation** — edit a published page in the CMS, verify the change appears on the public site within 5 minutes (or immediately on the next request after `revalidatePath` fires)
- [ ] **Security headers** — `curl -I https://www.your-ngo-domain.org` → verify `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy` are present
- [ ] **Donation flow** — test the full donate page flow end to end
- [ ] **Contact form** — submit a contact form, verify the message appears in the admin inbox
- [ ] **HTTPS redirect** — `curl -I http://www.your-ngo-domain.org` → should 301 redirect to `https://`
- [ ] **Lighthouse baseline** — run Lighthouse in Chrome on the home page, record performance/accessibility/SEO scores

### 6.2 Common Production Gotchas & Fixes

| Problem | Symptom | Fix |
|---|---|---|
| `firebase-admin` cold start crash | API routes return 500, Vercel logs show "Error: Failed to parse private key" | The `FIREBASE_ADMIN_PRIVATE_KEY` newlines are not being unescaped. Verify the env var in Vercel dashboard contains the full key with `\n` characters, and confirm `autoSeed.server.ts` does `.replace(/\\n/g, "\n")` |
| Wrong Firebase project in production | Admin panel writes go to dev Firestore | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` in Vercel's Production scope points to the dev project. Update it to the prod project ID and redeploy |
| Sign-in redirect fails | OAuth or email-link sign-in returns error after redirect | The production domain is not in Firebase Auth → Settings → Authorized domains |
| Images don't load via `next/image` | 400/502 on image URLs | `firebasestorage.googleapis.com` must be in `next.config.mjs` → `images.remotePatterns` (already configured) |
| Storage uploads fail from browser | CORS error in console | Run `gsutil cors set cors.json gs://your-prod-bucket` (see Phase 3.4) |
| Admin panel API route uses Edge runtime | `firebase-admin` throws "Cannot use Node.js modules" | Check for `export const runtime = 'edge'` in any API route that imports `firebase-admin` — remove it |
| Rules deploy breaks the live app | All Firestore reads return "permission denied" | Immediately roll back the rules commit (see Phase 2.3). Make `npm run test:rules` mandatory in CI |
| `NEXT_PUBLIC_*` change not reflected | Old values still in browser | These vars are baked in at build time. Changing them in Vercel → trigger a new deployment |
| Vercel preview deploys write to dev Firestore | Test data mixes with real data | This is by design (preview scope uses dev Firebase project). Acceptable for an NGO site. Document it for the team |

### 6.3 Ongoing Operations

- **Budget alerts**: Firebase Console → Project → Usage and billing → set monthly budget alerts at €5 and €20 to catch unexpected traffic
- **Error monitoring**: Enable Vercel Speed Insights and/or wire Sentry for production API route error tracking
- **Rules version history**: Firebase Console → Firestore → Rules tab shows the last 10 published rule sets with timestamps
- **Deployment history**: Vercel dashboard → Deployments → any past deployment can be "Promoted to Production" as a one-click rollback

---

## Summary of All Files Changed

| File | Change | Purpose |
|---|---|---|
| `.firebaserc` | **Created** | Project aliases (`default` = dev, `prod` = prod) for `firebase use` switching |
| `.env.production` | **Created** | Template for production env vars (real values in Vercel, never committed) |
| `.env.example` | **Updated** | Documents all required variables including new `FIREBASE_ADMIN_*` vars |
| `.gitignore` | **Updated** | Removed `.firebaserc` from ignore list (needed in CI); scoped env ignores |
| `firebase.json` | **Updated** | Added Storage emulator port; no hosting block (Vercel handles that) |
| `lib/firebase/autoSeed.server.ts` | **Updated** | Migrated from `serviceAccountKey.json` file read → env var credentials |
| `cors.json` | **Created** | Firebase Storage CORS policy, applied once via `gsutil cors set` |
| `.github/workflows/ci.yml` | **Created** | Lint + unit tests + rules tests + build gate on every PR |
| `.github/workflows/deploy-rules.yml` | **Created** | Automated Firestore/Storage rules deploy on rule file changes |
| `DEPLOYMENT.md` | **Created** | This file — comprehensive deployment playbook |
