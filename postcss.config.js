module.exports = {
    plugins: {
        'postcss-preset-env': {
            stage: 0,
            features: {
                'custom-properties': false, // Preserve CSS variables
            },
        },
        autoprefixer: {},
    },
};
