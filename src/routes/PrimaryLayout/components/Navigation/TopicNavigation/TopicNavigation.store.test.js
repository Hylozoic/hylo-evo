import orm from 'store/models'
import { getSubscribedCommunityTopics, mergeCommunityTopics } from './TopicNavigation.store'

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

describe('mergeCommunityTopics', () => {
  const data = [
    {community: '1', topic: {name: 'foo'}, newPostCount: 1, postsTotal: 2, followersTotal: 3},
    {community: '2', topic: {name: 'foo'}, newPostCount: 1, postsTotal: 2, followersTotal: 3},
    {community: '3', topic: {name: 'foo'}, newPostCount: 1, postsTotal: 2, followersTotal: 3},
    {community: '1', topic: {name: 'bar'}, newPostCount: 1, postsTotal: 2, followersTotal: 3},
    {community: '2', topic: {name: 'bar'}, newPostCount: 1, postsTotal: 2, followersTotal: 3},
    {community: '3', topic: {name: 'baz'}, newPostCount: 1, postsTotal: 2, followersTotal: 3}
  ]

  it('works as expected', () => {
    expect(mergeCommunityTopics(data)).toEqual([
      {topic: {name: 'foo'}, newPostCount: 3, postsTotal: 6, followersTotal: 9},
      {topic: {name: 'bar'}, newPostCount: 2, postsTotal: 4, followersTotal: 6},
      {topic: {name: 'baz'}, newPostCount: 1, postsTotal: 2, followersTotal: 3}
    ])
  })

  it('works on an empty list', () => {
    expect(mergeCommunityTopics([])).toEqual([])
  })
})
