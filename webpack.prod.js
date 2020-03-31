 const merge = require('webpack-merge');
 const { CleanWebpackPlugin } = require('clean-webpack-plugin');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin')
 const TerserJSPlugin = require('terser-webpack-plugin')
 const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
 const common = require('./webpack.common.js');

 module.exports = merge(common, {
     mode: 'production',
     devtool: 'source-map',
     module: {
         rules: [{ // 图片 - 考虑 base64 编码的情况
             test: /\.(png|jpg|jpeg|gif)$/,
             use: {
                 loader: 'url-loader',
                 options: {
                     // 小于 5kb 的图片用 base64 格式产出
                     // 否则，依然延用 file-loader 的形式，产出 url 格式
                     limit: 5 * 1024,
                     // 打包到 img 目录下
                     outputPath: '/img1/',
                 }
             }
         }, {
             test: /\.css$/,
             use: [
                 MiniCssExtractPlugin.loader,
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
             use: [{ //压缩css
                     loader: MiniCssExtractPlugin.loader,
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
     plugins: [
         new CleanWebpackPlugin(),
         //抽离css文件
         new MiniCssExtractPlugin({
             filename: 'css/main.[contentHash:8].css'
         })
     ],
     optimization: {
         // 压缩 css
         minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
         // 分割代码块
         splitChunks: {
             chunks: 'all',
             /**
              * initial 入口 chunk，对于异步导入的文件不处理
                 async 异步 chunk，只对异步导入的文件处理
                 all 全部 chunk
              */

             // 缓存分组
             cacheGroups: {
                 // 第三方模块
                 vendor: {
                     name: 'vendor', // chunk 名称
                     priority: 1, // 权限更高，优先抽离，重要！！！
                     test: /node_modules/,
                     minSize: 0, // 大小限制
                     minChunks: 1 // 最少复用过几次
                 },

                 // 公共的模块
                 common: {
                     name: 'common', // chunk 名称
                     priority: 0, // 优先级
                     minSize: 0, // 公共模块的大小限制
                     minChunks: 2 // 公共模块最少复用过几次
                 }
             }
         }
     }
 });