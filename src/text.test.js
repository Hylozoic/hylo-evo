import * as text from '../src/text'

describe('threadNames', () => {
  it('handles single name correctly', () => {
    const expected = 'Constantine'
    const actual = text.threadNames([ 'Constantine' ])
    expect(actual).toBe(expected)
  })

  it('handles two names correctly', () => {
    const expected = 'Constantine & Bartholemew'
    const actual = text.threadNames([ 'Constantine', 'Bartholemew' ])
    expect(actual).toBe(expected)
  })

  it('handles nine names correctly', () => {
    const expected = 'Constantine & 8 others'
    const actual = text.threadNames([
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
    const actual = text.divToP(unsafe)
    expect(actual).toBe(expected)
  })

  it('ignores strings where div is not present', () => {
    const expected = '<p>I have divulged that you are divine.</p>'
    const actual = text.divToP(expected)
    expect(actual).toBe(expected)
  })

  it('does not remove child tags of a div', () => {
    const expected = 'Wombats are great.<p>They <em>poop</em> square.</p>'
    const unsafe = 'Wombats are great.<div>They <em>poop</em> square.</div>'
    const actual = text.divToP(unsafe)
    expect(actual).toBe(expected)
  })
})

describe('sanitize', () => {
  it('returns empty string if called without text', () => {
    expect(text.sanitize()).toBe('')
  })

  it('returns empty string if whitelist is not an array', () => {
    expect(text.sanitize('foo', {})).toBe('')
  })

  it('allows whitelist to be undefined', () => {
    expect(text.sanitize('foo')).toBe('foo')
  })

  it('strips leading whitespace in paragraphs', () => {
    expect(text.sanitize('<p>&nbsp;</p>')).toBe('<p></p>')
  })

  it('removes tags not on a whitelist', () => {
    const expected = 'Wombats are great.<div>They poop square.</div>'
    const unsafe = 'Wombats are great.<em>So great.</em><div>They poop square.</div>'
    const actual = text.sanitize(unsafe, [ 'div' ])
    expect(actual).toBe(expected)
  })

  it('removes attributes not on a whitelist', () => {
    const expected = '<p id="wombat-data">Wombats are great.</p>'
    const unsafe = '<p id="wombat-data" class="main-wombat">Wombats are great.</p>'
    const actual = text.sanitize(unsafe, [ 'p' ], { p: [ 'id' ] })
    expect(actual).toBe(expected)
  })
})

describe('markdown', () => {
  it('converts to markdown', () => {
    expect(text.markdown('*strong* **italic**')).toBe("<p><em>strong</em> <strong>italic</strong></p>\n")
  })

  it('sanitizes also', () => {
    expect(text.markdown('*strong* **italic** <i>aa</i>')).toBe("<p><em>strong</em> <strong>italic</strong> </p>\n")
  })
})
