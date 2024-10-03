import {
  transformPathname,
  IOS_SITE_ASSOCIATION_FILE
} from './proxy'

describe('transformPathname', () => {
  it('forwards to index.html when no file extension present', () => {
    const actual = '/'
    const expected = `${process.env.PROXY_HOST}/index.html`
    const result = transformPathname(actual)
    expect(result).toEqual(expected)
  })

  it(`forwards /${IOS_SITE_ASSOCIATION_FILE} to ${IOS_SITE_ASSOCIATION_FILE}.json`, () => {
    const actual = `/${IOS_SITE_ASSOCIATION_FILE}`
    const expected = `${process.env.PROXY_HOST}/${IOS_SITE_ASSOCIATION_FILE}.json`
    const result = transformPathname(actual)
    expect(result).toEqual(expected)
  })
})
