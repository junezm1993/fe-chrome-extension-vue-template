const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function configFunc(env) {
  const isDevMode = env.NODE_ENV === 'development' || env.NODE_ENV === 'test';
  const config = {
    devtool: false,
    context: path.resolve(__dirname, './src'),
    entry: {
      options: './options/index.js',
      popup: './popup/index.js',
      background: './background/index.js',
      contentScripts: './contentScripts/index.js',
      search: './contentScripts/search.js',
      inject: './inject/index.js',
      remote: './remote/index.js',
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      publicPath: '.',
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            // extractCSS: !isDevMode,
          },
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
        },
        {
          test: /\.scss$/,
          use: [
            // isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'vue-style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.sass$/,
          use: [
            // isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'vue-style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              // eslint-disable-next-line
              options: { implementation: require('sass') },
            },
          ],
        },
        {
          test: /\.styl$/,
          use: [
            // isDevMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
            'vue-style-loader',
            'css-loader',
            'stylus-loader',
          ],
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|eot|ttf|woff|woff2?)$/,
          loader: 'url-loader',
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          loader: 'file-loader',
          options: {
            name: '/assets/[name].[ext]?[hash]',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        vue$: 'vue/dist/vue.runtime.esm.js',
        // 'jquery': path.resolve(__dirname, '/node_modules/jquery/src/jquery')
      },
    },
    optimization: {
      minimize: !isDevMode
    },
    plugins: [
      new webpack.ProvidePlugin({ $: 'jquery', jQuery:'jquery' }),
      new VueLoaderPlugin(),
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new CopyWebpackPlugin([
        { from: 'assets', to: 'assets' },
        { from: 'manifest.json', to: 'manifest.json', flatten: true },
      ]),
      new HtmlWebpackPlugin({
        title: 'Options',
        template: './index.html',
        filename: 'options.html',
        chunks: ['options'],
      }),
      new HtmlWebpackPlugin({
        title: 'Popup',
        template: './index.html',
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new webpack.DefinePlugin({
        'process.env.TM_ENV': JSON.stringify(env.NODE_ENV)
      })
    ],
  };

  /**
   * Adjust rendererConfig for production settings
   */
  if (isDevMode) {
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new ExtensionReloader({
        contentScript: 'contentScripts',
        background: 'background',
        extensionPage: 'popup',
        options: 'options',
      })
    )
  }
  return config;
}

module.exports = configFunc;
