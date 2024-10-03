// Babel config automaticaly configured by microbundle
// the below is use for jest test runs only

module.exports =
  process.env.NODE_ENV === 'test'
    ? {
        presets: [
          ['@babel/preset-env']
        ]
      }
    : {}
