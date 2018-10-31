import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/navigation'
import {
  getMemberVotes,
  fetchMemberVotes
} from './MemberVotes.store'

export function mapStateToProps (state, props) {
  return {
    posts: getMemberVotes(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchMemberVotes: personId => dispatch(fetchMemberVotes(personId)),
    showDetails: postId => push(postUrl(postId, props))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
