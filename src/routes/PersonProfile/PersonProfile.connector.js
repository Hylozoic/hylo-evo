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
        posts: person.postsCreated.toModelArray().map(post => ({
          ...post.ref,
          communities: post.communities.toRefArray()
        }))
      }
    }
    return null
  })
}

export function mapStateToProps ({ orm }, { match }) {
  const defaultPerson = {
    name: '',
    avatarUrl: '',
    bannerUrl: ''
  }
  const id = get('params.id', match)
  const error = Number.isSafeInteger(Number(id)) ? null
    : "Can't find that person."
  const person = error ? defaultPerson : getPerson(id)(orm)

  return {
    id,
    error,
    person
  }
}

export default connect(mapStateToProps, { fetchPerson })
