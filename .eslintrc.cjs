module.exports = {
  root: true,
  env: {
    es2021: true
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: true,
    tsconfigRootDir: __dirname
  },

  plugins: ["prettier", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "prettier/prettier": ["error"],
    "no-console": ["error", { allow: ["log", "warn", "error"] }]
  }
};
