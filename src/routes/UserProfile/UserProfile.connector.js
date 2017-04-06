import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { connect } from 'react-redux'

import { fetchPerson } from './UserProfile.actions'
import orm from 'store/models'

export function getPerson (id) {
  return ormCreateSelector(orm, session => {
    if (session.Person.hasIs(id)) {
      return session.Person.withId(id).withRefs
    }
    return null
  })
}

export function mapStateToProps ({ orm }, { match }) {
  return {
    person: getPerson(get('params.id', match))(orm)
  }
}

export default connect(mapStateToProps, { fetchPerson })
