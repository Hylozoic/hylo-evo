import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { connect } from 'react-redux'

import { fetchPerson } from './PersonProfile.actions'
import orm from 'store/models'

export function getPerson (id) {
  return ormCreateSelector(orm, session => {
    if (session.Person.hasId(id)) {
      const person = session.Person.withId(id)
      return {
        ...person.ref,
        posts: person.postsCreated.toRefArray()
      }
    }
    return {
      name: ''
    }
  })
}

export function mapStateToProps ({ orm }, { match }) {
  const id = get('params.id', match)
  return {
    id,
    person: getPerson(id)(orm)
  }
}

export default connect(mapStateToProps, { fetchPerson })
