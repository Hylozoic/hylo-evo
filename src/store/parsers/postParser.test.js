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

it('normalizes ids from communities', () => {
  const post = {
    communities: [
      { id: '1234', name: 'Wombat Central' },
      { id: '5678', name: 'Wombat Quarterly' },
      { id: '9012', name: 'Wombats-R-Us' }
    ]
  }
  const expected = { communities: [ '1234', '5678', '9012' ] }
  const actual = normalize(post)
  expect(actual).toEqual(expected)
})

it('normalizes ids from comments', () => {
  const post = {
    comments: [
      {
        "id": "1",
        "createdAt": "Fri Mar 24 2017 10:55:41 GMT+1300 (NZDT)",
        "text": "<p>Here's a comment!</p>",
        "creator": {
            "id": "46816",
            "name": "Rich",
            "avatarUrl": "https://www.gravatar.com/avatar/32f7ff34c3b5a8600b79be9a85a5c92f?d=mm&s=140"
        }
      }
    ]
  }
  const expected = { comments: [ '1' ] }
  const actual = normalize(post)
  expect(actual).toEqual(expected)
})
