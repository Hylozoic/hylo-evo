import resetNewPostCount from './resetNewPostCount'

it('works for GroupTopic', () => {
  expect(resetNewPostCount(5, 'GroupTopic')).toMatchSnapshot()
})

it('works for Membership', () => {
  expect(resetNewPostCount(5, 'Membership')).toMatchSnapshot()
})
