module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'airbnb',
        'airbnb-typescript',
        'prettier',
    ],
    ignorePatterns: ['!.*', 'dist', 'node_modules'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['react-refresh'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'react/react-in-jsx-scope': 'off',
        'react/jsx-uses-react': 'off',
        'react/require-default-props': ['error', { functions: 'defaultArguments' }],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
        'no-underscore-dangle': 'off',
        '@typescript-eslint/naming-convention': 'off',
        'no-plusplus': 'off',
        'import/extensions': [
            'error',
            {
                ignorePackages: true,
                pattern: {
                    js: 'never',
                    jsx: 'never',
                    ts: 'never',
                    tsx: 'never',
                    json: 'always',
                },
            },
        ],
    },
};
