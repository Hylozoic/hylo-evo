import orm from 'store/models' // this initializes redux-orm
import ormReducer from './ormReducer'
import { ADD_PERSON, UPDATE_PERSON, FETCH_POSTS } from 'store/constants'

describe('ADD_PERSON', () => {
  it('adds a person to app state', () => {
    const person = {id: '1', name: 'Lolo'}
    const state = orm.getEmptyState()
    const action = {type: ADD_PERSON, payload: person}

    const { Person: { itemsById, items } } = ormReducer(state, action)
    expect(itemsById[person.id]).toEqual(person)
    expect(items).toEqual([person.id])
  })
})

describe('UPDATE_PERSON', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Person.create({id: '1'})
    state = session.state
  })

  it('updates a person in app state', () => {
    const person = {id: '1', name: 'Lolo'}
    const action = {type: UPDATE_PERSON, payload: person}

    const { Person: { itemsById, items } } = ormReducer(state, action)
    expect(itemsById[person.id]).toEqual(person)
    expect(items).toEqual([person.id])
  })
})

describe('FETCH_POSTS', () => {
  let state

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    session.Community.create({id: '1'})
    state = session.state
  })

  it('adds feedOrder to community', () => {
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
    const nextState = ormReducer(state, action)
    expect(nextState.Community.itemsById['1']).toEqual({
      id: '1',
      feedOrder: [1, 5, 2, 4, 3]
    })
  })
})
