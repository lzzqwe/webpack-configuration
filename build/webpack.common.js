 const path = require('path');
 const { srcPath } = require('./path')

 const VueLoaderPlugin = require('vue-loader/lib/plugin')

 const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = {
     plugins: [
         new HtmlWebpackPlugin({
             template: path.join(srcPath, 'index.html'), // 指定模板文件路径
             filename: 'index.html' // 设置生成的内存页面的名称
         }),
         // 请确保引入这个插件！
         new VueLoaderPlugin()
     ],
     entry: {
         app: path.join(__dirname, '../src/main.js')
     },
     resolve: {
         alias: {
             common: path.resolve(__dirname, '../src/common/'),
             components: path.resolve(__dirname, '../src/components/'),
             base: path.resolve(__dirname, '../src/base/'),
             api: path.resolve(__dirname, '../src/api/')
         },
         extensions: ['.js', '.jsx', '.vue']
     },
     module: {
         rules: [{
             test: /\.jsx?$/, //1.babel-loader 的优化
             use: ['babel-loader?cacheDirectory'], //开启缓存 只要是es6代码没有改的就会缓存下来
             exclude: file => ( //明确编译范围
                 /node_modules/.test(file) &&
                 !/\.vue\.js/.test(file)
             )
         }, {
             test: /\.(woff|woff2|eot|ttf|otf)$/,
             use: [
                 'file-loader'
             ]
         }, {
             test: /\.vue$/,
             loader: 'vue-loader'
         }]
     },
 };