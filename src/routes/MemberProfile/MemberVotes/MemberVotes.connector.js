import { connect } from 'react-redux'

import { memberVotesSelector, fetchMemberVotes } from './MemberVotes.store'

export function mapStateToProps (state, props) {
  return {
    showDetails: (id, slug) => props.navigate(`/c/${slug}/p/${id}`),
    votes: memberVotesSelector(state, props)
  }
}

export default connect(mapStateToProps, { fetchMemberVotes })
