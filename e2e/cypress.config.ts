import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env["CYPRESS_BASE_URL"] ?? "http://localhost:4321",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    retries: { runMode: 0, openMode: 0 },
  },
});
