/* eslint-env jest */
import { merge } from 'lodash'
import reducer, {
  FETCH_FOR_CURRENT_USER
} from './PrimaryLayout.store'
import rollbar from 'client/rollbar'

jest.mock('client/rollbar', () => ({
  configure: jest.fn()
}))

describe('PrimaryLayout store', () => {
  describe('reducer', () => {
    describe(`when ${FETCH_FOR_CURRENT_USER}`, () => {
      test('rollbar called', () => {
        const action = {
          type: FETCH_FOR_CURRENT_USER,
          payload: {data: {me: {id: '1', username: 'Proteus', email: 'prot@e.us'}}}
        }

        reducer({}, action)
        expect(rollbar.configure).toHaveBeenCalled()
      })
    })
  })
})
