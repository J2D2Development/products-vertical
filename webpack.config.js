module.exports = {
    entry: './dist/index.js',
    output: {
        filename: '/public/bundle.js'
    },
    //for production: to actually product a bundle.js in public folder (dev server serves from memory for speed)
    // output: {
    //     path: path.join(__dirname, 'dist'),
    //     filename: 'bundle.js',
    //     publicPath: '/public/'
    // },
    devServer: { 
        inline: true 
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader',
                query: { presets: ['es2015'] }
            },
            { test: /\.json$/, loader: 'json' },
            { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] }
        ]
    }
}