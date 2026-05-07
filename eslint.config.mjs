import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // Vendored shadcn/ui components and test/script files don't need app lint rules.
    ignores: ["components/ui/**", "tests/**", "scripts/**"],
  },
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // setState-in-effect and purity are React Compiler rules; they flag valid
      // initialization patterns (e.g. reading window.innerWidth once on mount).
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      // Project uses Turkish copy with apostrophes/quotes — escaping adds noise.
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
