import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      'dist/',
      'coverage/',
      'eslint.config.js',
      '*.js'
    ],
  },
  ...compat.extends('airbnb-base'),
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'max-len': 'off',
      'no-alert': 'off',
      'global-require': 'off',
      'no-console': 'warn',
      'no-continue': 'off',
      'no-restricted-syntax': 'off',
      'no-shadow': 'off',
      'comma-dangle': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'import/no-duplicates': 'warn',
      semi: ['error', 'never'],
      indent: 'off',
      'import/extensions': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
)
