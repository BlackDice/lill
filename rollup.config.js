import babel from 'rollup-plugin-babel'

export default {
	entry: 'src/lill.js',
	format: 'cjs',
	exports: 'named',
	plugins: [babel()],
	dest: 'dist/lill.js',
}
