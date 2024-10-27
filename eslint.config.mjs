// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config({
    languageOptions: {
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    files: ["**/*.ts"],
    extends: [
        eslint.configs.recommended,
        // @ts-ignore
        ...tseslint.configs.recommendedTypeChecked,
        // @ts-ignore
        eslintConfigPrettier
    ],
    rules: {
        "no-console": "error",
        "no-useless-catch": 0,
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        "@typescript-eslint/no-unused-vars": [
            "error",
            {
                args: "all",
                argsIgnorePattern: "^_",
                caughtErrors: "all",
                caughtErrorsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                ignoreRestSiblings: true
            }
        ]
    },
    ignores: ["node_modules", "dist", "**/*.spec.ts", "tests"]
});
