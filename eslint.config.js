import js from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import unicorn from 'eslint-plugin-unicorn'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLParagraphElement: 'readonly',
        HTMLHeadingElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLTextAreaElement: 'readonly',
        React: 'readonly',
        fetch: 'readonly',
        RequestInit: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      unicorn,
      'jsx-a11y': jsxA11y,
      '@next/next': nextPlugin,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...unicorn.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/filename-case': 'off',
      semi: 'off',
      '@typescript-eslint/semi': 'off',
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        global: 'readonly',
      },
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]
