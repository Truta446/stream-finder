import { defineConfig, globalIgnores } from "eslint/config"
import coreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Purely stylistic; literal quotes/apostrophes in prose are fine.
      "react/no-unescaped-entities": "off",
    },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts"]),
])
