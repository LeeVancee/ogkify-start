//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      'node_modules/**',
      '.git/**',
      '.output/**',
      '.vercel/**',
      'src/components/ui/**',
      'components/ui/**',
      'generated/**',
      '.nitro',
      '*.config.js',
      '*.config.ts',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'off',
    },
  },
]
