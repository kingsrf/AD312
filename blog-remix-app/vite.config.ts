import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig(() => {
  const isTest = process.env.VITEST === "true";

  return {
    plugins: isTest ? [] : [reactRouter()],

    resolve: {
      tsconfigPaths: true,
    },

    test: {
      environment: "jsdom",
      setupFiles: ["./app/test/setup.ts"],
      globals: true,
    },
  };
});
