import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { memberVotesSelector, fetchMemberVotes } from './MemberVotes.store'

export function mapStateToProps (state, props) {
  return {
    votes: memberVotesSelector(state, props)
  }
}

export const mapDispatchToProps = {
  fetchMemberVotes,
  showDetails: (id, slug) => push(`/c/${slug}/p/${id}`)
}

export default connect(mapStateToProps, mapDispatchToProps)
