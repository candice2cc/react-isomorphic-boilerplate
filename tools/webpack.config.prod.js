/**
 * client和server两端生产环境webpack配置
 * @author Candice
 * @date 2018/6/6 20:39
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


// const extractSass = new ExtractTextPlugin({
//   filename: 'css/[name].[contenthash:8].css',
//   allChunks: true,
// });

module.exports = [
  {
    mode: 'production',
    name: 'client',
    context: path.resolve(__dirname, '..'),
    entry: {
      app: './client',
      vendor: [
        'react',
        'react-dom',
        // ...
      ]
    },
    output: {
      path: path.resolve(__dirname, '../dist/client'),
      filename: 'js/[name].[chunkhash:8].js',
      chunkFilename: 'js/chunk.[name].[chunkhash:8].js',
      publicPath: '/public/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              envName: 'client',
            }
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader', // creates style nodes from JS strings
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',

              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[ext]?[hash:5]',
              },

            },
          ],

        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)[?\w#]*$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[ext]?[hash:5]',
              },

            },
          ],
        },
        {
          test: /\.(mp4|mov|webm|ogg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'video/[name].[ext]?[hash:5]',
              },

            },
          ],
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
            options: {
              attrs: [':data-src', 'img:src', 'video:poster', 'source:src', 'object:data'],
            },
          },
        },
      ]

    },
    resolve: {
      extensions: ['.js', '.json', '.scss'],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/chunk.[name].[contenthash:8].css'
      }),
      new OptimizeCSSAssetsPlugin(),
      new CleanWebpackPlugin([path.resolve(__dirname, '../dist/client')], {root: path.join(__dirname, '../')}),
      // generate manifest.json
      new ManifestPlugin(),

      // use NamedModulesPlugin in during development for more readable output
      new webpack.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/server/homeProd.hbs'),
        template: './server/views/home.hbs',
        inject: true,
        hash: false,

      }),
    ],


  },
  {
    name: 'server',
    context: path.resolve(__dirname, '..'),
    entry: {
      app: './server/server.prod',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../dist/server'),
      chunkFilename: 'chunk.[name].js',
      libraryTarget: 'commonjs2',
      publicPath: '/public/'
    },
    target: 'node',
    node: {
      __filename: true,
      __dirname: true
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              envName: 'server',
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'css-loader/locals', // translates CSS into CommonJS
              options: {
                modules: true,
                importLoaders: 1,
                // localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
                localIdentName: '[local]___[hash:base64:5]'
              }
            },
            {
              loader: 'sass-loader' // compiles Sass to CSS
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[ext]?[hash:5]'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.scss'],
    },
    plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, '../dist/server')], {root: path.join(__dirname, '../')}),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        },
      }),
    ]
  }
];
