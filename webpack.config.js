const path = require("path");
const { library } = require("webpack");
var liveReloadedPlugin = require("webpack-livereload-plugin");

module.exports = {
    entry: './src/index.ts',
    plugins: [
        new liveReloadedPlugin({ appendScriptTag: true })
    ],
    // Punto de salida
    output: {
        filename: 'bundle.js',   // El archivo que Webpack generará
        path: path.resolve(__dirname, 'dist/js'), // El directorio donde se guardará el bundle
        libraryTarget: "var",
        library: "app"
    },
    resolve: {
        extensions: ['.js', '.css', '.ts', '.hbs'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },

    // Configuración de los loaders
    module: {
        rules: [
            {
                test: /\.ts$/,   // Regla para los archivos TypeScript
                use: 'ts-loader', // Usar ts-loader para procesar TypeScript
                exclude: /node_modules/,
            },
            {
                test: /\.hbs$/,
                use: [{
                    loader: "handlebars-loader",
                }]
            },
            {
                test: /\.js$/,  // Aplica a archivos JavaScript
                exclude: /node_modules/,
                use: 'babel-loader',  // Usa Babel para transformar el código JS
            },
            {
                test: /\.css$/,  // Aplica a archivos CSS
                use: ['style-loader', 'css-loader'],  // Carga CSS y lo inserta en el DOM
            },
        ],
    },

    // Configuración del servidor de desarrollo
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'), // El directorio a servir
        },
        compress: true,
        port: 5000,
        hot: true,  // Habilitar Hot Module Replacement (HMR)
        liveReload: true // Habilitar LiveReload
    },

    // Source maps para desarrollo (opcional)
    devtool: 'source-map',
}