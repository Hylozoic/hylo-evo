import { get } from 'lodash/fp'
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
