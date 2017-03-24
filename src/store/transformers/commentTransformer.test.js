import transform from './commentTransformer'

it('Normalizes id from creator', () => {
  const comment = {
    creator: {
      id: "46816",
      name: "Rich",
      avatarUrl: "https://www.gravatar.com/avatar/32f7ff34c3b5a8600b79be9a85a5c92f?d=mm&s=140"
    }
  }
  const expected = { creator: '46816' }
  const actual = transform(comment)
  expect(actual).toEqual(expected)
})
