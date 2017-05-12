import orm from 'store/models'
import { getTopicSubscriptions } from './TopicNavigation.store'

describe('getTopicSubscriptions', () => {
  const session = orm.session(orm.getEmptyState())

  const foomunity = {
    id: '1',
    name: 'Foomunity',
    slug: 'foo',
    topicSubscriptions: [
      {topic: '1', newPostCount: 5}, {topic: '2', newPostCount: 7}
    ].map(attrs => session.TopicSubscription.create(attrs))
  };

  [{
    id: '1',
    name: 'fun'
  },
  {
    id: '2',
    name: 'loving'
  },
  {
    id: '3',
    name: 'criminials'
  }].forEach(attrs => session.Topic.create(attrs));

  [
    foomunity,
    {
      id: '2',
      name: 'Barmunity',
      slug: 'bar',
      topicSubscriptions: [
        {topic: '2', newPostCount: 5}, {topic: '3', newPostCount: 7}
      ].map(attrs => session.TopicSubscription.create(attrs))
    }].forEach(attrs => session.Community.create(attrs))

  const state = {
    orm: session.state
  }

  it("returns an empty array if there's no community", () => {
    const topicSubscriptions = getTopicSubscriptions(state, {slug: 'anunknowncommunity'})
    expect(topicSubscriptions).toEqual([])
  })

  it('transforms topic subscriptions correctly', () => {
    const topicSubscriptions = getTopicSubscriptions(state, {slug: 'foo'})
    expect(topicSubscriptions).toMatchSnapshot()
  })
})
