const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function resolvePath(url) {
    return path.resolve(__dirname, '../', url);
}

const loadCSS = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    'css-loader',
    'postcss-loader'
];

const webpackConfig = {
    target: 'web',
    mode: 'production',
    devtool: 'source-map', // cheap-eval-source-map

    entry: {
        app: resolvePath('src/app.js'),
    },
    output: {
        path: resolvePath('dist/'),
        publicPath: '/',
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'font/[contenthash].[ext]',
                },
            },
            {
                test: /\.(jpe?g|png)$/,
                loader: 'url-loader',
                options: {
                    limit: 8912,
                    name: 'img/[contenthash].[ext]',
                },
            },
            {
                test: /\.css$/,
                use: loadCSS,
            },
            {
                test: /\.less$/,
                use: [
                    ...loadCSS,
                    {
                        loader: 'less-loader',
                        options: { javascriptEnabled: true }
                    }
                ],
            },
            {
                test: /\.js$/,
                exclude: resolvePath('node_modules'),
                loader: 'babel-loader',
            },
        ]
    },
    resolve: {
        extensions: [
            '.js',
            '.ts',
        ],
        alias: {
            '@': resolvePath('src')
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'blog-admin',
            filename: 'index.html',
            template: resolvePath('index.html'),
            inject: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[name].[contenthash].css'
        }),
    ],
};

module.exports = webpackConfig;