/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true, "vitest-globals/env": true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:vitest/recommended",
    "plugin:vitest-globals/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh", "vitest"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "vitest/expect-expect": [
      "error",
      { assertFunctionNames: ["expect", "testHelper*"] },
    ],
  },
};
