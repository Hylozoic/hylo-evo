import fetchForCurrentUser from './fetchForCurrentUser'

it('returns only current user fetch query when there is not any slug and skipTopics is true', () => {
  expect(fetchForCurrentUser(null, true)).toMatchSnapshot()
})

it('doesn\'t return topics if there is a slug of skipTopics is true', () => {
  expect(fetchForCurrentUser('anyslug', true)).toMatchSnapshot()
})

it('doesn\'t return topics if there is a slug of skipTopics is false', () => {
  expect(fetchForCurrentUser('anyslug', false)).toMatchSnapshot()
})
