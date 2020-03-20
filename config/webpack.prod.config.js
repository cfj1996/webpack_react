const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");
const fs = require("fs");
const resolveApp = relativePath => path.resolve(fs.realpathSync(process.cwd()), relativePath);
const webpackConfig = require("./webpack.config");
module.exports = (env) => {
	return merge(webpackConfig(env), (env) => ({
		bail: true,
		mode: "production",
		output: {
			// The build folder.
			path: resolveApp("dist"),
			// In development, it does not produce real files.
			filename: "static/js/[name].[hash:8].js",

			futureEmitAssets: true,
			chunkFilename: "static/js/[name].[hash:8].chunk.js",
			// We inferred the "public path" (such as / or /my-project) from homepage.
			// We use "/" in development.
			// Point sourcemap entries to original disk location (format as URL on Windows)
			devtoolModuleFilenameTemplate: info =>
				path.relative(resolveApp("src"), info.absoluteResourcePath).replace(/\\/g, "/"),

			// Prevents conflicts when multiple Webpack runtimes (from different apps)
			// are used on the same page.
		},
		devtool: "source-map",
		optimization: {
			splitChunks: {
				chunks: "all"
			}
		},
		public: [
			new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
			new CaseSensitivePathsPlugin(),
		]
	}));
};
