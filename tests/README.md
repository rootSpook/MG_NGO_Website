# Test Suite

## Overview

Three independent test layers:

| Layer | Runner | Needs emulator |
|-------|--------|---------------|
| **Unit** | Vitest | No |
| **Integration** | Vitest | Yes |
| **Security rules** | tsx (standalone script) | Yes |

---

## Commands

```bash
# Unit tests only (fast, no emulator needed)
npm run test:unit

# Integration tests (requires Firebase emulator)
npm run test:integration

# Firestore security rule tests (requires Firebase emulator)
npm run test:rules

# All tests (unit + integration — emulator required for integration)
npm run test

# Unit tests with coverage report
npm run test:coverage
```

---

## Prerequisites

For integration and security rules tests, start the Firestore emulator first:

```bash
# Install Java if not already installed (required by the emulator)
# Then:
npx firebase emulators:start --only firestore
```

The emulator must be running on `127.0.0.1:8080` before running `npm run test:integration` or `npm run test:rules`.

---

## File layout

```
tests/
  unit/
    slugify.test.ts           — slugify() pure function (12 cases)
    timestamps.test.ts        — tsToDateString(), tsToISOString() (6 cases)
    attachments.test.ts       — attachmentsFromContentItem() (5 cases)
    validation.test.ts        — Zod contact + volunteer schemas (16 cases)
    services.test.ts          — submitContactMessage(), submitVolunteerApplication() with mocked Firestore (16 cases)
    contactForm.handler.test.ts — contactFormToInput(), volunteerFormToInput() (13 cases)
  integration/
    contactMessage.flow.test.ts   — Visitor creates message, editor reads, forbidden fields blocked (5 cases)
    blog.flow.test.ts             — Blog CRUD: create, publish, public read, soft-delete, impersonation (7 cases)
    editor.blocked.test.ts        — Editor cannot access donations, settings, auditLogs, delete media (5 cases)
    unauth.blocked.test.ts        — Unauthed blocked from editor/admin collections (8 cases)
    editor.publishFlow.test.ts    — E2E: create → publish → public read; create → soft-delete → gone (2 cases)
    helpers/
      emulator.ts               — Shared RulesTestEnvironment factory + UID constants

  setup/
    unit.setup.ts         — Mocks @/lib/firebase/config; clears mocks between tests
    integration.setup.ts  — Sets FIRESTORE_EMULATOR_HOST env var

scripts/
  testSecurityRules.ts  — 45 Firestore security rule tests (tsx-driven, no framework)
```

---

## Notes

- Unit tests run in the `happy-dom` environment so `navigator.userAgent` is available for `submitContactMessage` tests.
- Integration tests are forced single-fork (`--pool forks --poolOptions.forks.singleFork`) so all suites share the same emulator connection without port conflicts.
- The integration test `projectId` is `ngo-mg-website-47a1a-test` (distinct from production `ngo-mg-website-47a1a`) so emulator data is isolated.
- Each integration test file calls `env.clearFirestore()` in `beforeEach` for a clean slate.
