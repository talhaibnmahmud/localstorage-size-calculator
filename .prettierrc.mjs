/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  $schema: "https://json.schemastore.org/prettierrc",
  semi: true,
  tabWidth: 2,
  singleQuote: false,
  printWidth: 100,
  trailingComma: "es5",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cn", "tw"],
};
