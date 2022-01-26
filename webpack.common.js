const path = require('path');
const glob = require('glob');
const HTMLWEBPACKPLUGIN = require("html-webpack-plugin");
const MINICSSEXTRACTPLUGIN = require("mini-css-extract-plugin");

const srcDir = path.resolve(process.cwd(), "src");

const pagesList = glob.sync(path.join(srcDir, "pages", "*/*.js"));

const entries = (pagesList) => {
    const entry = {};
    pagesList.forEach(page => {
        const {name} = path.parse(page);
        entry[name] = page;
        console.log('\x1B[44mentry::::::::::\x1B[0m ', `\x1B[34m${name} `, `${page}\x1B[0m`);
    });
    return entry;
};

const templates = (pagesList) => {
    const templates = [];
    pagesList.forEach(page => {
        const {name, dir} = path.parse(page);
        templates.push(
            new HTMLWEBPACKPLUGIN({
                filename: `${name}.html`,
                template: path.resolve(dir, `${name}.ejs`),
                chunks: [name]
            })
        )
        console.log('\x1B[46mtemplates::::::::::\x1B[0m ', `\x1B[36m${name}.html `, `${path.resolve(dir, `${name}.ejs`)}\x1B[0m`);
    });
    return templates;
};

const config = {
    entry: entries(pagesList),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[contenthash:8].js",
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                use: [{loader: "babel-loader"}],
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: MINICSSEXTRACTPLUGIN.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    {loader: "css-loader"},
                    {loader: "postcss-loader"},
                ],
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MINICSSEXTRACTPLUGIN.loader,
                        options: {
                            publicPath: "../",
                        },
                    },
                    {loader: "css-loader"},
                    {loader: "sass-loader"},
                    {loader: "postcss-loader"},
                ],
                exclude: /node_modules/
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: "ejs-loader",
                        options: {
                            esModule: false,
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpe?g|git)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[name].[hash:8][ext][query]",
                },
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name].[hash:8].[ext][query]",
                },
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                type: "asset/resource",
                generator: {
                    filename: "media/[name].[hash:8].[ext][query]",
                },
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        ...templates(pagesList),
        new MINICSSEXTRACTPLUGIN({
            filename: "css/[name].[hash:8].css",
            chunkFilename: "[id].[hash].css"
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
};

module.exports = config;
