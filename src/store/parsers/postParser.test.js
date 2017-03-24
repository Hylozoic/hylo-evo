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

it('does not allow unspecified properties onto resulting object', () => {
  const post = {
    id: '1',
    title: 'Wombat',
    type: null,
    details: '<p>Wombats poop square.</p>',
    wombatRatio: '1:1'
  }
  const actual = normalize(post)
  expect(actual.hasOwnProperty('wombatRatio')).toBe(false)
})
