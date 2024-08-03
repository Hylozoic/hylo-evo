import reducer, { fetchStewardSuggestions, clearStewardSuggestions } from './RolesSettingsTab.store'
import {
  CLEAR_STEWARD_SUGGESTIONS,
  FETCH_STEWARD_SUGGESTIONS
} from 'store/constants'

it('fetchStewardSuggestions', () => {
  expect(fetchStewardSuggestions(123, 'to')).toMatchSnapshot()
})

it('clearStewardSuggestions', () => {
  expect(clearStewardSuggestions()).toMatchSnapshot()
})

describe('reducer', () => {
  it('should handle CLEAR_STEWARD_SUGGESTIONS', () => {
    const expected = []
    const actual = reducer({}, {
      type: CLEAR_STEWARD_SUGGESTIONS
    })
    expect(actual).toEqual(expected)
  })

  it('should handle FETCH_STEWARD_SUGGESTIONS', () => {
    const expected = [ 11, 12 ]
    const actual = reducer({}, {
      type: FETCH_STEWARD_SUGGESTIONS,
      payload: {
        data: {
          group: {
            members: {
              items: [
                { id: 11 },
                { id: 12 }
              ]
            }
          }
        }
      }
    })
    expect(actual).toEqual(expected)
  })
})
