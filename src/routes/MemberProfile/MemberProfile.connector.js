import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import blockUser from 'store/actions/blockUser'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import getMe from 'store/selectors/getMe'
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
    currentUser: getMe(state),
    previousLocation: getPreviousLocation(state)
  }
}

const mapDispatchToProps = {
  fetchPerson,
  blockUser,
  push
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const goToPreviousLocation = () => dispatchProps.push(stateProps.previousLocation)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToPreviousLocation
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
