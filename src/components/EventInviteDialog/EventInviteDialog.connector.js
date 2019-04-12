import { connect } from 'react-redux'
import fetchPeople from 'store/actions/fetchPeople'
import { invitePeopleToEvent, peopleSelector } from './EventInviteDialog.store'

export function mapStateToProps (state, props) {
  const people = peopleSelector(state, props)

  return {
    people
  }
}

export const mapDispatchToProps = {
  fetchPeople, invitePeopleToEvent
}

export default connect(mapStateToProps, mapDispatchToProps)
