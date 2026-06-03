import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // No @vitejs/plugin-react needed — Vitest uses esbuild to transform TSX
  // natively when environment is happy-dom and JSX is set below.
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: { "@": root },
  },
  test: {
    name: "unit",
    globals: true,
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
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
        "components/admin/shared/ImageUploadWithUrl.tsx",
        "components/admin/shared/FileUploadWithUrl.tsx",
        "components/admin/shared/ImageUploadField.tsx",
      ],
    },
  },
});
