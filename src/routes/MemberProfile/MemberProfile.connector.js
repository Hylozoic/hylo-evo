import { connect } from 'react-redux'

import { fetchPerson, personSelector } from './MemberProfile.store'
import orm from 'store/models'

const defaultPerson = {
  name: '',
  avatarUrl: '',
  bannerUrl: ''
}

export function mapStateToProps (state, { match }) {
  const { id } = match.params
  const error = Number.isSafeInteger(Number(id)) ? null : messages.invalid

  return {
    id,
    error,
    person: personSelector(state, match.params)
  }
}

export default connect(mapStateToProps, { fetchPerson })
