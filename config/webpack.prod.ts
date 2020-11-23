import * as Merge from 'webpack-merge';
import * as Common from './webpack.common';

module.exports = Merge( Common, {
	mode: 'production',
	devtool: 'source-map',
	module: {
		rules: [ {
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						[ '@babel/preset-env', {
							'corejs': '3',
							'useBuiltIns': 'usage'
						} ]
					],
					plugins: [ '@babel/plugin-transform-runtime' ]
				}
			}
		} ]
	}
} );