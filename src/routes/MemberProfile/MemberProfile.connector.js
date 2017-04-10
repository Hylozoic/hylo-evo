import { createSelector as ormCreateSelector } from 'redux-orm'
import { connect } from 'react-redux'

import { fetchPerson } from './MemberProfile.actions'
import payload from './MemberProfile.test.json'
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
    return payload.data.person
  })
}

export function getRole (slug, memberships = []) {
  // TODO: get proper roles, avoid assuming 1 === admin!
  return memberships
    .find(m => m.community.slug === slug && m.role === 1)
      ? 'Community Manager'
      : null
}

export function mapStateToProps ({ orm }, { match }) {
  const { id, slug } = match.params
  const error = Number.isSafeInteger(Number(id)) ? null : messages.invalid
  let person = error ? defaultPerson : getPerson(id)(orm)
  const role = getRole(slug, person.memberships)
  if (role) {
    person = { ...person, role }
  }

  return {
    id,
    error,
    person: person || defaultPerson
  }
}

export default connect(mapStateToProps, { fetchPerson })
