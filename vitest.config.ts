import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // You can use (describe, it, expect) without import them in every file
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // setupFiles: "./tests/setup.ts"
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/generated/"],
    },
  },
});
