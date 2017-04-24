import { connect } from 'react-redux'

import { memberVotesSelector, fetchMemberVotes } from './MemberVotes.store'

export function mapStateToProps (state, props) {
  return {
    votes: memberVotesSelector(state, props)
  }
}

export default connect(mapStateToProps, { fetchMemberVotes })
