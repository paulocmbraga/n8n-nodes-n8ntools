module.exports = {
	extends: [
		'eslint:recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	env: {
		node: true,
		es2020: true,
	},
	ignorePatterns: ['dist/**', 'node_modules/**'],
	rules: {
		'no-unused-vars': 'off', // Desabilitar para TypeScript
		'no-console': 'warn',
		'prefer-const': 'error',
		'no-case-declarations': 'off', // Permitir declarações em case
		'no-undef': 'off', // Desabilitar pois TypeScript já verifica
	},
};