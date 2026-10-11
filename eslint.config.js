import eslint from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/**", "build/**", "node_modules/**", "coverage/**"] },
  eslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
