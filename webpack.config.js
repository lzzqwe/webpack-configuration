const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //*打包生成html文件 并且可以自动引入文件*
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    mode: 'production',
    entry: {
        app: './src/index.js'
    }, //入口
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        hot: true //启用 webpack 的 模块热替换 功能
    },
    output: { //出口
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.less$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'less-loader'
            ]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
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
    plugins: [ //打包生成html文件 并且可以自动引入文件
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ title: "管理输出" }),
        new webpack.HotModuleReplacementPlugin() //启用模块热替换
    ]
}