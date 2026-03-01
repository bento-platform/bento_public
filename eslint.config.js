const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const react = require("eslint-plugin-react");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");

const {
    fixupConfigRules,
} = require("@eslint/compat");

const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },

        globals: {
            ...globals.browser,
            ...globals.node,
        },
    },

    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
    },

    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/jsx-runtime",
    )),

    rules: {
        "react/prop-types": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "no-unused-vars": "off",

        "@typescript-eslint/no-unused-vars": ["error", {
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/consistent-type-imports": "error",

        "comma-dangle": ["error", {
            arrays: "always-multiline",
            objects: "always-multiline",
            imports: "always-multiline",
            exports: "always-multiline",
        }],

        semi: ["error", "always"],
        "react/react-in-jsx-scope": "off",
        "react-hooks/exhaustive-deps": ["error"],
    },

    settings: {
        react: {
            version: "detect",
        },
    },
}]);
