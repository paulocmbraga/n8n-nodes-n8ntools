module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.ts'],
	collectCoverageFrom: [
		'nodes/**/*.ts',
		'credentials/**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/dist/**'
	],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
	setupFilesAfterEnv: [],
	transform: {
		'^.+\.ts$': 'ts-jest'
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	maxWorkers: 1,
	testTimeout: 10000
};