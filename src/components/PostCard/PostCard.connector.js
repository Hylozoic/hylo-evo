import { connect } from 'react-redux'
import voteOnPost from 'store/actions/voteOnPost.js'

export function mapDispatchToProps (dispatch) {
  return {
    voteOnPost: (id, myVote) => dispatch(voteOnPost(id, myVote))
  }
}

export default connect(null, mapDispatchToProps)
