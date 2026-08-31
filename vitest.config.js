import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

const FULL = { statements: 100, functions: 100, lines: 100 };

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify(version),
	},
	test: {
		environment: 'jsdom',
		environmentOptions: { jsdom: { url: 'http://localhost:5174/' } },
		globals: false,
		setupFiles: ['./test/setup.js'],
		include: ['test/**/*.test.js'],
		restoreMocks: true,
		unstubEnvs: true,
		unstubGlobals: true,
		sequence: { shuffle: false },
		coverage: {
			provider: 'v8',
			reporter: ['text'],
			include: [
				'src/data/**/*.js',
				'src/utils/**/*.js',
				'src/features/**/*.js',
				'src/ui/categories.js',
				'src/ui/segmented.js',
				'src/ui/table.js',
				'src/ui/ui.js',
				'src/app/i18n.js',
			],
			thresholds: {
				'src/data/**/*.js': { ...FULL, branches: 95 },
				'src/utils/**/*.js': { 100: true },
				'src/features/**/*.js': { ...FULL, branches: 89 },
				'src/ui/categories.js': { 100: true },
				'src/ui/segmented.js': { 100: true },
				'src/ui/ui.js': { 100: true },
				'src/ui/table.js': { functions: 100, lines: 100, statements: 99, branches: 95 },
				'src/app/i18n.js': { ...FULL, branches: 92 },
			},
		},
	},
});
