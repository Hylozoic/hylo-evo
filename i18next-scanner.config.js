module.exports = {
  input: ['src/**/*.{js,jsx}'],
  options: {
    debug: true,
    removeUnusedKeys: true,
    func: {
      list: ['t', 'i18next.t'],
      extensions: ['.js', '.jsx']
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx'],
      fallbackKey: function (ns, value) {
        return value
      }
    },
    lngs: ['en', 'es'],
    ns: ['translation'],
    defaultLng: 'en',
    defaultValue: 'XXXXXXXXX',
    resource: {
      loadPath: 'public/locales/{{lng}}/{{ns}}.json',
      savePath: 'public/locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2,
      lineEnding: '\n'
    },
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
}
