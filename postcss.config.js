module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/jit': {},
    'postcss-focus-visible': {},
    'postcss-nested': {
      unwrap: ['screen'],
    },
    'autoprefixer': {}
  },
}