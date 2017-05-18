import orm from 'store/models'
import { getTopicSubscriptions } from './TopicNavigation.store'

describe('getTopicSubscriptions', () => {
  const session = orm.session(orm.getEmptyState())

  ;[{
    id: '1',
    name: 'fun'
  },
  {
    id: '2',
    name: 'loving'
  },
  {
    id: '3',
    name: 'criminals'
  }].forEach(attrs => session.Topic.create(attrs))

  ;[
    {
      id: '1',
      name: 'Foomunity',
      slug: 'foo'
    },
    {
      id: '2',
      name: 'Barmunity',
      slug: 'bar'
    }
  ].forEach(attrs => session.Community.create(attrs))

  ;[
    {topic: '1', newPostCount: 5, community: '1'},
    {topic: '2', newPostCount: 7, community: '1'},
    {topic: '2', newPostCount: 5, community: '2'},
    {topic: '3', newPostCount: 7, community: '2'}
  ].map(attrs => session.TopicSubscription.create(attrs))

  const state = {
    orm: session.state
  }

  it("returns an empty array if there's no community", () => {
    const topicSubscriptions = getTopicSubscriptions(state, {slug: 'duh'})
    expect(topicSubscriptions).toEqual([])
  })

  it('transforms topic subscriptions correctly', () => {
    const topicSubscriptions = getTopicSubscriptions(state, {slug: 'foo'})
    expect(topicSubscriptions).toMatchSnapshot()
  })
})
