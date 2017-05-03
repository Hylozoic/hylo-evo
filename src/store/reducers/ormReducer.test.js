import orm from 'store/models' // this initializes redux-orm
import ormReducer from './ormReducer'
import { EXTRACT_MODEL, VOTE_ON_POST_PENDING } from 'store/constants'
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
    it('does nothing if didVote is false', () => {
      expect(ormReducer(state, {...action, meta: {postId: '1', didVote: false}}))
      .toEqual(state)
    })

    it('increments votesTotal and updates myVote if didVote is true', () => {
      const newState = ormReducer(state, {...action, meta: {postId: '1', didVote: true}})
      expect(deep(state, newState)).toMatchSnapshot()
    })
  })

  describe('when myVote is true', () => {
    it('does nothing if didVote is true', () => {
      expect(ormReducer(state, {...action, meta: {postId: '2', didVote: true}}))
      .toEqual(state)
    })

    it('decrements votesTotal and updates myVote if didVote is false', () => {
      const newState = ormReducer(state, {...action, meta: {postId: '2', didVote: false}})
      expect(deep(state, newState)).toMatchSnapshot()
    })
  })
})
