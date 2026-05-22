import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const BASE_PROJECT_ID = "ngo-mg-website-47a1a-test";

/**
 * Each call receives a unique project ID derived from the caller's file path.
 * This gives every test file its own isolated Firestore namespace on the
 * emulator, so concurrent `clearFirestore()` calls in different suites cannot
 * wipe each other's staff seed data.
 */
export async function newEnv(suite?: string): Promise<RulesTestEnvironment> {
  const rules = readFileSync(join(process.cwd(), "firestore.rules"), "utf-8");
  const projectId = suite ? `${BASE_PROJECT_ID}-${suite}` : BASE_PROJECT_ID;
  return initializeTestEnvironment({
    projectId,
    firestore: { rules, host: "127.0.0.1", port: 8080 },
  });
}

export const ADMIN_UID = "it-admin";
export const EDITOR_UID = "it-editor";
