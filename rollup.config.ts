import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));
const peerDependencies = Object.keys(packageJson.peerDependencies);

const buildOptions: RollupOptions = {
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

// TODO: build types

export default buildOptions;
