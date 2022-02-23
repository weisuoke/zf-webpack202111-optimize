const path = require('path')
const webpack = require('webpack')
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const bootstrap = path.resolve(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.css')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require("purgecss-webpack-plugin");
const smw = new SpeedMeasureWebpackPlugin();

module.exports = {
  mode: 'none',
  devtool: false,
  entry: './src/index.js',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    // libraryExport: 'add', // 配置导出的模块中哪些子模块需要被导出，它只有在 libraryTarget 设置为 commonjs 的时候才有用
    library: 'calculator',  // 指定导出库的名称
    libraryTarget: 'umd', // 以何种方式导出
  },
  // 此处用来找普通模块
  resolve: {
    extensions: [".js", ".jsx", ".json"], // 指定要加载的模块的扩展名，尽可能把常用的往前放
    alias: {
      bootstrap
    },
    modules: [path.resolve("node_modules")],  // 指定去哪个目录中查找对应的模块
    mainFields: ['browser', 'module', 'main'],  // package.json 中的main字段
    mainFiles: ['main', 'index']
  },
  // 此处只用来找 loader
  resolveLoader: {

  },
  module: {
    // 不去分析这些模块的依赖，不可能有依赖，所以不去把它转成语法树，分析里面的依赖
    noParse: (moduleName) => {
      return /jquery|lodash/.test(moduleName)
    },
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {}
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset/resource', // 必定会输出一个文件
        parser: { // 根据这个条件做选择，如果小于 maxSize 的话就变成 base64 字符串，如果大于的就拷贝文件并返回新的地址
          dataUrlCondition: {
            maxSize: 4 * 1024 // 4kb
          }
        },
        generator: {
          filename: 'images/[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      }
    }),
    new webpack.IgnorePlugin({
      contextRegExp: /moment$/,  // 忽略 哪个模块
      resourceRegExp: /locale/, // 忽略模块内的哪些资源
    }),
    new MiniCssExtractPlugin({
      filename: 'style/[name].css'
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*']
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${path.resolve('src')}/**/*`, { nodir: true })
    })
  ]
}