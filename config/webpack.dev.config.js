const merge = require("webpack-merge");
const path = require("path");
const webpackConfig = require("./webpack.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const fs = require("fs");
const resolveApp = relativePath => path.resolve(fs.realpathSync(process.cwd()), relativePath);

module.exports = (env) => {
	return merge(webpackConfig(env), {
		plugins: [
			new HtmlWebpackPlugin(
				Object.assign({},
					{
						template: resolveApp("public/index.html"),
						inject: true,
					},
					env.production ? {
						minify: {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyJS: true,
							minifyCSS: true,
							minifyURLs: true,
						}
					} : undefined)
			),
			new CleanWebpackPlugin(),
			new webpack.HotModuleReplacementPlugin(),
		],
		devServer: {
			port: "8080",
			contentBase: resolveApp("public"),
			compress: true,
			historyApiFallback: true,
			hot: true,
			https: false,
			noInfo: true,
			open: true,
			proxy: {}
		}
	});
};




