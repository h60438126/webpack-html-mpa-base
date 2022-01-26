const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const path = require('path');
const webpack = require('webpack');

const config = {
    mode: "development",
    output: {
        publicPath: "/"
    },
    devServer: {
        hot: true,
        host: "0.0.0.0",
        port: 8080,
        static: {
            directory: path.join(__dirname, './public'),
        },
    },
    plugins: [
        new webpack.DefinePlugin({
            'BASE_URL': JSON.stringify('/'), // 静态资源根目录
        })
    ]
};

const output = merge(common, config);

module.exports = output;
