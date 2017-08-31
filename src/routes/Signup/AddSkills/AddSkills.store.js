import { get } from 'lodash/fp'

export const SET_AUTOCOMPLETE = `SET_AUTOCOMPLETE`
export const FETCH_SKILLS_AUTOCOMPLETE = `FETCH_SKILLS_AUTOCOMPLETE`

export function setAutocomplete (autocomplete) {
  return {
    type: SET_AUTOCOMPLETE,
    payload: autocomplete
  }
}

export function getAutocomplete (state) {
  return state.AddSkills.autocomplete
}

export function fetchSkills (autocomplete) {
  return {
    type: FETCH_SKILLS_AUTOCOMPLETE,
    graphql: {
      query: `query ($autocomplete: String) {
        skills (first: 10, autocomplete: $autocomplete) {
          items {
            id
            name
          }
        }
      }`,
      variables: {
        autocomplete
      }
    },
    meta: {
      extractModel: 'Skill',
      extractQueryResults: {
        getItems: get('payload.data.skills')
      }
    }
  }
}

// Reducer
const defaultState = {
  skills: []
}

export default function reducer (state = defaultState, action) {
  const { error, type, payload } = action
  if (error) return state

  switch (type) {
    case SET_AUTOCOMPLETE:
      return {
        ...state,
        autocomplete: payload
      }
    default:
      return state
  }
}
