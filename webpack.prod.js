const path = require("path");
const { merge } = require("webpack-merge");
const COPYWEBPACKPLUGIN = require("copy-webpack-plugin");
const common = require("./webpack.common.js");
const webpack = require("webpack");

const config = {
    mode: "production",
    output: {
        publicPath: "./",
    },
    plugins: [
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify("./"), // 静态资源根目录
        }),
        new COPYWEBPACKPLUGIN([
            {
                from: path.resolve(__dirname, "./public"),
                to: path.resolve(__dirname, "./dist"),
            },
        ]),
    ],
};

const output = merge(common, config);

module.exports = output;
