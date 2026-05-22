import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: { "@": root },
  },
  test: {
    name: "unit",
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
    setupFiles: ["tests/setup/unit.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "lib/firebase/services.ts",
        "lib/firebase/editorServices.ts",
        "lib/firebase/adminServices.ts",
        "lib/firebase/navServices.ts",
        "lib/firebase/storageUtils.ts",
        "lib/firebase/clientApp.ts",
        "lib/firebase/getDefaultDb.ts",
        "lib/tenant/masterDb.ts",
        "lib/validation/**/*.ts",
      ],
    },
  },
});
