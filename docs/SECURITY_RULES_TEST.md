# Security Rules Testing

## Why the emulator is required

Firebase Security Rules can only be tested accurately using the **Firebase Local Emulator Suite**. The Admin SDK (used in `bootstrap.ts`, `createUsers.ts`, etc.) bypasses all security rules by design — it always has full access regardless of what the rules say.

The test script uses `@firebase/rules-unit-testing`, which creates isolated test clients pointing at the emulator. Each client carries a specific auth context (unauthenticated, editor, or admin), so the rules evaluate exactly as they would in production.

---

## Setup

### 1. Install Java

The Firebase emulator requires Java 11 or later.

```bash
java -version
```

If not installed: [adoptium.net](https://adoptium.net)

### 2. Install the Firestore emulator

```bash
npx firebase setup:emulators:firestore
```

### 3. Start the emulator

Open a terminal and start the Firestore emulator. Keep it running during tests.

```bash
npx firebase emulators:start --only firestore
```

The emulator UI will be available at [http://127.0.0.1:4000](http://127.0.0.1:4000).

### 4. Run the test script

In a second terminal:

```bash
npx tsx scripts/testSecurityRules.ts
```

---

## What is tested

The script runs **37 test cases** across three roles. Each test asserts either that an operation **succeeds** or that it is **denied** by the rules.

### Public visitor (unauthenticated)

| # | Operation | Expected |
|---|---|:---:|
| 1 | Read `settings/site` | ✅ Allow |
| 2 | Read a published `contentItem` | ✅ Allow |
| 3 | Read `categories` | ✅ Allow |
| 4 | Read `tags` | ✅ Allow |
| 5 | Read a published `event` | ✅ Allow |
| 6 | Create `contactMessage` with allowed fields only | ✅ Allow |
| 7 | Read `staff` collection | ❌ Deny |
| 8 | Read `contactMessages` | ❌ Deny |
| 9 | Read a draft `contentItem` | ❌ Deny |
| 10 | Write to `settings/site` | ❌ Deny |
| 11 | Write to `contentItems` | ❌ Deny |
| 12 | Read `donations` | ❌ Deny |
| 13 | Read `auditLogs` | ❌ Deny |
| 14 | Create `contactMessage` with forbidden fields (e.g. `status`) | ❌ Deny |

### Editor

| # | Operation | Expected |
|---|---|:---:|
| 15 | Read a draft `contentItem` | ✅ Allow |
| 16 | Create a `contentItem` with own UID stamps | ✅ Allow |
| 17 | Update a `contentItem` with own UID stamp | ✅ Allow |
| 18 | Read `contactMessages` | ✅ Allow |
| 19 | Update contact message workflow fields (`status`, `handledBy`, etc.) | ✅ Allow |
| 20 | Write to `settings/site` | ❌ Deny |
| 21 | Write to `staff` documents | ❌ Deny |
| 22 | Delete a `mediaAsset` | ❌ Deny |
| 23 | Read `donations` | ❌ Deny |
| 24 | Create `contentItem` stamped with another user's UID | ❌ Deny |

### Admin

| # | Operation | Expected |
|---|---|:---:|
| 25 | Read and write `settings/site` | ✅ Allow |
| 26 | Read a draft `contentItem` | ✅ Allow |
| 27 | Write `contentItems` without UID restriction | ✅ Allow |
| 28 | Delete a `contentItem` | ✅ Allow |
| 29 | Read `staff` documents | ✅ Allow |
| 30 | Write `staff` documents | ✅ Allow |
| 31 | Read `contactMessages` | ✅ Allow |
| 32 | Read `donations` | ✅ Allow |
| 33 | Read `auditLogs` | ✅ Allow |
| 34 | Delete a `mediaAsset` | ✅ Allow |

---

## Manual live-environment checklist

If the emulator is unavailable, you can manually verify the most critical rules against the live project using the Firebase Console's **Rules Playground** (Firestore → Rules → Rules Playground tab).

Key scenarios to check manually:

- [ ] Unauthenticated read of `settings/site` → allowed
- [ ] Unauthenticated read of `staff/any-uid` → denied
- [ ] Unauthenticated write to `settings/site` → denied
- [ ] Editor write to `settings/site` → denied
- [ ] Editor delete of `mediaAssets/any` → denied
- [ ] Admin read of `donations/any` → allowed
- [ ] Unauthenticated read of `donations/any` → denied

---

## Expected output

```
── Public visitor (unauthenticated) ────────────────────────────

  ✅ PASS  CAN read settings/site
  ✅ PASS  CAN read a published contentItem
  ...
  ✅ PASS  CANNOT read staff collection
  ...

── Editor ──────────────────────────────────────────────────────

  ✅ PASS  CAN read a draft contentItem
  ...

── Admin ───────────────────────────────────────────────────────

  ✅ PASS  CAN read and write settings/site
  ...

════════════════════════════════════════════════════════════════
  Results: 34 passed, 0 failed
════════════════════════════════════════════════════════════════
```

A non-zero exit code means one or more rules are not behaving as expected. Check the `❌ FAIL` lines and compare against `firestore.rules`.
