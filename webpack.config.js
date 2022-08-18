module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "index.js",
        path: __dirname + "/dist",
    },
    devtool: "source-map",
    resolve: {
        extension: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"},
        ],
    },
    devServer: {
        port: 8080,
        contentBase: './',
        publicPath: '/dist'
    }
}