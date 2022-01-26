module.exports = {
  client: {
    includes: ['./**/*.js'],
    excludes: ["./**/*.js.test"],
    service: {
      name: 'local Hylo GraphQL',
      url: 'http://localhost:3001/noo/graphql',
      skipSSLValidation: true
    }
  }
}
