import { connect } from 'react-redux'
import { voteOnPost } from './PostFooter.store.js'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export function mapDispatchToProps (dispatch, { id, myVote }) {
  return {
    vote: () => dispatch(voteOnPost(id, !myVote))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
