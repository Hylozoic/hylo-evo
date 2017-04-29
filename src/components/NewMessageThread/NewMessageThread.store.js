export const MODULE_NAME = 'NewMessageThread'

export const FETCH_EXAMPLE = 'FETCH_EXAMPLE'
import { PEOPLE_SELECTOR_SET_AUTOCOMPLETE } from 'components/PeopleSelector/PeopleSelector.store'

export function fetchExample () {
  return {
    type: FETCH_EXAMPLE
  }
}

const defaultState = {
  participants: [
    { id: '1', name: 'Felix Huffenflarberson', avatarUrl: 'http://st2.depositphotos.com/2703645/11099/v/170/depositphotos_110992516-stock-illustration-female-cartoon-avatar-icon.jpg', community: 'FlorpleDorfers' }
  ]
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
