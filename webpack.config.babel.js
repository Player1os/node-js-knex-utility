// Load the package file.
import packageConfig from './package.json'

// Expose the configuration object.
export default {
	entry: [
		'babel-polyfill',
		'./src/index.ts',
	],
	output: {
		filename: './lib/index.js',
	},
	target: 'node',
	externals: Object.keys(packageConfig.dependencies || {})
		.reduce((externals, dependencyName) => {
			externals[dependencyName] = `commonjs ${dependencyName}`
			return externals
		}, {}),
	node: {
		__filename: true,
		__dirname: true,
	},
	module: {
		loaders: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			loader: 'babel-loader!ts-loader'
		}],
	},
	resolve: {
		extensions: [
			'.ts',
			'.js',
		],
	},
	devtool: 'source-map',
}
