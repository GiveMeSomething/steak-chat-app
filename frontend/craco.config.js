const path = require('path')

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')]
        }
    },
    webpack: {
        configure: {
            output: {
                path: path.resolve(__dirname, '../build'),
                filename: 'bundle.js'
            },
            cache: true,
            stats: 'minimal',
            devServer: {
                compress: true
            }
        }
    }
}
