import * as Path from 'path';
import * as HtmlPlugin from 'html-webpack-plugin';

const appDir = Path.dirname( __dirname );

module.exports = {
	context: Path.join( __dirname, '../src' ),
	entry: [ './main.ts' ],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [ 'style-loader', 'css-loader' ],
			}
		]
	},
	resolve: {
		extensions: [ '.ts', '.tsx', '.js', '.css', '.scss' ],
		modules: [
			Path.resolve( appDir, 'src' ),
			Path.resolve( appDir, 'node_modules' )
		],
		alias: {
			'src': Path.resolve( appDir, 'src/' )
		}
	},
	output: {
		filename: 'bundle.js',
		path: Path.resolve( __dirname, '../dist' ),
	},
	target: 'web',

	plugins: [
		new HtmlPlugin( {
			file: Path.join( __dirname, 'dist', 'index.html' ),
			template: './index.html'
		} )
	]
};