import resetNewPostCount from './resetNewPostCount'

it('works for CommunityTopic', () => {
  expect(resetNewPostCount(5, 'CommunityTopic')).toMatchSnapshot()
})

it('works for Membership', () => {
  expect(resetNewPostCount(5, 'Membership')).toMatchSnapshot()
})
