const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                    loader: 'file-loader',
                    options: {
                        esModule: false
                    }
                }

            ]
        }, {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                {
                    loader: 'postcss-loader'
                }
            ]
        }, {
            test: /\.less$/,
            use: [{
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                    }
                },
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    }
                }
            ]
        }]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        open: true,
        proxy: {
            '/': {
                target: 'http://127.0.0.1:3000',
                changeOrigin: true, // 支持跨域
                pathRewrite: { // 重写路径: 去掉路径中开头的'/api'
                    '^/': ''
                }
            }
        }
    }
});