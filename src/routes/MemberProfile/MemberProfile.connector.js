import { connect } from 'react-redux'

import { fetchPerson, personSelector } from './MemberProfile.store'

// TODO: this sort of thing belongs in an i18n module
const messages = {
  invalid: "That doesn't seem to be a valid person ID."
}

export function mapStateToProps (state, { match }) {
  const { id } = match.params
  const error = Number.isSafeInteger(Number(id)) ? null : messages.invalid

  return {
    id,
    currentTab: 'Overview',
    error,
    person: personSelector(state, match.params)
  }
}

export default connect(mapStateToProps, { fetchPerson })
