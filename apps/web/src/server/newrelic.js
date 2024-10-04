const newrelic = process.env.NEW_RELIC_LICENSE_KEY && process.env.NODE_ENV !== 'test'
  ? require('newrelic')
  : null

export function getBrowserSnippet () {
  if (!newrelic) return ''
  // FIXME: this should be changed to represent the actual page being loaded.
  // it's here for now only because it's required for the browser snippet
  newrelic.setTransactionName('/')
  return newrelic.getBrowserTimingHeader()
}
