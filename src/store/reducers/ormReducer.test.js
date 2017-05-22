import orm from 'store/models' // this initializes redux-orm
import ormReducer from './ormReducer'
import toggleTopicSubscribe from 'store/actions/toggleTopicSubscribe'
import {
  EXTRACT_MODEL,
  VOTE_ON_POST_PENDING,
  MARK_ACTIVITY_READ_PENDING,
  MARK_ALL_ACTIVITIES_READ_PENDING
} from 'store/constants'
import deep from 'deep-diff'

it('responds to EXTRACT_MODEL', () => {
  const state = orm.getEmptyState()

  const action = {
    type: EXTRACT_MODEL,
    payload: {
      id: '1',
      title: 'Cat on the loose',
      communities: [
        {
          id: '1',
          name: 'Neighborhood'
        }
      ],
      creator: {
        id: '2',
        name: 'Greg'
      }
    },
    meta: {
      modelName: 'Post'
    }
  }

  const newState = ormReducer(state, action)

  expect(newState).toMatchObject({
    Community: {
      items: ['1'],
      itemsById: {'1': {id: '1', name: 'Neighborhood'}}
    },
    Person: {
      items: ['2'],
      itemsById: {'2': {id: '2', name: 'Greg'}}
    },
    Post: {
      items: ['1'],
      itemsById: {'1': {id: '1', title: 'Cat on the loose', creator: '2'}}
    },
    PostCommunities: {
      items: [0],
      itemsById: {'0': {fromPostId: '1', toCommunityId: '1', id: 0}}
    }
  })
})

describe('on VOTE_ON_POST_PENDING', () => {
  const session = orm.session(orm.getEmptyState())

  session.Post.create({id: '1', votesTotal: 7, myVote: false})
  session.Post.create({id: '2', votesTotal: 4, myVote: true})

  const state = session.state

  const action = {
    type: VOTE_ON_POST_PENDING
  }

  describe('when myVote is false', () => {
    it('does nothing if isUpvote is false', () => {
      expect(ormReducer(state, {...action, meta: {postId: '1', isUpvote: false}}))
      .toEqual(state)
    })

    it('increments votesTotal and updates myVote if isUpvote is true', () => {
      const newState = ormReducer(state, {...action, meta: {postId: '1', isUpvote: true}})
      expect(deep(state, newState)).toMatchSnapshot()
    })
  })

  describe('when myVote is true', () => {
    it('does nothing if isUpvote is true', () => {
      expect(ormReducer(state, {...action, meta: {postId: '2', isUpvote: true}}))
      .toEqual(state)
    })

    it('decrements votesTotal and updates myVote if isUpvote is false', () => {
      const newState = ormReducer(state, {...action, meta: {postId: '2', isUpvote: false}})
      expect(deep(state, newState)).toMatchSnapshot()
    })
  })
})

const makeActivityState = () => {
  const session = orm.session(orm.getEmptyState())

  session.Activity.create({id: '1', unread: true})
  session.Activity.create({id: '2', unread: true})

  return session.state
}

describe('on MARK_ACTIVITY_READ_PENDING', () => {
  it('marks the activity read', () => {
    const state = makeActivityState()
    const action = {
      type: MARK_ACTIVITY_READ_PENDING,
      meta: {
        id: '2'
      }
    }

    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })
})

describe('on MARK_ALL_ACTIVITIES_READ_PENDING', () => {
  it('marks the activity read', () => {
    const state = makeActivityState()
    const action = {
      type: MARK_ALL_ACTIVITIES_READ_PENDING
    }

    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })
})

describe('on TOGGLE_TOPIC_SUBSCRIBE', () => {
  it('will remove an existing topic subscription and decrement the followersTotal', () => {
    const session = orm.session(orm.getEmptyState())
    session.CommunityTopic.create({
      id: '1',
      community: '1',
      topic: '1',
      followersTotal: 10
    })
    session.TopicSubscription.create({
      id: '3'
    })
    const state = session.state
    const action = toggleTopicSubscribe('1', '1', {id: '3'})
    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })

  it('will increment the communityTopic followersTotal appropriately', () => {
    const session = orm.session(orm.getEmptyState())
    session.CommunityTopic.create({
      id: '1',
      community: '3',
      topic: '2',
      followersTotal: 10
    })
    const state = session.state
    const action = toggleTopicSubscribe('2', '3')
    const newState = ormReducer(state, action)
    expect(deep(state, newState)).toMatchSnapshot()
  })
})
