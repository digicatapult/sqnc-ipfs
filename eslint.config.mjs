import prettier from 'eslint-plugin-prettier'
import globals from 'globals'
import babelParser from '@babel/eslint-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['**/node_modules', '**/package.json', '**/coverage'],
  },
  ...compat.extends('eslint:recommended', 'prettier'),
  {
    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: babelParser,
      ecmaVersion: 12,
      sourceType: 'module',

      parserOptions: {
        requireConfigFile: false,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'no-console': 2,
    },
  },
  {
    files: ['**/test/**/*.test.js'],

    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },

    rules: {
      'prettier/prettier': 'error',
    },
  },
]
