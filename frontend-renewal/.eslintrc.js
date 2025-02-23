// eslint-disable-next-line no-undef
module.exports = {
  root: true,

  ignorePatterns: ['node_modules', 'dist', 'components.d.ts', '*.min.js'],

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'prettier', 'import', 'sort-class-members', '@stylistic/ts'],

  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        endOfLine: 'auto',
        printWidth: 100,
      },
    ],

    semi: ['error', 'always'],
    quotes: ['warn', 'single', { allowTemplateLiterals: true }],
    'no-undef': 'error',
    // 'no-unused-expressions': 'error',
    // 객체 리터럴에 대한 메서드 및 속성 단축 구문을 요구하거나 허용하지 않습니다.
    'object-shorthand': 'error',
    // 가져오기, 내보내기 및 구조화 해제된 할당의 이름을 동일한 이름으로 바꾸는 것을 허용하지 않습니다.
    'no-useless-rename': 'error',
    'no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: false }],

    'class-methods-use-this': 'warn',

    'require-await': 'error',

    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-acces': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unsafe-declaration-merging': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', args: 'none', ignoreRestSiblings: false },
    ],

    '@stylistic/ts/lines-between-class-members': [
      'error',
      {
        enforce: [
          { blankLine: 'always', prev: '*', next: 'field' },
          { blankLine: 'never', prev: 'field', next: '*' },
          { blankLine: 'always', prev: '*', next: 'method' },
        ],
      },
    ],

    // Plugin Import
    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
      },
    ],

    'import/no-extraneous-dependencies': 'off',

    // Plugin sort-class-members
    'sort-class-members/sort-class-members': [
      2,
      {
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
        ],
        accessorPairPositioning: 'getThenSet',
      },
    ],
  },

  overrides: [
    {
      files: ['*.ts'],

      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      settings: {
        'import/resolver': {
          node: {
            extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
          },
        },
      },
      env: {
        es6: true,
        browser: true,
        node: true,
      },

      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { vars: 'all', args: 'none', ignoreRestSiblings: false },
        ],
      },
    },

    {
      files: ['*.tsx'],

      extends: [
        'plugin:react/recommended',
        'plugin:import/recommended',
        'plugin:@tanstack/query/recommended',
      ],
      plugins: ['prettier', 'import'],
      settings: {
        react: {
          version: 'detect', // React 버전을 자동으로 감지하도록 설정
        },
      },

      parser: '@typescript-eslint/parser',
      env: {
        es6: true,
        browser: true,
        node: true,
      },

      rules: {
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
        'linebreak-style': 0,
        'no-nested-ternary': 0,
        'no-param-reassign': ['error', { props: false }],
        'react/no-unknown-property': ['error', { ignore: ['css'] }],
        'react/react-in-jsx-scope': 0,
        'react/function-component-definition': 0,
        'react/jsx-filename-extension': [
          2,
          {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        ],
        'react/prop-types': 0,
        'react-hooks/exhaustive-deps': 0,
        'react/jsx-props-no-spreading': 0,
        'react/jsx-no-undef': 0,
        'no-undef': 0,
      },
    },

    {
      files: ['*.js', '*.mjs'],

      parserOptions: {
        ecmaVersion: 2023,
      },

      env: {
        es6: true,
      },

      rules: {},
    },
  ],
};
