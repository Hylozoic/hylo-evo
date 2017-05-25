import toggleTopicSubscribe from './toggleTopicSubscribe'

it('should set isSubscribing to false if existing subscription is passed', () => {
  const actual = toggleTopicSubscribe('3', '4', {})
  expect(actual.graphql.variables.isSubscribing).toBeFalsy()
})

it('should set isSubscribing to true if existing subscription is not passed', () => {
  const actual = toggleTopicSubscribe('3', '4')
  expect(actual.graphql.variables.isSubscribing).toBeTruthy()
})

it('should pass along the existingSubscriptionId in meta', () => {
  const actual = toggleTopicSubscribe('3', '4', {id: '5'})
  expect(actual.meta.existingSubscriptionId).toEqual('5')
})

it('should extract model TopicSubscription', () => {
  const actual = toggleTopicSubscribe('3', '4', {id: '5'})
  expect(actual.meta.extractModel).toEqual('TopicSubscription')
})

it('should match latest snapshot', () => {
  expect(toggleTopicSubscribe('3', '4', {id: '5'})).toMatchSnapshot()
})
