const path = require('path')
module.exports = {
    entry: './src/index.js', //入口
    output: { //出口
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
}