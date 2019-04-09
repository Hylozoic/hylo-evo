import { connect } from 'react-redux'
import { createSelector } from 'redux-orm'
import orm from 'store/models'
import fetchPeople from 'store/actions/fetchPeople'
import { invitePeopleToEvent } from './EventInviteDialog.store'
import { pick } from 'lodash/fp'

export function presentPerson (person) {
  return {
    ...pick([ 'id', 'name', 'avatarUrl' ], person.ref),
    community: person.memberships.first()
      ? person.memberships.first().community.name : null
  }
}

export const peopleSelector = createSelector(
  orm,
  state => state.orm,
  session => session.Person.all()
    .orderBy('name')
    .toModelArray()
    .map(presentPerson)
)

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
