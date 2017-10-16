/* eslint-env jest */
import reducer, { FETCH_FOR_CURRENT_USER } from './PrimaryLayout.store'
import rollbar from 'client/rollbar'

jest.mock('client/rollbar', () => ({}))

describe('PrimaryLayout store', () => {
  describe('reducer', () => {
    describe(`when ${FETCH_FOR_CURRENT_USER}`, () => {
      beforeEach(() => {
        rollbar.configure = jest.fn()
      })

      test('rollbar called', () => {
        const action = {
          type: FETCH_FOR_CURRENT_USER,
          payload: {data: {me: {id: '1', username: 'Proteus', email: 'prot@e.us'}}}
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
  })
})
