/**
 * @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions & import('@trivago/prettier-plugin-sort-imports').PluginConfig}
 */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  bracketSpacing: true,
  arrowParens: "always",
  bracketSameLine: false,
  embeddedLanguageFormatting: "auto",
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "always",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: false,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: true,

  tailwindAttributes: ["class", "className", "ngClass", ".*[cC]lassName"],
  tailwindFunctions: ["clsx", "cn"],
  tailwindStylesheet: "./src/index.css",

  overrides: [
    {
      files: ["**/package.json"],
      options: {
        useTabs: false,
      },
    },
    {
      files: ["**/*.mdx"],
      options: {
        proseWrap: "preserve",
        htmlWhitespaceSensitivia: "ignore",
      },
    },
  ],
};
