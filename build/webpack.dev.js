const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const distPath = path.join(__dirname, '..', 'dist')
    // 第一，引入 DllReferencePlugin
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [{
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
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                    }
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
        hot: true,

        port: 8088,

        open: true,

        compress: true, // 启动 gzip 压缩

        progress: true, // 显示打包的进度条

        contentBase: distPath
            // proxy: {
            //     '/api': {
            //         target: 'http://127.0.0.1:3000',
            //         changeOrigin: true // 支持跨域
            //             //     pathRewrite: { // 重写路径: 去掉路径中开头的'/api'
            //             //         '^/api': '/'
            //             //     }
            //             // }
            //     }
            // }
    },
    plugins: [
        new webpack.DefinePlugin({
            // window.ENV = 'production'
            ENV: JSON.stringify('development')
        }),
        // // 第三，告诉 Webpack 使用了哪些动态链接库
        new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require(path.join(distPath, 'vue.manifest.json')),
        }),
    ]
});