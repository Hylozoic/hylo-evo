import * as TextHelpers from '../src/TextHelpers'
import moment from 'moment-timezone'

describe('threadNames', () => {
  it('handles single name correctly', () => {
    const expected = 'Constantine'
    const actual = TextHelpers.threadNames([ 'Constantine' ])
    expect(actual).toBe(expected)
  })

  it('handles two names correctly', () => {
    const expected = 'Constantine & Bartholemew'
    const actual = TextHelpers.threadNames([ 'Constantine', 'Bartholemew' ])
    expect(actual).toBe(expected)
  })

  it('handles nine names correctly', () => {
    const expected = 'Constantine & 8 others'
    const actual = TextHelpers.threadNames([
      'Constantine',
      'Bartholemew',
      'Gertrude',
      'Hortense',
      'Abner',
      'Zachariah',
      'Philomena',
      'Zebediah',
      'Augustus'
    ])
    expect(actual).toBe(expected)
  })
})

describe('divToP', () => {
  it('converts div to p', () => {
    const expected = 'Wombats are great.<p>They poop square.</p>'
    const unsafe = 'Wombats are great.<div>They poop square.</div>'
    const actual = TextHelpers.divToP(unsafe)
    expect(actual).toBe(expected)
  })

  it('ignores strings where div is not present', () => {
    const expected = '<p>I have divulged that you are divine.</p>'
    const actual = TextHelpers.divToP(expected)
    expect(actual).toBe(expected)
  })

  it('does not remove child tags of a div', () => {
    const expected = 'Wombats are great.<p>They <em>poop</em> square.</p>'
    const unsafe = 'Wombats are great.<div>They <em>poop</em> square.</div>'
    const actual = TextHelpers.divToP(unsafe)
    expect(actual).toBe(expected)
  })
})

describe('sanitize', () => {
  it('returns empty string if called without text', () => {
    expect(TextHelpers.sanitize()).toBe('')
  })

  it('returns empty string if whitelist is not an array', () => {
    expect(TextHelpers.sanitize('foo', {})).toBe('')
  })

  it('allows whitelist to be undefined', () => {
    expect(TextHelpers.sanitize('foo')).toBe('foo')
  })

  it('strips leading whitespace in paragraphs', () => {
    expect(TextHelpers.sanitize('<p>&nbsp;</p>')).toBe('<p></p>')
  })

  it('removes tags not on a whitelist', () => {
    const expected = 'Wombats are great.<div>They poop square.</div>'
    const unsafe = 'Wombats are great.<em>So great.</em><div>They poop square.</div>'
    const actual = TextHelpers.sanitize(unsafe, [ 'div' ])
    expect(actual).toBe(expected)
  })

  it('removes attributes not on a whitelist', () => {
    const expected = '<p id="wombat-data">Wombats are great.</p>'
    const unsafe = '<p id="wombat-data" class="main-wombat">Wombats are great.</p>'
    const actual = TextHelpers.sanitize(unsafe, [ 'p' ], { p: [ 'id' ] })
    expect(actual).toBe(expected)
  })
})

describe('markdown', () => {
  it('converts to markdown', () => {
    expect(TextHelpers.markdown('*strong* **italic**')).toBe("<p><em>strong</em> <strong>italic</strong></p>\n")
  })

  it('sanitizes also', () => {
    expect(TextHelpers.markdown('*strong* **italic** <i>aa</i>')).toBe("<p><em>strong</em> <strong>italic</strong> </p>\n")
  })
})

describe('formatDatePair', () => {
  it('displays differences of dates', () => {
    const d1 = moment.tz(1551908483315, 'Etc/GMT').month(1).day(1).hour(18)
    const d2 = moment.tz(d1, 'Etc/GMT').hour(21)
    const d3 = moment.tz(d2, 'Etc/GMT').day(2)
    const d4 = moment.tz(d3, 'Etc/GMT').month(2)
    const d5 = moment.tz(d3, 'Etc/GMT').year(2050)

    expect(TextHelpers.formatDatePair(d1)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d2)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d3)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d4)).toMatchSnapshot()
    expect(TextHelpers.formatDatePair(d1, d5)).toMatchSnapshot()
  })
})
