"use strict";
const path = require("path");
const fs = require("fs");
const eslint = require("eslint");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");

const resolveApp = relativePath => path.resolve(fs.realpathSync(process.cwd()), relativePath);
module.exports = env => {
	const getStyleLoaders = (cssOptions, preProcessor) => {
		const loaders = [
			require.resolve("style-loader"),
			env.production && {
				loader: MiniCssExtractPlugin.loader,
				options: resolveApp("../")
			},
			{
				loader: require.resolve("css-loader"),
				options: cssOptions,
			},
			{
				// Options for PostCSS as we reference these options twice
				// Adds vendor prefixing based on your specified browser support in
				// package.json
				loader: require.resolve("postcss-loader"),
				options: {
					// Necessary for external CSS imports to work
					// https://github.com/facebook/create-react-app/issues/2677
					ident: "postcss",
					plugins: () => [
						require("postcss-flexbugs-fixes"),
						require("postcss-preset-env")({
							autoprefixer: {
								flexbox: "no-2009",
							},
							stage: 3,
						}),
						require("postcss-normalize")(),
					],
					sourceMap: false,
				},
			},
		].filter(Boolean);
		if (preProcessor) {
			loaders.push(
				{
					loader: require.resolve("resolve-url-loader"),
					options: {
						sourceMap: false,
					},
				},
				{
					loader: require.resolve(preProcessor),
					options: {
						sourceMap: true,
					},
				}
			);
		}
		return loaders;
	};
	return {
		mode: env.production ? "production" : "development",
		entry: {
			app: resolveApp("src/index.js")
		},
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
		resolve: {
			extensions: [".js", ".jsx", ".ts", ".tsx"]
		},
		module: {
			strictExportPresence: true,
			rules: [
				{ parser: { requireEnsure: false } },
				{
					test: /\.(js|mjs|jsx|ts|tsx)$/,
					enforce: "pre",
					use: [
						{
							options: {
								formatter: require.resolve("react-dev-utils/eslintFormatter"),
								eslintPath: require.resolve("eslint"),
								resolvePluginsRelativeTo: __dirname,
								baseConfig: (() => {
									const eslintCli = new eslint.CLIEngine();
									let eslintConfig;
									try {
										eslintConfig = eslintCli.getConfigForFile(resolveApp(".eslintrc.json"));
									} catch (e) {
										// A config couldn't be found.
									}
									// We allow overriding the config only if the env variable is set
									if (eslintConfig) {
										return eslintConfig;
									} else {
										return {
											extends: [require.resolve("eslint-config-react-app")],
										};
									}
								})(),
								ignore: false,
								useEslintrc: false,
							},
							loader: require.resolve("eslint-loader"),
						},
					],
					include: resolveApp("src"),
				},
				{
					oneOf: [
						{
							test: /\.(png|jpg|gif|woff|svg|eot|woff2|tff)$/,
							loader: require.resolve("url-loader"),
							options: {
								limit: 1000,
								name: "static/media/[name].[hash:8].[ext]",
							},
						},
						{
							test: /\.(js|mjs|jsx|ts|tsx)$/,
							include: resolveApp("src"),
							loader: require.resolve("babel-loader"),
							options: {
								sourceMaps: false,
								plugins: [["import", { libraryName: "antd-mobile", libraryDirectory: "es", style: "css" }]]
							}
						},
					]
				},
				{
					test: /.css$/,
					exclude: /\.global\.css$/,
					use: getStyleLoaders({ importLoaders: 1 })
				},
				{
					test: /\.less$/,
					exclude: /\.global\.less$/,
					use: getStyleLoaders({
						importLoaders: 2,
						modules: true
					}, "less-loader"),
					sideEffects: true,
				},
				{
					test: /\.global\.less$/,
					use: getStyleLoaders({ importLoaders: 2, }, "less-loader"),
				},
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "static/css/[name].[hash:8].css",
				chunkFilename: "static/css/[name].[hash:8].chunk.css",
			}),
			new HtmlWebpackPlugin(
				{
					template: resolveApp("public/index.html"),
					filename: "index.html",
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
					},
				}
			),
			new CopyWebpackPlugin([ // 复制插件
				{ from: resolveApp("public/favicon.ico"), to: resolveApp("dist") }
			]),
			new InterpolateHtmlPlugin(HtmlWebpackPlugin, {
				"PUBLIC_URL": "."
			}),
		],
		devtool: "inline-source-map",
	};
};
