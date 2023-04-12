module.exports = {
  extends: [ `next`, `prettier`, `plugin:@typescript-eslint/recommended` ],
  parser: `@typescript-eslint/parser`,
  plugins: [ `@typescript-eslint` ],
  root: false,
  rules: {
    "object-curly-spacing": [ 2, `always` ],
    "array-bracket-spacing": [ 2, `always` ],
    "space-before-blocks": [ 2, `always` ],
    "react/jsx-curly-brace-presence": [
      `error`,
      { props: `never`, children: `always` },
    ],
    "@next/next/no-html-link-for-pages": `off`,
    "react/jsx-key": `off`,
    "turbo/no-undeclared-env-vars": `off`,
    "react-hooks/exhaustive-deps": `off`,
    "react/react-in-jsx-scope": `off`,
    "react/jsx-first-prop-new-line": [ 2, `multiline` ],
    "react/jsx-max-props-per-line": [ 2, { maximum: 1, when: `multiline` } ],
    "react/jsx-closing-bracket-location": [ 2, `tag-aligned` ],
    "@typescript-eslint/no-unused-vars": [ 0, { argsIgnorePattern: `^_` } ],
    "@typescript-eslint/no-explicit-any": `off`,
    "@typescript-eslint/ban-ts-comment": `off`,
    "@typescript-eslint/member-delimiter-style": [
      2,
      {
        multiline: { delimiter: `none`, requireLast: true },
        singleline: { delimiter: `comma`, requireLast: false },
      },
    ],
    "func-style": [ `warn`, `declaration`, { allowArrowFunctions: true } ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [ `.ts`, `.tsx` ],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
