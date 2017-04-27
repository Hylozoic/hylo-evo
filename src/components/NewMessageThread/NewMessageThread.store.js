export const MODULE_NAME = 'NewMessageThread'

export const FETCH_EXAMPLE = 'FETCH_EXAMPLE'
import { PEOPLE_SELECTOR_SET_AUTOCOMPLETE } from 'components/PeopleSelector/PeopleSelector.store'

export function fetchExample () {
  return {
    type: FETCH_EXAMPLE
  }
}

const defaultState = {
  example: 'example value'
}

export default function reducer (state = defaultState, action) {
  const { error, payload, type } = action
  if (error) return state

  switch (type) {
    case PEOPLE_SELECTOR_SET_AUTOCOMPLETE:
      return { ...state, autocomplete: payload }

    default:
      return state
  }
}
