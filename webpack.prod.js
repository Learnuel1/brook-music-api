const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry:{
    main: "./server.js"
  },
  output: {
    path: path.join(__dirname, 'prod_build'),
    publicPath: "/",
    filename: "[name].js",
    clean: true
  },
  mode: "production",
  target: "node",
  devtool: "source-map", 
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true
        }
    }
    })]
     
  },
  module: {
    rules: [
      {
        test: /\/js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      }
    ]
  }
}