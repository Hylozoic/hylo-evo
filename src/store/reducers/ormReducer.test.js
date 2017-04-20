import orm from 'store/models' // this initializes redux-orm
import ormReducer from './ormReducer'
import { EXTRACT_MODEL } from 'store/constants'

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
