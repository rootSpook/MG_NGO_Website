# Authentication Flow

## Overview

The management panel uses **Firebase Authentication** with the Email/Password provider. There are no self-registration or password-reset flows exposed to the public — accounts are created exclusively by running the seed script (see [SETUP.md](./SETUP.md)).

Authentication state is managed globally via a React Context (`AuthContext`) and route protection is enforced at the layout level using Next.js App Router route groups.

---

## Role-Based Access Model

All authenticated staff have a document in the `staff/{uid}` Firestore collection. The `role` field on that document determines what a user can do.

| Capability | Admin | Editor |
|---|:---:|:---:|
| Read published public content | ✓ | ✓ |
| Manage blog posts, events, announcements | ✓ | ✓ |
| Upload and manage media assets | ✓ | ✓ |
| Read and update contact message workflow | ✓ | ✓ |
| Create audit log entries | ✓ | ✓ |
| Manage site settings | ✓ | — |
| Manage staff accounts | ✓ | — |
| Manage MG info pages and reports | ✓ | — |
| Delete media assets | ✓ | — |
| Read donation records | ✓ | — |
| Write to categories / tags structure | ✓ | ✓ |

> Security is enforced at the **database and storage level** via Firebase Security Rules — not just by hiding UI elements.

---

## Authentication Flow Step by Step

```
User submits email + password on /admin/login
        │
        ▼
signInWithEmailAndPassword(auth, email, password)
        │  Firebase Auth verifies credentials
        ▼
onAuthStateChanged fires with Firebase User object
        │
        ▼
getDoc(db, "staff", user.uid)
        │  Fetches role from Firestore
        ▼
AuthContext sets: user, role, loading = false
        │
        ▼
Login page detects user → router.replace("/admin")
        │
        ▼
AdminRouteGuard renders children (dashboard)
```

### Logout

```
logout() called
        │
        ▼
signOut(auth)
        │  Firebase clears local session
        ▼
onAuthStateChanged fires with null
        │
        ▼
AuthContext sets: user = null, role = null
        │
        ▼
AdminRouteGuard detects no user → router.replace("/admin/login")
```

---

## Session Persistence

Firebase Auth uses `indexedDB` to persist the session token locally. When the user refreshes the page:

1. The app mounts and `AuthContext` sets `loading = true`
2. `onAuthStateChanged` fires immediately with the cached user (if the token is still valid)
3. The role is re-fetched from Firestore
4. `loading` is set to `false` and the app renders normally

The user **does not need to log in again** after a page refresh. Sessions persist until the user explicitly logs out or the Firebase ID token expires and cannot be refreshed.

---

## Route Protection

### File structure

```
app/
├── layout.tsx                    ← Root layout; mounts AuthProvider via <Providers>
└── admin/
    ├── layout.tsx                ← Bare pass-through (no guard)
    ├── login/
    │   └── page.tsx              ← Public — accessible without authentication
    └── (protected)/
        ├── layout.tsx            ← Mounts AdminRouteGuard
        └── page.tsx              ← /admin dashboard (and all future CMS pages)
```

### How AdminRouteGuard works

`components/AdminRouteGuard.tsx` wraps every page inside `app/admin/(protected)/`:

1. While `loading` is `true` (auth state not yet resolved) → renders a full-screen spinner
2. If `user` is `null` after loading → `router.replace("/admin/login")`
3. If `user` is set → renders `children`

The route group `(protected)` is invisible in the URL — `/admin/(protected)/page.tsx` maps to `/admin`. The login page at `app/admin/login/page.tsx` sits **outside** the group and therefore outside the guard.

### Login page redirect

The login page also checks auth state on mount:

- If the user is already authenticated → `router.replace("/admin")` (prevents re-login)
- If not authenticated → renders the login form
