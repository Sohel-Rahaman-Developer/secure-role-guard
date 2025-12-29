import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "core/index": "src/core/index.ts",
    "react/index": "src/react/index.tsx",
    "adapters/index": "src/adapters/index.ts",
    "adapters/express": "src/adapters/express.ts",
    "adapters/nextjs": "src/adapters/nextjs.ts",
  },
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react"],
});
