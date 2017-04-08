import { get } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { connect } from 'react-redux'

import { fetchPerson } from './PersonProfile.actions'
import orm from 'store/models'

const defaultPerson = {
  name: '',
  avatarUrl: '',
  bannerUrl: ''
}

// TODO: this sort of thing belongs in an i18n module
const messages = {
  invalid: "That doesn't seem to be a valid person ID."
}

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
  const id = get('params.id', match)
  const error = Number.isSafeInteger(Number(id)) ? null : messages.invalid
  let person = error ? defaultPerson : getPerson(id)(orm)

  return {
    id,
    error,
    person: person || defaultPerson
  }
}

export default connect(mapStateToProps, { fetchPerson })
