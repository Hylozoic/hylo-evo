import orm from '../models'
import getMe from './getMe'
import getGroupTopicForCurrentRoute from './getGroupTopicForCurrentRoute'
import getTopicForCurrentRoute from './getTopicForCurrentRoute'
import getMyMemberships from './getMyMemberships'
import getCanModerate from './getCanModerate'

describe('getMe', () => {
  it('returns Me', () => {
    const session = orm.session(orm.getEmptyState())
    session.Me.create({
      id: '1',
      name: 'Joe Smith'
    })

    const result = getMe({ orm: session.state })

    expect(result.name).toEqual('Joe Smith')
    expect(result.id).toEqual('1')
  })
})

describe('getMyMemberships', () => {
  it('returns expected values', () => {
    const session = orm.session(orm.getEmptyState())
    const group1 = session.Group.create({ id: 'c1' })
    const group2 = session.Group.create({ id: 'c2' })
    const membership = session.Membership.create({ id: 'm1', group: group1.id })
    session.Membership.create({ id: 'm2', group: group2.id })
    const me = session.Me.create({})
    me.updateAppending({ memberships: [membership.id] })
    expect(getMyMemberships({ orm: session.state }, {}).length).toEqual(1)
  })
})

describe('getGroupTopicForCurrentRoute', () => {
  it('returns GroupTopic', () => {
    const session = orm.session(orm.getEmptyState())
    session.Group.create({ id: '1', slug: 'goteam', postCount: 10 })
    session.Topic.create({
      id: '2',
      name: 'petitions',
      postsTotal: '100',
      followersTotal: '200'
    })
    session.GroupTopic.create({
      id: '3',
      group: '1',
      topic: '2',
      postsTotal: '10',
      followersTotal: '20'
    })
    const props = {
      match: {
        params: {
          slug: 'goteam',
          topicName: 'petitions'
        }
      }
    }
    const result = getGroupTopicForCurrentRoute({ orm: session.state }, props)
    expect(result.postsTotal).toEqual('10')
    expect(result.id).toEqual('3')
  })

  it('should return null if no match', () => {
    const session = orm.session(orm.getEmptyState())
    const props = {
      match: {
        params: {
          slug: 'goteam',
          topicName: 'petitions'
        }
      }
    }
    const result = getGroupTopicForCurrentRoute({ orm: session.state }, props)
    expect(result).toBeNull()
  })
})

describe('getTopicForCurrentRoute', () => {
  it('returns Topic', () => {
    const session = orm.session(orm.getEmptyState())
    session.Topic.create({
      id: '2',
      name: 'petitions'
    })
    const props = {
      match: {
        params: {
          topicName: 'petitions'
        }
      }
    }
    const result = getTopicForCurrentRoute({ orm: session.state }, props)
    expect(result.name).toEqual('petitions')
    expect(result.id).toEqual('2')
  })

  it('should return null if no match', () => {
    const session = orm.session(orm.getEmptyState())
    const props = {
      match: {
        params: {
          topicName: 'petitions'
        }
      }
    }
    const result = getTopicForCurrentRoute({ orm: session.state }, props)
    expect(result).toBeNull()
  })
})

describe('getCanModerate', () => {
  const session = orm.session(orm.getEmptyState())
  beforeEach(() => {
    session.Me.create({
      id: '1'
    })
  })
  it('returns true when user can moderate', () => {
    const group = session.Group.create({ id: 1 })
    const membership = session.Membership.create({ id: 1, group: group.id, hasModeratorRole: true })
    const me = session.Me.first()
    me.updateAppending({ memberships: [membership.id] })
    const state = { orm: session.state }
    const props = { group }
    expect(getCanModerate(state, props)).toEqual(true)
  })
  it('returns false when user cannot moderate', () => {
    const group = session.Group.create({ id: 2 })
    const state = { orm: session.state }
    const props = { group }
    expect(getCanModerate(state, props)).toBeFalsy()
  })
})
