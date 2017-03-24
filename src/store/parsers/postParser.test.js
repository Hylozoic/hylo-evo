import postParser from './postParser'

it('Post is invalid if missing any of the core properties', () => {
  const id = '1'
  const title = 'Wombat'
  const type = null
  const details = '<p>Wombats poop square.</p>'
  expect(postParser.isValid({ id, title, type })).toBe(false)
  expect(postParser.isValid({ title, type, details })).toBe(false)
  expect(postParser.isValid({ id, type, details })).toBe(false)
  expect(postParser.isValid({ id, title, details })).toBe(false)
})
