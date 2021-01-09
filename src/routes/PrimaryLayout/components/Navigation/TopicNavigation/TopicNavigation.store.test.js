import orm from 'store/models'
import { getSubscribedGroupTopics, mergeGroupTopics } from './TopicNavigation.store'

describe('getSubscribedGroupTopics', () => {
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
  },
  {
    id: '4',
    name: 'yeah'
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
  ].forEach(attrs => session.Group.create(attrs))

  ;[
    { topic: '1', newPostCount: 5, group: '1', isSubscribed: true, visibility: 1 },
    { topic: '2', group: '1' },
    { topic: '2', newPostCount: 5, group: '2', isSubscribed: true, visibility: 1 },
    { topic: '3', newPostCount: 7, group: '1', isSubscribed: true, visibility: 2 },
    { topic: '4', newPostCount: 7, group: '1', isSubscribed: true, visibility: 0 }
  ].map(attrs => session.GroupTopic.create(attrs))

  const state = {
    orm: session.state
  }

  it('returns the expected value', () => {
    const groupTopics = getSubscribedGroupTopics(state, { slug: 'foo' })
    expect(groupTopics).toMatchSnapshot()
  })
})

describe('mergeGroupTopics', () => {
  const data = [
    { group: '1', topic: { name: 'foo' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 },
    { group: '2', topic: { name: 'foo' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 },
    { group: '3', topic: { name: 'foo' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 },
    { group: '1', topic: { name: 'bar' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 },
    { group: '2', topic: { name: 'bar' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 },
    { group: '3', topic: { name: 'baz' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 }
  ]

  it('works as expected', () => {
    expect(mergeGroupTopics(data)).toEqual([
      { topic: { name: 'foo' }, newPostCount: 3, postsTotal: 6, followersTotal: 9 },
      { topic: { name: 'bar' }, newPostCount: 2, postsTotal: 4, followersTotal: 6 },
      { topic: { name: 'baz' }, newPostCount: 1, postsTotal: 2, followersTotal: 3 }
    ])
  })

  it('works on an empty list', () => {
    expect(mergeGroupTopics([])).toEqual([])
  })
})
