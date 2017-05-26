import orm from 'store/models'
import { getSubscribedCommunityTopics } from './TopicNavigation.store'

describe('getSubscribedCommunityTopics', () => {
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
    {topic: '1', newPostCount: 5, community: '1', isSubscribed: true},
    {topic: '2', community: '1'},
    {topic: '2', newPostCount: 5, community: '2', isSubscribed: true},
    {topic: '3', newPostCount: 7, community: '1', isSubscribed: true}
  ].map(attrs => session.CommunityTopic.create(attrs))

  const state = {
    orm: session.state
  }

  it('returns the expected value', () => {
    const communityTopics = getSubscribedCommunityTopics(state, {slug: 'foo'})
    expect(communityTopics).toMatchSnapshot()
  })
})
