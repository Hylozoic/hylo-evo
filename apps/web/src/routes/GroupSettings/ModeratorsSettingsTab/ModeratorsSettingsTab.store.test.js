import reducer, { fetchModeratorSuggestions, clearModeratorSuggestions, addModerator, removeModerator } from './ModeratorsSettingsTab.store'
import {
  CLEAR_MODERATOR_SUGGESTIONS,
  FETCH_MODERATOR_SUGGESTIONS
} from 'store/constants'

it('fetchModeratorSuggestions', () => {
  expect(fetchModeratorSuggestions(123, 'to')).toMatchSnapshot()
})

it('clearModeratorSuggestions', () => {
  expect(clearModeratorSuggestions()).toMatchSnapshot()
})

it('addModerator', () => {
  expect(addModerator(123, 111)).toMatchSnapshot()
})

it('removeModerator', () => {
  expect(removeModerator(123, 111, true)).toMatchSnapshot()
})

describe('reducer', () => {
  it('should handle CLEAR_MODERATOR_SUGGESTIONS', () => {
    const expected = []
    const actual = reducer({}, {
      type: CLEAR_MODERATOR_SUGGESTIONS
    })
    expect(actual).toEqual(expected)
  })

  it('should handle FETCH_MODERATOR_SUGGESTIONS', () => {
    const expected = [ 11, 12 ]
    const actual = reducer({}, {
      type: FETCH_MODERATOR_SUGGESTIONS,
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
