import typescript from '@rollup/plugin-typescript';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));
const peerDependencies = Object.keys(packageJson.peerDependencies);

/** @type RollupOptions */
const buildOptions = {
	input: packageJson.source,
	external: peerDependencies,
	plugins: [
		typescript({
			include: ['src/**/*.ts'],
			declaration: true,
			declarationDir: '.',
		}),
	],
	output: [
		{
			file: packageJson.main,
			sourcemap: true,
			format: 'cjs',
		},
		{
			file: packageJson.module,
			sourcemap: true,
			format: 'es',
		},
	],
};

export default buildOptions;
