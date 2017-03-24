import transform from './communityTransformer'

it('Normalizes ids from members', () => {
  const community = {
    members: [
      { id: '111', name: 'Hortense', avatarUrl: 'https://foobar.com/foo.png' },
      { id: '222', name: 'Catalina', avatarUrl: 'https://foobar.com/foo.png' },
      { id: '333', name: 'Raphael', avatarUrl: 'https://foobar.com/foo.png' }
    ]
  }
  const expected = { members: [ '111', '222', '333' ] }
  const actual = transform(community)
  expect(actual).toEqual(expected)
})

