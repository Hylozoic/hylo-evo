import orm from '../models'
import ormReducer from './ormReducer'
import { FETCH_POSTS } from 'store/constants'

describe('ormReducer', () => {
  describe('on FETCH_POSTS', () => {
    it('adds feedOrder to community', () => {
      const session = orm.session(orm.getEmptyState())
      const { Community } = session
      Community.create({id: '1'})
      const state = session.state
      const action = {
        type: FETCH_POSTS,
        payload: {
          data: {
            community: {
              id: '1',
              posts: [
                {id: 1}, {id: 5}, {id: 2}, {id: 4}, {id: 3}
              ]
            }
          }
        }
      }
      const result = ormReducer(state, action)
      console.log('result', result)
    })
  })
})
