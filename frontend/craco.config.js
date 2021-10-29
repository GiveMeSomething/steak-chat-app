// craco.config.js
console.log('Craco running')

module.exports = {
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
    webpack: {
        configure: {
            resolve: {
                plugins: [],
            },
        },
    },
}
