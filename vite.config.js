import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        create: resolve(__dirname, "pages/create.html"),
        login: resolve(__dirname, "pages/login.html"),
        profile: resolve(__dirname, "pages/profile.html"),
        register: resolve(__dirname, "pages/register.html"),
        tasks: resolve(__dirname, "pages/tasks.html"),
      },
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: [
      "./src/tests/integration/setup/firebaseTestSetup.ts"
    ]
  }
});
