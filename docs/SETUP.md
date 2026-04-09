# Project Setup

Step-by-step guide for getting the project running locally from scratch.

---

## Prerequisites

- **Node.js** 18 or later — [nodejs.org](https://nodejs.org)
- **npm** 9 or later (bundled with Node.js)
- A Firebase project with the following services enabled:
  - Authentication (Email/Password provider)
  - Cloud Firestore
  - Firebase Storage

---

## 1. Clone the repo and install dependencies

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

---

## 2. Set up environment variables

Copy the example file and fill in your Firebase project values:

```bash
cp .env.example .env
```

Open `.env` and set each variable. You can find all values in the Firebase Console under **Project Settings → General → Your apps → SDK setup and configuration**.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> `.env` is git-ignored and must never be committed.

---

## 3. Get a Firebase service account key

The bootstrap script (step 4) uses the Firebase Admin SDK, which requires a service account key.

1. Open the Firebase Console
2. Go to **Project Settings → Service Accounts**
3. Click **Generate New Private Key**
4. Save the downloaded file as `serviceAccountKey.json` in the **project root**

> `serviceAccountKey.json` is git-ignored. Never commit it.

---

## 4. Bootstrap the project

Run the single bootstrap script to initialize all Firebase resources in one command:

```bash
npx tsx scripts/bootstrap.ts
```

This script runs three steps in sequence:

1. **Staff accounts** — creates Admin and Editor accounts in Firebase Auth and their `staff/{uid}` Firestore documents
2. **Settings** — creates the `settings/site` document with MG Foundation data
3. **Starter collections** — seeds initial documents in `categories`, `tags`, `contentItems`, and `events`

The script is idempotent — safe to run multiple times. Existing documents are skipped.

**Default credentials (change these before going to production):**

| Role | Email | Password |
|---|---|---|
| Admin | admin@mgfoundation.org | `Admin123!` |
| Editor | editor@mgfoundation.org | `Editor123!` |

> **Production note:** These passwords are temporary placeholders. Update them immediately in the Firebase Console under **Authentication → Users** before deploying.

---

## 5. Deploy Firestore security rules

```bash
# First-time only: log in and select your project
npx firebase login
npx firebase use ngo-mg-website-47a1a

# Deploy rules
npx firebase deploy --only firestore:rules
```

---

## 6. Deploy Storage security rules

```bash
npx firebase deploy --only storage
```

To deploy both Firestore and Storage rules in one command:

```bash
npx firebase deploy --only firestore:rules,storage
```

---

## 7. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

The management panel is at [http://localhost:3000/admin](http://localhost:3000/admin) — unauthenticated access redirects to `/admin/login`.

---

## Summary of important files

| File | Purpose |
|---|---|
| `.env` | Local Firebase config (git-ignored) |
| `.env.example` | Template for `.env` — commit this |
| `serviceAccountKey.json` | Firebase Admin SDK key (git-ignored) |
| `lib/firebase/config.ts` | Firebase client SDK initialization |
| `lib/firebase/AuthContext.tsx` | Auth state provider |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Storage security rules |
| `firebase.json` | Firebase CLI configuration |
| `scripts/bootstrap.ts` | Single bootstrap script — runs all setup steps |
