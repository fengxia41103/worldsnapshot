module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      jsx: true,
      modules: true,
      legacyDecorators: true,
    },
    sourceType: "module",
    useJSXTextNode: false,
    requireConfigFile: false,
  },
  extends: ["airbnb", "prettier", "plugin:compat/recommended"],
  plugins: ["unused-imports"],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    page: true,
  },
  rules: {
    "react/jsx-filename-extension": [1, { extensions: [".js"] }],
    "react/jsx-wrap-multilines": 0,
    "react/prop-types": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-one-expression-per-line": 0,
    "import/no-unresolved": [2, { ignore: ["^@/", "^umi/"] }],
    "import/no-extraneous-dependencies": [
      2,
      {
        optionalDependencies: true,
        devDependencies: ["**/tests/**.js", "/mock/**/**.js", "**/**.test.js"],
      },
    ],

    // allow unary operator in loop, but not anywhere else
    // allowForLoopAfterthoughts: true,

    "import/no-cycle": 0,
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "linebreak-style": 0,
    "no-console": 1,
    "no-param-reassign": 0,

    // allow `_id` because it's mongo PK name
    "no-underscore-dangle": ["error", { allow: ["_id", "__ALL_TABLE__"] }],
    // "no-unused-vars": ["error", { args: "none" }],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        "": "never",
      },
    ],
    "no-bitwise": 0,
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
  settings: {
    polyfills: ["fetch", "promises", "url", "object-assign"],
    "import/resolver": {
      node: {
        extensions: [".js", ".json"],
      },
    },
  },
};
