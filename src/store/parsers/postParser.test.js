import postParser, { normalize } from './postParser'

it('is invalid if missing any of the core properties', () => {
  const id = '1'
  const title = 'Wombat'
  const type = null
  const details = '<p>Wombats poop square.</p>'
  expect(postParser.isValid({ id, title, type })).toBe(false)
  expect(postParser.isValid({ title, type, details })).toBe(false)
  expect(postParser.isValid({ id, type, details })).toBe(false)
  expect(postParser.isValid({ id, title, details })).toBe(false)
})

it('does not allow unknown properties onto resulting object', () => {
  const post = {
    id: '1',
    wombatRatio: '1:1'
  }
  const actual = normalize(post)
  expect(actual.hasOwnProperty('wombatRatio')).toBe(false)
})

it('normalizes ids from followers', () => {
  const post = {
    followers: [
      { id: '111', name: 'Hortense', avatarUrl: 'https://foobar.com/foo.png' },
      { id: '222', name: 'Catalina', avatarUrl: 'https://foobar.com/foo.png' },
      { id: '333', name: 'Raphael', avatarUrl: 'https://foobar.com/foo.png' },
    ]
  }
  const expected = { followers: [ '111', '222', '333' ] }
  const actual = normalize(post)
  expect(actual).toEqual(expected)
})
