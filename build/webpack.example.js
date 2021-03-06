const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const fs =require('fs')
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// const config = require('./config');



const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = {
    mode: process.env.NODE_ENV,
    entry: './examples/main.js',
    output: {
        path: path.resolve(process.cwd(), './examples/Kv/'),
        publicPath: process.env.CI_ENV || '',
        filename: '[name].[hash:7].js',
        chunkFilename: isProd ? '[name].[hash:7].js' : '[name].js'
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        modules: ['node_modules'],
        alias: {
            "vue$":path.resolve(__dirname,'../node_modules/vue/dist/vue.esm.js')
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: 9898,
        publicPath: '/',
        hot: true
    },
    performance: {
        hints: false
    },
    stats: {
        children: false
    },
    module: {
        rules: [

            {
                test: /\.(jsx?|babel|es6)$/,
                include: process.cwd(),
                // exclude: config.jsexclude,
                loader: 'babel-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    },
                }
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.md$/,
                use:[
                    {
                        loader: 'vue-loader'
                    },
                    {
                        loader: path.resolve(__dirname,'./markdown-loader/index.js') ,
                    }
                ]

            },
            {
                test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
                use:[{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: path.posix.join('static', '[name].[hash:7].[ext]'),
                        esModule: false,
                    }
                }]

            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './examples/index.html',
            filename: './index.html'
        }),

        new ProgressBarPlugin(),
        new VueLoaderPlugin(),

        new webpack.LoaderOptionsPlugin({
            vue: {
                compilerOptions: {
                    preserveWhitespace: false
                }
            }
        })
    ],
    optimization: {
        minimizer: []
    },
    devtool: '#eval-source-map'
};



module.exports = webpackConfig;
