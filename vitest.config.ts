import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

// Root config runs all suites (unit + integration).
// Use vitest.unit.config.ts or vitest.integration.config.ts for targeted runs.
export default defineConfig({
  resolve: {
    alias: { "@": root },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "lib/firebase/services.ts",
        "lib/firebase/editorServices.ts",
        "lib/validation/**/*.ts",
      ],
    },
  },
});
