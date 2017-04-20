import { connect } from 'react-redux'

import { fetchPerson, personSelector } from './MemberProfile.store'

// TODO: this sort of thing belongs in an i18n module
const messages = {
  invalid: "That doesn't seem to be a valid person ID."
}

export function mapStateToProps (state, props) {
  const error = Number.isSafeInteger(Number(props.match.params.id)) ? null : messages.invalid
  const person = personSelector(state, props)

  return {
    currentTab: 'Overview',
    error,
    person,
    ready: state.MemberProfile ? state.MemberProfile.ready : false
  }
}

export default connect(mapStateToProps, { fetchPerson })
