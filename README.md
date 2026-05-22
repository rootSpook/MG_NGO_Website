# MG Foundation — NGO Website

A full-stack web application for the **Myasthenia Gravis Foundation of Turkey**, built with Next.js 16 and Firebase. The project serves as both a public-facing website and a content management system (CMS) for foundation staff.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Security](#security)
- [Documentation](#documentation)

---

## Overview

The MG Foundation website provides:

- A **public-facing site** in Turkish with information about Myasthenia Gravis, foundation activities, events, blogs, and donation campaigns.
- A **staff CMS** with role-based access for Admins and Editors to manage all site content.
- A **Firebase backend** for authentication, database, and file storage, with Vercel as the hosting platform.

**Firebase Projects:**
- Development: `ngo-mg-website-47a1a`
- Production: `ngo-mg-website-prod`

---

## Tech Stack

### Frontend
| Tool | Version | Purpose |
|---|---|---|
| Next.js (App Router) | 16.2.3 | Framework, SSR, routing |
| React | 19.2.4 | UI rendering |
| TypeScript | 5.7.3 | Type safety |
| Tailwind CSS | 4.2.4 | Styling |
| Radix UI + shadcn/ui | latest | Accessible UI components |
| React Hook Form + Zod | 7.54.1 / 3.24.1 | Forms and validation |
| Recharts | 2.15.0 | Analytics charts |
| Marked + DOMPurify | 13.0.3 / 3.12.0 | Safe Markdown rendering |
| Lucide React | 0.564.0 | Icons |
| next-themes | 0.4.6 | Dark/light mode |
| Sonner | 1.7.1 | Toast notifications |

### Backend
| Tool | Version | Purpose |
|---|---|---|
| Firebase Client SDK | 12.12.0 | Auth, Firestore, Storage (client) |
| Firebase Admin SDK | 13.8.0 | Server-side auth, privileged DB writes |
| Next.js API Routes | — | Server-side endpoints (Node.js runtime) |
| Vercel Analytics | 1.6.1 | Usage analytics |

### Developer Tools
| Tool | Version | Purpose |
|---|---|---|
| Vitest | 2.1.9 | Unit and integration testing |
| @firebase/rules-unit-testing | 5.0.0 | Firestore security rules testing |
| happy-dom | 15.11.7 | DOM simulation for tests |
| Firebase Emulator Suite | — | Local Firebase emulation |
| ESLint | 9.39.4 | Linting |

---

## Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (theme, nav, analytics)
│   ├── page.tsx                # Home page
│   ├── providers.tsx           # Auth context + theme providers
│   ├── blogs/[slug]/           # Blog detail page
│   ├── events/                 # Events listing
│   ├── donate/                 # Donation page
│   ├── about/                  # About pages
│   ├── volunteer/              # Volunteer application form
│   ├── contacts/               # Contact form
│   ├── mg/[slug]/              # Dynamic MG info pages
│   ├── pages/[slug]/           # Custom editable pages (page builder)
│   ├── media/                  # Public media gallery
│   ├── reports/                # Reports listing
│   ├── privacy/ terms/ legal/  # Legal pages
│   │
│   ├── admin/                  # Admin CMS (protected)
│   │   ├── login/              # Login page (public)
│   │   └── (protected)/        # Route group guarded by AdminRouteGuard
│   │
│   ├── editorPanel/            # Editor CMS interface
│   │   ├── dashboard/
│   │   ├── blog-posts/
│   │   ├── events/
│   │   ├── announcements/
│   │   ├── media/
│   │   ├── calendar/
│   │   ├── performance-review/
│   │   └── help/
│   │
│   ├── pageManagement/         # Page builder UI
│   │
│   └── api/public/             # Server-side API routes
│       ├── home/route.ts
│       ├── blogs/[slug]/route.ts
│       ├── donate/route.ts
│       ├── contacts/route.ts
│       ├── about/route.ts
│       ├── media/route.ts
│       └── reports/route.ts
│
├── components/                 # Reusable React components
│   ├── AdminRouteGuard.tsx     # Auth-based route protection
│   ├── EditorRouteGuard.tsx    # Role-based route protection
│   ├── admin/                  # Admin panel components
│   ├── blocks/                 # Page builder blocks (Hero, RichText, etc.)
│   ├── donate/                 # Donation flow components
│   ├── editorPanel/            # CMS interface components
│   ├── layout/                 # Header, Footer, NavProvider
│   ├── media/                  # Media upload and display
│   ├── reports/                # Reports display
│   ├── theme/                  # Theme and color customization
│   └── ui/                     # shadcn/ui primitives (40+ components)
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts           # Firebase client SDK init
│   │   ├── AuthContext.tsx     # Auth state provider
│   │   ├── services.ts         # Public Firestore queries
│   │   ├── editorServices.ts   # Editor/admin CRUD operations
│   │   ├── adminServices.ts    # Admin-only operations
│   │   ├── navServices.ts      # Navigation menu queries
│   │   ├── storageUtils.ts     # File upload/delete
│   │   ├── helpers.ts          # Firestore utility functions
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── constants.ts        # Collection names, status enums
│   │   ├── seedData.ts         # Fallback seed data
│   │   ├── autoSeed.server.ts  # One-time bootstrap script
│   │   └── validation/forms.ts # Zod schemas
│   ├── publicContent.ts
│   ├── publicPagesContent.ts
│   └── utils.ts
│
├── context/
│   └── EditorPanelContext.tsx  # Editor panel global state
│
├── types/
│   ├── pageBuilder.ts          # Block type definitions
│   └── editorPanel.ts          # CMS state types
│
├── hooks/                      # Custom React hooks
├── styles/globals.css          # Tailwind + CSS variables
├── public/                     # Static assets
│
├── tests/
│   ├── unit/                   # Pure function and validation tests
│   ├── integration/            # Firestore + auth flow tests
│   └── setup/                  # Test configuration
│
├── scripts/
│   ├── bootstrap.ts            # One-time project initialization
│   └── testSecurityRules.ts    # Security rules test runner
│
├── docs/                       # Internal documentation
│   ├── SETUP.md
│   ├── AUTH_FLOW.md
│   └── SECURITY_RULES_TEST.md
│
├── .github/workflows/
│   ├── ci.yml                  # Lint, test, build pipeline
│   └── deploy-rules.yml        # Firebase rules deployment
│
├── firebase.json               # Firebase CLI config
├── firestore.rules             # Firestore security rules
├── firestore.indexes.json      # Composite query indexes
├── storage.rules               # Cloud Storage security rules
├── cors.json                   # Storage CORS policy
├── .firebaserc                 # Firebase project aliases
├── next.config.mjs             # Next.js config + security headers
├── DEPLOYMENT.md               # Deployment playbook
└── .env.example                # Required environment variables
```

---

## Features

### Public Website
| Page | Path | Description |
|---|---|---|
| Home | `/` | Hero, about section, quick links, supporters |
| Blog | `/blogs` | Blog listing with categories and tags |
| Blog Detail | `/blogs/[slug]` | Full post with Markdown rendering |
| Events | `/events` | Upcoming events with registration |
| Donate | `/donate/[id]` | Campaign detail and IBAN info |
| About | `/about` | Foundation mission, vision, board members |
| MG Info | `/mg/[slug]` | Dynamic MG disease information pages |
| Custom Pages | `/pages/[slug]` | Fully editable pages via page builder |
| Volunteer | `/volunteer` | Public volunteer application form |
| Contact | `/contacts` | Public contact form |
| Media | `/media` | Public media gallery |
| Reports | `/reports` | Foundation reports listing |
| Legal | `/privacy`, `/terms`, `/legal` | Legal content pages |

### Admin CMS (`/admin`)
- Staff account management and role assignment
- Site settings (branding, colors, navigation)
- Full CRUD on all content types
- Donation and contact record management
- Performance analytics and reports

### Editor CMS (`/editorPanel`)
- Blog post authoring with draft → review → publish workflow
- Event management with attendee tracking
- Announcement management
- Media upload and gallery management
- Contact message workflow (status updates)
- Calendar view for events

### Page Builder
- Block-based editor for custom pages
- Block types: Hero, RichText, Accordion, Image, Video, and more
- Live preview and reorder support

---

## Architecture

```
Browser
  │
  ├── Next.js App Router (Vercel)
  │   ├── Server Components → Firebase Admin SDK → Firestore
  │   ├── API Routes (/api/public/*) → Firebase Admin SDK → Firestore
  │   └── Client Components → Firebase Client SDK → Firestore / Auth / Storage
  │
  └── Firebase Services
      ├── Firebase Auth (email/password)
      ├── Firestore (primary database)
      └── Cloud Storage (media files)
```

### Caching Strategy
- Site settings cached with `unstable_cache()` — 5-minute TTL
- Navigation config cached — 60-second TTL
- Admin panel calls `revalidatePath()` after saves to immediately bust cache

### Content Workflow
```
Draft → In Review → Published → Archived
```
All state transitions are tracked with server timestamps. Deleted content uses soft deletion (`deletedAt` timestamp) rather than hard removal, preserving the audit trail.

---

## Database Schema

### Firestore Collections

| Collection | Public Read | Auth Write | Admin Only | Description |
|---|:---:|:---:|:---:|---|
| `settings` | Yes | No | Write | Site branding, colors, URLs |
| `staff/{uid}` | No | Own doc | Full access | User roles and login metadata |
| `contentItems` | Published only | Editor+ | Delete | Blog posts, pages, FAQs, policies |
| `contentItems/{id}/revisions` | No | Append only | Read | Immutable content audit trail |
| `categories` | Yes | No | Write | Content categories |
| `tags` | Yes | No | Write | Content tags |
| `mediaAssets` | Public only | Editor+ | Delete | Uploaded files (images, docs, video) |
| `events` | Published only | Editor+ | Delete | Event listings |
| `events/{id}/registrations` | No | Create only | Read | Public event registrations |
| `campaigns` | Active/Draft | No | Full | Donation campaigns |
| `donations` | No | No | Read | Donation records (server writes only) |
| `contactMessages` | No | Create only | Full | Contact form submissions |
| `announcements` | Published only | Editor+ | Delete | Site announcements |
| `volunteerApplications` | No | Create only | Full | Volunteer signup submissions |
| `auditLogs` | No | Create only | Read | Append-only activity log |
| `ibanEntries` | Yes | No | Write | IBAN/bank info for donations |
| `boardMembers` | Yes | No | Write | Foundation leadership |
| `supporters` | Yes | No | Write | Foundation supporters |
| `notifications` | Self only | Self only | Write | In-app staff notifications |

### Content Types
Content items use a unified `contentItems` collection with a `type` field:
- `"page"` — static pages
- `"post"` — blog posts
- `"news"` — news items
- `"faq"` — FAQ entries
- `"policy"` — legal/policy documents

### Content Status
```
"draft" | "inReview" | "published" | "archived"
```

---

## Authentication & Authorization

### Authentication Flow
```
1. User submits email/password at /admin/login
2. Firebase Auth issues a JWT token
3. onAuthStateChanged fires in AuthContext
4. AuthContext fetches staff/{uid} doc to read role
5. Route guards (AdminRouteGuard / EditorRouteGuard) evaluate role
6. User is redirected to their dashboard or back to login
```

### Roles

| Role | Access |
|---|---|
| `admin` | Full CRUD on all collections, staff management, site settings, donations |
| `editor` | Create/update blog posts, events, announcements; manage media; handle contact workflows |
| Public | Read published content only; create contact/volunteer/registration submissions |

Authorization is enforced at **three layers**:
1. **Firestore security rules** — server-enforced, cannot be bypassed
2. **Route guards** — UI-layer redirects (`AdminRouteGuard`, `EditorRouteGuard`)
3. **API routes** — Firebase Admin SDK token verification

### User Management
- Users are created manually via the bootstrap script (no self-registration)
- Staff accounts are stored in both Firebase Auth and the `staff` Firestore collection
- Session persistence uses IndexedDB (browser)

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values.

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Firebase project API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Firebase Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Cloud Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | Firebase app instance ID |
| `FIREBASE_ADMIN_PROJECT_ID` | Server only | Admin SDK project ID |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Server only | Service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Server only | Service account private key |
| `NEXT_PUBLIC_SITE_URL` | Client | Canonical site URL (used for SEO) |

> **Security note:** `FIREBASE_ADMIN_*` variables are never bundled into the client. They are only available in Next.js API routes and server components.

---

## Local Development

### Prerequisites
- Node.js 20+
- Java 17+ (required for Firebase Emulator)
- Firebase CLI: `npm install -g firebase-tools`

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd <project-directory>

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in Firebase credentials in .env.local

# 4. Start the Firebase emulator
firebase emulators:start

# 5. Run the bootstrap script (first time only)
# Creates initial admin/editor accounts and default site settings
npx tsx scripts/bootstrap.ts

# 6. Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

Firebase Emulator UI is available at `http://localhost:4000`.

### Emulator Ports

| Service | Port |
|---|---|
| Firestore | 8080 |
| Cloud Storage | 9199 |
| Emulator UI | 4000 |

For detailed setup instructions, see [docs/SETUP.md](docs/SETUP.md).

---

## Testing

### Test Suites

| Suite | Command | Runner | Count | Scope |
|---|---|---|---|---|
| Unit | `npm run test:unit` | Vitest + happy-dom | ~57 cases | Pure functions, validation, form schemas |
| Integration | `npm run test:integration` | Vitest + Firebase Emulator | ~27 cases | Firestore CRUD, auth flows, access control |
| Security Rules | `npm run test:rules` | tsx + rules-unit-testing | ~45 cases | Firestore and Storage access rules |
| All + Coverage | `npm run coverage` | Vitest | — | Combined coverage report |

### Running Tests

```bash
# Unit tests (no emulator required)
npm run test:unit

# Integration tests (requires Firebase Emulator running)
npm run test:integration

# Security rules tests (starts emulator automatically)
npm run test:rules

# Full coverage report
npm run coverage
```

### Key Test Files

| File | Description |
|---|---|
| `tests/unit/validation.test.ts` | Zod schema validation (16 cases) |
| `tests/unit/services.test.ts` | Mock Firestore operations (16 cases) |
| `tests/unit/slugify.test.ts` | String utility functions |
| `tests/unit/timestamps.test.ts` | Date formatting helpers |
| `tests/integration/blog.flow.test.ts` | Full blog CRUD workflow |
| `tests/integration/contactMessage.flow.test.ts` | Contact form submission and editor handling |
| `tests/integration/editor.blocked.test.ts` | Role-based access denial |
| `tests/integration/editor.publishFlow.test.ts` | Draft → publish workflow |
| `scripts/testSecurityRules.ts` | Firestore/Storage security rules validation |

See [tests/README.md](tests/README.md) for full documentation.

---

## Deployment

### Infrastructure

| Component | Platform | Trigger |
|---|---|---|
| Next.js App | Vercel | Push to `main` (auto-deploy) |
| Firestore Rules | Firebase | GitHub Actions on rule file changes |
| Storage Rules | Firebase | GitHub Actions on rule file changes |
| Firestore Indexes | Firebase | GitHub Actions on index file changes |

### Branch → Environment Mapping

| Branch | Vercel Environment | Firebase Project |
|---|---|---|
| `main` | Production | `ngo-mg-website-prod` |
| `develop` | Preview | `ngo-mg-website-47a1a` (dev) |
| Feature branches | Preview | `ngo-mg-website-47a1a` (dev) |

### Manual Deployment

```bash
# Deploy Firebase rules and indexes to dev
firebase deploy --only firestore:rules,firestore:indexes,storage

# Deploy to production
firebase use prod
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase use default
```

For the full deployment playbook including Vercel setup, environment variable configuration, and post-deployment verification, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## CI/CD Pipeline

### `ci.yml` — Runs on every push and pull request

```
Checkout
  → Node.js 20 + Java 17 setup
  → npm install
  → ESLint (npm run lint)
  → Unit tests (npm run test:unit)
  → Security rules tests (npm run test:rules)
  → Production build (npm run build)
```

All steps must pass before a PR can be merged to `main`.

### `deploy-rules.yml` — Runs on changes to Firebase config files

Triggered by changes to:
- `firestore.rules`
- `storage.rules`
- `firestore.indexes.json`
- `firebase.json`
- `.firebaserc`

Workflow:
- Push to `develop` → deploys to dev Firebase project automatically
- Push to `main` → deploys to prod Firebase project (requires manual approval via GitHub Environment)

---

## Security

### Headers
`next.config.mjs` applies strict HTTP security headers to all responses:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`

### XSS Prevention
All Markdown content is sanitized with `isomorphic-dompurify` before being rendered in the browser.

### Firestore Security Rules
Rules enforce role-based access at the database level — not just the UI. Key principles:
- Unauthenticated users can only read published content
- Editors can create and update content; they cannot delete or access financial data
- Admins have full access
- Audit logs and revision history are append-only (cannot be modified or deleted)
- Donation records can only be written server-side (no client writes)

### Storage Security
- CORS policy configured in `cors.json` restricts browser-direct uploads to authorized origins
- Storage rules mirror Firestore role checks

### Secrets Management
- Firebase Admin credentials (`FIREBASE_ADMIN_*`) are stored in GitHub Secrets and Vercel environment variables only — never committed to the repository
- `.env.local` is in `.gitignore`

---

## Documentation

| Document | Location | Description |
|---|---|---|
| Local Setup | [docs/SETUP.md](docs/SETUP.md) | Step-by-step local development and bootstrap guide |
| Auth Flow | [docs/AUTH_FLOW.md](docs/AUTH_FLOW.md) | Authentication architecture and flow diagrams |
| Security Rules Testing | [docs/SECURITY_RULES_TEST.md](docs/SECURITY_RULES_TEST.md) | How to write and run Firestore rules tests |
| Deployment Playbook | [DEPLOYMENT.md](DEPLOYMENT.md) | Full production deployment guide (6 phases) |
| Test Suite | [tests/README.md](tests/README.md) | Test overview and how to run each suite |
| Analysis Report | [docs/Analysis Report.docx](docs/Analysis%20Report.docx) | Project analysis document |

---

## Available Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test:unit    # Run unit tests
npm run test:integration  # Run integration tests (requires emulator)
npm run test:rules   # Run security rules tests
npm run coverage     # Run all tests with coverage report
```
