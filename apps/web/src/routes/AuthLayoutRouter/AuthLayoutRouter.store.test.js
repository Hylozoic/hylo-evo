/* eslint-env jest */
import reducer, { ormSessionReducer } from './AuthLayoutRouter.store'
import { FETCH_FOR_CURRENT_USER } from 'store/constants'
import { LOCATION_CHANGE } from 'connected-react-router'
import rollbar from 'client/rollbar'
import orm from 'store/models'

jest.mock('client/rollbar', () => ({}))

describe('reducer', () => {
  describe(`when ${FETCH_FOR_CURRENT_USER}`, () => {
    beforeEach(() => {
      rollbar.configure = jest.fn()
    })

    test('rollbar called', () => {
      const action = {
        type: FETCH_FOR_CURRENT_USER,
        payload: { data: { me: { id: '1', username: 'Proteus', email: 'prot@e.us' } } }
      }

      reducer({}, action)
      expect(rollbar.configure).toBeCalled()
    })

    it('does nothing if the action had an error', () => {
      const action = {
        type: FETCH_FOR_CURRENT_USER,
        payload: {},
        error: true
      }

      reducer({}, action)
      expect(rollbar.configure).not.toBeCalled()
    })
  })

  describe('on LOCATION_CHANGE', () => {
    it('sets isDrawerOpen to false', () => {
      const state = {
        isDrawerOpen: true
      }
      const action = {
        type: LOCATION_CHANGE
      }
      expect(reducer(state, action).isDrawerOpen).toEqual(false)
    })
  })
})

describe('ormSessionReducer', () => {
  it('adds a person for current user', () => {
    const session = orm.session(orm.getEmptyState())
    const me = {
      id: '5',
      name: 'foo',
      avatarUrl: 'foo.png',
      memberships: [{ id: '7' }],
      settings: { lights: 'on' }
    }
    const action = {
      type: FETCH_FOR_CURRENT_USER,
      payload: {
        data: { me }
      }
    }

    ormSessionReducer(session, action)
    const person = session.Person.withId('5')
    expect(person._fields).toEqual(expect.objectContaining({
      id: me.id,
      avatarUrl: me.avatarUrl,
      name: me.name
    }))
  })
})
