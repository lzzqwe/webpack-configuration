## 起步

[ES2015](https://babel.docschina.org/docs/en/learn/) 中的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 语句已经被标准化，并且 [多数浏览器已经能够支持](https://caniuse.com/#search=modules)。一些旧版本浏览器虽然无法支持它们，但是通过 webpack 开箱即用的模块支持，我们也可以使用这些ES2015 模块标准。

在幕后，webpack 实际上会将代码进行 transpile(转译)，因此旧版本浏览器也可以执行。如果检查 `dist/main.js`，你就可以看到 webpack 是如何实现，这是独创精巧的设计！除了 `import` 和 `export`，webpack 还能够很好地支持各种其他模块语法，更多信息请查看 [模块 API](https://webpack.docschina.org/api/module-methods)。

注意，webpack 不会更改代码中除 `import` 和 `export` 语句以外的部分。如果你在使用其它 [ES2015 特性](http://es6-features.org/)，请确保你在 webpack [loader 系统](https://webpack.docschina.org/concepts/loaders/) 中使用了一个像是 [Babel](https://babel.docschina.org/) 或 [Bublé](https://buble.surge.sh/guide/) 的 [transpiler(转译器)](https://webpack.docschina.org/loaders/#transpiling)。

## 管理资源

1. 加载css  

    为了在 JavaScript 模块中 `import` 一个 CSS 文件，你需要安装 [style-loader](https://webpack.docschina.org/loaders/style-loader) 和 [css-loader](https://webpack.docschina.org/loaders/css-loader)，并在 [`module` 配置](https://webpack.docschina.org/configuration/module) 中添加这些 loader： 

   ```
   npm install --save-dev style-loader css-loader
   ```

    webpack.config.js

   ```
   const path = require('path')
   module.exports = {
       entry: './src/index.js', //入口
       output: { //出口
           filename: 'bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
       module: {
           rules: [{//css-loader配置
               test: /.css$/,
               use: ["style-loader", "css-loader"]
           }]
       }
   }
   ```

2. 加载image图片 

   ```
   npm install --save-dev file-loader
   ```

    webpack.config.js

   ```
   const path = require('path');
   
     module.exports = {
       entry: './src/index.js',
       output: {
         filename: 'bundle.js',
         path: path.resolve(__dirname, 'dist')
       },
       module: {
         rules: [
           {
             test: /\.css$/,
             use: [
               'style-loader',
               'css-loader'
             ]
           },
   +       {
   +         test: /\.(png|svg|jpg|gif)$/,
   +         use: [
   +           'file-loader'
   +         ]
   +       }
         ]
       }
     };
   ```

3. 加载fonts字体

    webpack.config.js

   ```
   const path = require('path')
   module.exports = {
       entry: './src/index.js', //入口
       output: { //出口
           filename: 'bundle.js',
           path: path.resolve(__dirname, 'dist')
       },
       module: {
           rules: [{
               test: /.css$/,
               use: ["style-loader", "css-loader"]
           }, {
               test: /\.(png|svg|jpg|gif)$/,
               use: [
                   'file-loader'
               ]
           }, {//加载字体
               test: /\.(woff|woff2|eot|ttf|otf)$/,
               use: [
                   'file-loader'
               ]
           }]
       }
   }
   ```

## 管理输出

1.  设置 HtmlWebpackPlugin （*打包生成html文件 并且可以自动引入文件*）

    首先安装插件，并且调整 `webpack.config.js` 文件： 

   ```
   npm install --save-dev html-webpack-plugin
   ```

    webpack.config.js

   ```
   const path = require('path');
   + const HtmlWebpackPlugin = require('html-webpack-plugin');
   
     module.exports = {
       entry: {
         app: './src/index.js',
         print: './src/print.js'
       },
   +   plugins: [
   +     new HtmlWebpackPlugin({
   +       title: '管理输出'
   +     })
   +   ],
       output: {
         filename: '[name].bundle.js',
         path: path.resolve(__dirname, 'dist')
       }
     };
   ```

    在我们构建之前，你应该了解，虽然在 `dist/` 文件夹我们已经有了 `index.html` 这个文件，然而 `HtmlWebpackPlugin` 还是会默认生成它自己的 `index.html` 文件。也就是说，它会用新生成的 `index.html` 文件，替换我们的原有文件。我们看下执行 `npm run build` 后会发生什么： 

   ```
   ...
              Asset       Size  Chunks                    Chunk Names
    print.bundle.js     544 kB       0  [emitted]  [big]  print
      app.bundle.js    2.81 kB       1  [emitted]         app
         index.html  249 bytes          [emitted]
   ...
   ```

    如果在代码编辑器中打开 `index.html`，你会看到 `HtmlWebpackPlugin` 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。

2.  清理-dist-文件夹 

   [`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin) 是一个流行的清理插件，安装和配置它。

   ```
   npm install --save-dev clean-webpack-plugin
   ```

    webpack.config.js

   ```
   const path = require('path');
     const HtmlWebpackPlugin = require('html-webpack-plugin');
   + const CleanWebpackPlugin = require('clean-webpack-plugin');
   
     module.exports = {
       entry: {
         app: './src/index.js',
         print: './src/print.js'
       },
       plugins: [
   +     new CleanWebpackPlugin(),
         new HtmlWebpackPlugin({
           title: '管理输出'
         })
       ],
       output: {
         filename: '[name].bundle.js',
         path: path.resolve(__dirname, 'dist')
       }
     };
   ```

    现在，执行 `npm run build`，检查 `/dist` 文件夹。如果一切顺利，现在只会看到构建后生成的文件，而没有旧文件！ 

## 开发环境

 在开始前，我们先将 [`mode` 设置为 `'development'`](https://webpack.docschina.org/concepts/mode/#mode-development)。 

 webpack.config.js

```
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
+   mode: 'development',
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: '开发环境'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

 使用 source map 

当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。例如，如果将三个源文件（`a.js`, `b.js` 和 `c.js`）打包到一个 bundle（`bundle.js`）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会直接指向到 `bundle.js`。你可能需要准确地知道错误来自于哪个源文件，所以这种提示这通常不会提供太多帮助。

为了更容易地追踪 error 和 warning，JavaScript 提供了 [source map](http://blog.teamtreehouse.com/introduction-source-maps) 功能，可以将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。

source map 有许多 [可用选项](https://webpack.docschina.org/configuration/devtool)，请务必仔细阅读它们，以便可以根据需要进行配置。

对于本指南，我们将使用 `inline-source-map` 选项，这有助于解释说明示例意图（此配置仅用于示例，不要用于生产环境）：

 webpack.config.js

```
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    mode: 'development',
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
+   devtool: 'inline-source-map',
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Development'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

### 选择一个开发工具

在每次编译代码时，手动运行 `npm run build` 会显得很麻烦。

webpack 提供几种可选方式，帮助你在代码发生变化后自动编译代码：

1. webpack watch mode(webpack 观察模式)
2. webpack-dev-server
3. webpack-dev-middleware

多数场景中，你可能需要使用 `webpack-dev-server`，但是不妨探讨一下以上的所有选项。

-  使用 watch mode(观察模式)  监控打包模式

  你可以指示 webpack "watch" 依赖图中所有文件的更改。如果其中一个文件被更新，代码将被重新编译，所以你不必再去手动运行整个构建。

  我们添加一个用于启动 webpack watch mode 的 npm scripts：

  **package.json**

  ```
  {
      "name": "development",
      "version": "1.0.0",
      "description": "",
      "main": "webpack.config.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
  +     "watch": "webpack --watch",
        "build": "webpack"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "clean-webpack-plugin": "^0.1.16",
        "css-loader": "^0.28.4",
        "csv-loader": "^2.1.1",
        "file-loader": "^0.11.2",
        "html-webpack-plugin": "^2.29.0",
        "style-loader": "^0.18.2",
        "webpack": "^3.0.0",
        "xml-loader": "^1.2.1"
      }
    }
  ```

   -  使用 webpack-dev-server 

      `webpack-dev-server` 为你提供了一个简单的 web server，并且具有 live reloading(实时重新加载) 功能。设置如下： 

     ```
     npm install --save-dev webpack-dev-server
     ```

     修改配置文件，告诉 dev server，从什么位置查找文件：

     **webpack.config.js**

     ```
     const path = require('path');
       const HtmlWebpackPlugin = require('html-webpack-plugin');
       const CleanWebpackPlugin = require('clean-webpack-plugin');
     
       module.exports = {
         mode: 'development',
         entry: {
           app: './src/index.js',
           print: './src/print.js'
         },
         devtool: 'inline-source-map',
     +   devServer: {
     +     contentBase: './dist'
     +   },
         plugins: [
           new CleanWebpackPlugin(['dist']),
           new HtmlWebpackPlugin({
             title: 'Development'
           })
         ],
         output: {
           filename: '[name].bundle.js',
           path: path.resolve(__dirname, 'dist')
         }
       };
     ```

      以上配置告知 `webpack-dev-server`，将 `dist` 目录下的文件 serve 到 `localhost:8080` 下。（译注：serve，将资源作为 server 的可访问文件） 

     ```
     webpack-dev-server 在编译之后不会写入到任何输出文件。而是将 bundle 文件保留在内存中，然后将它们 serve 到 server 中，就好像它们是挂载在 server 根路径上的真实文件一样。如果你的页面希望在其他不同路径中找到 bundle 文件，则可以通过 dev server 配置中的 publicPath 选项进行修改。
     ```

     我们添加一个可以直接运行 dev server 的 script：

     **package.json**

     ```
     {
         "name": "development",
         "version": "1.0.0",
         "description": "",
         "main": "webpack.config.js",
         "scripts": {
           "test": "echo \"Error: no test specified\" && exit 1",
           "watch": "webpack --watch",
     +     "start": "webpack-dev-server --open",
           "build": "webpack"
         },
         "keywords": [],
         "author": "",
         "license": "ISC",
         "devDependencies": {
           "clean-webpack-plugin": "^0.1.16",
           "css-loader": "^0.28.4",
           "csv-loader": "^2.1.1",
           "file-loader": "^0.11.2",
           "html-webpack-plugin": "^2.29.0",
           "style-loader": "^0.18.2",
           "webpack": "^3.0.0",
           "xml-loader": "^1.2.1"
         }
       }
     ```


## 模块热替换

 模块热替换(hot module replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新。本页面重点介绍其**实现**，而 [概念](https://webpack.docschina.org/concepts/hot-module-replacement) 页面提供了更多关于它的工作原理以及为什么它有用的细节。 

### 启用HMR

 此功能可以很大程度提高生产效率。我们要做的就是更新 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 配置，然后使用 webpack 内置的 HMR 插件。 

 **webpack.config.js** 

```
const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const webpack = require('webpack');

  module.exports = {
    entry: {
-      app: './src/index.js',
-      print: './src/print.js'
+      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
+     hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: '模块热替换'
      }),
+     new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

## tree_shaking

*tree shaking* 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块语法的 [静态结构](http://exploringjs.com/es6/ch_modules.html#static-module-structure) 特性，例如 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 和 [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)。这个术语和概念实际上是由 ES2015 模块打包工具 [rollup](https://github.com/rollup/rollup) 普及起来的。

webpack 2 正式版本内置支持 ES2015 模块（也叫做 *harmony modules*）和未使用模块检测能力。新的 webpack 4 正式版本扩展了此检测能力，通过 `package.json` 的 `"sideEffects"` 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

## 生产环境

### 配置

*development(开发环境)* 和 *production(生产环境)* 这两个环境下的构建目标存在着巨大差异。在*开发环境*中，我们需要：强大的 source map 和一个有着 live reloading(实时重新加载) 或 hot module replacement(热模块替换) 能力的 localhost server。而*生产环境*目标则转移至其他方面，关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写**彼此独立的 webpack 配置**。

虽然，以上我们将*生产环境*和*开发环境*做了略微区分，但是，请注意，我们还是会遵循不重复原则(Don't repeat yourself - DRY)，保留一个 "common(通用)" 配置。为了将这些配置合并在一起，我们将使用一个名为 [`webpack-merge`](https://github.com/survivejs/webpack-merge) 的工具。此工具会引用 "common" 配置，因此我们不必再在环境特定(environment-specific)的配置中编写重复代码。

我们先从安装 `webpack-merge` 开始，并将之前指南中已经成型的那些代码进行分离：

```
npm install --save-dev webpack-merge
```

 **project** 

```
  webpack
  |- package.json
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
  |- /dist
  |- /src
    |- index.js
    |- math.js
  |- /node_modules
```

####  **webpack.common.js** 

```
+ const path = require('path');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');
+
+ module.exports = {
+   entry: {
+     app: './src/index.js'
+   },
+   plugins: [
+     new CleanWebpackPlugin(['dist']),
+     new HtmlWebpackPlugin({
+       title: 'Production'
+     })
+   ],
+   output: {
+     filename: '[name].bundle.js',
+     path: path.resolve(__dirname, 'dist')
+   }
+ };
```

####  **webpack.dev.js** 

```
+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   mode: 'development',
+   devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist'
+   }
+ });
```

####  **webpack.prod.js** 

```
+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   mode: 'production',
+ });
```

现在，在 `webpack.common.js` 中，我们设置了 `entry` 和 `output` 配置，并且在其中引入这两个环境公用的全部插件。在 `webpack.dev.js` 中，我们将 `mode` 设置为 `development`，并且为此环境添加了推荐的 `devtool`（强大的 source map）和简单的 `devServer` 配置。最后，在 `webpack.prod.js` 中，我们将 `mode` 设置为 `production`，其中会引入之前在 [tree shaking](https://webpack.docschina.org/guides/tree-shaking) 指南中介绍过的 `TerserPlugin`。

注意，在环境特定的配置中使用 `merge()` 功能，可以很方便地引用 `dev` 和 `prod` 中公用的 common 配置。`webpack-merge` 工具提供了各种 merge(合并) 高级功能，但是在我们的用例中，无需用到这些功能。

### **npm scripts** 

 现在，我们把 `scripts` 重新指向到新配置。让 `npm start` script 中 `webpack-dev-server` 使用 *development(开发环境)* 配置文件，而让 `npm run build` script 使用 *production(生产环境)* 配置文件：

 **package.json** 

```
{
    "name": "development",
    "version": "1.0.0",
    "description": "",
    "main": "src/index.js",
    "scripts": {
-     "start": "webpack-dev-server --open",
+     "start": "webpack-dev-server --open --config webpack.dev.js",
-     "build": "webpack"
+     "build": "webpack --config webpack.prod.js"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "clean-webpack-plugin": "^0.1.17",
      "css-loader": "^0.28.4",
      "csv-loader": "^2.1.1",
      "express": "^4.15.3",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "style-loader": "^0.18.2",
      "webpack": "^3.0.0",
      "webpack-dev-middleware": "^1.12.0",
      "webpack-dev-server": "^2.9.1",
      "webpack-merge": "^4.1.0",
      "xml-loader": "^1.2.1"
    }
  }
```

### 指定mode

 许多 library 通过与 `process.env.NODE_ENV` 环境变量关联，以决定 library 中应该引用哪些内容。例如，当不处于*生产环境*中时，某些 library 为了使调试变得容易，可能会添加额外的 log(日志记录) 和 test(测试) 功能。并且，在使用 `process.env.NODE_ENV === 'production'` 时，一些 library 可能针对具体用户的环境，删除或添加一些重要代码，以进行代码执行方面的优化。从 webpack v4 开始, 指定 [`mode`](https://webpack.docschina.org/concepts/mode/) 会自动地配置 [`DefinePlugin`](https://webpack.docschina.org/plugins/define-plugin)： 

####  **webpack.prod.js** 

```
const merge = require('webpack-merge');
  const common = require('./webpack.common.js');

  module.exports = merge(common, {
    mode: 'production',
  });
```

------

```
技术上讲，NODE_ENV 是一个由 Node.js 暴露给执行脚本的系统环境变量。通常用于决定在开发环境与生产环境(dev-vs-prod)下，server tools(服务期工具)、build scripts(构建脚本) 和 client-side libraries(客户端库) 的行为。然而，与预期相反，无法在构建脚本 webpack.config.js 中，将 process.env.NODE_ENV 设置为 "production"，请查看 #2537。因此，在 webpack 配置文件中，process.env.NODE_ENV === 'production' ? '[name].[hash].bundle.js' : '[name].bundle.js' 这样的条件语句，无法按照预期运行。
```

 如果你正在使用像 [`react`](https://react.docchina.org/) 这样的 library，那么在添加此 DefinePlugin 插件后，你应该看到 bundle 大小显著下降。还要注意，任何位于 `/src` 的本地代码都可以关联到 process.env.NODE_ENV 环境变量，所以以下检查也是有效的： 

####  **src/index.js** 

```
import { cube } from './math.js';
+
+ if (process.env.NODE_ENV !== 'production') {
+   console.log('Looks like we are in development mode!');
+ }

  function component() {
    var element = document.createElement('pre');

    element.innerHTML = [
      'Hello webpack!',
      '5 cubed is equal to ' + cube(5)
    ].join('\n\n');

    return element;
  }

  document.body.appendChild(component());
```

