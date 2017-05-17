import resetNewPostCount from './resetNewPostCount'

it('works for TopicSubscription', () => {
  expect(resetNewPostCount(5, 'TopicSubscription')).toMatchSnapshot()
})

it('works for Membership', () => {
  expect(resetNewPostCount(5, 'Membership')).toMatchSnapshot()
})
