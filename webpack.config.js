const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: "./index.html",
    filename: "./index.html",
    minify: false
  });
　
module.exports = {

    mode: 'development',

    entry: './index.js',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    
    devServer: {
        historyApiFallback: true,
        port: 8000,
        open: true
    },

    module: {
        rules: [
            {
                test: /\.(mp3)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },

            {
              test: /\.(glsl|vs|fs|vert|frag)$/,
              exclude: /node_modules/,
              use: [
                'raw-loader',
              ]
            },

            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query:{
                  presets: ["@babel/preset-env", "@babel/preset-react"]
                }
            },

            {
              test:/\.(jpe?g|png|gif|svg|ico|jpeg)$/i,
              loader: 'url-loader',
              options:{
                limit: 2048,
                name: './image/[name].[ext]'
              }
            }
            
        ]
    },

    plugins: [
        htmlWebpackPlugin
    ]
};