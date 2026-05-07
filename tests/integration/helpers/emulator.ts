import {
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_ID = "ngo-mg-website-47a1a-test";

export async function newEnv(): Promise<RulesTestEnvironment> {
  const rules = readFileSync(join(process.cwd(), "firestore.rules"), "utf-8");
  return initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules, host: "127.0.0.1", port: 8080 },
  });
}

export const ADMIN_UID = "it-admin";
export const EDITOR_UID = "it-editor";
