import { createSelector } from 'redux-orm'
import { connect } from 'react-redux'

import { fetchPerson } from './MemberProfile.store'
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

export function getRole (slug, memberships = []) {
  return memberships.find(m => m.community.slug === slug && m.hasModeratorRole)
    ? 'Community Manager'
    : null
}

const getPerson = createSelector(
  orm,
  state => state.orm,
  (_, params) => params,
  (session, params) => {
    const { id, slug } = params
    if (session.Person.hasId(id)) {
      const person = session.Person.withId(id)
      let result = {
        ...person.ref,
        memberships: person.memberships.toModelArray().map(membership => ({
          ...membership.ref,
          community: membership.community.ref
        })),
        posts: person.postsCreated.toModelArray().map(post => ({
          ...post.ref,
          communities: post.communities.toRefArray()
        }))
      }
      return { ...result, role: getRole(slug, result.memberships) }
    }
    return defaultPerson
  }
)

export function mapStateToProps (state, { match }) {
  const { id } = match.params
  const error = Number.isSafeInteger(Number(id)) ? null : messages.invalid

  return {
    id,
    error,
    person: getPerson(state, match.params)
  }
}

export default connect(mapStateToProps, { fetchPerson })
